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
    eyebrow: "INSTANT",
    subtitle: "UPI, cards, wallets, netbanking",
    icon: "card-outline",
    badge: "RECOMMENDED",
    brandStrip: ["UPI", "Visa", "MC", "RuPay", "Wallets"],
    secureNote: "Secured by Razorpay · 256-bit SSL",
  },
  {
    id: "Cash on Delivery",
    title: "Cash on delivery",
    eyebrow: "RELAXED",
    subtitle: "Pay in cash when your order arrives",
    icon: "cash-outline",
    secureNote: "Available across serviceable pin codes",
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
};

/** Hero image card (above-the-fold marketing, not the same fields as API hero title). */
export const HOME_HERO_BANNER = {
  kicker: "Heritage craft · Small batch",
  badge: "100% PURE AND NATURAL",
  cta: "Explore collection",
};

/** Light-mode tagline under the home top wordmark (same voice as `APP_TAGLINE`). */
export const HOME_WORDMARK_TAGLINE = APP_TAGLINE;

/** Trust strip under the hero image (icon = Ionicons name). */
export const HOME_TRUST_STRIP = [
  { key: "source", label: "Authentic source", icon: "shield-checkmark-outline" },
  { key: "batch", label: "Small batch", icon: "leaf-outline" },
  { key: "cod", label: "COD delivery", icon: "car-outline" },
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
/** Static brand quote on Kankreg home (not from reviews API). */
export const HOME_BRAND_QUOTE = {
  text: "The packaging alone felt like a gift. kankreg has quietly become the only place I shop for the home.",
  attribution: "— The KankreG team",
};

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
      { label: "About", route: "Support" },
      { label: "Careers", route: null },
      { label: "Privacy", route: null },
      { label: "Terms", route: null },
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

/** Support screen (customer). */
export const SUPPORT_SCREEN = {
  pageSubtitle: "Fast replies",
  liveChatTitle: "Live chat",
  contactChatSub: "Usually minutes",
  contactEmailSub: SUPPORT_EMAIL_DISPLAY,
  contactWhatsAppSub: "Anytime",
};

/**
 * Profile screen (customer). Centralised copy so labels stay editable in one
 * place rather than hard-coded in [src/screens/ProfileScreen.js].
 */
export const PROFILE_SCREEN = {
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

/** Cart screen section chrome — see `CartScreen.js`. */
export const CART_UI = {
  pageEyebrow: "Your bag",
  pageTitle: "Shopping cart",
  checkoutEyebrow: "Almost there",
  checkoutTitle: "Checkout",
  backToBag: "Back to bag",
  itemsOverline: "Bag",
  itemsTitle: "Your items",
  pairOverline: "Pair",
  pairTitle: "Goes well with",
  couponOverline: "Save",
  couponTitle: "Coupon",
  summaryOverline: "Total",
  summaryTitle: "Summary",
  addressOverline: "Delivery",
  trustPure: "Pure ingredients",
  trustPay: "Secure checkout",
  trustOrganic: "Organic focus",
  emptyTitle: "Your cart is empty",
  emptyDescription: "Browse the shop and add items.",
  browseCta: "Browse products",
};

/** Cart — deliver-to panel and profile address prompts. */
export const CART_ADDRESS = {
  panelTitle: "Deliver to",
  profileIncompleteTitle: "Address incomplete",
  profileIncompleteSub: "Finish line, city, state, PIN, and country in your profile—we’ll pre-fill here.",
  profileEmptyTitle: "Save a delivery address",
  profileEmptySub: "Add it once in your profile for faster checkout.",
  useGps: "Use GPS",
  useGpsLoading: "Locating…",
  gpsFillSuccess: "Filled from your location.",
};

/** My Orders — buttons and compact copy (avoid repeating map/address lines). */
export const MY_ORDERS_UI = {
  detailsExpand: "Details",
  detailsCollapse: "Hide",
  changeAddress: "Change address",
  /** Shown above the address edit form. */
  editAddressTitle: "Update address (5 min)",
  invoiceHintWeb: "Tip: print dialog → Save as PDF.",
  itemsPreviewTitle: "Items",
  inFlightOverline: "Active",
  inFlightTitle: "In flight",
  historyOverline: "Past",
  historyTitle: "History",
  emptyDescriptionShort: "Orders and tracking show up here.",
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
  stickyPriceLabel: "Price",
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
  markerPartner: "Partner",
  markerDestination: "Delivery address",
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
  quickLinks: "Catalog & items",
  linkProductsTitle: "Manage products",
  linkProductsSubtitle: "Edit listings, MRP, discount, photos, stock, home section, and visibility on Home.",
  linkAddProductTitle: "Add product",
  linkAddProductSubtitle: "Create a new SKU and assign it to a home section.",
};
