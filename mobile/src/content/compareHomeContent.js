/**
 * “Ours vs ordinary ghee” — admin API shape + small bundled image fallbacks only.
 * Large legacy PNGs removed to shrink the app bundle.
 */
export const COMPARE_ROW_IMAGE_FALLBACKS = {
  "compare-milk": {
    ours: require("../../assets/marketing/hero-slide-04-wa-web-504.webp"),
    ordinary: null,
  },
  "compare-method": {
    ours: require("../../assets/marketing/hero-slide-1-web-504.webp"),
    ordinary: null,
  },
  "compare-feed": {
    ours: require("../../assets/marketing/hero-slide-06-wa-web-504.webp"),
    ordinary: null,
  },
  "compare-cooking": {
    ours: require("../../assets/marketing/hero-slide-2-web-504.webp"),
    ordinary: null,
  },
  "compare-purity": {
    ours: require("../../assets/marketing/hero-slide-05-wa-web-504.webp"),
    ordinary: null,
  },
  "compare-packaging": {
    ours: require("../../assets/marketing/hero-slide-05-wa-web-504.webp"),
    ordinary: null,
  },
};

const DEFAULT_ROWS = [
  {
    id: "compare-milk",
    order: 0,
    enabled: true,
    label: "Milk source",
    ours: "A2 milk from native Kankrej cows",
    ordinary: "A1 from crossbred or HF cows",
    oursImageUrl: "",
    ordinaryImageUrl: "",
  },
  {
    id: "compare-method",
    order: 1,
    enabled: true,
    label: "Method",
    ours: "Hand-churned the Bilona way",
    ordinary: "Factory cream separation",
    oursImageUrl: "",
    ordinaryImageUrl: "",
  },
  {
    id: "compare-feed",
    order: 2,
    enabled: true,
    label: "Feed",
    ours: "Open-grazed on native pasture",
    ordinary: "Commercial feed & silage",
    oursImageUrl: "",
    ordinaryImageUrl: "",
  },
  {
    id: "compare-cooking",
    order: 3,
    enabled: true,
    label: "Cooking",
    ours: "Slow wood-fire, small batches",
    ordinary: "High-heat industrial boilers",
    oursImageUrl: "",
    ordinaryImageUrl: "",
  },
  {
    id: "compare-purity",
    order: 4,
    enabled: true,
    label: "Purity",
    ours: "Nothing added, nothing taken",
    ordinary: "Preservatives & added oils",
    oursImageUrl: "",
    ordinaryImageUrl: "",
  },
  {
    id: "compare-packaging",
    order: 5,
    enabled: true,
    label: "Packaging",
    ours: "Hand-poured into amber glass",
    ordinary: "Mass-filled plastic tubs",
    oursImageUrl: "",
    ordinaryImageUrl: "",
  },
];

/** Admin `/home-view` + display defaults. */
export function buildCompareSectionDefaults() {
  return {
    enabled: true,
    eyebrow: "What makes us different",
    title: "Ours vs ordinary ghee",
    subtitle: "Most shelves sell factory-processed fat. We sell heritage.",
    filmLabel: "The Difference",
    storyChapter: "Chapter II",
    openingLine: "Two paths. One golden jar.",
    closingTagline: "A2 milk · Bilona-churned · open-grazed · hand-poured.",
    oursLabel: "KankreG",
    ordinaryLabel: "Ordinary",
    rows: DEFAULT_ROWS.map((row) => ({ ...row })),
  };
}

export function getCompareRowImageFallback(rowId, variant = "ours") {
  const pair = COMPARE_ROW_IMAGE_FALLBACKS[rowId];
  if (!pair) return null;
  return pair[variant] || null;
}

/** Legacy export for `gheeHomeContent.js` static blocks. */
export const COMPARE_HOME_CONTENT = {
  eyebrow: "What makes us different",
  title: "Ours vs ordinary ghee",
  subtitle: "Most shelves sell factory-processed fat. We sell heritage.",
  filmLabel: "The Difference",
  closingTagline: "A2 milk · Bilona-churned · open-grazed · hand-poured.",
  rows: DEFAULT_ROWS.map((row) => ({
    label: row.label,
    ours: row.ours,
    ordinary: row.ordinary,
    oursImage: getCompareRowImageFallback(row.id, "ours"),
    ordinaryImage: getCompareRowImageFallback(row.id, "ordinary"),
  })),
};
