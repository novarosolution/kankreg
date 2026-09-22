/**
 * Local dev only — seeds a realistic KankreG ghee catalog so the UI can be reviewed
 * with real content instead of empty states. Product packshots are served from
 * /media/products (square 1200–2000px). Lifestyle / gallery extras still use
 * /media/marketing until Cloudinary credentials are configured.
 *
 * Run: node scripts/seedCatalog.js
 */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");

const MARKETING_BASE = process.env.SEED_MEDIA_BASE || "http://127.0.0.1:5001/media/marketing";
const PRODUCT_BASE = process.env.SEED_PRODUCT_MEDIA_BASE || "http://127.0.0.1:5001/media/products";
const img = (file) => `${MARKETING_BASE}/${file}`;
const productImg = (file) => `${PRODUCT_BASE}/${file}`;

const TRUST_CHIPS = [
  { icon: "shield-checkmark-outline", label: "100% Pure" },
  { icon: "leaf-outline", label: "A2 Desi" },
  { icon: "sparkles-outline", label: "No Preservatives" },
];

const PROCESS_STEPS = [
  "Grass-fed Kankrej cows graze freely on open pastures.",
  "Fresh A2 milk is collected daily from healthy Kankrej cows.",
  "Curd is set overnight with natural culture at room temperature.",
  "Bilona butter is hand-churned from curd — not industrial cream.",
  "The butter is slow-cooked on a wood fire until golden and aromatic.",
  "Ghee is glass-bottled while grainy and fresh for lasting purity.",
];

const NUTRITION = {
  kick: "Nutrition",
  title: "Typical values per 100 g",
  tableHead: "Nutrient",
  tableSub: "Amount",
  rows: [
    { label: "Energy", value: "897 kcal" },
    { label: "Total Fat", value: "99.5 g" },
    { label: "Saturated Fat", value: "62 g" },
    { label: "Protein", value: "0 g" },
    { label: "Carbohydrate", value: "0 g" },
  ],
  cardTitle: "A2 Bilona ghee",
  cardBody: "Clarified butter, slow-cooked and hand-churned in small batches.",
  cardTags: ["A2 protein", "Lactose-free", "Grass-fed"],
  cardFooter: "Indicative values — see pack for exact nutrition information.",
};

const products = [
  {
    name: "A2 Kankrej Bilona Ghee",
    /** No mrp here on purpose: this product has 3 independently-priced size variants. */
    price: 1499,
    ratingAverage: 4.9,
    reviewCount: 1941,
    image: productImg("product-ghee-classic-jar-1200.webp"),
    images: [
      productImg("product-ghee-classic-jar-1200.webp"),
      productImg("product-ghee-classic-jar.png"),
      img("hero-slide-kankreg-product-wide-web-1200.webp"),
    ],
    lifestyleImage: img("hero-slide-kankreg-hero-03-web-1200.webp"),
    description:
      "Hand-churned Bilona ghee — grainy, golden, and honest. Made from A2 Kankrej cow milk using the traditional curd-churned method, slow-cooked on a wood fire and bottled in small batches.",
    category: "Ghee",
    homeSection: "Prime Products",
    productType: "Jar & Box",
    showOnHome: true,
    isPublished: true,
    homeOrder: 1,
    brand: "KankreG",
    sku: "KG-GHEE-CLASSIC",
    unit: "1 jar",
    eta: "2-3 days",
    isSpecial: true,
    inStock: true,
    stockQty: 120,
    badgeText: "BILONA METHOD",
    variants: [
      { label: "250 ml", price: 499, tag: "" },
      { label: "500 ml", price: 899, tag: "Most popular" },
      { label: "1 L", price: 1499, tag: "Best value" },
    ],
    usps: [
      {
        icon: "leaf-outline",
        title: "Thoughtful sourcing",
        description: "Grass-fed A2 milk from indigenous Kankrej cows — chosen for purity, not shelf appeal.",
      },
      {
        icon: "flame-outline",
        title: "Slow craft",
        description: "Traditional Bilona method, small batches, patient wood-fire churning for golden clarity.",
      },
      {
        icon: "water-outline",
        title: "Grainy & aromatic",
        description: "Curd-churned, never cream-separated — the texture and aroma true Bilona ghee is known for.",
      },
    ],
    processTitle: "Six steps from pasture to jar",
    processSteps: PROCESS_STEPS,
    highlightQuote: "Nothing rushed. Nothing added. Only pure Bilona craft.",
    usageRituals: [
      {
        icon: "restaurant-outline",
        title: "Daily roti & dal",
        description: "A spoonful over hot roti or dal-chawal for everyday nourishment.",
      },
      {
        icon: "flame-outline",
        title: "Cooking & tempering",
        description: "A high smoke point makes it ideal for tempering, sautéing, and traditional sweets.",
      },
    ],
    richProductPage: true,
    pageEyebrow: "ARTISANAL · A2 · BILONA",
    trustChips: TRUST_CHIPS,
    highlights: [
      "Hand-churned Bilona method",
      "Wood-fired slow cooking",
      "Grass-fed Kankrej cows",
      "Small-batch, glass-bottled",
    ],
    deliveryTitle: "Free delivery over ₹1,499",
    deliveryBody: "Dispatched within 24 hours. Delivered in secure, tamper-proof glass packaging.",
    storyKick: "Our story",
    storyTitle: "Nothing rushed. Nothing added.",
    storyLegend: "Bilona Method · Farm to Table",
    reviewsKick: "Reviews",
    reviewsTitle: "What customers say",
    nutrition: NUTRITION,
  },
  {
    name: "A2 Kankrej Bilona Ghee — Gift Box",
    price: 1599,
    mrp: 1799,
    /** Landscape "-web-1200" assets only — the PDP hero frame is wide, and the
     *  portrait "phone-*" bundles (840px, shot for the vertical home hero) letterbox
     *  badly inside it, leaving a small image adrift in a lot of blank card. */
    image: productImg("product-ghee-giftbox-1200.webp"),
    images: [
      productImg("product-ghee-giftbox-1200.webp"),
      productImg("product-ghee-giftbox.png"),
      productImg("product-ghee-classic-jar-1200.webp"),
    ],
    lifestyleImage: img("hero-slide-kankreg-hero-03-web-1200.webp"),
    description:
      "The same hand-churned A2 Bilona ghee, presented in a keepsake box — ready to gift for festivals, weddings, or a thoughtful housewarming.",
    category: "Ghee",
    homeSection: "Prime Products",
    productType: "Gift Set",
    showOnHome: true,
    isPublished: true,
    homeOrder: 2,
    brand: "KankreG",
    sku: "KG-GHEE-GIFTBOX-1L",
    unit: "1 box",
    eta: "2-3 days",
    isSpecial: true,
    inStock: true,
    stockQty: 60,
    ratingAverage: 4.9,
    reviewCount: 580,
    badgeText: "GIFT READY",
    variants: [{ label: "1 L", price: 1599, tag: "Gift box" }],
    usps: [
      {
        icon: "gift-outline",
        title: "Festive presentation",
        description: "Sealed glass jar in a printed keepsake box — no extra wrapping needed.",
      },
      {
        icon: "leaf-outline",
        title: "Same Bilona ghee",
        description: "Identical A2 Kankrej ghee, hand-churned and wood-fired in small batches.",
      },
    ],
    processTitle: "Six steps from pasture to jar",
    processSteps: PROCESS_STEPS,
    highlightQuote: "Goods worth coming back for.",
    richProductPage: true,
    pageEyebrow: "ARTISANAL · A2 · BILONA",
    trustChips: TRUST_CHIPS,
    highlights: ["Keepsake gift box", "Hand-churned Bilona method", "Grass-fed Kankrej cows"],
    deliveryTitle: "Free delivery over ₹1,499",
    deliveryBody: "Dispatched within 24 hours in secure, tamper-proof packaging.",
    storyKick: "Our story",
    storyTitle: "Nothing rushed. Nothing added.",
    storyLegend: "Bilona Method · Farm to Table",
    nutrition: NUTRITION,
  },
  {
    name: "A2 Kankrej Bilona Ghee — Trial Pack",
    price: 249,
    mrp: 299,
    ratingAverage: 4.8,
    reviewCount: 312,
    isNewLaunch: true,
    image: productImg("product-ghee-trial-100ml-1200.webp"),
    images: [
      productImg("product-ghee-trial-100ml-1200.webp"),
      productImg("product-ghee-trial-100ml.png"),
    ],
    description:
      "A small 100 ml jar of our hand-churned A2 Bilona ghee — perfect for first-time tasting before committing to a full size.",
    category: "Ghee",
    homeSection: "Prime Products",
    productType: "Trial Pack",
    showOnHome: true,
    isPublished: true,
    homeOrder: 3,
    brand: "KankreG",
    sku: "KG-GHEE-TRIAL-100",
    unit: "1 jar",
    eta: "2-3 days",
    inStock: true,
    stockQty: 200,
    badgeText: "NEW",
    variants: [{ label: "100 ml", price: 249, tag: "Trial size" }],
    trustChips: TRUST_CHIPS,
    highlights: ["Hand-churned Bilona method", "Grass-fed Kankrej cows"],
    deliveryTitle: "Free delivery over ₹1,499",
    deliveryBody: "Dispatched within 24 hours.",
    nutrition: NUTRITION,
  },
  {
    name: "Wood-Pressed Groundnut Oil — 1L",
    price: 650,
    mrp: 750,
    ratingAverage: 4.8,
    reviewCount: 640,
    image: productImg("product-groundnut-oil-1l-1200.webp"),
    images: [
      productImg("product-groundnut-oil-1l-1200.webp"),
      productImg("product-groundnut-oil-1l.png"),
    ],
    description:
      "Cold wood-pressed groundnut oil — nutty, unrefined, and made in small batches for everyday cooking.",
    category: "Oils",
    homeSection: "Prime Products",
    productType: "Oil",
    showOnHome: true,
    isPublished: true,
    homeOrder: 4,
    brand: "KankreG",
    sku: "KG-OIL-GROUNDNUT-1L",
    unit: "1 L",
    eta: "2-3 days",
    isSpecial: true,
    inStock: true,
    stockQty: 90,
    badgeText: "WOOD PRESSED",
    variants: [{ label: "1 L", price: 650, tag: "" }],
    trustChips: TRUST_CHIPS,
    highlights: ["Wood-pressed", "Unrefined", "Small-batch"],
    deliveryTitle: "Free delivery over ₹1,499",
    deliveryBody: "Dispatched within 24 hours.",
    nutrition: NUTRITION,
  },
  {
    name: "High Protein Atta — 5 kg",
    price: 420,
    mrp: 480,
    ratingAverage: 4.7,
    reviewCount: 210,
    image: productImg("product-atta-5kg-1200.webp"),
    images: [
      productImg("product-atta-5kg-1200.webp"),
      productImg("product-atta-5kg.png"),
    ],
    description:
      "Stone-ground high-protein atta for soft rotis with a hearty, farm-fresh flavour.",
    category: "Atta",
    homeSection: "Prime Products",
    productType: "Atta",
    showOnHome: true,
    isPublished: true,
    homeOrder: 5,
    brand: "KankreG",
    sku: "KG-ATTA-5KG",
    unit: "5 kg",
    eta: "2-3 days",
    inStock: true,
    stockQty: 75,
    badgeText: "HIGH PROTEIN",
    variants: [{ label: "5 kg", price: 420, tag: "" }],
    trustChips: TRUST_CHIPS,
    highlights: ["Stone-ground", "High protein", "Farm-fresh"],
    deliveryTitle: "Free delivery over ₹1,499",
    deliveryBody: "Dispatched within 24 hours.",
    nutrition: NUTRITION,
  },
];

async function applyCatalogSeed() {
  let created = 0;
  let updated = 0;
  for (const p of products) {
    const exists = await Product.findOne({ sku: p.sku });
    if (exists) {
      await Product.updateOne({ sku: p.sku }, { $set: p });
      updated += 1;
      continue;
    }
    await Product.create(p);
    created += 1;
  }
  return { created, updated, skipped: updated };
}

async function seed() {
  await connectDB();
  const { created, skipped } = await applyCatalogSeed();
  console.log(`Seed complete: ${created} created, ${skipped} already existed.`);
  process.exit(0);
}

if (require.main === module) {
  seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}

module.exports = { applyCatalogSeed };
