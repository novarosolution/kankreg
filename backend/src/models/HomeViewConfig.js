const mongoose = require("mongoose");

const homeViewConfigSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Pure Heritage in Every Drop",
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default:
        "Slow-churned from the milk of grass-fed cows — golden clarity and aroma rooted in tradition.",
      trim: true,
    },
    primeSectionTitle: {
      type: String,
      default: "Prime Products",
      trim: true,
    },
    productTypeTitle: {
      type: String,
      default: "Shop by category",
      trim: true,
    },
    showPrimeSection: {
      type: Boolean,
      default: true,
    },
    showHomeSections: {
      type: Boolean,
      default: true,
    },
    showProductTypeSections: {
      type: Boolean,
      default: true,
    },
    productCardStyle: {
      type: String,
      enum: ["compact", "comfortable"],
      default: "compact",
    },
    /** Admin shop / pickup pin — shown on customer order tracking maps. */
    shopLocation: {
      name: { type: String, default: "KankreG Shop", trim: true },
      line1: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      state: { type: String, default: "", trim: true },
      postalCode: { type: String, default: "", trim: true },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    /** Web hero carousel — images or videos managed in admin. */
    heroSlides: [
      {
        id: { type: String, required: true },
        order: { type: Number, default: 0 },
        mediaType: { type: String, enum: ["image", "video"], default: "image" },
        url: { type: String, default: "", trim: true },
        title: { type: String, default: "", trim: true },
        subtitle: { type: String, default: "", trim: true },
        enabled: { type: Boolean, default: true },
      },
    ],
    /** Community / Instagram rail after Our Story on web home. */
    communitySection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "Our Community", trim: true },
      title: { type: String, default: "Loved by families, shared every day", trim: true },
      instagram: {
        handle: { type: String, default: "kankreg_ghee", trim: true },
        displayHandle: { type: String, default: "@kankreg_ghee", trim: true },
        followersLabel: { type: String, default: "18.4k followers", trim: true },
        followLabel: { type: String, default: "Follow", trim: true },
        url: { type: String, default: "https://instagram.com/kankreg_ghee", trim: true },
      },
      posts: [
        {
          id: { type: String, required: true },
          order: { type: Number, default: 0 },
          enabled: { type: Boolean, default: true },
          type: { type: String, enum: ["reel", "customer"], default: "reel" },
          tag: { type: String, default: "Reel", trim: true },
          imageUrl: { type: String, default: "", trim: true },
          views: { type: String, default: "", trim: true },
          likes: { type: String, default: "", trim: true },
          quote: { type: String, default: "", trim: true },
          author: {
            name: { type: String, default: "", trim: true },
            subtitle: { type: String, default: "", trim: true },
            avatar: { type: String, default: "", trim: true },
            brand: { type: Boolean, default: true },
          },
        },
      ],
    },
    /** “Ours vs ordinary ghee” compare block on web home. */
    compareSection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "What makes us different", trim: true },
      title: { type: String, default: "Ours vs ordinary ghee", trim: true },
      subtitle: {
        type: String,
        default: "Most shelves sell factory-processed fat. We sell heritage.",
        trim: true,
      },
      filmLabel: { type: String, default: "The difference", trim: true },
      storyChapter: { type: String, default: "Chapter II", trim: true },
      openingLine: {
        type: String,
        default: "Two paths. One golden jar. This is where heritage meets the shelf.",
        trim: true,
      },
      oursLabel: { type: String, default: "KankreG", trim: true },
      ordinaryLabel: { type: String, default: "Ordinary", trim: true },
      rows: [
        {
          id: { type: String, required: true },
          order: { type: Number, default: 0 },
          enabled: { type: Boolean, default: true },
          label: { type: String, default: "", trim: true },
          ours: { type: String, default: "", trim: true },
          ordinary: { type: String, default: "", trim: true },
          oursImageUrl: { type: String, default: "", trim: true },
          ordinaryImageUrl: { type: String, default: "", trim: true },
        },
      ],
    },
    /** About KankreG block on web home + about page. */
    aboutSection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "About KankreG", trim: true },
      title: { type: String, default: "Craft rooted in tradition", trim: true },
      body: {
        type: String,
        default:
          "KankreG brings slow-made essentials from Indian kitchens to your door — curated quality, live order tracking, and rewards on every purchase.",
        trim: true,
      },
      videoUrl: { type: String, default: "", trim: true },
      videoCaption: { type: String, default: "", trim: true },
      photos: [
        {
          url: { type: String, default: "", trim: true },
          caption: { type: String, default: "", trim: true },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeViewConfig", homeViewConfigSchema);
