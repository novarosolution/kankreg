/**
 * Bundled lifestyle / product photography for hero surfaces (Expo Metro `require`).
 * Files under `assets/marketing/` — originals live in project `img/` (sync when adding shots).
 *
 * Each slide: static copy + CTA; first slide title/subtitle overridden in KankregHomeScreen from admin `homeViewConfig`.
 */

export const HOME_HERO_CAROUSEL_SLIDES = [
  {
    key: "hero-1",
    image: require("../../assets/marketing/hero-slide-1.jpg"),
    title: "Heritage craft, delivered",
    subtitle: "Fast delivery. Fresh picks. Curated quality.",
    cta: "Explore collection",
    action: "featured",
  },
  {
    key: "hero-2",
    image: require("../../assets/marketing/hero-slide-2.jpg"),
    title: "Fresh picks, daily",
    subtitle: "Handpicked essentials with premium freshness and reliable quality.",
    cta: "Explore fresh",
    action: "featured",
  },
  {
    key: "hero-3",
    image: require("../../assets/marketing/hero-slide-3.jpg"),
    title: "Smooth checkout",
    subtitle: "Simple cart flow, faster ordering, and a cleaner shopping experience.",
    cta: "Start shopping",
    action: "catalog",
  },
  {
    key: "hero-4",
    image: require("../../assets/marketing/hero-slide-04-wa.jpeg"),
    title: "Pure & natural",
    subtitle: "Thoughtfully sourced products you can trust for your home and family.",
    cta: "Shop now",
    action: "catalog",
  },
  {
    key: "hero-5",
    image: require("../../assets/marketing/hero-slide-05-wa.jpeg"),
    title: "Small batch quality",
    subtitle: "Limited runs and careful selection—flavour and freshness first.",
    cta: "See highlights",
    action: "featured",
  },
  {
    key: "hero-6",
    image: require("../../assets/marketing/hero-slide-06-wa.jpeg"),
    title: "From our kitchen to yours",
    subtitle: "Celebrate tradition with staples that feel premium every day.",
    cta: "Browse catalog",
    action: "catalog",
  },
  {
    key: "hero-7",
    image: require("../../assets/marketing/hero-slide-07.png"),
    title: "Curated for you",
    subtitle: "A storefront experience tuned for quick discovery on phone and web.",
    cta: "Explore collection",
    action: "featured",
  },
  {
    key: "hero-8",
    image: require("../../assets/marketing/hero-slide-08.png"),
    title: "COD & reliable delivery",
    subtitle: "Order with confidence—clear updates and dependable fulfilment.",
    cta: "Start shopping",
    action: "catalog",
  },
  {
    key: "hero-9",
    image: require("../../assets/marketing/hero-slide-09.png"),
    title: "Premium presentation",
    subtitle: "Packaging and picks that match the care behind every product.",
    cta: "Shop now",
    action: "catalog",
  },
  {
    key: "hero-10",
    image: require("../../assets/marketing/hero-slide-10.png"),
    title: "Your everyday essentials",
    subtitle: "Stock up on favourites without compromising on taste or authenticity.",
    cta: "See highlights",
    action: "featured",
  },
  {
    key: "hero-11",
    image: require("../../assets/marketing/hero-slide-11.png"),
    title: "Crafted selection",
    subtitle: "We spotlight items that earn a place on your shelf.",
    cta: "Browse catalog",
    action: "catalog",
  },
  {
    key: "hero-12",
    image: require("../../assets/marketing/hero-slide-12.png"),
    title: "Bright, modern shopping",
    subtitle: "A calm, focused layout on web and mobile—find what you need faster.",
    cta: "Explore collection",
    action: "featured",
  },
  {
    key: "hero-13",
    image: require("../../assets/marketing/hero-slide-13.png"),
    title: "Trust in every order",
    subtitle: "Transparent quality, responsive support, and a cart that stays in sync.",
    cta: "Start shopping",
    action: "catalog",
  },
  {
    key: "hero-14",
    image: require("../../assets/marketing/hero-slide-14.png"),
    title: "Made to impress",
    subtitle: "Gift-ready picks and staples that look as good as they perform.",
    cta: "Shop now",
    action: "catalog",
  },
  {
    key: "hero-15",
    image: require("../../assets/marketing/hero-slide-15.png"),
    title: "Welcome to the experience",
    subtitle: "Scroll the catalog, save your address, and checkout in minutes.",
    cta: "See highlights",
    action: "featured",
  },
];

/** Product packaging slide height ratio — web/desktop landscape (1672×941). */
export const HOME_HERO_PRODUCT_SLIDE_HEIGHT_PER_WIDTH = 941 / 1672;

/** Default landscape hero height ratio for web (1535×1024 class assets). */
export const HOME_HERO_WEB_LANDSCAPE_HEIGHT_PER_WIDTH = 1024 / 1535;

/** Phone hero band height per point of slider width — portrait reference JPEG. */
export const HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH = 1537 / 1023;

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
  imageFit: "contain",
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
    imageFit: "contain",
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
    imageFit: "contain",
    captionAlign: "left",
  },
  {
    key: "web-hero-pure",
    /** Desktop slide 4 — `imgs/ChatGPT Image Jun 10, 2026, 06_59_11 PM.png` (1915×821). */
    image: require("../../assets/marketing/hero-slide-kankreg-web-04.png"),
    title: "The benchmark of purity",
    subtitle: "A2 Kankrej cow ghee — Bilona-crafted, farm to table.",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH,
    imageFit: "contain",
    captionAlign: "left",
  },
];

/**
 * Native (iOS/Android) home hero only — three WhatsApp JPEGs from `img/`.
 * Order: `WhatsApp Iae2026-04-30…`, `WhatsApp Image …18.41.08`, `WhatsApp Image …18.41.09`
 * → `hero-slide-06-wa`, `hero-slide-04-wa`, `hero-slide-05-wa`.
 */
/** Phone product hero — portrait `imgs/ChatGPT Image Jun 10, 2026, 04_56_13 PM.png` (1111×1416). */
export const HOME_HERO_PRODUCT_PHONE_SLIDE = {
  key: "phone-hero-product",
  image: require("../../assets/marketing/hero-slide-kankreg-product-phone.png"),
  title: HOME_HERO_PRODUCT_SLIDE.title,
  subtitle: HOME_HERO_PRODUCT_SLIDE.subtitle,
  cta: HOME_HERO_PRODUCT_SLIDE.cta,
  action: HOME_HERO_PRODUCT_SLIDE.action,
  variant: HOME_HERO_PRODUCT_SLIDE.variant,
  badge: HOME_HERO_PRODUCT_SLIDE.badge,
  contentPosition: "center",
};

/** Portrait product slide height ratio (1111×1416). */
export const HOME_HERO_PRODUCT_PHONE_SLIDE_HEIGHT_PER_WIDTH = 1416 / 1111;

export const HOME_HERO_MOBILE_SLIDER_SLIDES = [
  HOME_HERO_PRODUCT_PHONE_SLIDE,
  {
    key: "phone-hero-iae",
    /** Phone slide 2 — `imgs/ChatGPT Image Jun 10, 2026, 05_22_00 PM.png` (1110×1417). */
    image: require("../../assets/marketing/hero-slide-kankreg-phone-02.png"),
    title: "Pure A2 Kankrej ghee",
    subtitle: "Hand-churned Bilona ghee — grainy, golden, and honest.",
    cta: "Shop ghee",
    action: "catalog",
  },
  {
    key: "phone-hero-0808",
    /** Phone slide 3 — `imgs/ChatGPT Image Jun 10, 2026, 05_34_22 PM.png` (1023×1537). */
    image: require("../../assets/marketing/hero-slide-kankreg-phone-03.png"),
    title: "A golden touch on every meal",
    subtitle:
      "Pure Bilona ghee over steaming dal-chawal — from grass-fed Kankrej cows to your family table.",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
  },
  {
    key: "phone-hero-0909",
    /** Phone slide 4 — portrait `imgs/ChatGPT Image Jun 10, 2026, 06_15_51 PM phone.png` (498×1024). */
    image: require("../../assets/marketing/hero-slide-kankreg-phone-04.png"),
    title: "The benchmark of purity",
    subtitle: "A2 Kankrej cow ghee — Bilona-crafted, farm to table.",
    cta: "Shop ghee",
    action: "catalog",
    contentPosition: "center",
    heightRatio: 1024 / 498,
    imageFit: "cover",
    captionAlign: "center",
  },
];

/** Cross-platform brand film for Home (web + native). */
export const HOME_BRAND_PROMO_VIDEO = require("../../assets/marketing/home-hero-video.mp4");

/** @deprecated Use HOME_HERO_CAROUSEL_SLIDES — kept for quick greps / external refs */
export const HOME_HERO_SLIDE_IMAGES = HOME_HERO_CAROUSEL_SLIDES.map((s) => s.image);

/** Softer JPEG for auth hero (lighter than large PNGs). */
export const AUTH_AMBIENT_IMAGE = require("../../assets/marketing/hero-slide-04-wa.jpeg");
