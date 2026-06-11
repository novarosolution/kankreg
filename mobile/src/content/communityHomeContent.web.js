/**
 * Web: community defaults with WebP fallbacks (no bundled JPEGs on home path).
 */

export const COMMUNITY_HOME_CONTENT = {
  eyebrow: "Our Community",
  title: "Loved by families, shared every day",
  subtitle: "Reels, recipes, and words from families who cook with KankreG every day.",
  instagram: {
    handle: "kankreg_ghee",
    displayHandle: "@kankreg_ghee",
    followersLabel: "18.4k followers",
    followLabel: "Follow",
    url: "https://instagram.com/kankreg_ghee",
  },
  posts: [
    {
      id: "reel-golden-pour",
      type: "reel",
      tag: "Reel",
      image: require("../../assets/marketing/hero-slide-05-wa-web-504.webp"),
      views: "12.3k",
      likes: "1.2k",
      author: {
        name: "kankreg_ghee",
        subtitle: "The golden pour",
        avatar: "K",
        brand: true,
      },
    },
    {
      id: "customer-ramesh",
      type: "customer",
      tag: "Customer",
      image: require("../../assets/marketing/hero-slide-04-wa-web-504.webp"),
      quote: "Tastes just like my grandmother's homemade ghee.",
      likes: "340",
      author: {
        name: "Ramesh Patel",
        subtitle: "Ahmedabad",
        avatar: "R",
        brand: false,
      },
    },
    {
      id: "reel-herd",
      type: "reel",
      tag: "Reel",
      image: require("../../assets/marketing/hero-slide-06-wa-web-504.webp"),
      views: "8.1k",
      likes: "980",
      author: {
        name: "kankreg_ghee",
        subtitle: "Meet our herd",
        avatar: "K",
        brand: true,
      },
    },
    {
      id: "reel-recipe",
      type: "reel",
      tag: "Recipe",
      image: require("../../assets/marketing/hero-slide-1-web-504.webp"),
      views: "5.6k",
      likes: "742",
      author: {
        name: "kankreg_ghee",
        subtitle: "Ghee dal tadka",
        avatar: "K",
        brand: true,
      },
    },
    {
      id: "customer-priya",
      type: "customer",
      tag: "Customer",
      image: require("../../assets/marketing/hero-slide-2-web-504.webp"),
      quote: "Pure aroma, real Bilona ghee. We've switched for good.",
      likes: "512",
      author: {
        name: "Priya Shah",
        subtitle: "Surat",
        avatar: "P",
        brand: false,
      },
    },
  ],
};

export const COMMUNITY_POST_IMAGE_FALLBACKS = {
  "reel-golden-pour": require("../../assets/marketing/hero-slide-05-wa-web-504.webp"),
  "customer-ramesh": require("../../assets/marketing/hero-slide-04-wa-web-504.webp"),
  "reel-herd": require("../../assets/marketing/hero-slide-06-wa-web-504.webp"),
  "reel-recipe": require("../../assets/marketing/hero-slide-1-web-504.webp"),
  "customer-priya": require("../../assets/marketing/hero-slide-2-web-504.webp"),
};

const FALLBACK_POST_ORDER = COMMUNITY_HOME_CONTENT.posts.map((post) => post.id);

export function buildCommunitySectionDefaults() {
  return {
    enabled: true,
    eyebrow: COMMUNITY_HOME_CONTENT.eyebrow,
    title: COMMUNITY_HOME_CONTENT.title,
    subtitle: COMMUNITY_HOME_CONTENT.subtitle,
    instagram: { ...COMMUNITY_HOME_CONTENT.instagram },
    posts: COMMUNITY_HOME_CONTENT.posts.map((post, order) => ({
      id: post.id,
      order,
      enabled: true,
      type: post.type,
      tag: post.tag,
      imageUrl: "",
      views: post.views || "",
      likes: post.likes || "",
      quote: post.quote || "",
      author: { ...post.author },
    })),
  };
}

export function getCommunityPostImageFallback(postId, index = 0) {
  if (postId && COMMUNITY_POST_IMAGE_FALLBACKS[postId]) {
    return COMMUNITY_POST_IMAGE_FALLBACKS[postId];
  }
  const key = FALLBACK_POST_ORDER[index % FALLBACK_POST_ORDER.length];
  return COMMUNITY_POST_IMAGE_FALLBACKS[key] || null;
}
