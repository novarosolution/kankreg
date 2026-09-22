import { parseCatalogBoolean } from "./catalogBoolean";
import { getProductCategoryLabels, isProductOnSale, isProductPremium } from "./shopFilters";
import { isProductComingSoon, isProductOutOfStock } from "./productAvailability";

export function buildShopCatalogSummary(products = []) {
  const list = Array.isArray(products) ? products : [];
  let inStock = 0;
  let comingSoon = 0;
  let onSale = 0;
  let outOfStock = 0;

  for (const p of list) {
    if (isProductComingSoon(p)) {
      comingSoon += 1;
      continue;
    }
    if (isProductOutOfStock(p)) {
      outOfStock += 1;
      continue;
    }
    inStock += 1;
    if (isProductOnSale(p)) onSale += 1;
  }

  return {
    total: list.length,
    inStock,
    comingSoon,
    onSale,
    outOfStock,
  };
}

/** Category → product count for shop rail. */
export function getShopCategoryCounts(products = []) {
  const map = new Map();
  for (const p of products) {
    for (const label of getProductCategoryLabels(p)) {
      const key = String(label || "").trim();
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      const order = { Ghee: 0, Oils: 1, Atta: 2 };
      const d = (order[a.label] ?? 9) - (order[b.label] ?? 9);
      return d || a.label.localeCompare(b.label);
    });
}

export function isProductPremiumFlag(p) {
  return parseCatalogBoolean(p?.isSpecial, false) || isProductPremium(p);
}
