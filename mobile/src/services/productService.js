import { apiGet, apiPost } from "./apiClient";
import { normalizeHeroSubtitle, normalizeHeroTitle } from "../utils/homeMarketingCopy";
import {
  normalizeAboutSection,
  normalizeCommunitySection,
  normalizeCompareSection,
  normalizeHeroSlides,
} from "../utils/homeViewMedia";

const publicApi = { auth: false };

const PRODUCTS_CACHE_TTL_MS = 60 * 1000;
let productsCache = {
  data: null,
  fetchedAt: 0,
  promise: null,
};

function normalizeProduct(raw) {
  const primaryImage =
    raw.image || (Array.isArray(raw.images) && raw.images.length ? raw.images[0] : "");

  const priceNum = Number(raw.price);
  const price = Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : 0;

  const mrpNum = Number(raw.mrp);
  const mrp =
    Number.isFinite(mrpNum) && mrpNum > 0 ? mrpNum : null;

  const id = raw._id ?? raw.id;
  const name = String(raw.name ?? "").trim() || "Untitled product";
  const description = String(raw.description ?? "").trim();
  const unit = String(raw.unit ?? "").trim() || "1 pc";

  const variants = Array.isArray(raw.variants)
    ? raw.variants
        .map((v) => ({
          label: String(v?.label ?? "").trim(),
          price: Math.max(0, Number(v?.price) || 0),
        }))
        .filter((v) => v.label && Number.isFinite(v.price))
    : [];

  const usps = Array.isArray(raw.usps)
    ? raw.usps
        .map((b) => ({
          icon: String(b?.icon ?? "checkmark-circle-outline").trim() || "checkmark-circle-outline",
          title: String(b?.title ?? "").trim(),
          description: String(b?.description ?? "").trim(),
        }))
        .filter((b) => b.title || b.description)
    : [];

  const usageRituals = Array.isArray(raw.usageRituals)
    ? raw.usageRituals
        .map((b) => ({
          icon: String(b?.icon ?? "sunny-outline").trim() || "sunny-outline",
          title: String(b?.title ?? "").trim(),
          description: String(b?.description ?? "").trim(),
        }))
        .filter((b) => b.title || b.description)
    : [];

  const processSteps = Array.isArray(raw.processSteps)
    ? raw.processSteps.map((s) => String(s ?? "").trim()).filter(Boolean)
    : [];

  const ratingAvg = Number(raw.ratingAverage);
  const reviewCt = Number(raw.reviewCount);

  return {
    ...raw,
    id,
    name,
    description,
    price,
    mrp,
    image: primaryImage,
    images:
      Array.isArray(raw.images) && raw.images.length
        ? raw.images
        : primaryImage
          ? [primaryImage]
          : [],
    category: String(raw.category ?? "").trim() || "General",
    homeSection: String(raw.homeSection ?? "").trim() || "Prime Products",
    productType: String(raw.productType ?? raw.category ?? "").trim() || "General",
    showOnHome: raw.showOnHome !== false,
    homeOrder: Number.isFinite(Number(raw.homeOrder)) ? Number(raw.homeOrder) : 0,
    brand: String(raw.brand ?? "").trim(),
    sku: String(raw.sku ?? "").trim(),
    unit,
    eta: raw.eta ? String(raw.eta).trim() : "",
    isSpecial: Boolean(raw.isSpecial),
    inStock: raw.inStock !== false,
    stockQty: Number.isFinite(Number(raw.stockQty)) ? Math.max(0, Number(raw.stockQty)) : 0,
    ratingAverage: Number.isFinite(ratingAvg) ? Math.min(5, Math.max(0, ratingAvg)) : 0,
    reviewCount: Number.isFinite(reviewCt) ? Math.max(0, Math.floor(reviewCt)) : 0,
    badgeText: String(raw.badgeText ?? "").trim(),
    lifestyleImage: String(raw.lifestyleImage ?? "").trim(),
    variants,
    usps,
    processTitle: String(raw.processTitle ?? "").trim(),
    processSteps,
    highlightQuote: String(raw.highlightQuote ?? "").trim(),
    usageRituals,
    richProductPage: raw.richProductPage === true,
  };
}

export async function getProducts() {
  const now = Date.now();
  if (productsCache.data && now - productsCache.fetchedAt < PRODUCTS_CACHE_TTL_MS) {
    return productsCache.data;
  }
  if (productsCache.promise) {
    return productsCache.promise;
  }

  productsCache.promise = (async () => {
    const data = await apiGet("/products", publicApi);
    const list = Array.isArray(data) ? data : [];
    const normalized = list.map(normalizeProduct);
    productsCache = {
      data: normalized,
      fetchedAt: Date.now(),
      promise: null,
    };
    return normalized;
  })();

  try {
    return await productsCache.promise;
  } catch (error) {
    productsCache.promise = null;
    throw error;
  }
}

export function invalidateProductsCache() {
  productsCache = {
    data: null,
    fetchedAt: 0,
    promise: null,
  };
}

export async function getProductById(id) {
  const allProducts = await getProducts();
  return allProducts.find((item) => item.id === id) || null;
}

export async function getProductReviews(productId) {
  const data = await apiGet(`/products/${productId}/reviews`, publicApi);
  return {
    ratingAverage: Number(data.ratingAverage || 0),
    reviewCount: Number(data.reviewCount || 0),
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
  };
}

export async function submitProductReview(_token, productId, payload) {
  const data = await apiPost(`/products/${productId}/reviews`, payload);
  return {
    ratingAverage: Number(data.ratingAverage || 0),
    reviewCount: Number(data.reviewCount || 0),
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
  };
}

export const DEFAULT_HOME_VIEW_CONFIG = {
  heroTitle: "",
  heroSubtitle: "",
  primeSectionTitle: "",
  productTypeTitle: "",
  showPrimeSection: true,
  showHomeSections: true,
  showProductTypeSections: true,
  productCardStyle: "compact",
  heroSlides: [],
  aboutSection: normalizeAboutSection(null),
  communitySection: normalizeCommunitySection(null),
  compareSection: normalizeCompareSection(null),
};

function normalizeHomeViewConfig(data) {
  const heroTitle = normalizeHeroTitle(String(data?.heroTitle ?? "").trim());
  const heroSubtitle = normalizeHeroSubtitle(String(data?.heroSubtitle ?? "").trim());
  return {
    heroTitle,
    heroSubtitle,
    primeSectionTitle: String(data?.primeSectionTitle ?? "").trim(),
    productTypeTitle: String(data?.productTypeTitle ?? "").trim(),
    showPrimeSection: data?.showPrimeSection !== false,
    showHomeSections: data?.showHomeSections !== false,
    showProductTypeSections: data?.showProductTypeSections !== false,
    productCardStyle: data?.productCardStyle === "comfortable" ? "comfortable" : "compact",
    heroSlides: normalizeHeroSlides(data?.heroSlides),
    aboutSection: normalizeAboutSection(data?.aboutSection),
    communitySection: normalizeCommunitySection(data?.communitySection),
    compareSection: normalizeCompareSection(data?.compareSection),
  };
}

/** Customer home config from MongoDB — always returns usable defaults when API is unavailable. */
export async function getHomeViewConfig() {
  try {
    const data = await apiGet("/home-view", publicApi);
    return normalizeHomeViewConfig(data);
  } catch {
    return { ...DEFAULT_HOME_VIEW_CONFIG };
  }
}
