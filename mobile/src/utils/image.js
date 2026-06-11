import { Image as RNImage, Platform } from "react-native";
import { Image } from "expo-image";
import { getApiBaseUrl } from "../services/apiBase";

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
}

function getDevHostFromApiBase() {
  try {
    return new URL(getApiBaseUrl()).hostname;
  } catch {
    return "";
  }
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

/** Metro / Expo web bundled media (`/assets/…`, `unstable_path=`). Not API uploads. */
function isBundlerMediaPath(uri) {
  const value = String(uri || "");
  return (
    value.startsWith("/assets") ||
    value.includes("/assets/") ||
    value.includes("unstable_path=") ||
    value.startsWith("data:image/") ||
    value.startsWith("data:video/")
  );
}

/** Same-origin absolute URL for bundled web assets (Metro dev + static export). */
function resolveBundlerMediaUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${value.startsWith("/") ? value : `/${value}`}`;
  }
  return value;
}

function withHost(urlString, hostname) {
  try {
    const url = new URL(urlString);
    url.hostname = hostname;
    return url.toString();
  } catch {
    return urlString;
  }
}

function hostVariants(urlString) {
  try {
    const url = new URL(urlString);
    const currentHost = url.hostname;
    const devHost = getDevHostFromApiBase();
    const candidates = [];

    if (isLocalHost(currentHost)) {
      // Images served from local API — emulator / device need host variants.
      if (Platform.OS === "android") {
        candidates.push(withHost(urlString, "10.0.2.2"));
      }
      if (devHost && !isLocalHost(devHost)) {
        candidates.push(withHost(urlString, devHost));
      }
      candidates.push(urlString);
    } else {
      // CDN / Cloudinary / remote URLs — never rewrite hostname to the API dev host (that breaks loads on Android).
      candidates.push(urlString);
    }

    // Prefer HTTPS for remote http URLs (e.g. misconfigured API).
    if (!isLocalHost(url.hostname) && url.protocol === "http:") {
      const httpsUrl = new URL(urlString);
      httpsUrl.protocol = "https:";
      candidates.unshift(httpsUrl.toString());
    }
    return unique(candidates);
  } catch {
    return [urlString];
  }
}

/** `require()` module id → web/native URI (Metro assets, Cloudinary, API paths). */
export function resolveBundledModuleSrc(moduleRef) {
  if (typeof moduleRef !== "number") return "";
  const asset = RNImage.resolveAssetSource(moduleRef);
  const raw = String(asset?.uri || "").trim();
  if (!raw) return "";
  return resolveImageUri(raw) || raw;
}

export function resolveImageUri(rawUri) {
  const raw = String(rawUri || "").trim();
  if (!raw) return "";
  // Metro `unstable_path` URLs are pre-encoded — encodeURI turns %2F into %252F (404 on web).
  if (isBundlerMediaPath(raw)) return resolveBundlerMediaUri(raw);

  const uri = encodeURI(raw);
  const apiBase = getApiBaseUrl();
  if (uri.startsWith("/")) return `${apiBase}${uri}`;
  if (!/^https?:\/\//i.test(uri)) return `${apiBase}/${uri.replace(/^\/+/, "")}`;

  try {
    const url = new URL(uri);

    if (isLocalHost(url.hostname)) {
      const devHost = getDevHostFromApiBase();
      if (devHost) {
        url.hostname = devHost;
      }
      return url.toString();
    }

    return url.toString();
  } catch {
    return uri;
  }
}

export function getImageUriCandidates(rawUri, { width, quality = "auto" } = {}) {
  const raw = String(rawUri || "").trim();
  if (!raw) return [];

  let candidates = [];
  if (isBundlerMediaPath(raw)) {
    candidates = [resolveBundlerMediaUri(raw)];
  } else {
    const uri = encodeURI(raw);
    const apiBase = getApiBaseUrl();
    if (uri.startsWith("/")) {
      candidates = hostVariants(`${apiBase}${uri}`);
    } else if (!/^https?:\/\//i.test(uri)) {
      candidates = hostVariants(`${apiBase}/${uri.replace(/^\/+/, "")}`);
    } else {
      candidates = hostVariants(resolveImageUri(uri));
    }
  }

  if (!width) return candidates;
  return unique(
    candidates.map((candidate) => optimizeDisplayImageUrl(candidate, { width, quality })).filter(Boolean)
  );
}

/** Product PDP — main hero (smaller delivery size, faster load). */
export function getProductHeroImageUri(rawUri) {
  return getImageUriCandidates(rawUri, { width: 840, quality: "auto:good" })[0] || "";
}

/** Product PDP — gallery thumb strip. */
export function getProductThumbImageUri(rawUri) {
  return getImageUriCandidates(rawUri, { width: 220, quality: "auto:good" })[0] || "";
}

/** Product PDP — lifestyle / story supporting image. */
export function getProductSectionImageUri(rawUri) {
  return getImageUriCandidates(rawUri, { width: 720, quality: "auto:good" })[0] || "";
}

/** Shared expo-image placeholder while remote heroes / catalog images resolve. */
export const PRODUCT_HERO_BLURHASH = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

const CLOUDINARY_UPLOAD = "/upload/";

function cloudinaryHasTransform(segment) {
  return /^(f_|q_|w_|c_|h_|dpr_|g_)/.test(segment);
}

/**
 * Delivery-time Cloudinary transforms — smaller WebP/AVIF, faster home/process/compare loads.
 * Bundled Metro assets are returned unchanged (absolute URL on web).
 */
function buildCloudinaryTransform({ width, quality }) {
  return `f_auto,q_${quality},w_${width},c_limit`;
}

function applyCloudinaryDeliveryTransform(uri, { width, quality }) {
  const uploadIdx = uri.indexOf(CLOUDINARY_UPLOAD);
  const prefix = uri.slice(0, uploadIdx + CLOUDINARY_UPLOAD.length);
  const suffix = uri.slice(uploadIdx + CLOUDINARY_UPLOAD.length);
  const transform = buildCloudinaryTransform({ width, quality });

  if (suffix.includes(`${transform}/`)) return uri;

  const parts = suffix.split("/");
  const firstSegment = parts[0] || "";

  if (cloudinaryHasTransform(firstSegment)) {
    parts[0] = transform;
    return `${prefix}${parts.join("/")}`;
  }

  if (/^v\d+$/i.test(firstSegment)) {
    return `${prefix}${transform}/${suffix}`;
  }

  return `${prefix}${transform}/${suffix}`;
}

export function optimizeDisplayImageUrl(rawUri, { width = 960, quality = "auto" } = {}) {
  const uri = resolveImageUri(String(rawUri || "").trim());
  if (!uri) return "";
  if (isBundlerMediaPath(uri)) return resolveBundlerMediaUri(uri);
  if (!uri.includes("res.cloudinary.com") || !uri.includes(CLOUDINARY_UPLOAD)) {
    return uri;
  }

  return applyCloudinaryDeliveryTransform(uri, { width, quality });
}

/** Warm product PDP gallery — thumbs first (instant placeholders), then hero. */
export function prefetchProductGalleryImages(rawUris = [], { heroCount = 2 } = {}) {
  const uris = rawUris.map((u) => String(u || "").trim()).filter(Boolean);
  if (!uris.length) return;

  const thumbUrls = unique(uris.map((u) => getProductThumbImageUri(u)).filter(Boolean));
  const heroUrls = unique(uris.slice(0, heroCount).map((u) => getProductHeroImageUri(u)).filter(Boolean));

  if (Platform.OS === "web") {
    prefetchDisplayImages(thumbUrls, { eagerCount: thumbUrls.length, width: 220 });
    prefetchDisplayImages(heroUrls, { eagerCount: heroUrls.length, width: 840 });
    return;
  }

  thumbUrls.forEach((url) => {
    Image.prefetch(url).catch(() => {});
  });
  heroUrls.forEach((url) => {
    Image.prefetch(url).catch(() => {});
  });
}

export function prefetchProductHeroImage(rawUri) {
  const uri = String(rawUri || "").trim();
  if (!uri) return;
  prefetchProductGalleryImages([uri], { heroCount: 1 });
}

/** Web: warm browser cache for upcoming section images. */
export function prefetchDisplayImages(sources, { eagerCount = 2, width = 960, quality = "auto:good" } = {}) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;

  const seen = new Set();
  sources.forEach((raw, index) => {
    const uri = optimizeDisplayImageUrl(
      typeof raw === "object" && raw?.uri ? raw.uri : raw,
      { width: index < eagerCount ? Math.max(width, 1200) : width, quality }
    );
    if (!uri || seen.has(uri)) return;
    seen.add(uri);

    if (!document.querySelector(`link[data-kankreg-preload="${uri}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = uri;
      link.setAttribute("data-kankreg-preload", uri);
      if (index < eagerCount && "fetchPriority" in link) {
        link.fetchPriority = "high";
      }
      document.head.appendChild(link);
    }

    const img = new window.Image();
    img.decoding = "async";
    img.src = uri;
  });
}
