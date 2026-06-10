import {
  buildCommunitySectionDefaults,
  getCommunityPostImageFallback,
} from "../content/communityHomeContent";
import {
  buildCompareSectionDefaults,
  getCompareRowImageFallback,
} from "../content/compareHomeContent";

function asTrimmedString(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function normalizeMediaType(value) {
  return asTrimmedString(value).toLowerCase() === "video" ? "video" : "image";
}

export function normalizeHeroSlide(slide, index = 0) {
  if (!slide || typeof slide !== "object") return null;
  const url = asTrimmedString(slide.url);
  if (!url) return null;
  return {
    id: asTrimmedString(slide.id) || `slide-${index + 1}`,
    order: Number.isFinite(Number(slide.order)) ? Number(slide.order) : index,
    mediaType: normalizeMediaType(slide.mediaType),
    url,
    title: asTrimmedString(slide.title),
    subtitle: asTrimmedString(slide.subtitle),
    enabled: slide.enabled !== false,
  };
}

export function normalizeHeroSlides(slides) {
  if (!Array.isArray(slides)) return [];
  return slides
    .map((slide, index) => normalizeHeroSlide(slide, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function getActiveHeroSlides(slides) {
  return normalizeHeroSlides(slides).filter((slide) => slide.enabled);
}

/** Map bundled marketing slides → hero slider shape (web fallback). */
export function mapMarketingSlidesToHero(marketingSlides = []) {
  return marketingSlides.map((slide, index) => ({
    id: slide.key || `marketing-${index}`,
    order: index,
    mediaType: "image",
    url: slide.image,
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    cta: slide.cta || "Shop now",
    enabled: true,
    variant: slide.variant || "",
    badge: slide.badge || "",
    contentPosition: slide.contentPosition || "center",
    heightRatio: slide.heightRatio,
    layout: slide.layout || "",
    imageFit: slide.imageFit || "",
    captionAlign: slide.captionAlign || "",
  }));
}

function normalizeAboutPhoto(photo) {
  if (!photo || typeof photo !== "object") return null;
  const url = asTrimmedString(photo.url);
  if (!url) return null;
  return { url, caption: asTrimmedString(photo.caption) };
}

export const ABOUT_SECTION_DEFAULTS = {
  enabled: true,
  eyebrow: "Our story",
  title: "Craft rooted in tradition",
  body:
    "KankreG crafts pure A2 Kankrej cow ghee using the ancestral Bilona method — hand-churned, wood-fired, and bottled in small batches for families who value tradition and taste.",
  videoUrl: "",
  videoCaption: "From grass-fed Kankrej cows to golden, grainy ghee.",
  photos: [],
};

export function normalizeAboutSection(about) {
  if (!about || typeof about !== "object") {
    return { ...ABOUT_SECTION_DEFAULTS, photos: [] };
  }
  const photos = Array.isArray(about.photos)
    ? about.photos.map(normalizeAboutPhoto).filter(Boolean)
    : [];
  return {
    enabled: about.enabled !== false,
    eyebrow: asTrimmedString(about.eyebrow, ABOUT_SECTION_DEFAULTS.eyebrow),
    title: asTrimmedString(about.title, ABOUT_SECTION_DEFAULTS.title),
    body: asTrimmedString(about.body, ABOUT_SECTION_DEFAULTS.body),
    videoUrl: asTrimmedString(about.videoUrl),
    videoCaption: asTrimmedString(about.videoCaption),
    photos,
  };
}

export function hasAboutMedia(about) {
  const section = normalizeAboutSection(about);
  if (!section.enabled) return false;
  return Boolean(
    section.videoUrl || section.photos.length > 0 || section.body || section.title
  );
}

export function newHeroSlideId() {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function newCommunityPostId() {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function newCompareRowId() {
  return `compare-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizePostType(value) {
  return asTrimmedString(value).toLowerCase() === "customer" ? "customer" : "reel";
}

function normalizeCommunityAuthor(author, fallback = {}, type = "reel") {
  const src = author && typeof author === "object" ? author : {};
  const name = asTrimmedString(src.name, fallback.name || "");
  const avatarFallback = name ? name.charAt(0).toUpperCase() : "K";
  const brand =
    type === "customer"
      ? src.brand === true || src.brand === "true"
      : src.brand !== false && src.brand !== "false";
  return {
    name,
    subtitle: asTrimmedString(src.subtitle, fallback.subtitle || ""),
    avatar: asTrimmedString(src.avatar, fallback.avatar || avatarFallback) || avatarFallback,
    brand,
  };
}

export function normalizeCommunityPost(post, index = 0) {
  if (!post || typeof post !== "object") return null;
  const id = asTrimmedString(post.id) || `community-${index + 1}`;
  const type = normalizePostType(post.type);
  const fallbackAuthor =
    type === "customer"
      ? { name: "", subtitle: "", avatar: "C", brand: false }
      : { name: "kankreg_ghee", subtitle: "", avatar: "K", brand: true };
  return {
    id,
    order: Number.isFinite(Number(post.order)) ? Number(post.order) : index,
    enabled: post.enabled !== false,
    type,
    tag: asTrimmedString(post.tag, type === "customer" ? "Customer" : "Reel"),
    imageUrl: asTrimmedString(post.imageUrl),
    views: asTrimmedString(post.views),
    likes: asTrimmedString(post.likes),
    quote: asTrimmedString(post.quote),
    author: normalizeCommunityAuthor(post.author, fallbackAuthor, type),
  };
}

export function normalizeCommunityPosts(posts) {
  const seed = buildCommunitySectionDefaults().posts;
  if (!Array.isArray(posts) || !posts.length) {
    return seed.map((item, index) => normalizeCommunityPost(item, index)).filter(Boolean);
  }
  return posts
    .map((post, index) => normalizeCommunityPost(post, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function normalizeCommunitySection(section) {
  const defaults = buildCommunitySectionDefaults();
  if (!section || typeof section !== "object") {
    return {
      ...defaults,
      instagram: { ...defaults.instagram },
      posts: normalizeCommunityPosts([]),
    };
  }
  const ig = section.instagram && typeof section.instagram === "object" ? section.instagram : {};
  const handle = asTrimmedString(ig.handle, defaults.instagram.handle);
  const displayHandle = asTrimmedString(
    ig.displayHandle,
    handle.startsWith("@") ? handle : `@${handle}`
  );
  const url =
    asTrimmedString(ig.url) || `https://instagram.com/${handle.replace(/^@/, "")}`;
  return {
    enabled: section.enabled !== false,
    eyebrow: asTrimmedString(section.eyebrow, defaults.eyebrow),
    title: asTrimmedString(section.title, defaults.title),
    instagram: {
      handle,
      displayHandle,
      followersLabel: asTrimmedString(ig.followersLabel, defaults.instagram.followersLabel),
      followLabel: asTrimmedString(ig.followLabel, defaults.instagram.followLabel),
      url,
    },
    posts: normalizeCommunityPosts(section.posts),
  };
}

/** Merge admin config with bundled image fallbacks for the web home rail. */
export function resolveCommunityDisplay(section) {
  const normalized = normalizeCommunitySection(section);
  if (!normalized.enabled) return null;
  const posts = normalized.posts
    .filter((post) => post.enabled && (post.imageUrl || getCommunityPostImageFallback(post.id)))
    .map((post, index) => ({
      id: post.id,
      type: post.type,
      tag: post.tag,
      image: post.imageUrl || getCommunityPostImageFallback(post.id, index),
      views: post.views,
      likes: post.likes,
      quote: post.quote,
      author: post.author,
    }));
  if (!posts.length) return null;
  return {
    eyebrow: normalized.eyebrow,
    title: normalized.title,
    instagram: normalized.instagram,
    posts,
  };
}

export function normalizeCompareRow(row, index = 0) {
  if (!row || typeof row !== "object") return null;
  const id = asTrimmedString(row.id) || `compare-${index + 1}`;
  return {
    id,
    order: Number.isFinite(Number(row.order)) ? Number(row.order) : index,
    enabled: row.enabled !== false,
    label: asTrimmedString(row.label),
    ours: asTrimmedString(row.ours),
    ordinary: asTrimmedString(row.ordinary),
    oursImageUrl: asTrimmedString(row.oursImageUrl),
    ordinaryImageUrl: asTrimmedString(row.ordinaryImageUrl),
  };
}

export function normalizeCompareRows(rows) {
  const seed = buildCompareSectionDefaults().rows;
  if (!Array.isArray(rows) || !rows.length) {
    return seed.map((item, index) => normalizeCompareRow(item, index)).filter(Boolean);
  }
  return rows
    .map((row, index) => normalizeCompareRow(row, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function normalizeCompareSection(section) {
  const defaults = buildCompareSectionDefaults();
  if (!section || typeof section !== "object") {
    return { ...defaults, rows: normalizeCompareRows([]) };
  }
  return {
    enabled: section.enabled !== false,
    eyebrow: asTrimmedString(section.eyebrow, defaults.eyebrow),
    title: asTrimmedString(section.title, defaults.title),
    subtitle: asTrimmedString(section.subtitle, defaults.subtitle),
    filmLabel: asTrimmedString(section.filmLabel, defaults.filmLabel),
    storyChapter: asTrimmedString(section.storyChapter, defaults.storyChapter),
    openingLine: asTrimmedString(section.openingLine, defaults.openingLine),
    oursLabel: asTrimmedString(section.oursLabel, defaults.oursLabel),
    ordinaryLabel: asTrimmedString(section.ordinaryLabel, defaults.ordinaryLabel),
    rows: normalizeCompareRows(section.rows),
  };
}

/** Merge admin compare config with bundled marketing fallbacks. */
export function resolveCompareDisplay(section) {
  const normalized = normalizeCompareSection(section);
  if (!normalized.enabled) return null;
  const rows = normalized.rows
    .filter((row) => row.enabled && row.label)
    .map((row) => ({
      id: row.id,
      label: row.label,
      ours: row.ours,
      ordinary: row.ordinary,
      oursImage: row.oursImageUrl || getCompareRowImageFallback(row.id, "ours"),
      ordinaryImage: row.ordinaryImageUrl || getCompareRowImageFallback(row.id, "ordinary"),
    }));
  if (!rows.length) return null;
  return {
    eyebrow: normalized.eyebrow,
    title: normalized.title,
    subtitle: normalized.subtitle,
    filmLabel: normalized.filmLabel,
    storyChapter: normalized.storyChapter,
    openingLine: normalized.openingLine,
    oursLabel: normalized.oursLabel,
    ordinaryLabel: normalized.ordinaryLabel,
    rows,
  };
}
