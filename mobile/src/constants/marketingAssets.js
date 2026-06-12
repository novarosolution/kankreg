/**
 * Bundled lifestyle / product photography for hero surfaces (Expo Metro `require`).
 * Source originals: project `imgs/` → synced to `mobile/assets/marketing/` (resize with sips -Z).
 *
 * Each slide: static copy + CTA; first slide title/subtitle overridden in KankregHomeScreen from admin `homeViewConfig`.
 */

/** Product packaging slide height ratio — web/desktop landscape (1672×941). */
export const HOME_HERO_PRODUCT_SLIDE_HEIGHT_PER_WIDTH = 941 / 1672;

/** Default landscape hero height ratio for web (1535×1024 class assets). */
export const HOME_HERO_WEB_LANDSCAPE_HEIGHT_PER_WIDTH = 1024 / 1535;

/** Compact home hero band — short carousel above catalog (web fallback only). */
export const HOME_HERO_COMPACT_HEIGHT_RATIO = 0.34;
export const HOME_HERO_COMPACT_MAX_HEIGHT = 220;
export const HOME_HERO_COMPACT_MIN_HEIGHT = 168;

/** Native app home hero — premium band, full copy visible. */
export const HOME_HERO_APP_HEIGHT_RATIO = 0.56;
export const HOME_HERO_APP_MAX_HEIGHT = 312;
export const HOME_HERO_APP_MIN_HEIGHT = 228;
export const HOME_HERO_APP_MAX_SLIDES = 2;

/** Phone hero band height per point of slider width — portrait product slide (941×1200). */
export const HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH = 1200 / 941;

/**
 * Web home hero only — three PNGs from `img/` (bundled as `hero-slide-13`, `hero-slide-10`, `hero-slide-07`).
 * Order matches: file_00000000a7b47208…, file_0000000054c47208…, file_0000000005007208…
 */
/** Wide landscape product hero — desktop slide 1 (1915×821 panoramic). */
export const HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH = 821 / 1915;

/** Landscape product hero — `imgs/ChatGPT Image Jun 10, 2026, 06_44_25 PM.png` (1915×821). */
export const HOME_HERO_PRODUCT_SLIDE = {
  key: "web-hero-product",
  image: require("../../assets/marketing/hero-slide-kankreg-product-wide.png"),
  title: "The benchmark of purity",
  subtitle: "A2 Kankrej cow ghee — Bilona method, farm to table.",
  cta: "Shop ghee",
  action: "catalog",
  variant: "product",
  badge: "Bilona · Farm to table",
  contentPosition: "center",
  heightRatio: HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH,
  imageFit: "cover",
  captionAlign: "left",
};

/** Photo-based web hero slides (no baked-in PNG typography — overlay copy only). */
export const HOME_HERO_WEB_SLIDER_SLIDES = [
  HOME_HERO_PRODUCT_SLIDE,
  {
    key: "web-hero-ghee",
    /** Desktop slide 2 — `imgs/ChatGPT Image Jun 10, 2026, 06_45_06 PM.png` (1915×821). */
    image: require("../../assets/marketing/hero-slide-kankreg-web-02.png"),
    title: "Pure A2 Kankrej ghee",
    subtitle: "Hand-churned Bilona ghee — grainy, golden, and honest.",
    cta: "Shop ghee",
    action: "catalog",
    heightRatio: HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH,
    imageFit: "cover",
    captionAlign: "left",
  },
  {
    key: "web-hero-craft",
    /** Desktop slide 3 — `imgs/ChatGPT Image Jun 10, 2026, 06_53_12 PM.png` (1915×821). */
    image: require("../../assets/marketing/hero-slide-kankreg-hero-03.png"),
    title: "A golden touch on every meal",
    subtitle:
      "Pure Bilona ghee over steaming dal-chawal — from grass-fed Kankrej cows to your family table.",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH,
    imageFit: "cover",
    captionAlign: "left",
  },
  {
    key: "web-hero-pure",
    /** Desktop slide 4 — `imgs/ChatGPT Image Jun 10, 2026, 06_59_11 PM.png` (1915×821). Copy is baked into the artwork. */
    image: require("../../assets/marketing/hero-slide-kankreg-web-04.png"),
    title: "",
    subtitle: "",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH,
    imageFit: "cover",
    captionAlign: "center",
  },
];

/**
 * Native (iOS/Android) home hero only — three WhatsApp JPEGs from `img/`.
 * Order: `WhatsApp Iae2026-04-30…`, `WhatsApp Image …18.41.08`, `WhatsApp Image …18.41.09`
 * → `hero-slide-06-wa`, `hero-slide-04-wa`, `hero-slide-05-wa`.
 */
/**
 * Phone hero slide 1 — `imgs/ChatGPT Image Jun 10, 2026, 04_56_13 PM.png` (product box).
 * Phone hero slide 2 — `imgs/ChatGPT Image Jun 10, 2026, 05_22_00 PM.png` (glass jar).
 * Phone hero slide 3 — `imgs/ChatGPT Image Jun 10, 2026, 05_34_22 PM.png` (khichdi + ghee).
 * Phone hero slide 4 — `imgs/ChatGPT Image Jun 10, 2026, 06_15_51 PM phone.png` (box + jar, baked copy).
 */
export const HOME_HERO_PRODUCT_PHONE_SLIDE = {
  key: "phone-hero-product",
  image: require("../../assets/marketing/hero-slide-kankreg-phone-hero.png"),
  title: "The benchmark of purity",
  subtitle: "A2 Kankrej cow ghee — Bilona method, farm to table.",
  cta: "Shop ghee",
  action: "catalog",
  variant: "product",
  badge: "Bilona · Farm to table",
  contentPosition: "center",
  heightRatio: 1200 / 941,
  imageFit: "cover",
  captionAlign: "center",
  captionMode: "overlay",
  captionZone: "bottom",
};

/** Portrait product slide height ratio (941×1200 bundled). */
export const HOME_HERO_PRODUCT_PHONE_SLIDE_HEIGHT_PER_WIDTH = 1200 / 941;

export const HOME_HERO_MOBILE_SLIDER_SLIDES = [
  HOME_HERO_PRODUCT_PHONE_SLIDE,
  {
    key: "phone-hero-jar",
    image: require("../../assets/marketing/hero-slide-kankreg-phone-02.png"),
    title: "Pure A2 Kankrej ghee",
    subtitle: "Hand-churned Bilona ghee — grainy, golden, and honest.",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: 1200 / 941,
    imageFit: "cover",
    captionAlign: "center",
    captionMode: "overlay",
    captionZone: "top",
  },
  {
    key: "phone-hero-meal",
    image: require("../../assets/marketing/hero-slide-kankreg-phone-03.png"),
    title: "A golden touch on every meal",
    subtitle:
      "Pure Bilona ghee over steaming khichdi — from grass-fed Kankrej cows to your family table.",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: 1200 / 798,
    imageFit: "cover",
    captionAlign: "center",
    captionMode: "overlay",
    captionZone: "top",
  },
  {
    key: "phone-hero-purity",
    image: require("../../assets/marketing/hero-slide-kankreg-phone-04.png"),
    title: "",
    subtitle: "",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: 1200 / 583,
    imageFit: "cover",
    captionAlign: "center",
    captionMode: "baked",
    captionZone: "bottom",
  },
];

/** Softer JPEG for auth hero (lighter than large PNGs). */
export const AUTH_AMBIENT_IMAGE = require("../../assets/marketing/hero-slide-04-wa.jpeg");
