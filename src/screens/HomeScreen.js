/* @refresh reset */
/** @deprecated Legacy home — AppNavigator uses KankregHomeScreen.js. Do not extend this file. */
/** @deprecated Legacy home — live app uses `KankregHomeScreen`. */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import {
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View} from "react-native";
import MotionScrollView from "../components/motion/MotionScrollView";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "../components/home/HomePageFooter";
import HomeSectionHeader from "../components/home/HomeSectionHeader";
import BottomNavBar from "../components/BottomNavBar";
import QCommerceSearchField from "../components/qcommerce/QCommerceSearchField";
import LocationBar from "../components/qcommerce/LocationBar";
import BrandLogo from "../components/BrandLogo";
import PremiumLoader from "../components/ui/PremiumLoader";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import useReducedMotion from "../hooks/useReducedMotion";
import { getHomeViewConfig, getProducts } from "../services/productService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { fonts, icon, layout, lineHeight, radius, spacing, typography } from "../theme/tokens";
import {
  HOME_CATALOG_INTRO,
  HOME_HERO_BANNER,
  HOME_LIVE_ORDER_CARD,
  HOME_PAGE_LABELS,
  HOME_VIEW_DEFAULTS,
  HOME_WORDMARK_TAGLINE} from "../content/appContent";
import { BRAND_LOGO_SIZE, SEARCH_PLACEHOLDER } from "../constants/brand";
import {
  HOME_HERO_MOBILE_SLIDER_SLIDES,
  HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH,
  HOME_HERO_WEB_SLIDER_SLIDES} from "../constants/marketingAssets";
import { HOME_CATALOG_ALL, matchesShelfProduct } from "../utils/shelfMatch";
import { productToCartLine } from "../utils/productCart";
import {
  ALCHEMY,
  CUSTOMER_SHELL_GRADIENT_LOCATIONS,
  FONT_DISPLAY,
  FONT_DISPLAY_SEMI,
  getCustomerShellGradient} from "../theme/customerAlchemy";
import { customerPageScrollBase, customerScrollPaddingBottom, customerScrollPaddingTop } from "../theme/screenLayout";
import { WEB_HEADER_HEIGHT, WEB_Z_INDEX } from "../theme/web";
import GoldHairline from "../components/ui/GoldHairline";
import HomeMarketingHero from "../components/home/HomeMarketingHero";
import HomeTrustStrip from "../components/home/HomeTrustStrip";
import {
  HomeCategoryCards,
  HomeEditorialHero,
  HomeFeaturedEditorial,
  HomeMarqueeTicker} from "../components/home/HomeKankregSections";
import { HomeCatalogGridCard, HomeCatalogListRow } from "../components/home/HomeCatalogProductViews";
import { fetchMyOrders } from "../services/userService";
import { formatINR } from "../utils/currency";
import { getOrderStatusLabel } from "../utils/orderStatus";
import { navigateCustomerRoute } from "../navigation/customerNavigate";

if (Platform.OS === "web") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Room for optional tagline under home wordmark (keeps hamburger & cart aligned). */
const HOME_TOPBAR_TAGLINE_ROOM = 4;
/** Distance from top of screen to first row of menu (below home bar + gap). */
const HOME_MENU_TOP_OFFSET = BRAND_LOGO_SIZE.homeTopBar + HOME_TOPBAR_TAGLINE_ROOM + spacing.sm * 2 + spacing.xs;

/** Home lists the full catalog; `showOnHome` on each product still controls visibility. */
function matchesHomeShelf(product) {
  return matchesShelfProduct(product, HOME_CATALOG_ALL);
}

export default function HomeScreen({ navigation }) {
  const route = useRoute();
  const { colors: c, shadowLift, shadowPremium, isDark } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  /** Tighter type/icons on very narrow widths inside the trust row. */
  const trustVisualDense = windowWidth < 380;
  const styles = useMemo(
    () => createHomeStyles(c, shadowLift, shadowPremium, isDark),
    [c, shadowLift, shadowPremium, isDark]
  );
  const scrollRef = useRef(null);
  const featuredYRef = useRef(0);
  const heroSliderRef = useRef(null);
  const webRootRef = useRef(null);
  const webHeaderRef = useRef(null);
  const webHeroRef = useRef(null);
  const webTrustRef = useRef(null);
  const webCatalogRefs = useRef([]);
  const webFooterRef = useRef(null);

  const insets = useSafeAreaInsets();
  const { addToCart, removeFromCart, getItemQuantity, totalItems } = useCart();
  const { isAuthenticated, token, user, refreshProfile } = useAuth();
  const [query, setQuery] = useState("");
  /** From menu: full catalog vs curated starter picks */
  const [collectionTab, setCollectionTab] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sectionFilter, setSectionFilter] = useState(null);
  const [homeViewConfig, setHomeViewConfig] = useState({ ...HOME_VIEW_DEFAULTS });
  const [refreshing, setRefreshing] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroSliderWidth, setHeroSliderWidth] = useState(0);
  const [deliveryLine1, setDeliveryLine1] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [activeJumpId, setActiveJumpId] = useState("home-hero");
  const [liveOrder, setLiveOrder] = useState(null);
  const showMarketing = !query.trim();
  const reducedMotion = useReducedMotion();

  /** Scroll-spy: highlights the closest anchor for the desktop jump-nav. */
  useEffect(() => {
    if (Platform.OS !== "web") return undefined;
    if (typeof globalThis === "undefined" || typeof globalThis.window === "undefined") return undefined;
    if (windowWidth < 1280) return undefined;
    const win = globalThis.window;
    const doc = globalThis.document;
    if (!doc) return undefined;
    const ids = ["home-hero", "home-trust", "home-catalog", "home-sections"];
    const threshold = WEB_HEADER_HEIGHT + 16;
    let frame = null;
    const tick = () => {
      let nextId = ids[0];
      for (const id of ids) {
        const el = doc.getElementById(id);
        if (!el || typeof el.getBoundingClientRect !== "function") continue;
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) {
          nextId = id;
        }
      }
      setActiveJumpId((prev) => (prev === nextId ? prev : nextId));
      frame = null;
    };
    const onScroll = () => {
      if (frame == null) {
        frame = win.requestAnimationFrame(tick);
      }
    };
    tick();
    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onScroll);
    return () => {
      win.removeEventListener("scroll", onScroll);
      win.removeEventListener("resize", onScroll);
      if (frame != null) win.cancelAnimationFrame(frame);
    };
  }, [windowWidth]);

  const smoothScrollToAnchor = useCallback((id) => {
    if (Platform.OS !== "web") return;
    if (typeof globalThis === "undefined" || typeof globalThis.window === "undefined") return;
    const win = globalThis.window;
    const doc = globalThis.document;
    if (!doc) return;
    const el = doc.getElementById(id);
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    const top = el.getBoundingClientRect().top + (win.pageYOffset || 0) - (WEB_HEADER_HEIGHT + 12);
    win.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);

  const refreshDeliverySnippet = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setDeliveryLine1("");
      setDeliveryCity("");
      return;
    }
    const cachedAddress = user?.defaultAddress;
    if (cachedAddress?.line1 || cachedAddress?.city) {
      setDeliveryLine1(String(cachedAddress?.line1 || "").trim());
      setDeliveryCity(String(cachedAddress?.city || "").trim());
      return;
    }
    try {
      const profile = await refreshProfile();
      const a = profile?.defaultAddress;
      setDeliveryLine1(String(a?.line1 || "").trim());
      setDeliveryCity(String(a?.city || "").trim());
    } catch {
      setDeliveryLine1("");
      setDeliveryCity("");
    }
  }, [isAuthenticated, token, user?.defaultAddress, refreshProfile]);

  useFocusEffect(
    useCallback(() => {
      refreshDeliverySnippet();
      let cancelled = false;
      (async () => {
        if (!isAuthenticated || !token) {
          if (!cancelled) setLiveOrder(null);
          return;
        }
        try {
          const data = await fetchMyOrders(token);
          const orders = Array.isArray(data) ? data : [];
          const pick =
            orders.find((o) => String(o?.status || "") === "out_for_delivery") ||
            orders.find((o) =>
              ["ready_for_pickup", "shipped", "preparing", "confirmed"].includes(String(o?.status || ""))
            ) ||
            null;
          if (!cancelled) setLiveOrder(pick);
        } catch {
          if (!cancelled) setLiveOrder(null);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [isAuthenticated, refreshDeliverySnippet, token])
  );

  /** Width-derived hero height: web = wide band; phone = height from reference 1023×1537 JPEG aspect (+ screen cap). */
  const heroSlideHeight = useMemo(() => {
    const w = heroSliderWidth > 0 ? heroSliderWidth : Math.min(windowWidth, layout.maxContentWidth);
    if (Platform.OS === "web") {
      return Math.min(640, Math.max(420, Math.round(w * 0.48)));
    }
    const ideal = Math.round(w * HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH);
    const maxFromScreen = Math.round(windowHeight * 0.58);
    return Math.max(300, Math.min(ideal, 580, maxFromScreen));
  }, [heroSliderWidth, windowWidth, windowHeight]);

  const loadHomeData = useCallback(async ({ isPullRefresh = false } = {}) => {
    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const [data, viewConfig] = await Promise.all([
        getProducts(),
        getHomeViewConfig().catch(() => null),
      ]);
      setProducts(data);
      if (viewConfig) setHomeViewConfig(viewConfig);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      if (isPullRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
      if (Platform.OS === "web" && typeof ScrollTrigger.refresh === "function") {
        ScrollTrigger.refresh();
      }
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  useEffect(() => {
    const raw = route.params?.filterHomeSection;
    if (raw != null && String(raw).trim()) {
      setSectionFilter(String(raw).trim());
    } else {
      setSectionFilter(null);
    }
  }, [route.params?.filterHomeSection]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!matchesHomeShelf(product)) return false;
      const productName = String(product?.name || "");
      const productDescription = String(product?.description || "");
      const searchTerm = query.trim().toLowerCase();
      const matchesSearch =
        searchTerm.length === 0 ||
        productName.toLowerCase().includes(searchTerm) ||
        productDescription.toLowerCase().includes(searchTerm);
      return matchesSearch;
    });
  }, [products, query]);

  const homeVisibleProducts = useMemo(() => {
    return filteredProducts
      .filter((item) => item.showOnHome !== false)
      .sort((a, b) => {
        const orderA = Number.isFinite(Number(a.homeOrder)) ? Number(a.homeOrder) : 0;
        const orderB = Number.isFinite(Number(b.homeOrder)) ? Number(b.homeOrder) : 0;
        if (orderA !== orderB) return orderA - orderB;
        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [filteredProducts]);

  const productsForHome = useMemo(() => {
    if (query.trim()) return homeVisibleProducts;
    if (collectionTab === "starter") return homeVisibleProducts.slice(0, 4);
    return homeVisibleProducts;
  }, [homeVisibleProducts, collectionTab, query]);

  const totalMatches = productsForHome.length;
  const homeCatalogCount = homeVisibleProducts.length;
  const starterShownCount = Math.min(4, homeCatalogCount);
  /** Two-column tiles on tablets / landscape — list stays for active search (easier to scan). */
  const useProductGridLayout = windowWidth >= 560 && !query.trim();
  const catalogGridColStyle = useMemo(() => {
    if (!useProductGridLayout) return null;
    const scrollPad = Platform.OS === "web" ? spacing.xl : spacing.lg;
    const surfacePad = Platform.OS === "web" ? spacing.lg : spacing.lg;
    const gap = Platform.OS === "web" ? spacing.lg : spacing.md;
    const columnCount =
      windowWidth >= 1440 ? 4 : windowWidth >= 1100 ? 3 : 2;
    const contentW = Math.min(windowWidth, layout.maxContentWidth);
    const inner = Math.max(0, contentW - 2 * scrollPad - 2 * surfacePad);
    const totalGap = gap * (columnCount - 1);
    const col = Math.max(136, Math.floor((inner - totalGap) / columnCount));
    const maxCol = Platform.OS === "web" ? 300 : col;
    const finalCol = Math.min(col, maxCol);
    return { width: finalCol, minWidth: finalCol, maxWidth: finalCol };
  }, [useProductGridLayout, windowWidth]);

  const adminManagedSections = useMemo(() => {
    const grouped = productsForHome.reduce((acc, item) => {
      const key = String(item.homeSection || "Prime Products").trim() || "Prime Products";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([title, items]) => ({ title, items }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [productsForHome]);

  const visibleHomeSections = useMemo(() => {
    if (!homeViewConfig.showPrimeSection) return adminManagedSections;
    const primeKey = String(homeViewConfig.primeSectionTitle || "Prime Products")
      .trim()
      .toLowerCase();
    return adminManagedSections.filter(
      (section) => String(section.title || "").trim().toLowerCase() !== primeKey
    );
  }, [adminManagedSections, homeViewConfig.showPrimeSection, homeViewConfig.primeSectionTitle]);

  const sectionsForRender = useMemo(() => {
    if (!sectionFilter) return visibleHomeSections;
    return visibleHomeSections.filter((s) => String(s.title).trim() === sectionFilter);
  }, [visibleHomeSections, sectionFilter]);

  const clearSectionFilter = useCallback(() => {
    setSectionFilter(null);
    navigation.setParams({ filterHomeSection: undefined });
  }, [navigation]);

  const handleCatalogAddToCart = useCallback(
    (product) => {
      if (product.inStock === false || Number(product.stockQty || 0) <= 0) return;
      if (!isAuthenticated) {
        navigation.navigate("Login");
        return;
      }
      addToCart(productToCartLine(product));
    },
    [addToCart, isAuthenticated, navigation]
  );

  const handleCatalogRemoveFromCart = useCallback(
    (productId) => {
      if (!isAuthenticated) {
        navigation.navigate("Login");
        return;
      }
      removeFromCart(productId);
    },
    [isAuthenticated, navigation, removeFromCart]
  );

  const shellColors = useMemo(() => getCustomerShellGradient(isDark, c), [isDark, c]);
  const heroSlides = useMemo(() => {
    const source = Platform.OS === "web" ? HOME_HERO_WEB_SLIDER_SLIDES : HOME_HERO_MOBILE_SLIDER_SLIDES;
    return source.map((slide, index) => ({
      ...slide,
      title: index === 0 ? homeViewConfig.heroTitle : slide.title,
      subtitle: index === 0 ? homeViewConfig.heroSubtitle || slide.subtitle : slide.subtitle,
      cta: index === 0 ? HOME_HERO_BANNER.cta : slide.cta}));
  }, [homeViewConfig.heroTitle, homeViewConfig.heroSubtitle]);

  const scrollToFeatured = useCallback(() => {
    const y = Math.max(0, featuredYRef.current - 12);
    scrollRef.current?.scrollTo({ y, animated: true });
  }, []);

  const goToHeroSlide = useCallback((index) => {
    const w = heroSliderWidth;
    if (w <= 0 || heroSlides.length === 0) return;
    const next = Math.max(0, Math.min(index, heroSlides.length - 1));
    heroSliderRef.current?.scrollTo({ x: next * w, animated: true });
    setHeroSlideIndex(next);
  }, [heroSliderWidth, heroSlides.length]);

  const focusCatalog = useCallback(() => {
    requestAnimationFrame(() => scrollToFeatured());
  }, [scrollToFeatured]);

  useEffect(() => {
    if (!showMarketing || heroSlides.length < 2 || heroSliderWidth <= 0) return undefined;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => {
        const next = (prev + 1) % heroSlides.length;
        heroSliderRef.current?.scrollTo({ x: next * heroSliderWidth, animated: true });
        return next;
      });
    }, heroSlides.length > 8 ? 4500 : 4200);
    return () => clearInterval(timer);
  }, [showMarketing, heroSlides.length, heroSliderWidth]);

  const handleHeroSlideAction = useCallback(
    (action) => {
      if (action === "catalog") {
        focusCatalog();
        return;
      }
      scrollToFeatured();
    },
    [focusCatalog, scrollToFeatured]
  );

  const setWebCatalogRef = useCallback((idx, node) => {
    webCatalogRefs.current[idx] = node;
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || reducedMotion) return undefined;
    const root = webRootRef.current;
    if (!root) return undefined;
    const ctx = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (webHeaderRef.current) {
          intro.fromTo(webHeaderRef.current, { y: 16 }, { y: 0, duration: 0.45 });
        }
        if (webHeroRef.current) {
          intro.fromTo(webHeroRef.current, { y: 18 }, { y: 0, duration: 0.52 }, "-=0.28");
        }

        const revealNodes = [
          webTrustRef.current,
          ...webCatalogRefs.current.filter(Boolean),
          webFooterRef.current,
        ].filter(Boolean);

        revealNodes.forEach((node, idx) => {
          gsap.fromTo(
            node,
            { y: 28 },
            {
              y: 0,
              duration: 0.58,
              ease: "power2.out",
              delay: idx === 0 ? 0.04 : 0,
              scrollTrigger: {
                trigger: node,
                start: "top 88%",
                toggleActions: "play none none reverse"}}
          );
        });

        if (webTrustRef.current) {
          gsap.fromTo(
            webTrustRef.current,
            { y: 20 },
            {
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              scrollTrigger: {
                trigger: webTrustRef.current,
                start: "top 92%",
                end: "bottom 72%",
                scrub: 0.35}}
          );
        }

        if (webHeroRef.current) {
          gsap.to(webHeroRef.current, {
            y: -18,
            ease: "none",
            scrollTrigger: {
              trigger: webHeroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6}});
        }
      }, root);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion, showMarketing, sectionsForRender.length, totalMatches, query, collectionTab, loading]);

  const renderCatalogItems = (items, listKeyPrefix = "cat") => {
    const outOfStock = (p) => p.inStock === false || Number(p.stockQty || 0) <= 0;
    if (useProductGridLayout && catalogGridColStyle && items.length > 0) {
      return (
        <View style={styles.productGridWrap}>
          {items.map((item, idx) => (
            <HomeCatalogGridCard
              key={item.id ?? `${listKeyPrefix}-g-${idx}`}
              catalogGridColStyle={catalogGridColStyle}
              idx={idx}
              isOutOfStock={outOfStock(item)}
              item={item}
              navigation={navigation}
              quantity={getItemQuantity(item.id)}
              styles={styles}
              onAddToCart={() => handleCatalogAddToCart(item)}
              onRemoveFromCart={() => handleCatalogRemoveFromCart(item.id)}
            />
          ))}
        </View>
      );
    }
    return items.map((item, idx) => (
      <HomeCatalogListRow
        key={item.id ?? `${listKeyPrefix}-r-${idx}`}
        index={idx}
        isOutOfStock={outOfStock(item)}
        item={item}
        navigation={navigation}
        quantity={getItemQuantity(item.id)}
        styles={styles}
        totalInGroup={items.length}
        onAddToCart={() => handleCatalogAddToCart(item)}
        onRemoveFromCart={() => handleCatalogRemoveFromCart(item.id)}
      />
    ));
  };
  return (
    <View ref={webRootRef} style={styles.screen}>
      <LinearGradient
        colors={shellColors}
        locations={CUSTOMER_SHELL_GRADIENT_LOCATIONS}
        start={{ x: 0.06, y: 0 }}
        end={{ x: 0.94, y: 1 }}
        style={styles.gradientFill}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(0,0,0,0.2)", "transparent", "transparent", "rgba(0,0,0,0.48)"]
              : ["rgba(116, 79, 28, 0.035)", "transparent", "transparent", "rgba(116, 79, 28, 0.075)"]
          }
          locations={[0, 0.18, 0.65, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFillObject, styles.peNone]}
        />
        <MotionScrollView
        ref={scrollRef}
        style={styles.scrollMain}
        scrollEventThrottle={16}
        contentContainerStyle={[
          customerPageScrollBase,
          {
            paddingTop:
              Platform.OS === "web"
                ? customerScrollPaddingTop(insets, { webMin: spacing.md })
                : spacing.xl + 6,
            paddingBottom: customerScrollPaddingBottom(insets),
            paddingHorizontal:
              Platform.OS === "web"
                ? windowWidth < 720
                  ? spacing.sm
                  : windowWidth < 980
                    ? spacing.md
                    : customerPageScrollBase.paddingHorizontal
                : customerPageScrollBase.paddingHorizontal},
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          Platform.OS === "web" ? undefined : (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                await loadHomeData({ isPullRefresh: true });
                await refreshDeliverySnippet();
              }}
              tintColor={c.primary}
              colors={[c.primary]}
              progressBackgroundColor={c.surface}
            />
          )
        }
      >
        <View
          ref={webHeaderRef}
          nativeID="home-hero"
          style={[styles.headerWrap, { paddingTop: Math.max(insets.top, spacing.md) }]}
        >
          {Platform.OS !== "web" ? (
            <View
              style={[
                styles.headerAmbientCard,
                isDark ? styles.headerAmbientCardDark : styles.headerAmbientCardLight,
              ]}
            >
              <LinearGradient
                colors={[ALCHEMY.gold, "rgba(212, 175, 55, 0.35)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerAmbientSheen, styles.peNone]}
              />
              <View style={styles.topBarShellNested}>
                <View style={styles.alchemyTopBar}>
                  <Pressable
                    onPress={() => setMenuOpen(true)}
                    style={({ pressed }) => [styles.alchemyIconBtn, pressed && { opacity: 0.75 }]}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Open menu"
                  >
                    <Ionicons name="menu" size={icon.nav} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                  </Pressable>
                  <View style={styles.wordmarkBlock}>
                    <BrandLogo
                      width={BRAND_LOGO_SIZE.homeTopBar}
                      height={BRAND_LOGO_SIZE.homeTopBar}
                      style={styles.topBarLogo}
                    />
                    <Text style={[styles.topBarTagline, { color: c.textMuted }]} numberOfLines={1}>
                      {HOME_WORDMARK_TAGLINE}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => navigateCustomerRoute(navigation, "Cart")}
                    style={({ pressed }) => [styles.alchemyIconBtn, pressed && { opacity: 0.75 }]}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"}
                  >
                    <View style={styles.cartBtnInner}>
                      <Ionicons name="bag-handle-outline" size={icon.nav} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                      {totalItems > 0 ? (
                        <View
                          style={[
                            styles.cartBadge,
                            {
                              backgroundColor: c.primary,
                              borderColor: isDark ? "rgba(28, 25, 23, 0.95)" : "#FFFCF8"},
                          ]}
                        >
                          <Text style={styles.cartBadgeText}>{totalItems > 99 ? "99+" : String(totalItems)}</Text>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                </View>
              </View>
              <View style={[styles.headerInnerDivider, isDark ? styles.headerInnerDividerDark : null]} />
              <View style={styles.searchWrap}>
                <LinearGradient
                  colors={["rgba(201, 162, 39, 0.65)", "rgba(116, 79, 28, 0.45)", "rgba(201, 162, 39, 0.4)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.searchGradientFrame}
                >
                  <View style={[styles.searchInner, { backgroundColor: isDark ? c.surface : ALCHEMY.cardBg }]}>
                    <QCommerceSearchField
                      premium
                      value={query}
                      onChangeText={setQuery}
                      onClear={() => setQuery("")}
                      placeholder={SEARCH_PLACEHOLDER}
                    />
                  </View>
                </LinearGradient>
              </View>
              {isAuthenticated ? (
                <View style={styles.homeLocationWrap}>
                  <LocationBar
                    addressLine={deliveryLine1}
                    city={deliveryCity}
                    onPress={() => navigation.navigate("ManageAddress")}
                  />
                </View>
              ) : null}
            </View>
          ) : null}

          {Platform.OS === "web" && windowWidth >= 1100 && showMarketing ? (
            <View ref={webHeroRef}>
              <HomeEditorialHero navigation={navigation} featuredProduct={products[0]} />
            </View>
          ) : (
            <HomeMarketingHero
              goToHeroSlide={goToHeroSlide}
              handleHeroSlideAction={handleHeroSlideAction}
              heroSlideHeight={heroSlideHeight}
              heroSlideIndex={heroSlideIndex}
              heroSliderRef={heroSliderRef}
              heroSliderWidth={heroSliderWidth}
              heroSlides={heroSlides}
              homeViewConfig={homeViewConfig}
              isDark={isDark}
              reducedMotion={reducedMotion}
              setHeroSlideIndex={setHeroSlideIndex}
              setHeroSliderWidth={setHeroSliderWidth}
              showMarketing={showMarketing}
              styles={styles}
              webHeroRef={webHeroRef}
            />
          )}

          {query.trim() ? (
            <TouchableOpacity style={styles.activeFilterBar} onPress={() => setQuery("")} activeOpacity={0.85}>
              <Ionicons name="search-outline" size={icon.xs} color={c.primary} />
              <Text style={styles.activeFilterText} numberOfLines={1}>
                “{query.trim()}”
              </Text>
              <Text style={styles.activeFilterClear}>Clear</Text>
            </TouchableOpacity>
          ) : null}
          {sectionFilter ? (
            <TouchableOpacity style={styles.sectionFilterBar} onPress={clearSectionFilter} activeOpacity={0.85}>
              <Ionicons name="layers-outline" size={icon.xs} color={c.secondary} />
              <Text style={styles.activeFilterText} numberOfLines={1}>
                {sectionFilter}
              </Text>
              <Text style={styles.sectionFilterClear}>Clear</Text>
            </TouchableOpacity>
          ) : null}
          {error ? (
            <View
              style={[
                styles.homeErrorBanner,
                {
                  borderColor: isDark ? "rgba(248, 113, 113, 0.35)" : "rgba(220, 38, 38, 0.28)",
                  backgroundColor: isDark ? "rgba(220, 38, 38, 0.14)" : "rgba(220, 38, 38, 0.07)"},
              ]}
            >
              <Ionicons name="alert-circle-outline" size={icon.md} color={c.danger} style={styles.homeErrorIcon} />
              <Text style={[styles.errorText, { color: c.textPrimary }]}>{error}</Text>
            </View>
          ) : null}
        </View>

        {showMarketing && !query.trim() ? (
          <HomeTrustStrip
            c={c}
            forwardedRef={webTrustRef}
            isDark={isDark}
            reducedMotion={reducedMotion}
            styles={styles}
            trustVisualDense={trustVisualDense}
          />
        ) : null}

        {showMarketing && !query.trim() ? (
          <GoldHairline marginVertical={spacing.md} withDot />
        ) : null}

        {showMarketing && !query.trim() ? <HomeMarqueeTicker /> : null}

        {showMarketing && !query.trim() && products.length > 0 ? (
          <HomeCategoryCards
            products={products}
            onBrowse={(label) => {
              setSectionFilter(label);
              if (Platform.OS === "web") {
                smoothScrollToAnchor("home-catalog");
              }
            }}
          />
        ) : null}

        {isAuthenticated && liveOrder ? (
          <View style={styles.liveOrderWrap}>
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(201, 162, 39, 0.2)", "rgba(24, 21, 19, 0.92)"]
                  : ["rgba(255, 252, 246, 0.98)", "rgba(255, 248, 232, 0.94)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.liveOrderCard}
            >
              <Text style={styles.liveOrderOverline}>{HOME_LIVE_ORDER_CARD.overline}</Text>
              <Text style={styles.liveOrderTitle}>
                {String(liveOrder?.status || "") === "out_for_delivery"
                  ? HOME_LIVE_ORDER_CARD.title
                  : HOME_LIVE_ORDER_CARD.fallbackHint}
              </Text>
              <View style={styles.liveOrderMetaRow}>
                <View style={[styles.liveOrderStatusPill, { borderColor: c.primaryBorder }]}>
                  <Text style={[styles.liveOrderStatusText, { color: c.primaryDark }]}>
                    {getOrderStatusLabel(liveOrder?.status)}
                  </Text>
                </View>
                <Text style={styles.liveOrderAmount}>{formatINR(Number(liveOrder?.totalPrice || 0))}</Text>
              </View>
              <View style={styles.liveOrderActions}>
                <TouchableOpacity
                  style={[styles.liveOrderBtn, styles.liveOrderBtnPrimary]}
                  onPress={() => navigation.navigate("MyOrders")}
                  activeOpacity={0.9}
                >
                  <Text style={styles.liveOrderBtnPrimaryText}>{HOME_LIVE_ORDER_CARD.ctaPrimary}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.liveOrderBtn, styles.liveOrderBtnGhost]}
                  onPress={() => navigation.navigate("MyOrders")}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.liveOrderBtnGhostText, { color: c.textPrimary }]}>
                    {HOME_LIVE_ORDER_CARD.ctaSecondary}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ) : null}

        {totalMatches > 0 ? (
          <View
            onLayout={(e) => {
              featuredYRef.current = e.nativeEvent.layout.y;
            }}
          >
            {!query.trim() && !loading && homeCatalogCount > 0 ? (
              <React.Fragment>
                {Platform.OS === "web" && windowWidth >= 1280 ? (
                  <View style={styles.jumpNavSticky} nativeID="home-jump-nav">
                    <View style={styles.jumpNavInner}>
                      {[
                        { id: "home-hero", label: "Top" },
                        { id: "home-trust", label: "Why us" },
                        { id: "home-catalog", label: "Catalog" },
                        { id: "home-sections", label: "Collections" },
                      ].map((item) => {
                        const isActive = activeJumpId === item.id;
                        return (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => smoothScrollToAnchor(item.id)}
                            accessibilityRole="link"
                            accessibilityLabel={`Jump to ${item.label}`}
                            accessibilityState={{ selected: isActive }}
                            style={[styles.jumpNavChip, isActive ? styles.jumpNavChipActive : null]}
                          >
                            {isActive ? <View style={styles.jumpNavDot} /> : null}
                            <Text
                              style={[
                                styles.jumpNavChipText,
                                isActive ? styles.jumpNavChipTextActive : null,
                              ]}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
                <View nativeID="home-catalog" style={styles.shopDiscoverySection}>
                  <Text style={[styles.homeSectionOverline, styles.homeShopOverline, { color: c.textMuted }]}>
                    {HOME_PAGE_LABELS.shopOverline}
                  </Text>
                  {String(HOME_PAGE_LABELS.shopHint || "").trim() ? (
                    <Text style={[styles.shopDiscoveryHint, { color: c.textSecondary }]} numberOfLines={2}>
                      {HOME_PAGE_LABELS.shopHint.trim()}
                    </Text>
                  ) : null}
                  <Text style={[styles.shopDiscoveryIntro, { color: c.textPrimary }]}>
                    {collectionTab === "starter" ? HOME_CATALOG_INTRO.starter : HOME_CATALOG_INTRO.all}
                  </Text>
                  <View style={[styles.catalogBrowseBar, isDark ? styles.catalogBrowseBarDark : styles.catalogBrowseBarLight]}>
                    <Pressable
                      onPress={() => {
                        setCollectionTab("all");
                        focusCatalog();
                      }}
                      style={({ pressed, hovered }) => [
                        styles.catalogBrowseOption,
                        collectionTab === "all" ? styles.catalogBrowseOptionActive : null,
                        hovered && Platform.OS === "web" ? styles.catalogBrowseOptionHover : null,
                        pressed && styles.catalogBrowseOptionPressed,
                      ]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: collectionTab === "all" }}
                    >
                      <Ionicons
                        name="grid-outline"
                        size={icon.sm}
                        color={collectionTab === "all" ? c.primaryDark : c.textMuted}
                      />
                      <Text style={[styles.catalogBrowseTitle, { color: c.textPrimary }]}>Full catalog</Text>
                      <Text style={[styles.catalogBrowseSub, { color: c.textSecondary }]}>
                        {homeCatalogCount} {homeCatalogCount === 1 ? "item" : "items"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCollectionTab("starter");
                        focusCatalog();
                      }}
                      style={({ pressed, hovered }) => [
                        styles.catalogBrowseOption,
                        collectionTab === "starter" ? styles.catalogBrowseOptionActive : null,
                        hovered && Platform.OS === "web" ? styles.catalogBrowseOptionHover : null,
                        pressed && styles.catalogBrowseOptionPressed,
                      ]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: collectionTab === "starter" }}
                    >
                      <Ionicons
                        name="sparkles-outline"
                        size={icon.sm}
                        color={collectionTab === "starter" ? c.secondaryDark : c.textMuted}
                      />
                      <Text style={[styles.catalogBrowseTitle, { color: c.textPrimary }]}>Starter picks</Text>
                      <Text style={[styles.catalogBrowseSub, { color: c.textSecondary }]}>
                        Top {starterShownCount} for first order
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </React.Fragment>
            ) : null}
            {sectionFilter && sectionsForRender.length === 0 ? (
              <View style={[styles.catalogSurface, styles.emptySectionHint]}>
                <PremiumEmptyState
                  iconName="layers-outline"
                  title={`No section named “${sectionFilter}”.`}
                  description="Pick another section or clear the filter to see the full catalog."
                  ctaLabel="Clear filter"
                  ctaIconLeft="close-circle-outline"
                  onCtaPress={clearSectionFilter}
                  compact
                />
              </View>
            ) : homeViewConfig.showHomeSections && sectionsForRender.length > 0 ? (
              <View nativeID="home-sections">
              {sectionsForRender.map((section, sIdx) => (
                <Animated.View
                  key={section.title}
                  style={styles.listSection}
                  entering={
                    Platform.OS === "web" || reducedMotion
                      ? undefined
                      : FadeInDown.delay(Math.min(sIdx * 72, 400)).duration(420)
                  }
                >
                  <View ref={(node) => setWebCatalogRef(sIdx, node)} style={styles.catalogSurface}>
                    <HomeSectionHeader
                      overline={sIdx === 0 ? "Curated for you" : "Featured shelf"}
                      title={section.title}
                      count={section.items.length}
                      onSeeAll={
                        section.items.length > 3
                          ? () =>
                              navigation.navigate({
                                name: "Home",
                                merge: true,
                                params: { filterHomeSection: String(section.title).trim() }})
                          : undefined
                      }
                    />
                    {renderCatalogItems(section.items, `sec-${section.title}`)}
                  </View>
                </Animated.View>
              ))}
              </View>
            ) : (
              <Animated.View
                nativeID="home-sections"
                collapsable={false}
                style={styles.listSection}
                entering={Platform.OS === "web" || reducedMotion ? undefined : FadeInDown.delay(80).duration(440)}
              >
                <View ref={(node) => setWebCatalogRef(0, node)} style={styles.catalogSurface}>
                  <HomeSectionHeader
                    overline={homeViewConfig.showPrimeSection ? "Prime selection" : "All products"}
                    title={homeViewConfig.showPrimeSection ? homeViewConfig.primeSectionTitle : "Shop"}
                    count={productsForHome.length}
                  />
                  {renderCatalogItems(productsForHome, "shop")}
                </View>
              </Animated.View>
            )}
          </View>
        ) : (
          <View ref={(node) => setWebCatalogRef(0, node)} style={[styles.catalogSurface, styles.emptyWrap]}>
            {loading ? (
              <PremiumLoader size="md" caption="Loading catalog…" />
            ) : (
              <PremiumEmptyState
                iconName={query.trim() ? "search-outline" : "cube-outline"}
                title={
                  filteredProducts.length > 0 && productsForHome.length === 0
                    ? "Nothing curated for Home yet"
                    : query.trim()
                      ? "No products match your search"
                      : "Catalog is empty"
                }
                description={
                  filteredProducts.length > 0 && productsForHome.length === 0
                    ? "Ask admin to enable “Show on Home” for products to feature them here."
                    : query.trim()
                      ? `Try a different keyword — or browse the full collection.`
                      : "Add items or adjust filters to see the catalog."
                }
                ctaLabel={query.trim() ? "Clear search" : undefined}
                ctaIconLeft={query.trim() ? "close-circle-outline" : undefined}
                onCtaPress={query.trim() ? () => setQuery("") : undefined}
              />
            )}
          </View>
        )}

        {Platform.OS === "web" ? (
          <View style={[styles.footerFadeBridge, styles.peNone]}>
            <LinearGradient
              colors={[
                "rgba(0,0,0,0)",
                isDark ? "rgba(8, 6, 5, 0.42)" : "rgba(116, 79, 28, 0.04)",
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}

        {showMarketing && !query.trim() && products[0] ? (
          <HomeFeaturedEditorial product={products[0]} navigation={navigation} />
        ) : null}

        <View ref={webFooterRef} style={styles.footerWrapper}>
          <HomePageFooter colors={c} />
        </View>
        </MotionScrollView>
        <BottomNavBar />
      </LinearGradient>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
        statusBarTranslucent={Platform.OS === "android"}
        {...(Platform.OS === "ios" ? { presentationStyle: "overFullScreen" } : {})}
      >
        <View style={styles.menuModalRoot}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuOpen(false)}
            accessibilityLabel="Close menu"
          />
          <View style={[styles.menuLayer, styles.peBoxNone]}>
            <View
              style={[
                styles.menuDropdown,
                {
                  top:
                    Math.max(insets.top, Platform.OS === "web" ? spacing.md : spacing.sm) + HOME_MENU_TOP_OFFSET,
                  left: spacing.lg,
                  backgroundColor: isDark ? c.surface : ALCHEMY.cardBg,
                  borderColor: isDark ? c.border : ALCHEMY.pillInactive},
              ]}
              collapsable={false}
            >
              <LinearGradient
                colors={[ALCHEMY.gold, ALCHEMY.brown]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.menuGoldAccent}
              />
              <View style={styles.menuHeaderRow}>
                <Text style={[styles.menuHeaderTitle, { color: c.textPrimary }]}>Menu</Text>
                <Pressable
                  onPress={() => setMenuOpen(false)}
                  style={({ pressed }) => [styles.menuCloseBtn, pressed && { opacity: 0.7 }]}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close menu"
                >
                  <Ionicons name="close" size={icon.lg} color={c.textSecondary} />
                </Pressable>
              </View>
              <Text style={[styles.menuSectionLabel, { color: c.textMuted }]}>Shop</Text>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.menuRow,
                  ...(collectionTab === "all"
                    ? [
                        styles.menuRowSelected,
                        { backgroundColor: isDark ? "rgba(201, 162, 39, 0.12)" : ALCHEMY.creamDeep },
                        { borderColor: isDark ? c.primaryBorder : ALCHEMY.pillInactive },
                      ]
                    : []),
                  hovered && Platform.OS === "web" ? styles.menuRowHover : null,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={() => {
                  setCollectionTab("all");
                  setMenuOpen(false);
                  requestAnimationFrame(() => scrollToFeatured());
                }}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt }]}>
                  <Ionicons name="flame-outline" size={icon.md} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </View>
                <View style={styles.menuRowTextCol}>
                  <Text style={[styles.menuRowTitle, { color: c.textPrimary }]}>All Ghee</Text>
                  <Text style={[styles.menuRowValue, { color: c.textSecondary }]}>
                    {homeCatalogCount} {homeCatalogCount === 1 ? "item" : "items"}
                  </Text>
                </View>
                {collectionTab === "all" ? (
                  <View style={[styles.menuPillActive, { backgroundColor: c.secondarySoft, borderColor: c.secondaryBorder }]}>
                    <Text style={[styles.menuPillActiveText, { color: c.secondaryDark }]}>Active</Text>
                  </View>
                ) : (
                  <View style={styles.menuCheckPlaceholder} />
                )}
              </Pressable>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.menuRow,
                  ...(collectionTab === "starter"
                    ? [
                        styles.menuRowSelected,
                        { backgroundColor: isDark ? "rgba(201, 162, 39, 0.12)" : ALCHEMY.creamDeep },
                        { borderColor: isDark ? c.primaryBorder : ALCHEMY.pillInactive },
                      ]
                    : []),
                  hovered && Platform.OS === "web" ? styles.menuRowHover : null,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={() => {
                  setCollectionTab("starter");
                  setMenuOpen(false);
                  requestAnimationFrame(() => scrollToFeatured());
                }}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt }]}>
                  <Ionicons name="water-outline" size={icon.md} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </View>
                <View style={styles.menuRowTextCol}>
                  <Text style={[styles.menuRowTitle, { color: c.textPrimary }]}>My First Drop</Text>
                  <Text style={[styles.menuRowValue, { color: c.textSecondary }]}>
                    {starterShownCount} curated picks
                  </Text>
                </View>
                {collectionTab === "starter" ? (
                  <View style={[styles.menuPillActive, { backgroundColor: c.secondarySoft, borderColor: c.secondaryBorder }]}>
                    <Text style={[styles.menuPillActiveText, { color: c.secondaryDark }]}>Active</Text>
                  </View>
                ) : (
                  <View style={styles.menuCheckPlaceholder} />
                )}
              </Pressable>
              <View style={[styles.menuDivider, { backgroundColor: c.border }]} />
              <Text style={[styles.menuSectionLabel, { color: c.textMuted }]}>Account</Text>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.menuRow,
                  hovered && Platform.OS === "web" ? styles.menuRowHover : null,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={() => {
                  setMenuOpen(false);
                  navigateCustomerRoute(navigation, "Profile");
                }}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt }]}>
                  <Ionicons name="person-outline" size={icon.md} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </View>
                <View style={styles.menuRowTextCol}>
                  <Text style={[styles.menuRowTitle, { color: c.textPrimary }]}>Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={icon.sm} color={c.textMuted} />
              </Pressable>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.menuRow,
                  hovered && Platform.OS === "web" ? styles.menuRowHover : null,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("MyOrders");
                }}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt }]}>
                  <Ionicons name="receipt-outline" size={icon.md} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </View>
                <View style={styles.menuRowTextCol}>
                  <Text style={[styles.menuRowTitle, { color: c.textPrimary }]}>My orders</Text>
                </View>
                <Ionicons name="chevron-forward" size={icon.sm} color={c.textMuted} />
              </Pressable>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.menuRow,
                  hovered && Platform.OS === "web" ? styles.menuRowHover : null,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Support");
                }}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt }]}>
                  <Ionicons name="help-circle-outline" size={icon.md} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </View>
                <View style={styles.menuRowTextCol}>
                  <Text style={[styles.menuRowTitle, { color: c.textPrimary }]}>Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={icon.sm} color={c.textMuted} />
              </Pressable>
              <Pressable
                style={({ pressed, hovered }) => [
                  styles.menuRow,
                  hovered && Platform.OS === "web" ? styles.menuRowHover : null,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Settings");
                }}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt }]}>
                  <Ionicons name="settings-outline" size={icon.md} color={isDark ? c.textPrimary : ALCHEMY.brown} />
                </View>
                <View style={styles.menuRowTextCol}>
                  <Text style={[styles.menuRowTitle, { color: c.textPrimary }]}>Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={icon.sm} color={c.textMuted} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createHomeStyles(c, shadowLift, shadowPremium, isDark) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      width: "100%",
      alignSelf: "stretch",
      maxWidth: "100%"},
    gradientFill: {
      flex: 1,
      width: "100%"},
    scrollMain: {
      flex: 1,
      width: "100%"},
    headerWrap: {
      paddingBottom: Platform.select({ web: spacing.md + 4, default: spacing.sm + 4 })},
    headerAmbientCard: {
      position: "relative",
      borderRadius: radius.xxl,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? "rgba(232, 200, 90, 0.42)" : "rgba(201, 162, 39, 0.42)",
      marginBottom: spacing.md + 4,
      ...Platform.select({
        ios: {
          shadowColor: "#3D2A12",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.22 : 0.09,
          shadowRadius: 20},
        android: { elevation: isDark ? 5 : 4 },
        web: {
          boxShadow: isDark
            ? "0 16px 44px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 18px 48px rgba(61, 42, 18, 0.11), 0 5px 16px rgba(28, 25, 23, 0.045), inset 0 1px 0 rgba(255, 253, 251, 0.95), inset 0 0 0 1px rgba(255,255,255,0.45)"},
        default: {}})},
    headerAmbientCardLight: {
      borderColor: "rgba(100, 116, 139, 0.16)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      ...Platform.select({
        web: {
          backdropFilter: "blur(20px)"},
        default: {}})},
    headerAmbientCardDark: {
      borderColor: "rgba(201, 162, 39, 0.2)",
      backgroundColor: "rgba(28, 25, 23, 0.58)"},
    headerAmbientSheen: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 112,
      opacity: isDark ? 0.12 : 0.2},
    topBarShellNested: {
      paddingTop: 4,
      paddingBottom: 2,
      paddingHorizontal: spacing.xs},
    headerInnerDivider: {
      height: StyleSheet.hairlineWidth,
      marginHorizontal: spacing.lg,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
      backgroundColor: "rgba(116, 79, 28, 0.12)"},
    headerInnerDividerDark: {
      backgroundColor: "rgba(255, 255, 255, 0.1)"},
    cartBtnInner: {
      width: 44,
      minHeight: 40,
      alignItems: "center",
      justifyContent: "center",
      position: "relative"},
    cartBadge: {
      position: "absolute",
      top: 2,
      right: 0,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2},
    cartBadgeText: {
      color: "#FFFCF8",
      fontSize: 10,
      fontFamily: fonts.extrabold,
      lineHeight: 12},
    alchemyTopBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.xs + 2,
      minHeight: BRAND_LOGO_SIZE.homeTopBar + spacing.sm},
    wordmarkBlock: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "stretch",
      paddingHorizontal: spacing.xs,
      minWidth: 0,
      minHeight: BRAND_LOGO_SIZE.homeTopBar + spacing.sm + 14,
      overflow: "visible"},
    topBarTagline: {
      marginTop: -2,
      fontSize: typography.overline,
      fontFamily: fonts.semibold,
      letterSpacing: 0.6,
      textAlign: "center"},
    topBarLogo: {
      flexShrink: 0,
      alignSelf: "center",
      transform: [{ scale: 1.08 }],
      ...Platform.select({
        ios: {
          shadowColor: "#3D2A12",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3},
        web: {
          boxShadow: "0 2px 8px rgba(61, 42, 18, 0.08)"},
        default: {}})},
    alchemyIconBtn: {
      width: 44,
      minHeight: 42,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(100, 116, 139, 0.16)",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255, 255, 255, 0.88)",
      ...Platform.select({
        web: { cursor: "pointer" },
        default: {}})},
    searchWrap: {
      marginTop: 0,
      marginBottom: spacing.sm + 2,
      paddingHorizontal: spacing.sm},
    homeLocationWrap: {
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.sm + 2},
    searchGradientFrame: {
      borderRadius: 999,
      padding: 2,
      ...Platform.select({
        ios: {
          shadowColor: ALCHEMY.brown,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.2 : 0.14,
          shadowRadius: 16},
        android: { elevation: isDark ? 5 : 4 },
        web: {
          boxShadow: isDark
            ? "0 12px 40px rgba(0,0,0,0.35)"
            : "0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.05)"},
        default: {}})},
    searchInner: {
      borderRadius: 999,
      overflow: "hidden"},
    heroImageOuter: {
      marginBottom: Platform.select({ web: spacing.xl + 12, default: spacing.xl + 8 }),
      borderRadius: radius.xxl,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(100, 116, 139, 0.14)",
      borderTopWidth: 3,
      borderTopColor: isDark ? "rgba(201, 162, 39, 0.55)" : "rgba(201, 162, 39, 0.75)",
      ...Platform.select({
        web: {
          width: "100%",
          maxWidth: layout.maxContentWidth,
          alignSelf: "center",
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25)"
            : "0 20px 42px rgba(15, 23, 42, 0.11), 0 6px 14px rgba(15, 23, 42, 0.06)"},
        ios: {
          shadowColor: "#1a1208",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: isDark ? 0.4 : 0.2,
          shadowRadius: 24},
        android: { elevation: isDark ? 8 : 5 },
        default: {}})},
    heroSlider: {
      width: "100%"},
    heroPremiumFill: {
      position: "relative",
      width: "100%",
      justifyContent: "flex-end",
      backgroundColor: "#141210",
      overflow: "hidden"},
    heroPhoto: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%"},
    heroDotsPill: {
      position: "absolute",
      bottom: Platform.select({ web: 20, default: 16 }),
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 4},
    heroDotBackdrop: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.pill,
      backgroundColor: "rgba(10, 8, 6, 0.5)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 252, 248, 0.14)",
      ...Platform.select({
        web: {
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"},
        default: {}})},
    heroDotRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8},
    heroDotHit: {
      padding: 4,
      ...Platform.select({
        web: { cursor: "pointer" },
        default: {}})},
    heroDot: {
      width: 7,
      height: 7,
      borderRadius: 4},
    heroDotIdle: {
      backgroundColor: "rgba(255, 252, 248, 0.28)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 252, 248, 0.2)"},
    heroDotActive: {
      backgroundColor: ALCHEMY.goldBright,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 252, 248, 0.55)",
      transform: [{ scale: 1.15 }]},
    heroBrandLogo: {
      alignSelf: "flex-start",
      marginBottom: spacing.sm},
    heroBrandLogoOnPhoto: {
      opacity: 0.98},
    heroImageInner: {
      position: "relative",
      zIndex: 2,
      paddingTop: Platform.select({ web: spacing.xxl + 8, default: spacing.xl + 4 }),
      paddingHorizontal: Platform.select({ web: spacing.xxl + 8, default: spacing.lg + 4 }),
      paddingBottom: Platform.select({ web: 88, default: 76 })},
    heroGoldHairline: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      opacity: 0.95,
      zIndex: 3},
    heroSlideCounter: {
      position: "absolute",
      top: Platform.select({ web: spacing.lg + 4, default: spacing.md + 4 }),
      right: spacing.md + 4,
      zIndex: 4,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.pill,
      backgroundColor: "rgba(8, 6, 4, 0.52)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 252, 248, 0.22)",
      ...Platform.select({
        web: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"},
        default: {}})},
    heroSlideCounterText: {
      color: "#FFFCF8",
      fontSize: typography.caption,
      fontFamily: fonts.extrabold,
      letterSpacing: 1.2,
      fontVariant: ["tabular-nums"]},
    heroSlideCounterSep: {
      color: "rgba(255, 252, 248, 0.55)",
      fontFamily: fonts.semibold,
      letterSpacing: 0},
    heroEditorialRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.sm + 2,
      maxWidth: 560},
    heroKickerText: {
      color: "rgba(255, 252, 248, 0.92)",
      fontSize: typography.overline + 1,
      fontFamily: fonts.extrabold,
      letterSpacing: 2,
      textTransform: "uppercase",
      ...Platform.select({
        web: { textShadow: "0 1px 12px rgba(8, 6, 4, 0.55)" },
        default: {
          textShadowColor: "rgba(8, 6, 4, 0.55)",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 10}})},
    heroBadgePill: {
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(231, 200, 90, 0.55)",
      backgroundColor: "rgba(201, 162, 39, 0.22)"},
    heroBadgePillText: {
      color: "#FFF8E8",
      fontSize: typography.overline,
      fontFamily: fonts.extrabold,
      letterSpacing: 1.2},
    heroDisplayTitle: {
      fontFamily: FONT_DISPLAY,
      fontSize: Platform.OS === "web" ? 48 : 36,
      lineHeight: Platform.OS === "web" ? 54 : 42,
      letterSpacing: Platform.OS === "web" ? -0.85 : -0.7,
      marginBottom: spacing.sm,
      maxWidth: 700,
      ...Platform.select({
        web: {
          textShadow: isDark
            ? "0 2px 28px rgba(8, 6, 4, 0.45)"
            : "0 2px 14px rgba(255, 255, 255, 0.6)"},
        default: {
          textShadowColor: isDark ? "rgba(8, 6, 4, 0.45)" : "rgba(255, 255, 255, 0.6)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: isDark ? 18 : 10}})},
    heroDisplayOnPhoto: {
      color: "#FFFCF8",
      ...Platform.select({
        web: { textShadow: "0 2px 22px rgba(8, 6, 4, 0.65)" },
        default: {
          textShadowColor: "rgba(8, 6, 4, 0.65)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 16}})},
    heroDisplaySub: {
      marginTop: spacing.sm,
      fontSize: Platform.OS === "web" ? typography.body + 2 : typography.body + 1,
      fontFamily: fonts.medium,
      lineHeight: Platform.OS === "web" ? 30 : 26,
      maxWidth: 620,
      opacity: 0.96,
      ...Platform.select({
        web: { textShadow: "0 1px 10px rgba(8, 6, 4, 0.35)" },
        default: {
          textShadowColor: "rgba(8, 6, 4, 0.35)",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 10}})},
    heroDisplaySubOnPhoto: {
      color: "rgba(255, 252, 248, 0.94)",
      ...Platform.select({
        web: { textShadow: "0 1px 12px rgba(8, 6, 4, 0.55)" },
        default: {
          textShadowColor: "rgba(8, 6, 4, 0.55)",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 12}})},
    heroCtaWrap: {
      marginTop: spacing.xl + 4,
      alignSelf: "flex-start",
      borderRadius: radius.pill,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 252, 248, 0.32)",
      ...Platform.select({
        ios: {
          shadowColor: "#1a1208",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 14},
        android: { elevation: 6 },
        web: {
          boxShadow: "0 14px 36px rgba(26, 18, 8, 0.38)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease"},
        default: {}})},
    heroCtaWrapHover: {
      ...Platform.select({
        web: {
          transform: [{ translateY: -2 }],
          boxShadow: "0 20px 48px rgba(26, 18, 8, 0.5)"},
        default: {}})},
    heroCtaGradient: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: Platform.select({ web: 17, default: 16 }),
      paddingHorizontal: Platform.select({ web: spacing.xxl + 8, default: spacing.xxl + 4 }),
      borderRadius: radius.pill},
    heroBrownCtaText: {
      color: "#FFFCF8",
      fontFamily: fonts.bold,
      fontSize: typography.body,
      letterSpacing: 0.35},
    promoVideoWrap: {
      width: "100%",
      maxWidth: layout.maxContentWidth,
      alignSelf: "center",
      marginBottom: spacing.xl + 8,
      borderRadius: radius.xxl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(100, 116, 139, 0.14)",
      borderTopWidth: 3,
      borderTopColor: isDark ? "rgba(201, 162, 39, 0.55)" : "rgba(201, 162, 39, 0.75)",
      backgroundColor: "#110B07",
      padding: Platform.OS === "web" ? 10 : 8,
      ...Platform.select({
        web: {
          boxShadow: isDark
            ? "0 28px 72px rgba(0,0,0,0.56), 0 8px 26px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 20px 48px rgba(15, 23, 42, 0.14), 0 7px 18px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.76)"},
        ios: {
          shadowColor: "#1a1208",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.36 : 0.18,
          shadowRadius: 18},
        android: { elevation: isDark ? 6 : 4 },
        default: {}})},
    promoVideoFrame: {
      borderRadius: radius.xl + 2,
      overflow: "hidden",
      backgroundColor: "#0A0705",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(255, 252, 248, 0.14)" : "rgba(255, 252, 248, 0.24)",
      ...Platform.select({
        web: {
          boxShadow: isDark
            ? "inset 0 0 0 1px rgba(255, 252, 248, 0.08)"
            : "inset 0 0 0 1px rgba(255, 252, 248, 0.4)"},
        default: {}})},
    promoVideo: {
      width: "100%",
      height: Platform.OS === "web" ? 400 : 260,
      backgroundColor: "#120D08"},
    promoSheen: {
      ...StyleSheet.absoluteFillObject},
    promoMuteBtn: {
      position: "absolute",
      right: spacing.md,
      bottom: spacing.md,
      zIndex: 3,
      minHeight: 44,
      paddingHorizontal: spacing.sm + 2,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: "rgba(255, 252, 248, 0.48)",
      backgroundColor: "rgba(12, 9, 7, 0.66)",
      ...Platform.select({
        web: {
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(8, 6, 4, 0.5), inset 0 1px 0 rgba(255, 252, 248, 0.28)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"},
        default: {}})},
    promoMuteText: {
      color: "#FFFCF8",
      fontSize: typography.overline + 1,
      fontFamily: fonts.extrabold,
      letterSpacing: 0.35,
      textTransform: "uppercase"},
    promoMuteBtnAttention: {
      borderColor: "rgba(255, 252, 248, 0.76)",
      backgroundColor: "rgba(12, 9, 7, 0.78)",
      ...Platform.select({
        web: {
          boxShadow: "0 10px 24px rgba(8, 6, 4, 0.56), inset 0 1px 0 rgba(255, 252, 248, 0.4)"},
        default: {}})},
    jumpNavSticky: {
      alignSelf: "center",
      marginBottom: spacing.md,
      ...Platform.select({
        web: {
          position: "sticky",
          top: WEB_HEADER_HEIGHT + 8,
          zIndex: 11},
        default: {}})},
    jumpNavInner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 9999,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(232, 200, 90, 0.22)" : "rgba(116, 79, 28, 0.16)",
      backgroundColor: isDark ? "rgba(15, 12, 10, 0.72)" : "rgba(255, 252, 247, 0.86)",
      ...Platform.select({
        web: {
          backdropFilter: "saturate(160%) blur(14px)",
          WebkitBackdropFilter: "saturate(160%) blur(14px)",
          boxShadow: isDark
            ? "0 12px 28px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 10px 24px rgba(116, 79, 28, 0.12), inset 0 1px 0 rgba(255,255,255,0.7)"},
        default: {}})},
    jumpNavChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
      borderRadius: 9999,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "transparent",
      backgroundColor: "transparent",
      ...Platform.select({
        web: {
          cursor: "pointer",
          transitionProperty: "transform, background-color, color, border-color",
          transitionDuration: "180ms"},
        default: {}})},
    jumpNavChipActive: {
      backgroundColor: isDark ? "rgba(232, 200, 90, 0.16)" : c.primarySoft,
      borderColor: isDark ? "rgba(232, 200, 90, 0.42)" : c.primaryBorder,
      ...Platform.select({
        web: {
          boxShadow: isDark
            ? "0 6px 14px rgba(232, 200, 90, 0.16)"
            : "0 6px 14px rgba(116, 79, 28, 0.14)"},
        default: {}})},
    jumpNavDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: isDark ? ALCHEMY.goldBright : c.primary},
    jumpNavChipTextActive: {
      color: isDark ? ALCHEMY.goldBright : c.primaryDark},
    jumpNavChipText: {
      fontSize: typography.caption,
      fontFamily: fonts.bold,
      color: isDark ? c.textPrimary : ALCHEMY.brown,
      letterSpacing: 0.4},
    trustSectionWrap: {
      width: "100%",
      marginTop: spacing.md,
      marginBottom: Platform.OS === "web" ? spacing.xl : spacing.xxl,
      alignItems: "center",
      ...Platform.select({
        web: {
          maxWidth: layout.maxContentWidth,
          alignSelf: "center"},
        default: {}})},
    liveOrderWrap: {
      width: "100%",
      marginBottom: spacing.lg,
      ...Platform.select({
        web: {
          maxWidth: layout.maxContentWidth,
          alignSelf: "center"},
        default: {}})},
    liveOrderCard: {
      borderRadius: radius.xxl,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(232, 200, 90, 0.3)" : "rgba(116, 79, 28, 0.14)"},
    liveOrderOverline: {
      fontSize: typography.overline + 1,
      fontFamily: fonts.extrabold,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      color: isDark ? ALCHEMY.goldBright : ALCHEMY.brown,
      marginBottom: 4},
    liveOrderTitle: {
      fontSize: typography.body,
      fontFamily: fonts.bold,
      color: c.textPrimary,
      marginBottom: spacing.sm},
    liveOrderMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: spacing.sm},
    liveOrderStatusPill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: c.primarySoft},
    liveOrderStatusText: {
      fontSize: typography.caption,
      fontFamily: fonts.bold},
    liveOrderAmount: {
      fontSize: typography.body,
      fontFamily: fonts.extrabold,
      color: c.textPrimary},
    liveOrderActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm},
    liveOrderBtn: {
      flex: 1,
      borderRadius: radius.lg,
      paddingVertical: spacing.sm,
      alignItems: "center",
      justifyContent: "center"},
    liveOrderBtnPrimary: {
      backgroundColor: c.primary},
    liveOrderBtnPrimaryText: {
      color: c.onPrimary,
      fontSize: typography.bodySmall,
      fontFamily: fonts.bold},
    liveOrderBtnGhost: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? c.border : "rgba(116, 79, 28, 0.2)",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.64)"},
    liveOrderBtnGhostText: {
      fontSize: typography.bodySmall,
      fontFamily: fonts.semibold},
    trustSectionEyebrow: {
      fontSize: typography.overline + 1,
      fontFamily: fonts.extrabold,
      letterSpacing: 2,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: spacing.sm + 4,
      width: "100%"},
    homeSectionOverline: {
      fontSize: typography.overline + 1,
      fontFamily: fonts.extrabold,
      letterSpacing: 1.65,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: spacing.sm,
      width: "100%"},
    homeShopOverline: {
      marginBottom: spacing.xs + 2},
    shopDiscoveryHint: {
      fontSize: typography.caption,
      fontFamily: fonts.regular,
      lineHeight: lineHeight.caption + 4,
      textAlign: "center",
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.md,
      opacity: 0.92},
    shopDiscoveryIntro: {
      fontSize: typography.body,
      fontFamily: FONT_DISPLAY_SEMI,
      lineHeight: lineHeight.body + 4,
      textAlign: "center",
      marginBottom: spacing.md + 2,
      paddingHorizontal: spacing.sm,
      letterSpacing: -0.2},
    shopDiscoverySection: {
      width: "100%",
      ...Platform.select({
        web: {
          maxWidth: layout.maxContentWidth,
          alignSelf: "center"},
        default: {}}),
      marginBottom: spacing.xl + 4},
    trustStripAmbient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.xxl,
      opacity: Platform.OS === "web" ? 0.7 : 1},
    homeErrorBanner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.md + 4,
      marginBottom: spacing.md + 2,
      borderRadius: radius.lg + 2,
      borderWidth: StyleSheet.hairlineWidth,
      maxWidth: layout.maxContentWidth,
      width: "100%",
      alignSelf: "center"},
    homeErrorIcon: {
      marginTop: 2,
      flexShrink: 0},
    trustStrip: {
      position: "relative",
      overflow: "hidden",
      paddingVertical: spacing.md + 4,
      paddingHorizontal: spacing.sm + 4,
      borderRadius: radius.xxl,
      ...Platform.select({
        web: {
          width: "100%",
          maxWidth: layout.maxContentWidth,
          alignSelf: "center"},
        default: {}}),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(116, 79, 28, 0.14)",
      borderTopWidth: 2,
      borderTopColor: ALCHEMY.gold,
      ...Platform.select({
        ios: {
          shadowColor: "#3D2A12",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.22 : 0.07,
          shadowRadius: 18},
        android: { elevation: isDark ? 5 : 3 },
        web: {
          boxShadow: isDark
            ? "0 16px 40px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            : "0 12px 32px rgba(61, 42, 18, 0.07), 0 2px 10px rgba(28, 25, 23, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.92)"},
        default: {}})},
    trustStripDark: {
      borderColor: "rgba(201, 162, 39, 0.2)",
      borderTopColor: "rgba(232, 200, 90, 0.55)"},
    trustStripInk: {
      backgroundColor: "#19140f",
      borderColor: "rgba(255, 255, 255, 0.08)",
      borderTopWidth: 0,
      ...Platform.select({
        web: {
          boxShadow: "0 14px 38px -20px rgba(25, 20, 15, 0.28)"},
        default: {}})},
    trustStripInner: {
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "space-between",
      width: "100%",
      zIndex: 1},
    trustDivider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: "stretch",
      marginVertical: Platform.OS === "web" ? spacing.sm + 2 : spacing.xs + 2,
      flexShrink: 0,
      opacity: Platform.OS === "web" ? 0.6 : 1},
    trustDividerLight: {
      backgroundColor: "rgba(116, 79, 28, 0.16)"},
    trustDividerDark: {
      backgroundColor: "rgba(232, 200, 90, 0.28)"},
    trustCell: {
      flex: 1,
      minWidth: 0,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm - 2,
      paddingHorizontal: spacing.xxs,
      paddingVertical: spacing.xxs},
    trustIconBadge: {
      width: Platform.OS === "web" ? 42 : 44,
      height: Platform.OS === "web" ? 42 : 44,
      borderRadius: Platform.OS === "web" ? 21 : 22,
      alignItems: "center",
      justifyContent: "center"},
    trustIconBadgeLight: {
      backgroundColor: ALCHEMY.goldSoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(98, 64, 20, 0.1)",
      ...Platform.select({
        ios: {
          shadowColor: ALCHEMY.brown,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 4},
        default: {}})},
    trustIconBadgeDark: {
      backgroundColor: "rgba(201, 162, 39, 0.12)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(232, 200, 90, 0.18)"},
    trustCellLabel: {
      fontSize: typography.caption,
      fontFamily: fonts.semibold,
      textAlign: "center",
      lineHeight: lineHeight.caption,
      letterSpacing: 0.15,
      maxWidth: "100%"},
    trustCellLabelDense: {
      fontSize: typography.overline + 1,
      lineHeight: lineHeight.overline + 2,
      letterSpacing: 0.08},
    productListRow: {
      marginBottom: spacing.md,
      borderRadius: radius.xl + 4,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(116, 79, 28, 0.1)",
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255, 255, 255, 0.55)",
      ...Platform.select({
        ios: {
          shadowColor: "#3D2A12",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.14 : 0.05,
          shadowRadius: 10},
        android: { elevation: isDark ? 2 : 1 },
        web: {
          boxShadow: isDark
            ? "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 6px 18px rgba(28, 25, 23, 0.05), inset 0 1px 0 rgba(255,255,255,0.88)"},
        default: {}})},
    productListRowDivider: {
      marginBottom: spacing.lg},
    productListRowLast: {
      marginBottom: 0},
    heroCardCompact: {
      borderRadius: radius.xxl,
      paddingHorizontal: spacing.xl + 2,
      paddingVertical: spacing.xl + 2,
      marginBottom: spacing.lg + 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      borderTopWidth: 3,
      borderTopColor: isDark ? c.primaryBorder : ALCHEMY.gold,
      backgroundColor: isDark ? c.surface : ALCHEMY.cardBg,
      ...shadowPremium},
    heroTitle: {
      color: c.textPrimary,
      fontSize: typography.h2,
      fontFamily: FONT_DISPLAY,
      letterSpacing: -0.35},
    heroSubtext: {
      marginTop: 6,
      color: c.textSecondary,
      fontSize: typography.bodySmall,
      fontFamily: fonts.regular},
    activeFilterBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md + 2,
      paddingVertical: 13,
      paddingHorizontal: spacing.lg,
      backgroundColor: c.primarySoft,
      borderRadius: radius.xl + 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.primaryBorder,
      borderTopWidth: 2,
      borderTopColor: c.primary,
      ...shadowLift},
    activeFilterText: {
      flex: 1,
      color: c.textPrimary,
      fontSize: typography.bodySmall,
      fontFamily: fonts.semibold},
    activeFilterClear: {
      color: c.primary,
      fontSize: typography.caption,
      fontFamily: fonts.extrabold},
    sectionFilterBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md + 2,
      paddingVertical: 13,
      paddingHorizontal: spacing.lg,
      backgroundColor: c.secondarySoft,
      borderRadius: radius.xl + 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.secondaryBorder,
      borderTopWidth: 2,
      borderTopColor: c.secondary,
      ...shadowLift},
    sectionFilterClear: {
      color: c.secondary,
      fontSize: typography.caption,
      fontFamily: fonts.extrabold},
    catalogBrowseBar: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: 0,
      padding: Platform.select({ web: 10, default: 9 }),
      borderRadius: radius.xl + 6,
      borderWidth: StyleSheet.hairlineWidth,
      ...shadowLift,
      ...Platform.select({
        web: {
          width: "100%",
          maxWidth: layout.maxContentWidth,
          alignSelf: "center",
          userSelect: "none",
          boxShadow: isDark
            ? "0 14px 34px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 12px 28px rgba(61, 42, 18, 0.08), inset 0 1px 0 rgba(255,255,255,0.86)"},
        default: {}})},
    catalogBrowseBarLight: {
      borderColor: "rgba(116, 79, 28, 0.12)",
      backgroundColor: "rgba(255, 253, 249, 0.94)"},
    catalogBrowseBarDark: {
      borderColor: c.border,
      backgroundColor: c.surfaceMuted},
    catalogBrowseOption: {
      flex: 1,
      minWidth: 0,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Platform.select({ web: spacing.md + 2, default: spacing.md }),
      paddingHorizontal: spacing.sm,
      borderRadius: radius.lg + 2,
      gap: 5},
    catalogBrowseOptionActive: {
      backgroundColor: isDark ? "rgba(201, 162, 39, 0.16)" : "#FFFFFF",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? c.primaryBorder : ALCHEMY.pillInactive,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(232, 200, 90, 0.65)" : ALCHEMY.gold},
    catalogBrowseOptionHover: {
      backgroundColor: isDark ? "rgba(201, 162, 39, 0.1)" : "rgba(255,255,255,0.75)",
      ...Platform.select({
        web: {
          boxShadow: isDark
            ? "0 8px 18px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 8px 16px rgba(61, 42, 18, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)"},
        default: {}})},
    catalogBrowseOptionPressed: {
      opacity: 0.88},
    catalogBrowseTitle: {
      fontFamily: FONT_DISPLAY_SEMI,
      fontSize: 15,
      letterSpacing: 0.06,
      textAlign: "center"},
    catalogBrowseSub: {
      fontSize: 12,
      fontFamily: fonts.medium,
      textAlign: "center"},
    sectionChipsScroll: {
      marginBottom: spacing.xl,
      flexGrow: 0},
    sectionChipsContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingBottom: spacing.xs,
      paddingRight: spacing.lg},
    sectionChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      ...Platform.select({
        web: { cursor: "pointer" },
        default: {}})},
    sectionChipActive: {
      borderColor: c.primaryBorder,
      backgroundColor: c.primarySoft,
      borderTopWidth: 2,
      borderTopColor: c.primary},
    sectionChipLabel: {
      fontFamily: fonts.bold,
      fontSize: 13,
      maxWidth: 168},
    sectionChipCount: {
      fontSize: 11,
      fontFamily: fonts.extrabold},
    listSection: {
      marginBottom: Platform.select({ web: spacing.xl + 8, default: spacing.xxl })},
    catalogSurface: {
      overflow: "hidden",
      backgroundColor: isDark ? c.surface : ALCHEMY.cardBg,
      borderRadius: radius.xxl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? c.border : "rgba(100, 116, 139, 0.12)",
      borderTopWidth: 3,
      borderTopColor: isDark ? "rgba(232, 200, 90, 0.55)" : "rgba(201, 162, 39, 0.72)",
      paddingHorizontal: Platform.select({ web: spacing.xl + 6, default: spacing.md + 8 }),
      paddingTop: Platform.select({ web: spacing.lg + 4, default: spacing.lg + 8 }),
      paddingBottom: Platform.select({ web: spacing.lg + 6, default: spacing.xl + 6 }),
      ...Platform.select({
        web: {
          width: "100%",
          maxWidth: layout.maxContentWidth,
          alignSelf: "center"},
        default: {}}),
      ...Platform.select({
        ios: {
          shadowColor: "#3D2A12",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 18},
        android: { elevation: isDark ? 4 : 3 },
        web: {
          boxShadow: isDark
            ? "0 16px 42px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 12px 32px rgba(15, 23, 42, 0.07), 0 4px 12px rgba(61, 42, 18, 0.04), inset 0 1px 0 rgba(255,255,255,0.94)"},
        default: {}})},
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      marginBottom: spacing.md,
      paddingTop: 0,
      paddingBottom: Platform.select({ web: spacing.md + 4, default: spacing.md + 4 }),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(116, 79, 28, 0.08)"},
    sectionHeaderBlock: {
      flex: 1,
      minWidth: 0},
    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      flex: 1,
      minWidth: 0},
    sectionHeadingFlex: {
      flex: 1,
      minWidth: 0},
    sectionHeading: {
      fontSize: Platform.OS === "web" ? typography.h2 : typography.h2,
      lineHeight: Platform.OS === "web" ? 30 : 31,
      fontFamily: FONT_DISPLAY,
      color: c.textPrimary,
      letterSpacing: Platform.OS === "web" ? -0.45 : -0.32},
    sectionCountInline: {
      fontSize: typography.caption,
      fontFamily: fonts.extrabold,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: radius.pill,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(232, 200, 90, 0.18)" : c.primarySoft,
      color: isDark ? ALCHEMY.goldBright : c.primaryDark},
    sectionSeeAllBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      ...Platform.select({
        ios: {
          shadowColor: "#3D2A12",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6},
        android: { elevation: 2 },
        web: {
          boxShadow: "0 6px 16px rgba(61, 42, 18, 0.09)",
          transition: "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"},
        default: {}})},
    sectionSeeAllBtnHover: {
      backgroundColor: isDark ? "rgba(201, 162, 39, 0.16)" : "rgba(255,255,255,0.95)",
      ...Platform.select({
        web: {
          boxShadow: "0 10px 22px rgba(61, 42, 18, 0.12)",
          transform: [{ translateY: -1 }]},
        default: {}})},
    sectionSeeAll: {
      fontSize: typography.caption,
      fontFamily: fonts.extrabold,
      letterSpacing: 0.2},
    emptyLoader: {
      marginBottom: spacing.md},
    productGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      alignItems: "flex-start",
      alignContent: "flex-start",
      justifyContent: "flex-start"},
    footerFadeBridge: {
      width: "100%",
      maxWidth: layout.maxContentWidth,
      alignSelf: "center",
      height: 64,
      marginTop: -spacing.sm},
    footerWrapper: {
      marginTop: spacing.lg},
    productGridWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      columnGap: Platform.OS === "web" ? 22 : spacing.md,
      rowGap: Platform.OS === "web" ? 22 : spacing.md + 4},
    productGridCell: {
      marginBottom: 0,
      alignSelf: "stretch"},
    gridCell: {
      marginBottom: 0},
    emptyWrap: {
      paddingVertical: spacing.xxl + 4,
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      ...Platform.select({
        web: {
          maxWidth: layout.maxContentWidth,
          alignSelf: "center",
          width: "100%"},
        default: {}})},
    emptyIconCircle: {
      width: 96,
      height: 96,
      borderRadius: radius.xxl,
      backgroundColor: c.primarySoft,
      borderWidth: 1.5,
      borderColor: c.primaryBorder,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
      ...shadowLift},
    emptyText: {
      textAlign: "center",
      color: c.textSecondary,
      fontSize: typography.bodySmall + 1,
      lineHeight: lineHeight.bodySmall + 4,
      fontFamily: fonts.medium,
      maxWidth: 340},
    errorText: {
      flex: 1,
      fontSize: typography.bodySmall,
      fontFamily: fonts.semibold,
      lineHeight: lineHeight.bodySmall + 2},
    emptySectionHint: {
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.md + 4,
      paddingVertical: spacing.md},
    emptySectionText: {
      fontSize: typography.bodySmall,
      fontFamily: fonts.medium,
      color: c.textSecondary,
      textAlign: "center"},
    emptySectionClear: {
      fontSize: typography.bodySmall,
      fontFamily: fonts.extrabold,
      color: c.secondary},
    menuModalRoot: {
      flex: 1,
      backgroundColor: "transparent"},
    menuBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(12, 10, 8, 0.5)",
      zIndex: 0},
    menuLayer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1},
    menuDropdown: {
      position: "absolute",
      minWidth: 288,
      maxWidth: "92%",
      borderRadius: radius.xxl + 2,
      borderWidth: StyleSheet.hairlineWidth,
      paddingBottom: spacing.lg,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.28,
          shadowRadius: 24},
        android: { elevation: 14 },
        web: {
          boxShadow: "0 20px 50px rgba(12, 10, 8, 0.28)",
          zIndex: WEB_Z_INDEX.dropdown},
        default: {}})},
    menuGoldAccent: {
      height: 3,
      width: "100%",
      opacity: 0.95},
    menuHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md + 2,
      paddingTop: spacing.sm + 2,
      paddingBottom: spacing.xs + 2},
    menuHeaderTitle: {
      fontFamily: FONT_DISPLAY,
      fontSize: typography.h2,
      letterSpacing: -0.35},
    menuCloseBtn: {
      padding: 4,
      borderRadius: radius.sm},
    menuSectionLabel: {
      fontSize: 11,
      fontFamily: fonts.extrabold,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      paddingBottom: 6},
    menuRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginHorizontal: spacing.sm,
      marginBottom: 4,
      paddingVertical: 12,
      paddingHorizontal: spacing.sm,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(116, 79, 28, 0.08)"},
    menuRowHover: {
      backgroundColor: isDark ? "rgba(201, 162, 39, 0.08)" : "rgba(201, 162, 39, 0.1)"},
    menuRowSelected: {
      borderWidth: 1},
    menuRowPressed: {
      opacity: 0.88},
    menuIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(116, 79, 28, 0.16)"},
    menuRowTextCol: {
      flex: 1,
      minWidth: 0},
    menuRowTitle: {
      fontSize: typography.bodySmall,
      fontFamily: fonts.bold,
      letterSpacing: 0.1},
    menuRowValue: {
      marginTop: 2,
      fontSize: typography.caption,
      fontFamily: fonts.medium,
      lineHeight: 18},
    menuPillActive: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: 1},
    menuPillActiveText: {
      fontSize: 10,
      fontFamily: fonts.extrabold,
      letterSpacing: 0.4,
      textTransform: "uppercase"},
    menuDivider: {
      height: StyleSheet.hairlineWidth,
      marginVertical: spacing.sm,
      marginHorizontal: spacing.md},
    menuCheckPlaceholder: {
      width: 56,
      height: 24},
    peNone: {
      pointerEvents: "none"},
    peBoxNone: {
      pointerEvents: "box-none"}});
}
