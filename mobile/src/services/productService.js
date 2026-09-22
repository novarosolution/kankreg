import { apiGet, apiPost } from "./apiClient";
import { parseCatalogBoolean } from "../utils/catalogBoolean";
import { normalizeHeroSubtitle, normalizeHeroTitle } from "../utils/homeMarketingCopy";
import {
  normalizeAboutSection,
  normalizeCommunitySection,
  normalizeCompareSection,
  normalizeProcessSection,
  normalizeHeroSlides,
} from "../utils/homeViewMedia";

const publicApi = { auth: false };

const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000;
let productsCache = {
  data: null,
  fetchedAt: 0,
  promise: null,
};

function storeProducts(list) {
  const normalized = Array.isArray(list) ? list.map(normalizeProduct) : [];
  productsCache = {
    data: normalized,
    fetchedAt: Date.now(),
    promise: null,
  };
  return normalized;
}

async function fetchProductsFromApi() {
  const data = await apiGet("/products", publicApi);
  const list = Array.isArray(data) ? data : [];
  return storeProducts(list);
}

/** Instant catalog for first paint — no network wait. */
export function peekProductsCache() {
  return productsCache.data;
}

/** Refresh catalog in background; optional callback when newer data arrives. */
export function revalidateProductsInBackground(onUpdated) {
  const now = Date.now();
  if (productsCache.data && now - productsCache.fetchedAt < PRODUCTS_CACHE_TTL_MS) {
    /** Still deliver cached data to the caller: a screen whose own initial fetch
     *  failed (backend briefly down) relies on this callback to recover once another
     *  screen has successfully filled the cache — skipping it left Home stuck on
     *  "No products yet" while Shop showed the full catalog. */
    if (onUpdated) onUpdated(productsCache.data);
    return Promise.resolve(productsCache.data);
  }
  if (productsCache.promise) {
    return productsCache.promise.then((data) => {
      if (onUpdated && data) onUpdated(data);
      return data;
    });
  }
  productsCache.promise = fetchProductsFromApi()
    .then((data) => {
      if (onUpdated) onUpdated(data);
      return data;
    })
    .catch((error) => {
      productsCache.promise = null;
      throw error;
    })
    .finally(() => {
      productsCache.promise = null;
    });
  return productsCache.promise;
}

/** Warm catalog during app boot (fire-and-forget). */
export function warmProductsCache() {
  revalidateProductsInBackground().catch(() => {});
}

/** Find one product from the warm catalog cache. */
export function peekProductById(productId) {
  const id = String(productId || "").trim();
  if (!id || !productsCache.data) return null;
  return productsCache.data.find((item) => String(item.id) === id) || null;
}

export function normalizeProduct(raw) {
  const primaryImage =
    raw.image || (Array.isArray(raw.images) && raw.images.length ? raw.images[0] : "");

  const priceNum = Number(raw.price);
  const price = Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : 0;

  const mrpNum = Number(raw.mrp);
  const mrp =
    Number.isFinite(mrpNum) && mrpNum > 0 ? mrpNum : null;

  const id = String(raw._id ?? raw.id ?? "");
  const name = String(raw.name ?? "").trim() || "Untitled product";
  const description = String(raw.description ?? "").trim();
  const unit = String(raw.unit ?? "").trim() || "1 pc";

  const variants = Array.isArray(raw.variants)
    ? raw.variants
        .map((v) => ({
          label: String(v?.label ?? "").trim(),
          price: Math.max(0, Number(v?.price) || 0),
          tag: String(v?.tag ?? "").trim(),
        }))
        .filter((v) => v.label && Number.isFinite(v.price))
    : [];

  const trustChips = Array.isArray(raw.trustChips)
    ? raw.trustChips
        .map((b) => ({
          icon: String(b?.icon ?? "checkmark-circle-outline").trim() || "checkmark-circle-outline",
          label: String(b?.label ?? "").trim(),
        }))
        .filter((b) => b.label)
    : [];

  const highlights = Array.isArray(raw.highlights)
    ? raw.highlights.map((s) => String(s ?? "").trim()).filter(Boolean)
    : [];

  const nutritionRaw = raw.nutrition && typeof raw.nutrition === "object" ? raw.nutrition : {};
  const nutritionRows = Array.isArray(nutritionRaw.rows)
    ? nutritionRaw.rows
        .map((r) => ({
          label: String(r?.label ?? "").trim(),
          value: String(r?.value ?? "").trim(),
        }))
        .filter((r) => r.label && r.value)
    : [];
  const nutritionCardTags = Array.isArray(nutritionRaw.cardTags)
    ? nutritionRaw.cardTags.map((t) => String(t ?? "").trim()).filter(Boolean)
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
    isPublished: raw.isPublished !== false,
    homeOrder: Number.isFinite(Number(raw.homeOrder)) ? Number(raw.homeOrder) : 0,
    brand: String(raw.brand ?? "").trim(),
    sku: String(raw.sku ?? "").trim(),
    unit,
    eta: raw.eta ? String(raw.eta).trim() : "",
    isSpecial: parseCatalogBoolean(raw.isSpecial, false),
    comingSoon: parseCatalogBoolean(raw.comingSoon, false),
    comingSoonNote: String(raw.comingSoonNote ?? "").trim(),
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
    pageEyebrow: String(raw.pageEyebrow ?? "").trim(),
    trustChips,
    highlights,
    deliveryTitle: String(raw.deliveryTitle ?? "").trim(),
    deliveryBody: String(raw.deliveryBody ?? "").trim(),
    storyKick: String(raw.storyKick ?? "").trim(),
    storyTitle: String(raw.storyTitle ?? "").trim(),
    storyLegend: String(raw.storyLegend ?? "").trim(),
    reviewsKick: String(raw.reviewsKick ?? "").trim(),
    reviewsTitle: String(raw.reviewsTitle ?? "").trim(),
    nutrition: {
      kick: String(nutritionRaw.kick ?? "").trim(),
      title: String(nutritionRaw.title ?? "").trim(),
      tableHead: String(nutritionRaw.tableHead ?? "").trim(),
      tableSub: String(nutritionRaw.tableSub ?? "").trim(),
      rows: nutritionRows,
      cardTitle: String(nutritionRaw.cardTitle ?? "").trim(),
      cardBody: String(nutritionRaw.cardBody ?? "").trim(),
      cardTags: nutritionCardTags,
      cardFooter: String(nutritionRaw.cardFooter ?? "").trim(),
    },
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

  productsCache.promise = fetchProductsFromApi()
    .catch((error) => {
      productsCache.promise = null;
      if (productsCache.data) return productsCache.data;
      throw error;
    })
    .finally(() => {
      productsCache.promise = null;
    });

  return productsCache.promise;
}

export function invalidateProductsCache() {
  productsCache = {
    data: null,
    fetchedAt: 0,
    promise: null,
  };
}

export async function getProductById(id, { fresh = false } = {}) {
  const key = String(id || "").trim();
  if (!key) return null;

  if (!fresh) {
    const allProducts = await getProducts();
    const cached = allProducts.find((item) => String(item.id) === key);
    if (cached) return cached;
  }

  try {
    const data = await apiGet(`/products/${encodeURIComponent(key)}`, publicApi);
    if (!data) return null;
    return normalizeProduct(data);
  } catch {
    const allProducts = await getProducts();
    return allProducts.find((item) => String(item.id) === key) || null;
  }
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
  processSection: normalizeProcessSection(null),
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
    processSection: normalizeProcessSection(data?.processSection),
  };
}

let homeViewCache = {
  data: null,
  fetchedAt: 0,
  promise: null,
};

export function peekHomeViewCache() {
  return homeViewCache.data || { ...DEFAULT_HOME_VIEW_CONFIG };
}

export function warmHomeViewCache() {
  revalidateHomeViewInBackground().catch(() => {});
}

export function revalidateHomeViewInBackground(onUpdated) {
  const now = Date.now();
  if (homeViewCache.data && now - homeViewCache.fetchedAt < PRODUCTS_CACHE_TTL_MS) {
    /** Same recovery contract as revalidateProductsInBackground — always deliver. */
    if (onUpdated) onUpdated(homeViewCache.data);
    return Promise.resolve(homeViewCache.data);
  }
  if (homeViewCache.promise) {
    return homeViewCache.promise.then((data) => {
      if (onUpdated) onUpdated(data);
      return data;
    });
  }
  homeViewCache.promise = fetchHomeViewFromApi()
    .then((data) => {
      if (onUpdated) onUpdated(data);
      return data;
    })
    .catch(() => homeViewCache.data || { ...DEFAULT_HOME_VIEW_CONFIG })
    .finally(() => {
      homeViewCache.promise = null;
    });
  return homeViewCache.promise;
}

async function fetchHomeViewFromApi() {
  try {
    const data = await apiGet("/home-view", publicApi);
    const normalized = normalizeHomeViewConfig(data);
    homeViewCache = { data: normalized, fetchedAt: Date.now(), promise: null };
    return normalized;
  } catch {
    const fallback = { ...DEFAULT_HOME_VIEW_CONFIG };
    /** fetchedAt: 0 — a failed fetch must not count as fresh for the TTL window,
     *  otherwise admin hero slides/config stay hidden for 5 minutes after one blip. */
    homeViewCache = { data: fallback, fetchedAt: 0, promise: null };
    return fallback;
  }
}

/** Customer home config from MongoDB — cached for instant home paint. */
export async function getHomeViewConfig() {
  const now = Date.now();
  if (homeViewCache.data && now - homeViewCache.fetchedAt < PRODUCTS_CACHE_TTL_MS) {
    return homeViewCache.data;
  }
  if (homeViewCache.promise) {
    return homeViewCache.promise;
  }
  return revalidateHomeViewInBackground();
}
