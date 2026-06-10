import { Asset } from "expo-asset";
import { Image } from "react-native";
import { resolveImageUri } from "./image";

function isBundledAsset(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.uri === "string" &&
    value.uri.trim().length > 0
  );
}

/** Expo `require()` asset id, bundled asset object, or remote URL → expo-image source. */
export function resolveImageSource(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (isBundledAsset(value)) {
    return {
      uri: value.uri,
      ...(Number.isFinite(value.width) ? { width: value.width } : {}),
      ...(Number.isFinite(value.height) ? { height: value.height } : {}),
    };
  }
  if (typeof value === "string") {
    const uri = resolveImageUri(value);
    return uri ? { uri } : null;
  }
  return null;
}

/** Expo `require()` asset id or remote URL → string for <video> / players. */
export function resolveVideoUri(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string") {
    const uri = resolveImageUri(value) || value;
    return uri;
  }
  if (isBundledAsset(value)) {
    return resolveImageUri(value.uri) || value.uri;
  }
  if (typeof value === "number") {
    const resolved = Image.resolveAssetSource(value);
    const uri = resolved?.uri || "";
    if (uri) return resolveImageUri(uri) || uri;
    try {
      const asset = Asset.fromModule(value);
      const fromAsset = asset.uri || asset.localUri || "";
      return fromAsset ? resolveImageUri(fromAsset) || fromAsset : "";
    } catch {
      return "";
    }
  }
  return "";
}

/** Normalize any media value → `expo-video` `VideoSource` (require id, uri string, or null). */
export function toVideoPlayerSource(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  if (isBundledAsset(value)) return resolveImageUri(value.uri) || value.uri;
  if (typeof value === "string") {
    const uri = resolveImageUri(value);
    return uri || value;
  }
  return null;
}
