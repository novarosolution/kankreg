import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";

// Production app calls this host + paths like /products. Static sites on the same domain
// usually proxy the API under /api — we mount both /products and /api/products on the server.
// Override with EXPO_PUBLIC_API_URL if your API lives elsewhere (e.g. https://api.example.com).
const PRODUCTION_API_URL = "https://kankregserver.onrender.com";
const DEV_API_PORT = 5001;

/**
 * Fix common .env mistakes: ":5001", "5001", "localhost" without scheme, etc.
 */
function sanitizeConfiguredBase(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
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
      return `http://${s}`;
    }
  }
  return s.replace(/\/+$/, "");
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
    return configured;
  }

  // Only treat as dev when Metro/babel explicitly sets __DEV__ === true.
  // If __DEV__ is missing (some embedded/minified bundles), default to production API.
  const isDev = typeof __DEV__ !== "undefined" && __DEV__;
  if (!isDev) {
    return PRODUCTION_API_URL;
  }

  // Web: use 127.0.0.1 so we don't hit IPv6 ::1 with no server (broken fetch / 404 from wrong host).
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
