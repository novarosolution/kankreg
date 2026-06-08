/** Home / Figma labels → product `category` / `productType` values in the catalog. */
const CATEGORY_ALIASES = {
  home: ["home & kitchen", "home and kitchen", "home", "kitchen"],
  kitchen: ["home & kitchen", "kitchen", "home and kitchen"],
  wellness: ["wellness"],
  lifestyle: ["lifestyle"],
  accessories: ["accessories"],
  general: ["general"],
};

function normalizeCategoryLabel(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function getProductCategoryLabels(product) {
  const cat = String(product?.category || "").trim();
  const type = String(product?.productType || "").trim();
  return [...new Set([cat, type].filter(Boolean))];
}

/** Match selected shop categories (from chips / home deep links). */
export function matchShopCategories(product, selectedCategories = []) {
  if (!selectedCategories.length) return true;

  const productLabels = getProductCategoryLabels(product).map(normalizeCategoryLabel);
  if (!productLabels.length) return false;

  return selectedCategories.some((filter) => {
    const f = normalizeCategoryLabel(filter);
    if (!f) return true;

    if (productLabels.some((pl) => pl === f || pl.includes(f) || f.includes(pl))) {
      return true;
    }

    const aliases = CATEGORY_ALIASES[f] || [];
    return aliases.some((alias) => {
      const a = normalizeCategoryLabel(alias);
      return productLabels.some((pl) => pl === a || pl.includes(a) || a.includes(pl));
    });
  });
}

export function getProductRating(product) {
  const raw = product?.ratingAverage ?? product?.rating ?? product?.averageRating;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export function isProductOnSale(product) {
  const mrp = Number(product?.mrp);
  const price = Number(product?.price);
  return Number.isFinite(mrp) && Number.isFinite(price) && mrp > price;
}

export function isProductPremium(product) {
  return Number(product?.price) >= 1500;
}

/**
 * Apply shop catalog filters — shared by native + web `ShopScreen`.
 */
export function applyShopFilters(products, { categories = [], pill = "All", minRating = 0, sortKey = "featured" } = {}) {
  let list = (Array.isArray(products) ? products : []).filter((p) => p.inStock !== false);

  if (categories.length) {
    list = list.filter((p) => matchShopCategories(p, categories));
  }

  if (pill === "On sale") {
    list = list.filter(isProductOnSale);
  } else if (pill === "Premium") {
    list = list.filter(isProductPremium);
  } else if (pill === "New in") {
    list = list.slice(0, 8);
  }

  if (minRating >= 4) {
    list = list.filter((p) => getProductRating(p) >= 4);
  } else if (minRating >= 3) {
    list = list.filter((p) => getProductRating(p) >= 3);
  }

  if (sortKey === "price-asc") {
    list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
  }

  return list;
}
