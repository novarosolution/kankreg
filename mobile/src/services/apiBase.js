import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";

// Production app calls this host + paths like /products. Static sites on the same domain
// usually proxy the API under /api — we mount both /products and /api/products on the server.
// Override with EXPO_PUBLIC_API_URL if your API lives elsewhere (e.g. https://api.example.com).
const PRODUCTION_API_URL = "https://kankregserver.onrender.com";
const DEV_API_PORT = 5001;

function isLocalHostname(host) {
  const h = String(host || "").toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "10.0.2.2" ||
    /^\d+\.\d+\.\d+\.\d+$/.test(h)
  );
}

function isSecureWebContext() {
  return (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location?.protocol === "https:"
  );
}

/**
 * Fix common .env mistakes: ":5001", "5001", "localhost" without scheme, etc.
 * Remote hosts default to https (required when the web app is served over HTTPS).
 */
function isInvalidApiHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  // Render internal IDs (e.g. srv-d8gn6l6rnols73er9ec0) are not public DNS — common Vercel misconfig.
  if (/^srv-[a-z0-9]+$/i.test(h)) return true;
  return false;
}

function sanitizeConfiguredBase(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;

  if (/^:\d+$/.test(s)) {
    return `http://127.0.0.1${s}`;
  }
  if (/^\d+$/.test(s)) {
    return `http://127.0.0.1:${s}`;
  }
  if (s.startsWith("//")) {
    return `https:${s}`;
  }
  if (!/^https?:\/\//i.test(s)) {
    if (/^[\w.-]+(:\d+)?(\/.*)?$/.test(s)) {
      const host = s.split("/")[0].split(":")[0];
      if (isInvalidApiHost(host)) return null;
      const scheme = isLocalHostname(host) ? "http" : "https";
      s = `${scheme}://${s}`;
    }
  }
  s = s.replace(/\/+$/, "");
  const upgraded = upgradeInsecureRemoteUrl(s);
  try {
    const { hostname } = new URL(upgraded);
    if (isInvalidApiHost(hostname)) return null;
  } catch {
    return null;
  }
  return upgraded;
}

function upgradeInsecureRemoteUrl(url) {
  if (!url || !/^http:\/\//i.test(url)) return url;
  try {
    const { hostname } = new URL(url);
    if (isLocalHostname(hostname)) return url;
    return url.replace(/^http:\/\//i, "https://");
  } catch {
    return url;
  }
}

function getConfiguredApiUrl() {
  const fromEnv = sanitizeConfiguredBase(process.env.EXPO_PUBLIC_API_URL);
  if (fromEnv) return fromEnv;
  const fromExtra = sanitizeConfiguredBase(Constants.expoConfig?.extra?.apiUrl);
  if (fromExtra) return fromExtra;
  return null;
}

/** WebSocket host — same origin as API, without `/api` suffix. */
export function getSocketBaseUrl() {
  const api = getApiBaseUrl();
  if (!api) return "";
  return api.replace(/\/api\/?$/i, "");
}

export function getApiBaseUrl() {
  const configured = getConfiguredApiUrl();
  if (configured) {
    return upgradeInsecureRemoteUrl(configured);
  }

  const isDev = typeof __DEV__ !== "undefined" && __DEV__;
  if (!isDev) {
    return PRODUCTION_API_URL;
  }

  if (Platform.OS === "web" && isSecureWebContext()) {
    return PRODUCTION_API_URL;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://127.0.0.1:${DEV_API_PORT}`;
  }

  // Android emulator: 10.0.2.2 reaches the host machine (API + WebSocket on port 5001).
  if (Platform.OS === "android" && Device.isDevice === false) {
    return `http://10.0.2.2:${DEV_API_PORT}`;
  }

  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    "";
  const devHost = debuggerHost.split(":")[0];
  if (devHost) {
    return `http://${devHost}:${DEV_API_PORT}`;
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${DEV_API_PORT}`;
  }

  return `http://127.0.0.1:${DEV_API_PORT}`;
}
