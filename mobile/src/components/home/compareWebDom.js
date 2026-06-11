import { Image, Platform } from "react-native";
import { unstable_createElement as createElement } from "react-native-web";
import { resolveImageSource } from "../../utils/mediaSource";
import { optimizeDisplayImageUrl, resolveBundledModuleSrc, resolveImageUri } from "../../utils/image";

function rawUriFromSource(source) {
  if (typeof source === "number") {
    return resolveBundledModuleSrc(source) || null;
  }
  const resolved = resolveImageSource(source);
  if (!resolved) return null;
  if (typeof resolved === "number") {
    const asset = Image.resolveAssetSource(resolved);
    return asset?.uri || null;
  }
  return resolved.uri || null;
}

function isLocalBundledUri(uri) {
  const value = String(uri || "");
  return (
    value.includes("unstable_path=") ||
    value.startsWith("/assets") ||
    value.includes("/assets/")
  );
}

/** Remote URL, bundled asset, or require() → optimized string for <img src>. */
export function toImageSrc(source, options) {
  if (source == null || source === "") return null;
  if (typeof source === "number") {
    return resolveBundledModuleSrc(source) || null;
  }
  const raw = rawUriFromSource(source);
  if (!raw) return null;
  if (Platform.OS === "web" && !isLocalBundledUri(raw)) {
    return optimizeDisplayImageUrl(raw, options) || resolveImageUri(raw) || raw;
  }
  return resolveImageUri(raw) || raw;
}

export function HtmlDiv(props) {
  const { children, ...rest } = props;
  return createElement("div", rest, children);
}

export function HtmlSpan(props) {
  const { children, ...rest } = props;
  return createElement("span", rest, children);
}

export function HtmlP(props) {
  const { children, ...rest } = props;
  return createElement("p", rest, children);
}

export function HtmlH1(props) {
  const { children, ...rest } = props;
  return createElement("h1", rest, children);
}

export function HtmlH3(props) {
  const { children, ...rest } = props;
  return createElement("h3", rest, children);
}

export function HtmlImg({
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  className,
  style,
  ...props
}) {
  return createElement("img", {
    alt: "",
    className,
    loading,
    decoding,
    style,
    ...(fetchPriority ? { fetchPriority } : null),
    ...props,
  });
}
