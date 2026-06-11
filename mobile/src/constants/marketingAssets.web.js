/**
 * Web-optimized hero slides (WebP @ 840–1200px). Generated via `npm run optimize:web`.
 * Native uses PNG sources in `marketingAssets.js`.
 */

export const HOME_HERO_PRODUCT_SLIDE_HEIGHT_PER_WIDTH = 941 / 1672;
export const HOME_HERO_WEB_LANDSCAPE_HEIGHT_PER_WIDTH = 1024 / 1535;
export const HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH = 1200 / 941;
export const HOME_HERO_PRODUCT_WIDE_HEIGHT_PER_WIDTH = 821 / 1915;

export const HOME_HERO_PRODUCT_SLIDE = {
  key: "web-hero-product",
  image: require("../../assets/marketing/hero-slide-kankreg-product-wide-web-1200.webp"),
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

export const HOME_HERO_WEB_SLIDER_SLIDES = [
  HOME_HERO_PRODUCT_SLIDE,
  {
    key: "web-hero-ghee",
    image: require("../../assets/marketing/hero-slide-kankreg-web-02-web-1200.webp"),
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
    image: require("../../assets/marketing/hero-slide-kankreg-hero-03-web-1200.webp"),
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
    image: require("../../assets/marketing/hero-slide-kankreg-web-04-web-1200.webp"),
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

export const HOME_HERO_PRODUCT_PHONE_SLIDE = {
  key: "phone-hero-product",
  image: require("../../assets/marketing/hero-slide-kankreg-phone-hero-web-840.webp"),
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

export const HOME_HERO_PRODUCT_PHONE_SLIDE_HEIGHT_PER_WIDTH = 1200 / 941;

export const HOME_HERO_MOBILE_SLIDER_SLIDES = [
  HOME_HERO_PRODUCT_PHONE_SLIDE,
  {
    key: "phone-hero-jar",
    image: require("../../assets/marketing/hero-slide-kankreg-phone-02-web-840.webp"),
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
    image: require("../../assets/marketing/hero-slide-kankreg-phone-03-web-840.webp"),
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
    image: require("../../assets/marketing/hero-slide-kankreg-phone-04-web-840.webp"),
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

export const AUTH_AMBIENT_IMAGE = require("../../assets/marketing/hero-slide-04-wa.jpeg");
