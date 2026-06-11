import { buildCommunitySectionDefaults } from "./communityHomeContent";
import { buildCompareSectionDefaults } from "./compareHomeContent";
import { buildProcessSectionDefaults } from "./processHomeContent";

/**
 * Full home-view defaults with bundled image fallbacks — admin + seeding only.
 * Do not import from customer screens (pulls heavy marketing assets).
 */
export const HOME_VIEW_DEFAULTS = {
  heroTitle: "Pure Heritage in Every Drop",
  heroSubtitle: "Slow-churned from the milk of grass-fed cows — golden clarity and aroma rooted in tradition.",
  primeSectionTitle: "Prime Products",
  productTypeTitle: "Shop by category",
  showPrimeSection: true,
  showHomeSections: true,
  showProductTypeSections: true,
  productCardStyle: "compact",
  shopLocation: {
    name: "KankreG Shop",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    latitude: null,
    longitude: null,
  },
  heroSlides: [],
  aboutSection: {
    enabled: true,
    eyebrow: "Our story",
    title: "Craft rooted in tradition",
    body:
      "KankreG crafts pure A2 Kankrej cow ghee using the ancestral Bilona method — hand-churned, wood-fired, and bottled in small batches for families who value tradition and taste.",
    videoUrl: "",
    videoCaption: "From grass-fed Kankrej cows to golden, grainy ghee.",
    photos: [],
  },
  communitySection: buildCommunitySectionDefaults(),
  compareSection: buildCompareSectionDefaults(),
  processSection: buildProcessSectionDefaults(),
};
