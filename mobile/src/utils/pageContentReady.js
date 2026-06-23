import { Image as RNImage, Platform } from "react-native";
import { getProductThumbImageUri, prefetchDisplayImages } from "./image";

function resolveAssetUri(source) {
  if (!source) return "";
  if (typeof source === "string") return source.trim();
  if (typeof source === "number") {
    const resolved = RNImage.resolveAssetSource(source);
    return resolved?.uri ? String(resolved.uri) : "";
  }
  if (typeof source === "object" && source.uri) return String(source.uri).trim();
  return "";
}

function loadImageUri(uri, timeoutMs) {
  return new Promise((resolve) => {
    if (!uri) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, timeoutMs);
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const img = new window.Image();
      img.decoding = "async";
      if ("fetchPriority" in img) img.fetchPriority = "low";
      img.onload = done;
      img.onerror = done;
      img.src = uri;
      return;
    }
    RNImage.prefetch(uri).then(done).catch(done);
  });
}

/** Background warm-up — never blocks UI. */
export async function prefetchImageSources(sources = [], { timeoutMs = 6000, max = 8 } = {}) {
  const uris = [];
  const seen = new Set();
  for (const raw of sources) {
    const uri = resolveAssetUri(raw);
    if (!uri || seen.has(uri)) continue;
    seen.add(uri);
    uris.push(uri);
    if (uris.length >= max) break;
  }
  if (!uris.length) return;

  if (Platform.OS === "web") {
    prefetchDisplayImages(uris, { eagerCount: Math.min(3, uris.length), width: 400, warmupAll: false });
    return;
  }

  await Promise.all(uris.slice(0, 4).map((uri) => loadImageUri(uri, timeoutMs)));
}

export function prefetchHomePageImages({ products = [], heroSlides = [] } = {}) {
  const productUris = products
    .slice(0, 6)
    .map((p) => getProductThumbImageUri(p?.image || p?.images?.[0]));
  const heroUris = heroSlides.slice(0, 2).map((slide) => resolveAssetUri(slide?.url));
  prefetchImageSources([...heroUris, ...productUris], { max: 8 }).catch(() => {});
}

export function prefetchShopPageImages(products = []) {
  const uris = products
    .slice(0, 10)
    .map((p) => getProductThumbImageUri(p?.image || p?.images?.[0]));
  prefetchImageSources(uris, { max: 10 }).catch(() => {});
}

/** @deprecated Non-blocking — use prefetchHomePageImages instead. */
export async function waitForHomePageImages(opts) {
  prefetchHomePageImages(opts);
}

/** @deprecated Non-blocking — use prefetchShopPageImages instead. */
export async function waitForShopPageImages(products = []) {
  prefetchShopPageImages(products);
}
