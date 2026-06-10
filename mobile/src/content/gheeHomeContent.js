import { COMPARE_HOME_CONTENT } from "./compareHomeContent";

/**
 * Premium A2 Kankrej ghee home sections — single source for web home story blocks.
 * Re-exported as `HOME_STORY_CONTENT` from `appContent.js`.
 *
 * Also edit in Admin → Home View: about eyebrow, title, body, video, photos.
 * Process steps (titles, copy, images) are edited here — swap `image` per step.
 * Compare section (“Ours vs ordinary”) is managed in Admin → Home View → Compare ghee.
 * Static labels (pull quote, gallery eyebrow) live in `HOME_SCREEN_UI.ourStory`.
 */
export const GHEE_HOME_CONTENT = {
  process: {
    eyebrow: "How it's made",
    title: "Six steps from pasture to jar",
    subtitle: "No shortcuts. No cream separation. Only curd-churned Bilona ghee.",
    journeyLabel: "The Bilona journey",
    steps: [
      {
        step: 1,
        title: "Grass-fed Kankrej cows graze freely",
        description: "Indigenous desi cows roam open pastures — never force-fed, never rushed.",
        image: require("../../assets/marketing/ghee-process-step-01-pasture.png"),
        imageFit: "cover",
        imagePosition: "top center",
      },
      {
        step: 2,
        title: "Fresh A2 milk collected daily",
        description: "Morning milk from healthy Kankrej cows, rich in A2 beta-casein protein.",
        image: require("../../assets/marketing/ghee-process-step-02-milk.png"),
        imageFit: "cover",
        imagePosition: "top center",
      },
      {
        step: 3,
        title: "Curd set overnight with natural culture",
        description: "Traditional culture at room temperature — the foundation of true Bilona ghee.",
        image: require("../../assets/marketing/ghee-process-step-03-curd.png"),
        imageFit: "cover",
        imagePosition: "top center",
      },
      {
        step: 4,
        title: "Hand-churned Bilona into white butter",
        description: "Makhan separated by hand from curd — not industrial cream.",
        image: require("../../assets/marketing/ghee-process-step-04-bilona.png"),
        imageFit: "cover",
        imagePosition: "top center",
      },
      {
        step: 5,
        title: "Slow-cooked on a wood fire",
        description: "Patient wood-fired simmer until water evaporates and aroma deepens.",
        image: require("../../assets/marketing/ghee-process-step-05-woodfire.png"),
        imageFit: "cover",
        imagePosition: "top center",
      },
      {
        step: 6,
        title: "Golden ghee, glass-bottled",
        description: "Grainy, aromatic A2 ghee — sealed in glass for freshness and purity.",
        image: require("../../assets/marketing/hero-slide-05-wa.jpeg"),
        imageFit: "cover",
        imagePosition: "top center",
      },
    ],
  },

  differentiators: COMPARE_HOME_CONTENT,

  whyKankrej: {
    eyebrow: "Why Kankrej",
    title: "The breed behind the gold",
    subtitle:
      "Kankrej cattle are an indigenous treasure of Gujarat and Rajasthan — hardy, heat-tolerant, and prized for nourishing A2 milk.",
    body:
      "For centuries, Kankrej cows have thrived in western India. Their A2 beta-casein milk is easier to digest and holds a revered place in Ayurvedic nutrition. We partner with small herds raised naturally — every jar honours the animal, the land, and the slow craft of Bilona ghee.",
    stats: [
      { value: "A2 Protein", label: "Easier to digest", description: "Beta-casein A2 — not the A1 found in most commercial dairy." },
      { value: "Indigenous Desi", label: "Kankrej heritage", description: "One of India's oldest and hardiest cattle breeds." },
      { value: "Ayurvedic", label: "Time-honoured wellness", description: "Prized for cooking, rituals, and daily nourishment." },
    ],
  },

  benefits: {
    eyebrow: "Benefits",
    title: "Why families choose our ghee",
    items: [
      { title: "Aids digestion", description: "Butyric acid and traditional preparation support gut health." },
      { title: "A2 protein goodness", description: "From indigenous Kankrej cows — gentler for many constitutions." },
      { title: "Fat-soluble vitamins", description: "Rich in vitamins A, D, E, and K naturally present in pure ghee." },
      { title: "Supports immunity", description: "Nourishing fats and antioxidants from slow wood-fired cooking." },
      { title: "Ayurvedic cooking", description: "Ideal for tadka, sweets, and daily wellness rituals." },
      { title: "Deep, nutty aroma", description: "Grainy texture and wood-fire character you can taste." },
    ],
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "Loved across Gujarat",
    items: [
      {
        quote: "The grain and aroma remind me of my grandmother's kitchen. We use nothing else for our dal tadka now.",
        name: "Priya Shah",
        location: "Ahmedabad, Gujarat",
      },
      {
        quote: "Finally ghee I trust for my children — pure A2, no odd aftertaste. The glass bottle feels as premium as the ghee.",
        name: "Ramesh Patel",
        location: "Rajkot, Gujarat",
      },
      {
        quote: "I switched from supermarket brands after tasting KankreG. You can tell it's Bilona — rich, golden, and honest.",
        name: "Meera Desai",
        location: "Surat, Gujarat",
      },
    ],
  },
};
