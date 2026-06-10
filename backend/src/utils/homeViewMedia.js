function asTrimmedString(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function normalizeMediaType(value) {
  const t = asTrimmedString(value).toLowerCase();
  return t === "video" ? "video" : "image";
}

/** @param {unknown} slide */
function normalizeHeroSlide(slide, index = 0) {
  if (!slide || typeof slide !== "object") return null;
  const url = asTrimmedString(slide.url);
  if (!url) return null;
  const id = asTrimmedString(slide.id) || `slide-${index + 1}`;
  return {
    id,
    order: Number.isFinite(Number(slide.order)) ? Number(slide.order) : index,
    mediaType: normalizeMediaType(slide.mediaType),
    url,
    title: asTrimmedString(slide.title),
    subtitle: asTrimmedString(slide.subtitle),
    enabled: slide.enabled !== false,
  };
}

/** @param {unknown} slides */
function normalizeHeroSlides(slides) {
  if (!Array.isArray(slides)) return [];
  return slides
    .map((slide, index) => normalizeHeroSlide(slide, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

/** @param {unknown} photo */
function normalizeAboutPhoto(photo) {
  if (!photo || typeof photo !== "object") return null;
  const url = asTrimmedString(photo.url);
  if (!url) return null;
  return {
    url,
    caption: asTrimmedString(photo.caption),
  };
}

const ABOUT_DEFAULTS = {
  enabled: true,
  eyebrow: "About KankreG",
  title: "Craft rooted in tradition",
  body:
    "KankreG brings slow-made essentials from Indian kitchens to your door — curated quality, live order tracking, and rewards on every purchase.",
  videoUrl: "",
  videoCaption: "",
  photos: [],
};

/** @param {unknown} about */
function normalizeAboutSection(about) {
  if (!about || typeof about !== "object") {
    return { ...ABOUT_DEFAULTS, photos: [] };
  }
  const photos = Array.isArray(about.photos)
    ? about.photos.map(normalizeAboutPhoto).filter(Boolean)
    : [];
  return {
    enabled: about.enabled !== false,
    eyebrow: asTrimmedString(about.eyebrow, ABOUT_DEFAULTS.eyebrow),
    title: asTrimmedString(about.title, ABOUT_DEFAULTS.title),
    body: asTrimmedString(about.body, ABOUT_DEFAULTS.body),
    videoUrl: asTrimmedString(about.videoUrl),
    videoCaption: asTrimmedString(about.videoCaption),
    photos,
  };
}

const { COMMUNITY_SECTION_DEFAULTS } = require("./communityDefaults");

function normalizePostType(value) {
  const t = asTrimmedString(value).toLowerCase();
  return t === "customer" ? "customer" : "reel";
}

/** @param {unknown} author */
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

/** @param {unknown} post */
function normalizeCommunityPost(post, index = 0) {
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

/** @param {unknown} posts */
function normalizeCommunityPosts(posts) {
  if (!Array.isArray(posts) || !posts.length) {
    return COMMUNITY_SECTION_DEFAULTS.posts.map((item, index) =>
      normalizeCommunityPost(item, index)
    );
  }
  return posts
    .map((post, index) => normalizeCommunityPost(post, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

/** @param {unknown} section */
function normalizeCommunitySection(section) {
  if (!section || typeof section !== "object") {
    return {
      ...COMMUNITY_SECTION_DEFAULTS,
      instagram: { ...COMMUNITY_SECTION_DEFAULTS.instagram },
      posts: normalizeCommunityPosts([]),
    };
  }
  const ig = section.instagram && typeof section.instagram === "object" ? section.instagram : {};
  const handle = asTrimmedString(ig.handle, COMMUNITY_SECTION_DEFAULTS.instagram.handle);
  const displayHandle = asTrimmedString(
    ig.displayHandle,
    handle.startsWith("@") ? handle : `@${handle}`
  );
  const url =
    asTrimmedString(ig.url) ||
    `https://instagram.com/${handle.replace(/^@/, "")}`;
  return {
    enabled: section.enabled !== false,
    eyebrow: asTrimmedString(section.eyebrow, COMMUNITY_SECTION_DEFAULTS.eyebrow),
    title: asTrimmedString(section.title, COMMUNITY_SECTION_DEFAULTS.title),
    instagram: {
      handle,
      displayHandle,
      followersLabel: asTrimmedString(
        ig.followersLabel,
        COMMUNITY_SECTION_DEFAULTS.instagram.followersLabel
      ),
      followLabel: asTrimmedString(
        ig.followLabel,
        COMMUNITY_SECTION_DEFAULTS.instagram.followLabel
      ),
      url,
    },
    posts: normalizeCommunityPosts(section.posts),
  };
}

const { COMPARE_SECTION_DEFAULTS } = require("./compareDefaults");

/** @param {unknown} row */
function normalizeCompareRow(row, index = 0) {
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

/** @param {unknown} rows */
function normalizeCompareRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    return COMPARE_SECTION_DEFAULTS.rows.map((item, index) => normalizeCompareRow(item, index));
  }
  return rows
    .map((row, index) => normalizeCompareRow(row, index))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

/** @param {unknown} section */
function normalizeCompareSection(section) {
  if (!section || typeof section !== "object") {
    return {
      ...COMPARE_SECTION_DEFAULTS,
      rows: normalizeCompareRows([]),
    };
  }
  return {
    enabled: section.enabled !== false,
    eyebrow: asTrimmedString(section.eyebrow, COMPARE_SECTION_DEFAULTS.eyebrow),
    title: asTrimmedString(section.title, COMPARE_SECTION_DEFAULTS.title),
    subtitle: asTrimmedString(section.subtitle, COMPARE_SECTION_DEFAULTS.subtitle),
    filmLabel: asTrimmedString(section.filmLabel, COMPARE_SECTION_DEFAULTS.filmLabel),
    storyChapter: asTrimmedString(section.storyChapter, COMPARE_SECTION_DEFAULTS.storyChapter),
    openingLine: asTrimmedString(section.openingLine, COMPARE_SECTION_DEFAULTS.openingLine),
    oursLabel: asTrimmedString(section.oursLabel, COMPARE_SECTION_DEFAULTS.oursLabel),
    ordinaryLabel: asTrimmedString(section.ordinaryLabel, COMPARE_SECTION_DEFAULTS.ordinaryLabel),
    rows: normalizeCompareRows(section.rows),
  };
}

module.exports = {
  ABOUT_DEFAULTS,
  COMMUNITY_SECTION_DEFAULTS,
  COMPARE_SECTION_DEFAULTS,
  normalizeHeroSlides,
  normalizeAboutSection,
  normalizeCommunitySection,
  normalizeCommunityPosts,
  normalizeCompareSection,
  normalizeCompareRows,
};
