import { Platform } from "react-native";
import { resolveBundledModuleSrc } from "./image";
import { resolveVideoUri } from "./mediaSource";
import {
  HOME_TIMELINE_VIDEO,
  HOME_TIMELINE_VIDEO_PREVIEW,
  HOME_TIMELINE_VIDEO_POSTER,
} from "../constants/marketingTimelineVideo.web";
import {
  HOME_BRAND_PROMO_VIDEO,
  HOME_BRAND_PROMO_VIDEO_PREVIEW,
  HOME_BRAND_PROMO_VIDEO_POSTER,
} from "../constants/marketingBrandVideo.web";

/** Web video delivery caps — sharp on retina, never 4K originals. */
export const WEB_VIDEO_DESKTOP_MAX_WIDTH = 1080;
export const WEB_VIDEO_MOBILE_MAX_WIDTH = 720;
export const WEB_VIDEO_PREVIEW_WIDTH = 360;

const VIDEO_UPLOAD = "/video/upload/";

const PREVIEW_MAP = new Map([
  [HOME_TIMELINE_VIDEO, HOME_TIMELINE_VIDEO_PREVIEW],
  [HOME_BRAND_PROMO_VIDEO, HOME_BRAND_PROMO_VIDEO_PREVIEW],
]);

const POSTER_MAP = new Map([
  [HOME_TIMELINE_VIDEO, HOME_TIMELINE_VIDEO_POSTER],
  [HOME_BRAND_PROMO_VIDEO, HOME_BRAND_PROMO_VIDEO_POSTER],
]);

const BUNDLED_FULL_TO_WEB = [
  ["home-hero-video.mp4", "home-hero-video-web.mp4"],
  ["timeline-brand-film.mp4", "timeline-brand-film-web.mp4"],
];

function cloudinaryHasVideoTransform(segment) {
  return /^(q_|w_|c_|h_|f_|g_|sp_|dl_|vs_|vc_|ac_|br_)/.test(segment);
}

function applyCloudinaryVideoTransform(uri, { width, quality = "auto:good" }) {
  const uploadIdx = uri.indexOf(VIDEO_UPLOAD);
  if (uploadIdx === -1) return uri;

  const prefix = uri.slice(0, uploadIdx + VIDEO_UPLOAD.length);
  const suffix = uri.slice(uploadIdx + VIDEO_UPLOAD.length);
  const transform = `q_${quality},w_${width},c_limit,f_auto`;

  if (suffix.includes(`${transform}/`)) return uri;

  const parts = suffix.split("/");
  const firstSegment = parts[0] || "";

  if (cloudinaryHasVideoTransform(firstSegment)) {
    parts[0] = transform;
    return `${prefix}${parts.join("/")}`;
  }

  if (/^v\d+$/i.test(firstSegment)) {
    return `${prefix}${transform}/${suffix}`;
  }

  return `${prefix}${transform}/${suffix}`;
}

function preferBundledWebVideoVariant(uri) {
  const value = String(uri || "");
  if (!value || Platform.OS !== "web") return value;
  if (value.includes("-preview.mp4") || value.includes("-web.mp4")) return value;

  for (const [fullName, webName] of BUNDLED_FULL_TO_WEB) {
    if (value.includes(fullName) && !value.includes(webName.replace(".mp4", ""))) {
      return value.replace(fullName, webName);
    }
  }

  return value;
}

/** CSS layout width → capped pixel width for web `<video>` (max 1080p delivery). */
export function getWebVideoDisplayWidth(layoutWidth = 960, { isMobileWeb = false } = {}) {
  const css = Math.max(320, Number(layoutWidth) || 960);
  let dpr = 1;
  if (typeof window !== "undefined") {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
  }
  const cap = isMobileWeb ? WEB_VIDEO_MOBILE_MAX_WIDTH : WEB_VIDEO_DESKTOP_MAX_WIDTH;
  return Math.min(Math.ceil(css * dpr), cap);
}

/**
 * Delivery URL for web video — bundled `-web.mp4`, Cloudinary `w_` cap, never raw 4K.
 * @param {object} [options.preview] — tiny preview tier for progressive load
 */
export function getWebVideoUri(
  value,
  { layoutWidth = 960, isMobileWeb = false, quality = "auto:good", preview = false } = {}
) {
  const deliveryWidth = preview
    ? WEB_VIDEO_PREVIEW_WIDTH
    : getWebVideoDisplayWidth(layoutWidth, { isMobileWeb });
  const deliveryQuality = preview ? "auto:low" : quality;

  let uri = resolveVideoUri(value);
  if (!uri) return "";

  uri = preferBundledWebVideoVariant(uri);

  if (uri.includes("res.cloudinary.com") && uri.includes(VIDEO_UPLOAD)) {
    return applyCloudinaryVideoTransform(uri, { width: deliveryWidth, quality: deliveryQuality });
  }

  return uri;
}

/** Bundled marketing video → tiny preview MP4, or Cloudinary w_360 preview. */
export function getPreviewVideoUri(value, options = {}) {
  if (typeof value === "number" && PREVIEW_MAP.has(value)) {
    return resolveVideoUri(PREVIEW_MAP.get(value));
  }

  const full = resolveVideoUri(value);
  if (!full) return "";
  if (full.includes("-preview.mp4")) return full;

  if (full.includes("res.cloudinary.com") && full.includes(VIDEO_UPLOAD)) {
    return getWebVideoUri(value, { ...options, preview: true });
  }

  return "";
}

/** First-frame poster WebP for blur-up before preview video. */
export function getVideoPosterUri(value) {
  if (typeof value === "number" && POSTER_MAP.has(value)) {
    return resolveBundledModuleSrc(POSTER_MAP.get(value));
  }
  return "";
}
