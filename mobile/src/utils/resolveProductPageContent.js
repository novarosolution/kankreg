import { PRODUCT_SCREEN } from "../content/appContent";
import { GHEE_PRODUCT_CONTENT } from "../content/gheeProductContent";

function pickString(productVal, fallback = "") {
  const v = String(productVal ?? "").trim();
  return v || fallback;
}

function pickArray(productArr, fallbackArr = []) {
  if (Array.isArray(productArr) && productArr.length) return productArr;
  return fallbackArr;
}

function normalizeCopy(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function mapUspsToFeatures(usps = []) {
  return usps.slice(0, 4).map((usp) => ({
    icon: String(usp?.icon || "sparkles-outline").trim() || "sparkles-outline",
    title: String(usp?.title || "").trim(),
    subtitle: String(usp?.description || "").trim(),
  }));
}

function hasNutritionData(nutrition) {
  if (!nutrition) return false;
  return Boolean(
    nutrition.rows?.length ||
      nutrition.cardTitle ||
      nutrition.cardBody ||
      nutrition.cardFooter ||
      nutrition.title
  );
}

/**
 * Merge product DB fields with optional ghee defaults (when shelfMatch).
 * Product/admin values always win when present.
 */
export function resolveProductPageContent(product, { shelfMatch = false } = {}) {
  const ghee = shelfMatch ? GHEE_PRODUCT_CONTENT : null;
  const description = String(product?.description ?? "").trim();

  const trustChips = pickArray(product?.trustChips, ghee?.trustChips || []);
  const highlights = pickArray(product?.highlights, ghee?.highlights || []);

  const delivery =
    product?.deliveryTitle || product?.deliveryBody
      ? {
          title: pickString(product.deliveryTitle, "Delivery"),
          body: pickString(product.deliveryBody),
        }
      : ghee?.delivery || (product?.eta ? { title: "Delivery", body: String(product.eta) } : null);

  const storyLegend = pickString(product?.storyLegend, ghee?.legacy?.legend || "");
  const story = {
    kick: pickString(product?.storyKick, ghee?.legacy?.kick || PRODUCT_SCREEN.storyOverline),
    title: pickString(product?.storyTitle, ghee?.legacy?.title || PRODUCT_SCREEN.storyTitle),
    legend: storyLegend,
  };
  const showStoryLegend =
    Boolean(storyLegend) && normalizeCopy(storyLegend) !== normalizeCopy(description);

  const usps = Array.isArray(product?.usps) ? product.usps.filter(Boolean) : [];
  const featureCards =
    usps.length >= 1 ? mapUspsToFeatures(usps) : pickArray(ghee?.features, []);

  const nutritionRaw = product?.nutrition;
  const nutrition = hasNutritionData(nutritionRaw)
    ? {
        kick: pickString(nutritionRaw.kick, ghee?.nutrition?.kick || "Nutrition"),
        title: pickString(nutritionRaw.title, ghee?.nutrition?.title || "Nutritional Facts"),
        tableHead: pickString(nutritionRaw.tableHead, ghee?.nutrition?.tableHead || "Per 100 g"),
        tableSub: pickString(nutritionRaw.tableSub, ghee?.nutrition?.tableSub || ""),
        rows: pickArray(nutritionRaw.rows, ghee?.nutrition?.rows || []),
        card: {
          title: pickString(nutritionRaw.cardTitle, ghee?.nutrition?.card?.title || ""),
          body: pickString(nutritionRaw.cardBody, ghee?.nutrition?.card?.body || ""),
          tags: pickArray(nutritionRaw.cardTags, ghee?.nutrition?.card?.tags || []),
          footer: pickString(nutritionRaw.cardFooter, ghee?.nutrition?.card?.footer || ""),
        },
      }
    : shelfMatch && ghee?.nutrition
      ? {
          kick: ghee.nutrition.kick,
          title: ghee.nutrition.title,
          tableHead: ghee.nutrition.tableHead,
          tableSub: ghee.nutrition.tableSub,
          rows: ghee.nutrition.rows,
          card: ghee.nutrition.card,
        }
      : null;

  const reviewsSection = {
    kick: pickString(product?.reviewsKick, ghee?.reviewsKick || PRODUCT_SCREEN.reviewsOverline),
    title: pickString(product?.reviewsTitle, ghee?.reviewsTitle || PRODUCT_SCREEN.reviewsTitle),
  };

  const eyebrow = pickString(
    product?.pageEyebrow,
    ghee?.eyebrow || product?.badgeText || product?.category || PRODUCT_SCREEN.categoryFallback
  );

  const hasDbStory =
    product?.storyKick ||
    product?.storyTitle ||
    product?.storyLegend ||
    product?.highlightQuote ||
    product?.lifestyleImage ||
    product?.usageRituals?.length ||
    product?.usps?.length;

  const showStorySection = Boolean(
    shelfMatch ||
    product?.richProductPage ||
    hasDbStory ||
    (product?.richProductPage && product?.processSteps?.length) ||
    featureCards.length > 0
  );

  return {
    eyebrow,
    lead: description,
    trustChips,
    highlights,
    delivery,
    story,
    showStoryLegend,
    featureCards,
    nutrition,
    reviewsSection,
    showStorySection,
    showNutritionSection: Boolean(nutrition),
  };
}
