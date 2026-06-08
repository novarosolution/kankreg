/**
 * Central customer-facing copy for KankreG.
 *
 * - Brand: name, taglines, search, support email.
 * - Home view defaults: same shape as API `/home-view` and Admin → Home View (Mongo).
 * - Home marketing: hero image strip, trust row, catalog intros (editable separately from API hero title/subtitle).
 * - Footers & support: compact footer, wide home footer, support screen header.
 *
 * Keep `backend/src/models/HomeViewConfig.js` defaults aligned with HOME_VIEW_DEFAULTS.
 */

/** @type {string} */
export const APP_DISPLAY_NAME = "KankreG";
/**
 * Square `BrandLogo` sizes (width = height). Tune here — screens import via `src/constants/brand`.
 */
export const BRAND_LOGO_SIZE = {
  /** Inner screens: back + logo + title (keep ≤ ~48 so the row does not wrap). */
  headerCompact: 44,
  /** Web top bar + full brand mark (no back chevron). */
  headerDefault: 56,
  /** Home top bar wordmark (with tagline below) — only affects Home, not `WebAppHeader`. */
  homeTopBar: 80,
  /** Home hero block logo. */
  homeHero: 108,
  footerCompact: 56,
  footerWide: 64,
  authHero: 72,
  startup: 96,
};
export const APP_TAGLINE = "Premium essentials · Fair prices";
export const APP_SPLASH_TAGLINE = "Goods, beautifully delivered";
export const APP_WORDMARK_SUBLINE = "Premium essentials";
export const APP_HERO_KICKER = `${APP_DISPLAY_NAME} · ${APP_WORDMARK_SUBLINE}`;
export const SEARCH_PLACEHOLDER = "Search KankreG — ghee, staples…";
export const SUPPORT_EMAIL_DISPLAY = "support@kankreg.app";

/** Digital product partner — linked from customer footers. */
export const APP_ENGINEER_NAME = "NovaRo Solution";
export const APP_ENGINEER_URL = "https://novarosolution.com/";

/** Razorpay payment page (UPI, cards, wallet) — used as a hosted-page fallback. */
export const RAZORPAY_PAY_URL = "https://razorpay.me/@chaudharydhirajpadmabhai";

/** How long the order stays in `pending_payment` before the server sweep cancels it. */
export const RAZORPAY_PAYMENT_TIMEOUT_MIN = 30;

/**
 * Methods rendered by `PaymentMethodSelector`. `id` is the value that gets
 * sent as `paymentMethod` to the backend — keep aligned with the backend
 * enum on `Order.paymentMethod`.
 */
export const PAYMENT_METHODS = [
  {
    id: "Razorpay",
    title: "Pay online",
    eyebrow: "ONLINE",
    subtitle: "UPI, cards & wallets",
    icon: "card-outline",
    badge: "",
    brandStrip: [],
    secureNote: "",
  },
  {
    id: "Cash on Delivery",
    title: "Cash on delivery",
    eyebrow: "COD",
    subtitle: "Pay when delivered",
    icon: "cash-outline",
    secureNote: "",
  },
];

/** Fallback hero when API is offline — also seed defaults for new HomeViewConfig documents. */
export const HOME_HERO_TITLE_DEFAULT = "Pure Heritage in Every Drop";
export const HOME_HERO_SUBTITLE_DEFAULT =
  "Slow-churned from the milk of grass-fed cows — golden clarity and aroma rooted in tradition.";

export const HOME_VIEW_DEFAULTS = {
  heroTitle: HOME_HERO_TITLE_DEFAULT,
  heroSubtitle: HOME_HERO_SUBTITLE_DEFAULT,
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
};

/** Hero image card (native banner kicker — API `heroTitle` / `heroSubtitle` override when loaded). */
export const HOME_HERO_BANNER = {
  kicker: "New season",
  badge: "Bestseller",
  cta: "Shop now",
};

/** Static brand quote on wide web home (not from reviews API). */
export const HOME_BRAND_QUOTE = {
  text: "Quietly premium — the kind of essentials you notice every morning.",
  attribution: "— KankreG",
};

/**
 * Home screen — shared copy for app + web (`KankregHomeScreen.js` and home sections).
 * API fields from `/home-view` override titles where noted in screen code.
 */
export const HOME_SCREEN_UI = {
  hero: {
    eyebrow: HOME_HERO_BANNER.kicker,
    titleFallback: "The morning ritual",
    subtitleFallback: "",
    cta: HOME_HERO_BANNER.cta,
    loadingCta: "Loading…",
    fromLabel: "From",
  },
  categories: {
    title: "Categories",
    action: "See all",
    webOverline: "Collections",
    webShopBy: "Shop by category",
    webTitleFallback: "Browse the categories",
    /** Fallback Ionicons for web category tiles (by sort order). */
    webTileIcons: ["nutrition-outline", "leaf-outline", "home-outline", "cafe-outline"],
    itemsSuffix: "items",
  },
  bestsellers: {
    titleFallback: "Bestsellers",
    action: "See all",
    webEyebrow: "Catalog",
    webAction: "View all",
  },
  editorial: {
    overline: "Curated essentials",
    ctaExplore: "Explore collection",
    ctaRewards: "Rewards",
    featuredLabel: "Featured",
    shopNowLabel: "Shop now",
    ctaShop: "Shop now",
  },
  featured: {
    sectionLabel: "Featured",
    eyebrow: "New season",
    title: "Slow rituals, beautifully made.",
    body: "Design-led essentials for home, wellness, and everyday living.",
    ctaPrimary: "Shop now",
    ctaSecondary: "Browse shop",
  },
  marquee: [
    "Live order tracking",
    "Secure checkout",
    "Rewards on every order",
    "Crafted with care",
  ],
  empty: {
    productsTitle: "No products yet",
    productsDescription: "New arrivals will appear here soon.",
    productsCta: "Browse shop",
    categoriesTitle: "No categories yet",
    categoriesDescription: "Collections appear when products are added.",
    categoriesCta: "Browse shop",
  },
  quote: HOME_BRAND_QUOTE,
  trust: {
    overline: "Why KankreG",
  },
  /** Web-only home layout copy and section toggles (`KankregHomeScreen.js`). */
  web: {
    welcomeTag: APP_TAGLINE,
    heroStats: [
      { key: "orders", value: "12.5k+", label: "Orders fulfilled" },
      { key: "rating", value: "4.9★", label: "Avg. rating" },
      { key: "purity", value: "100%", label: "Pure A2 ghee" },
    ],
    showStatsStrip: true,
    showTestimonials: true,
    showBrandQuote: true,
    statsSectionIndex: 2,
    testimonialsSectionIndex: 7,
    quoteSectionIndex: 8,
  },
};

/** Light-mode tagline under the home top wordmark (same voice as `APP_TAGLINE`). */
export const HOME_WORDMARK_TAGLINE = APP_TAGLINE;

/** Trust strip under the hero (icon = Ionicons name). */
export const HOME_TRUST_STRIP = [
  { key: "craft", label: "Curated quality", icon: "diamond-outline" },
  { key: "track", label: "Live tracking", icon: "navigate-outline" },
  { key: "secure", label: "Secure checkout", icon: "shield-checkmark-outline" },
];

/**
 * Animated stats strip (count-up). `target` numeric, `prefix` and `suffix` cosmetic,
 * `precision` controls decimals.
 */
export const HOME_STATS_STRIP = {
  overline: "Trusted by Indian kitchens",
  items: [
    {
      key: "orders",
      target: 12500,
      prefix: "",
      suffix: "+",
      precision: 0,
      label: "Orders fulfilled",
      icon: "cube-outline",
    },
    {
      key: "rating",
      target: 4.9,
      prefix: "",
      suffix: "★",
      precision: 1,
      label: "Average rating",
      icon: "star-outline",
    },
    {
      key: "purity",
      target: 100,
      prefix: "",
      suffix: "%",
      precision: 0,
      label: "Pure A2 ghee",
      icon: "shield-checkmark-outline",
    },
  ],
};

/**
 * Customer testimonials shown under the stats strip. Keep voice short, regional, real.
 * `name`, `city`, `quote`, `rating` (out of 5), optional `avatar` (string url or null = initial).
 */
export const HOME_TESTIMONIALS = {
  overline: "Loved by our customers",
  title: "Stories from our kitchens",
  items: [
    {
      key: "rashmi",
      name: "Rashmi P.",
      city: "Ahmedabad",
      quote:
        "The aroma the moment I open the jar — pure nostalgia. My morning rotis taste like grandma made them.",
      rating: 5,
    },
    {
      key: "arjun",
      name: "Arjun S.",
      city: "Mumbai",
      quote:
        "Genuinely small-batch. You can taste the difference vs. supermarket ghee. Worth every rupee.",
      rating: 5,
    },
    {
      key: "neha",
      name: "Neha K.",
      city: "Pune",
      quote:
        "Fast COD delivery, sealed beautifully. Switched my whole family — even kids prefer this taste.",
      rating: 5,
    },
  ],
};

/** Small uppercase labels above home sections (trust row, shop block). */
export const HOME_PAGE_LABELS = {
  trustOverline: "Why KankreG",
  shopOverline: "Browse the shop",
  /** Hint under shop overline — empty string hides it. */
  shopHint: "",
};

/** Home live-order summary card (shown for authenticated users with active orders). */
export const HOME_LIVE_ORDER_CARD = {
  overline: "Track order",
  title: "Your order is moving",
  fallbackHint: "Follow status updates in My Orders.",
  ctaPrimary: "Track now",
  ctaSecondary: "My orders",
};

/** Catalog section intro (when not searching). */
export const HOME_CATALOG_INTRO = {
  starter: "Hand-picked to start you off right",
  all: "From our shelves to your kitchen",
};

/** Suffix for the side menu “starter” row (after dynamic counts). */
export const HOME_MENU_STARTER_TAG = "Starter picks";

/** Compact footer (auth screens, etc.). */
export const FOOTER_COMPACT = {
  offerLine: "Fresh staples · Fair prices",
  needHelp: "Need help?",
  customerCare: "Customer care",
  chatSupport247: "24×7 chat support",
};

export const APP_FOOTER_NAV_LINKS = [
  { label: "Home", route: "Home" },
  { label: "Cart", route: "Cart" },
  { label: "Orders", route: "MyOrders" },
  { label: "Profile", route: "Profile" },
  { label: "Help", route: "Support" },
];

/** Wide home footer: column titles + links (`route` null = no navigation). */
export const HOME_PAGE_FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", route: "Home" },
      { label: "Cart", route: "Cart" },
      { label: "My orders", route: "MyOrders" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", route: "Support" },
      { label: "Delivery", route: "ManageAddress" },
      { label: "Account", route: "Profile" },
      { label: "Pay online (Razorpay)", url: RAZORPAY_PAY_URL },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Secure checkout", route: null },
      { label: "Cash on delivery", route: null },
      { label: "Quality promise", route: null },
    ],
  },
];

/** `icon`: "brand" = logo mark; else Ionicons name. */
export const HOME_PAGE_TRUST_BADGES = [
  { key: "quality", label: "Trusted quality", icon: "shield-checkmark-outline" },
  { key: "process", label: "Traditional process", icon: "leaf-outline" },
  { key: "fair", label: "Fair prices", icon: "ribbon-outline" },
];

export const HOME_PAGE_FOOTER_META = "Made with care in India";

/** kankreg.html topbar — nav labels + action copy (routes wired in kankregNav.js). */
export const KANKREG_HEADER = {
  signInLabel: "Sign in",
  accountLabel: "Account",
  searchA11y: "Search shop",
  cartA11y: "Cart",
  menuOpenA11y: "Open menu",
  menuCloseA11y: "Close menu",
};

/** Primary header nav order (Admin / Delivery appended by role in buildKankregNavItems). */
export const KANKREG_NAV_ITEMS = [
  { key: "Home", label: "Home" },
  { key: "Shop", label: "Shop" },
  { key: "Product", label: "Product" },
  { key: "Cart", label: "Cart" },
  { key: "Checkout", label: "Checkout" },
  { key: "Orders", label: "Orders" },
  { key: "Rewards", label: "Rewards" },
  { key: "Account", label: "Account" },
];

/** Desktop web header — marketing site nav (no checkout/product deep links). */
export const KANKREG_WEB_NAV_ITEMS = [
  { key: "Home", label: "Home" },
  { key: "Shop", label: "Shop" },
  { key: "About", label: "About" },
  { key: "Rewards", label: "Rewards" },
  { key: "Account", label: "Account" },
];

/** About page — editorial marketing copy (web-first, works on native). */
export const ABOUT_SCREEN_UI = {
  header: {
    eyebrow: "Our story",
    title: "Crafted for everyday rituals",
    subtitle: "Slow-churned essentials, fair prices, and a delivery experience that feels personal.",
  },
  hero: {
    kicker: "Since day one",
    title: "Quietly premium essentials for Indian kitchens",
    lead:
      "KankreG began with a simple promise: heritage-quality ghee and staples, sourced with care, priced honestly, and delivered with live tracking you can trust.",
    ctaPrimary: "Shop the collection",
    ctaSecondary: "How we craft",
    badge: "Family-owned · Gujarat",
    floatQuote: "The aroma the moment you open the jar — pure nostalgia.",
  },
  mission: {
    eyebrow: "Mission",
    title: "Good food should feel unmistakably real",
    paragraphs: [
      "We work with small-batch partners who share our obsession with clarity, aroma, and honest labels. No shortcuts — just ingredients you would proudly serve at your own table.",
      "Every order earns rewards, every delivery is tracked in real time, and every product page tells you exactly what you are buying. Transparency is part of the craft.",
    ],
  },
  pillars: [
    {
      key: "source",
      icon: "leaf-outline",
      title: "Thoughtful sourcing",
      body: "Grass-fed A2 milk, cold-pressed oils, and pantry staples chosen for purity — not shelf appeal.",
    },
    {
      key: "craft",
      icon: "flame-outline",
      title: "Slow craft",
      body: "Traditional methods, small batches, and patient churning for the golden clarity ghee is known for.",
    },
    {
      key: "fair",
      icon: "heart-outline",
      title: "Fair pricing",
      body: "Premium quality without the premium markup. Rewards on every order keep loyal kitchens saving.",
    },
    {
      key: "deliver",
      icon: "bicycle-outline",
      title: "Delivered with care",
      body: "Live order tracking, secure Razorpay checkout, and support that answers like a neighbour would.",
    },
  ],
  craft: {
    eyebrow: "The process",
    title: "From farm to your morning roti",
    steps: [
      { key: "milk", label: "01", title: "Select milk", body: "A2 milk from grass-fed herds, tested for quality before it ever reaches the churn." },
      { key: "churn", label: "02", title: "Slow churn", body: "Patient, low-heat churning until the butter separates — the step that builds aroma." },
      { key: "clarify", label: "03", title: "Clarify & rest", body: "Ghee is clarified, filtered, and rested so the golden colour and nutty notes settle in." },
      { key: "pack", label: "04", title: "Pack & ship", body: "Sealed fresh, shipped with live tracking — from our kitchen partners to yours." },
    ],
  },
  stats: [
    { key: "orders", value: "12.5k+", label: "Orders fulfilled" },
    { key: "rating", value: "4.9★", label: "Average rating" },
    { key: "purity", value: "100%", label: "Pure A2 ghee" },
    { key: "cities", value: "40+", label: "Cities served" },
  ],
  ctaBand: {
    title: "Ready to taste the difference?",
    body: "Explore bestsellers, earn rewards on your first order, and track delivery every step of the way.",
    cta: "Browse the shop",
    ctaSecondary: "Contact support",
  },
};

/** Privacy & Terms — static legal pages linked from site footer. */
export const LEGAL_PAGES = {
  privacy: {
    title: "Privacy policy",
    eyebrow: "Legal",
    updated: "Last updated June 2025",
    intro:
      "KankreG respects your privacy. This policy explains what we collect, how we use it, and the choices you have when you shop with us.",
    sections: [
      {
        title: "Information we collect",
        body: "When you create an account or place an order, we collect your name, phone number, email, delivery address, and payment references processed securely through Razorpay. We also collect device and usage data to improve the app and website.",
      },
      {
        title: "How we use your data",
        body: "We use your information to fulfil orders, send delivery updates, provide customer support, process rewards, and improve our products. We do not sell your personal data to third parties.",
      },
      {
        title: "Cookies & analytics",
        body: "Our website may use cookies and similar technologies to remember preferences and measure performance. You can control cookies through your browser settings.",
      },
      {
        title: "Data retention & security",
        body: "We retain order and account data as long as needed for legal, tax, and support purposes. We apply industry-standard safeguards to protect your information in transit and at rest.",
      },
      {
        title: "Your rights",
        body: "You may request access, correction, or deletion of your personal data by contacting us at support@kankreg.app. We will respond within a reasonable timeframe.",
      },
      {
        title: "Contact",
        body: "Questions about this policy? Email support@kankreg.app and we will be glad to help.",
      },
    ],
  },
  terms: {
    title: "Terms of service",
    eyebrow: "Legal",
    updated: "Last updated June 2025",
    intro:
      "By using KankreG — on web or in the app — you agree to these terms. Please read them before placing an order.",
    sections: [
      {
        title: "Using our service",
        body: "You must provide accurate delivery details and be available to receive orders. Misuse of the platform, fraudulent payments, or abusive behaviour toward staff or delivery partners may result in account suspension.",
      },
      {
        title: "Orders & pricing",
        body: "Prices, offers, and product availability may change without notice. An order is confirmed only after successful payment (or COD acceptance). We reserve the right to cancel orders affected by stock or pricing errors.",
      },
      {
        title: "Payments",
        body: "Online payments are processed by Razorpay. Cash on delivery is available where shown at checkout. Failed or abandoned online payments may release reserved stock after the payment timeout window.",
      },
      {
        title: "Delivery",
        body: "Estimated delivery times are indicative. Live tracking is provided when available. Risk of loss passes to you upon successful delivery to the address provided.",
      },
      {
        title: "Returns & quality",
        body: "If you receive a damaged or incorrect item, contact support within 48 hours with photos. We will arrange a replacement or refund at our discretion, in line with applicable consumer laws.",
      },
      {
        title: "Rewards",
        body: "Reward points have no cash value, may expire, and are subject to programme rules shown in the app. We may amend the rewards programme with reasonable notice.",
      },
      {
        title: "Governing law",
        body: "These terms are governed by the laws of India. Disputes shall be subject to the courts of Ahmedabad, Gujarat, unless otherwise required by law.",
      },
    ],
  },
};

export const KANKREG_ROLE_NAV_ITEMS = {
  admin: { key: "Admin", label: "Admin" },
  delivery: { key: "Delivery", label: "Delivery" },
};

/** kankreg.html `.foot` — newsletter + columns + legal (routes optional). */
export const KANKREG_FOOTER_NEWSLETTER = {
  title: "Join the list",
  body: "First access to new drops, member-only offers, and 100 bonus points on signup.",
  placeholder: "your@email.com",
  cta: "Subscribe",
  successMessage: "Thanks — you're on the list.",
};

export const KANKREG_FOOTER_TAGLINE =
  "Design-led essentials, delivered with care. Live tracking, secure payments, rewarded every time.";

export const KANKREG_FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New arrivals", route: "Shop", params: { pill: "New in" } },
      { label: "Bestsellers", route: "Shop" },
      { label: "On sale", route: "Shop", params: { pill: "On sale" } },
      { label: "Gift cards", route: "Shop" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My orders", route: "MyOrders", requiresAuth: true },
      { label: "Rewards", route: "RedeemRewards", requiresAuth: true },
      { label: "Addresses", route: "ManageAddress", requiresAuth: true },
      { label: "Support", route: "Support", requiresAuth: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", route: "About" },
      { label: "Careers", route: "About" },
      { label: "Privacy", route: "Privacy" },
      { label: "Terms", route: "Terms" },
    ],
  },
];

export const KANKREG_FOOTER_COPYRIGHT = "© 2025 kankreg. Crafted in India.";
export const KANKREG_FOOTER_PAYMENTS_LINE = "Payments secured by Razorpay · Built on Expo + Express";

/** Native header: announce + topbar (no fixed announce on very small native optional). */
export const KANKREG_ANNOUNCE_COPY = {
  delivery: "Free delivery over ₹1,499",
  rewards: "Earn rewards on every order",
  seasonCta: "New season edit is live →",
};

/** Shared actions / empty states across customer screens. */
export const COMMON_UI = {
  retry: "Retry",
  refresh: "Refresh",
  save: "Save",
  cancel: "Cancel",
  loading: "Loading…",
  errorFallback: "Something went wrong. Try again.",
};

/** Cart screen section chrome — see `CartScreen.js`. */
export const CART_UI = {
  pageEyebrow: "Your bag",
  pageTitle: "Shopping cart",
  checkoutTitle: "Checkout",
  emptyTitle: "Your cart is empty",
  emptyDescription: "Add items from the shop.",
  browseCta: "Browse shop",
};

/** Cart — deliver-to panel and profile address prompts. */
export const CART_ADDRESS = {
  panelTitle: "Delivery address",
  contactSection: "Contact",
  addressSection: "Address",
  noteSection: "Note",
  useSaved: "Use saved",
  useGps: "Use current location",
  useGpsLoading: "Locating…",
  gpsFillSuccess: "Location added.",
};

/** Shop catalog — `ShopScreen.js` + `ShopPageChrome.js`. */
export const SHOP_SCREEN_UI = {
  pageEyebrow: "Catalog",
  pageTitle: "Shop",
  pageTitleWide: "Shop everything",
  pageSubtitle: "Curated pieces for home, kitchen & everyday rituals",
  searchPlaceholder: "Search essentials",
  refineTitle: "Refine",
  resetFilters: "Reset",
  sortA11y: "Change sort order",
  showingPrefix: "Showing",
  showingOf: "of",
  showingSuffix: "products",
  clearFilters: "Clear filters",
  filtersOpen: "Filters",
  filtersClose: "Hide filters",
  emptyTitle: "No products found",
  emptyDescription: "Try a different filter or check back soon.",
  emptyCta: "Browse shop",
  emptyMatchesTitle: "No matches",
  emptyMatchesDescription: "Try another category or clear filters to see more products.",
  viewAllCta: "View all",
  filterCategory: "Category",
  filterCollection: "Collection",
  filterRating: "Rating",
  filterPrice: "Price",
  priceMin: "₹500",
  priceMax: "₹8,000",
  collectionPills: ["All", "New in", "On sale", "Premium"],
  sortOptions: [
    { key: "featured", label: "Featured" },
    { key: "price-asc", label: "Price ↑" },
    { key: "newest", label: "Newest" },
  ],
  trustLine: "Free delivery over ₹1,499 · Secure checkout · Live order tracking",
};

/** Notifications — `NotificationsScreen.js`. */
export const NOTIFICATIONS_SCREEN_UI = {
  pageTitle: "Notifications",
  pageEyebrow: "Inbox",
  refresh: COMMON_UI.refresh,
  loadingCaption: "Loading notifications…",
  filters: {
    all: "All",
    unread: "Unread",
    archived: "Archived",
  },
  groups: {
    today: "Today",
    week: "This week",
    earlier: "Earlier",
  },
  emptyTitle: "You're all caught up",
  emptyDescription: "We'll notify you when something arrives.",
};

/** Rewards — `RedeemRewardsScreen.js`. */
export const REWARDS_SCREEN_UI = {
  pageTitle: "Rewards",
  pageEyebrow: "Points",
  pageSubtitle: "Redeem coupons with your balance",
  balanceLabel: "Your balance",
  catalogTitle: "Redeem",
  walletTitle: "My coupons",
  emptyCatalogTitle: "No rewards yet",
  emptyCatalogDescription: "Check back for new offers.",
  redeemCta: "Redeem",
  redeeming: "Redeeming…",
  copied: "Code copied",
  copyFailed: "Could not copy",
  loadingCaption: "Loading rewards…",
  errorFallback: "Unable to load rewards.",
};

/** Edit profile — `EditProfileScreen.js`. */
export const EDIT_PROFILE_SCREEN_UI = {
  pageTitle: "Edit profile",
  pageEyebrow: "Account",
  pageSubtitle: "Name, phone & photo",
  sectionPersonal: "Personal",
  sectionContact: "Contact",
  saveCta: COMMON_UI.save,
  saving: "Saving…",
  success: "Profile updated.",
  errorFallback: "Unable to save profile.",
};

/** Saved addresses — `ManageAddressScreen.js`. */
export const MANAGE_ADDRESS_SCREEN_UI = {
  pageTitle: "Saved addresses",
  pageEyebrow: "Delivery",
  pageSubtitle: "Default address for checkout",
  sectionDefault: "Default address",
  useGps: "Use current location",
  useGpsLoading: "Locating…",
  saveCta: COMMON_UI.save,
  saving: "Saving…",
  success: "Address saved.",
  errorFallback: "Unable to save address.",
  coordsHint: "GPS coordinates help live order tracking.",
};

/** Native location onboarding — `FindLocationScreen.js`. */
export const FIND_LOCATION_UI = {
  title: "Where should we deliver?",
  subtitle: "Set your area for accurate delivery and tracking.",
  cta: "Confirm location",
  skip: "Skip for now",
  loading: "Finding location…",
};

/** Support screen (customer). */
export const SUPPORT_SCREEN = {
  pageTitle: "Help & support",
  pageEyebrow: "Support",
  pageSubtitle: "Fast replies",
  liveChatTitle: "Live chat",
  contactChatSub: "Usually minutes",
  contactEmailSub: SUPPORT_EMAIL_DISPLAY,
  contactWhatsAppSub: "Anytime",
  faqTitle: "Common questions",
  chatPlaceholder: "Type your message…",
  sendCta: "Send",
  sending: "Sending…",
  emptyThread: "Start a conversation — we typically reply within minutes.",
  faqs: [
    {
      q: "When will my order arrive?",
      a: "Track status in My Orders. Same-day in many areas.",
    },
    {
      q: "How do I change my order?",
      a: "My Orders → update address before pickup.",
    },
    {
      q: "Can I pay on delivery?",
      a: "Yes — Cash on Delivery and online checkout.",
    },
    {
      q: "How do refunds work?",
      a: "Refunds return to your original payment method.",
    },
  ],
};

/**
 * Profile screen (customer). Centralised copy so labels stay editable in one
 * place rather than hard-coded in [src/screens/ProfileScreen.js].
 */
export const PROFILE_SCREEN = {
  pageTitle: "My profile",
  pageEyebrow: "Account",
  eyebrow: "KankreG member",
  memberSincePrefix: "Member since",
  pageSubtitle: "Your account",
  fallbackName: "Welcome",
  emptyPhone: "Add phone in Edit profile",
  roleAdmin: "Admin",
  roleDelivery: "Delivery partner",
  roleCustomer: "Customer",
  addressTitle: "Default delivery address",
  addressEyebrow: "DELIVERY",
  addressDefaultRibbon: "DEFAULT",
  addressMissingTitle: "No saved address yet",
  addressMissingHint: "Add an address for quicker checkout.",
  addressChangeCta: "Change address",
  addressAddCta: "Add address",
  quickActionsEyebrow: "Account hub",
  quickActionsTitle: "Account options",
  quickActionsSubtitle: "Profile, orders, support",
  adminRibbonTitle: "Admin dashboard",
  adminRibbonHint: "Storefront & orders",
  deliveryRibbonTitle: "Delivery dashboard",
  deliveryRibbonHint: "Your assigned runs",
  dangerTitle: "Account safety",
  dangerHint: "Signed-in data stays on this device until you remove it.",
  signOutLabel: "Sign out",
};

/** Settings screen — short labels for density. */
export const SETTINGS_SCREEN = {
  pageTitle: "Settings",
  pageEyebrow: "Preferences",
  pageSubtitle: "Theme & account",
  appearanceGroup: "Appearance",
  appearanceGroupSub: "Theme",
  themeSectionTitle: "Theme",
  themeSectionSub: "Tap to cycle Light · Dark · System",
  accountGroup: "Account",
  accountGroupSub: "Profile & orders",
  accountSectionTitle: "Account options",
  accountSectionSub: "Profile, address, orders",
  notificationsGroup: "Notifications",
  notificationsGroupSub: "Alerts",
  alertsSectionTitle: "Alerts",
  alertsSectionSub: "Orders & support",
  orderUpdatesHint: "Dispatch & delivery",
  marketingHint: "Offers & promos",
  deliveryGroup: "Delivery",
  deliveryGroupSub: "Partner tools",
  adminGroup: "Admin",
  adminGroupSub: "Operations",
};

/** Delivery dashboard — partner sharing GPS with customers (foreground). */
export const DELIVERY_LIVE_SHARE = {
  title: "Share live location",
  hintBeforeBold: "While enabled, your position updates for customers when the order is ",
  hintBold: "packed, shipped, or out for delivery",
  hintAfterBold: ". Stops when you leave this screen or turn it off.",
  webHint:
    "On the web, your browser will ask for location. Keep this tab active when possible—background tabs may send updates less often.",
  switchA11yLabel: "Share live location",
  sharingActive: "Sharing live",
  lastSentPrefix: "Last sent",
};

/** Delivery partner dashboard — order cards and navigation. */
export const DELIVERY_DASHBOARD_COPY = {
  navigateDropoff: "Navigate",
  dropoffEyebrow: "Drop-off",
  customerCallA11y: "Call customer",
  /** Shown when address text is missing or looks invalid (never polyline/encoded blobs). */
  addressUnavailable: "Full address in details below",
};

/** Home location row — tap-through to saved address. */
export const LOCATION_BAR = {
  kicker: "Deliver to",
  /** Visible label when no address saved (short). */
  emptyLabel: "Add address",
  /** Screen reader / full phrasing. */
  emptyA11y: "Add delivery address",
};

/** Auth screens — Login / Register (kankreg.html `#auth`). */
export const AUTH_UI = {
  loginTitle: "Sign in",
  loginSubtitle: "Access your orders, rewards and saved items.",
  registerTitle: "Create account",
  registerSubtitle: "Join kankreg — earn rewards on every delivered order.",
  socialDivider: "or continue with",
  forgotPassword: "Forgot password?",
  forgotPasswordStub: "Password reset is coming soon. Contact support if you need help.",
  trustLine: "Secured checkout · Razorpay · Your data stays private",
  googleLabel: "Google",
  appleLabel: "Apple",
  socialComingSoon: "Coming soon",
  socialDisabledHint: "Google & Apple sign-in will be enabled once OAuth is configured.",
  continueGuest: "Continue as guest",
  haveAccount: "Already have an account?",
  needAccount: "New here?",
};

/** My Orders — shared copy for app + web (`MyOrdersScreen.js`). */
export const MY_ORDERS_UI = {
  pageTitle: "Order tracking",
  pageEyebrowActive: "In transit",
  pageEyebrowDefault: "Orders",
  emptyTitle: "No orders yet",
  emptyDescription: "Orders show up here after checkout.",
  emptyCta: "Browse shop",
  loadingCaption: "Loading orders…",
  refresh: "Refresh",
  orderPrefix: "ORDER",
  filters: {
    all: "All",
    active: "Active",
    delivered: "Delivered",
    cancelled: "Cancelled",
  },
  trackSteps: ["Placed", "Packed", "On the way", "Delivered"],
  etaPrefix: "Arriving in",
  etaFallback: "Soon",
  partnerRole: "Delivery partner",
  partnerOnWay: "On the way",
  detailsExpand: "Details",
  detailsCollapse: "Hide",
  changeAddress: "Address",
  editAddressTitle: "Update address",
  saveAddress: "Save",
  savingAddress: "Saving…",
  cancel: "Cancel",
  reorder: "Reorder",
  reorderLoading: "Adding…",
  invoiceDownload: "Invoice",
  invoiceGenerating: "Generating…",
  invoiceHintWeb: "Save as PDF from print.",
  itemsPreviewTitle: "Items",
  claimReward: "Claim reward",
  claimRewardLoading: "Claiming…",
  claimedReward: "Claimed",
  loadMore: "Load more",
  statTotal: "Total",
  statInFlight: "Active",
  statDelivered: "Delivered",
  statSpend: "Spend",
  inFlightTitle: "Active orders",
  historyTitle: "History",
  /** @deprecated use emptyDescription */
  emptyDescriptionShort: "Orders show up here after checkout.",
};

/**
 * Product detail screen — centralized copy for [`ProductScreen.js`](src/screens/ProductScreen.js).
 * Use `{key}` placeholders with `fillProductScreen(template, { key: value })`.
 */
export const PRODUCT_SCREEN = {
  loadingCaption: "Loading product…",
  loadErrorFallback: "Unable to load product.",
  notFoundTitle: "Product not found",
  notFoundDescriptionFallback: "Unavailable—open Home to browse.",
  backToHomeCta: "Back to home",
  heroImageUnavailable: "No image",
  heroInStock: "In stock",
  heroOutOfStock: "Out of stock",
  categoryFallback: "General",
  metaNoRatings: "No ratings",
  metaReadyToShip: "Ready to ship",
  metaOutOfStockShort: "Out of stock",
  /** `{rating}` `{count}` for pill text */
  metaRatingSummary: "{rating} ({count})",
  storyOverline: "Details",
  storyTitle: "About this item",
  /** Empty = no subtitle under section header (see ProductScreen). */
  storySubtitle: "",
  defaultDescription: "From KankreG.",
  variantOverline: "Choose",
  variantTitle: "Options",
  variantSubtitle: "",
  reviewsOverline: "Ratings",
  reviewsTitle: "Reviews",
  /** Kept for templates if needed; header uses count chip + empty-state line only. */
  reviewsSubtitleHasCount: "{rating} · {count} reviews",
  reviewsSubtitleOne: "{rating} · 1 review",
  reviewsEmptySubtitle: "No reviews yet",
  reviewComposerNoteLabel: "",
  reviewComposerA11y: "Review comment (optional)",
  reviewComposerPlaceholder: "Optional",
  reviewPost: "Post",
  reviewPosting: "Posting…",
  reviewRatingError: "Pick 1–5 stars.",
  reviewSubmitSuccess: "Posted.",
  reviewSubmitErrorFallback: "Couldn’t post review.",
  /** Empty = no list section label (see ProductScreen). */
  reviewListLatest: "",
  reviewNoWrittenNote: "—",
  reviewFirstHint: "",
  stickyPriceLabel: "Total",
  addToCart: "Add to cart",
  /** Primary + sticky CTA when line is not purchasable */
  outOfStock: "Out of stock",
  productOutOfStockA11y: "Unavailable",
  addToCartA11y: "Add to cart",
  /** `{count}` stepper label */
  inCartCount: "{count} in cart",
  /** `{count}` stock fact */
  stockCountLabel: "{count} in stock",
  stockOutLabel: "Out of stock",
  unitFallback: "1 pc",
  /** `{pct}` discount chip */
  savePctChip: "Save {pct}%",
  stickyInCart: "In cart ({count})",
};

/** Replace `{placeholders}` in `PRODUCT_SCREEN` template strings. */
export function fillProductScreen(template, vars) {
  let out = String(template ?? "");
  Object.entries(vars || {}).forEach(([k, v]) => {
    out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  });
  return out;
}

/** Order confirmed screen + celebration overlays (`OrderConfirmedScreen.js`, `OrderCelebrationOverlay.js`). */
export const ORDER_CELEBRATION_UI = {
  orderPrefix: "ORDER",
  /** Full-screen route after checkout (`OrderConfirmedScreen.js`). */
  screen: {
    eyebrow: "Order placed",
    title: "Order confirmed",
    lead: "Thank you — we're preparing your essentials with care.",
    orderRefLabel: "Reference",
    stepsTitle: "What happens next",
    steps: [
      {
        key: "confirmed",
        icon: "checkmark-circle-outline",
        label: "Confirmed",
        detail: "We received your order and payment details.",
      },
      {
        key: "preparing",
        icon: "cube-outline",
        label: "Preparing",
        detail: "Your items are being packed at the store.",
      },
      {
        key: "tracking",
        icon: "navigate-outline",
        label: "On the way",
        detail: "Track live updates anytime in My Orders.",
      },
    ],
    summaryTitle: "Order summary",
    labels: {
      items: "Items",
      payment: "Payment",
      delivery: "Delivering to",
      total: "Total",
    },
    paymentLabels: {
      "Cash on Delivery": "Cash on delivery",
      Razorpay: "Paid online",
      cod: "Cash on delivery",
      online: "Paid online",
    },
    trustChips: [
      { key: "track", icon: "navigate-outline", label: "Live tracking" },
      { key: "secure", icon: "shield-checkmark-outline", label: "Secure checkout" },
      { key: "care", icon: "heart-outline", label: "Handled with care" },
    ],
    trustLine: "We'll notify you as your order moves — open My Orders for the full timeline.",
    ctaPrimary: "Track order",
    ctaSecondary: "Continue shopping",
    ctaHome: "Back to home",
    missingOrderTitle: "Order not found",
    missingOrderBody: "We couldn't load this confirmation. Check My Orders for your latest purchases.",
    missingOrderCta: "Go to My Orders",
  },
  /** Full-screen popup after checkout (`OrderCelebrationOverlay.js`). */
  confirmed: {
    title: "Order placed",
    subtitle: "Your order {ref} is confirmed. We'll keep you posted as it moves.",
    ctaPrimary: "Track order",
    ctaSecondary: "Continue shopping",
  },
  delivered: {
    title: "Delivered!",
    subtitle: "Your order arrived safely. Enjoy — and thank you for choosing kankreg.",
    ctaPrimary: "View orders",
    ctaSecondary: "Shop again",
  },
};

/** Format short order reference for UI (e.g. ORDER #A1B2C3). */
export function formatOrderReference(order, prefix = ORDER_CELEBRATION_UI.orderPrefix) {
  const id = String(order?._id || order?.id || "")
    .slice(-6)
    .toUpperCase();
  return id ? `${prefix} #${id}` : "";
}

/** Public order id for celebration UI (e.g. #KG-20451). */
export function formatOrderPublicRef(order) {
  const id = String(order?._id || order?.id || "")
    .slice(-5)
    .toUpperCase();
  return id ? `#KG-${id}` : "";
}

export function formatOrderPlacedMessage(order) {
  const ref = formatOrderPublicRef(order);
  const template = ORDER_CELEBRATION_UI.confirmed.subtitle;
  return ref ? template.replace("{ref}", ref) : template.replace("{ref}", "your order");
}

/** Item count from order line items. */
export function orderItemCount(order) {
  const lines = Array.isArray(order?.products) ? order.products : [];
  return lines.reduce((sum, line) => sum + Math.max(1, Number(line?.quantity) || 1), 0);
}

/** Human payment label from order payload. */
export function orderPaymentLabel(order) {
  const raw = String(order?.paymentMethod || "").trim();
  const map = ORDER_CELEBRATION_UI.screen.paymentLabels;
  return map[raw] || raw || map.online;
}

/** My Orders — live map + markers while order is out for delivery. */
export const ORDER_LIVE_TRACKING = {
  overline: "Live",
  title: "Delivery tracking",
  loading: "Loading map…",
  errorTitle: "Live tracking",
  loadFailed: "Unable to load live tracking.",
  partnerFallback: "Delivery partner",
  staleBanner: "Partner location paused—weak signal or sharing off.",
  waitingDefault: "Waiting for partner location.",
  webFallback: "For turn-by-turn, open in Maps.",
  /** Shown under the embedded OSM map on web (tiles © OpenStreetMap). */
  osmAttrib: "Map data © OpenStreetMap contributors",
  /** Dark mode uses Carto tiles on web. */
  osmAttribDark: "© OpenStreetMap · © CARTO",
  openMapsCta: "Open in Maps",
  markerPartner: "Delivery partner",
  markerShop: "Shop",
  markerDestination: "Delivery address",
  shopNotConfigured: "Set shop location in Admin → Storefront.",
  deliverToEyebrow: "Deliver to",
  deliverPhoneA11y: "Call delivery phone",
  updatedJustNow: "Updated just now",
  /** Use `{minutes}` placeholder for whole minutes since update. */
  updatedMinutesAgo: "Updated {minutes} min ago",
  /** Appended before locale time when the update is older than ~2 hours. */
  updatedAtPrefix: "Updated ",
  /** Shown when an encoded driving-route polyline is drawn (Google Directions). */
  googleRouteAttrib: "Route © Google",
};

/** Admin → Home View screen: labels, hints, and quick links to related tools. */
export const ADMIN_HOME_VIEW_COPY = {
  title: "Manage storefront content",
  subtitle:
    "Hero copy and home layout live here. Each product’s name, price, image, stock, “Show on Home”, and which block it appears in (e.g. Prime Products) are set under Products.",
  heroSection: "Hero banner",
  heroHint: "Shown on the large home hero (title + subtitle under the brand).",
  sectionTitles: "Home catalog headings",
  sectionTitlesHint:
    "Prime title is the default section name for products without a custom Home section, and the heading for the main list when sections are merged. Product type title is saved with this profile for layout features (same API as the storefront).",
  visibilitySection: "Home layout switches",
  visibilityHint:
    "These flags are read by the live Home screen. Each product still needs “Show on Home” and a Home section in the product editor.",
  cardLayoutSection: "Product card density",
  cardLayoutHint: "Stored as compact or comfortable (wired when the storefront reads this setting).",
  shopLocationSection: "Shop / pickup location",
  shopLocationHint: "Pin shown on order tracking maps (shop, delivery partner, customer).",
  shopNameLabel: "Shop name",
  shopAddressLabel: "Address line",
  shopCityLabel: "City",
  shopStateLabel: "State",
  shopPostalLabel: "Postal code",
  shopCoordsLabel: "Coordinates",
  shopUseGps: "Use current location",
  shopUseGpsLoading: "Locating…",
  quickLinks: "Catalog & items",
  linkProductsTitle: "Manage products",
  linkProductsSubtitle: "Edit listings, MRP, discount, photos, stock, home section, and visibility on Home.",
  linkAddProductTitle: "Add product",
  linkAddProductSubtitle: "Create a new SKU and assign it to a home section.",
};
