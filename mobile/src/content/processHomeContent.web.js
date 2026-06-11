/** Web-optimized process step images (WebP @ 720px). */
export const PROCESS_STEP_IMAGE_FALLBACKS = {
  "process-01": require("../../assets/marketing/ghee-process-step-01-pasture-web-720.webp"),
  "process-02": require("../../assets/marketing/ghee-process-step-02-milk-web-720.webp"),
  "process-03": require("../../assets/marketing/ghee-process-step-03-curd-web-720.webp"),
  "process-04": require("../../assets/marketing/ghee-process-step-04-bilona-web-720.webp"),
  "process-05": require("../../assets/marketing/ghee-process-step-05-woodfire-web-720.webp"),
  "process-06": require("../../assets/marketing/ghee-process-step-06-bottled-web-720.webp"),
};

const DEFAULT_STEPS = [
  {
    id: "process-01",
    order: 0,
    enabled: true,
    title: "Grass-fed Kankrej cows graze freely",
    description: "Indigenous desi cows roam open pastures — never force-fed, never rushed.",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
  },
  {
    id: "process-02",
    order: 1,
    enabled: true,
    title: "Fresh A2 milk collected daily",
    description: "Morning milk from healthy Kankrej cows, rich in A2 beta-casein protein.",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
  },
  {
    id: "process-03",
    order: 2,
    enabled: true,
    title: "Curd set overnight with natural culture",
    description: "Traditional culture at room temperature — the foundation of true Bilona ghee.",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
  },
  {
    id: "process-04",
    order: 3,
    enabled: true,
    title: "Hand-churned Bilona into white butter",
    description: "Makhan separated by hand from curd — not industrial cream.",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
  },
  {
    id: "process-05",
    order: 4,
    enabled: true,
    title: "Slow-cooked on a wood fire",
    description: "Patient wood-fired simmer until water evaporates and aroma deepens.",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
  },
  {
    id: "process-06",
    order: 5,
    enabled: true,
    title: "Golden ghee, glass-bottled",
    description: "Grainy, aromatic A2 ghee — sealed in glass for freshness and purity.",
    imageUrl: "",
    imageFit: "contain",
    imagePosition: "center",
  },
];

export function buildProcessSectionDefaults() {
  return {
    enabled: true,
    eyebrow: "How it's made",
    title: "Six steps from pasture to jar",
    subtitle: "No shortcuts. No cream separation. Only curd-churned Bilona ghee.",
    journeyLabel: "The Bilona journey",
    filmLabel: "Chapter I",
    openingLine: "From open pasture to golden jar — every step by hand.",
    steps: DEFAULT_STEPS.map((step) => ({ ...step })),
  };
}

export function getProcessStepImageFallback(stepId) {
  return PROCESS_STEP_IMAGE_FALLBACKS[stepId] || null;
}

export const PROCESS_HOME_CONTENT = {
  eyebrow: "How it's made",
  title: "Six steps from pasture to jar",
  subtitle: "No shortcuts. No cream separation. Only curd-churned Bilona ghee.",
  journeyLabel: "The Bilona journey",
  filmLabel: "Chapter I",
  openingLine: "From open pasture to golden jar — every step by hand.",
  steps: DEFAULT_STEPS.map((step, index) => ({
    step: index + 1,
    title: step.title,
    description: step.description,
    image: getProcessStepImageFallback(step.id),
    imageFit: step.imageFit,
    imagePosition: step.imagePosition,
  })),
};
