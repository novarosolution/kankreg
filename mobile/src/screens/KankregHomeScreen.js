import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Platform, RefreshControl, StyleSheet, Text, View } from "react-native";
import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import {
  HomeCategoryCards,
  HomeFeaturedEditorial,
  HomeMarqueeTicker,
} from "../components/home/HomeKankregSections";
import WebPremiumHero from "../components/home/WebPremiumHero";
import AboutKankregMedia from "../components/home/AboutKankregMedia";
import HomeTimelineVideoSection from "../components/home/HomeTimelineVideoSection";
import HomeProcessJourney from "../components/home/HomeProcessJourney";
import HomeCommunitySection from "../components/home/HomeCommunitySection";
import HomeGheePremiumWeb from "../components/home/HomeGheePremiumWeb";
import LazyWhenVisible from "../components/ui/LazyWhenVisible";
import {
  normalizeAboutSection,
  normalizeCommunitySection,
  normalizeCompareSection,
} from "../utils/homeViewMedia";
import HomeStatsStrip from "../components/home/HomeStatsStrip";
import HomeTestimonials from "../components/home/HomeTestimonials";
import { HomeCatalogGridCard, HomeCatalogViewAllLink } from "../components/home/HomeCatalogProductViews";
import { SectionHeader, ScrollFadeUp } from "../components/home/editorial";
import { KankregGrainOverlay, KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import KankregTrustStrip from "../components/kankreg/KankregTrustStrip";
import CatalogGridReveal from "../components/kankreg/CatalogGridReveal";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import PremiumErrorBanner from "../components/ui/PremiumErrorBanner";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { KANKREG_CHROME } from "../theme/kankregWeb";
import { HOME_SECTION_GAP, HOME_SPACE } from "../theme/homeEditorial";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { DEFAULT_HOME_VIEW_CONFIG, getHomeViewConfig, getProducts } from "../services/productService";
import { getHomeCatalogProducts } from "../utils/shopFilters";
import { HOME_SCREEN_UI } from "../content/appContent";
import { createQuoteBlockStyles } from "../theme/screenThemes";
import { productToCartLine } from "../utils/productCart";
import NativeHomeHeader from "../components/native/NativeHomeHeader";
import NativeHomeHeroSlider from "../components/home/NativeHomeHeroSlider";
import NativeSectionHeader from "../components/native/NativeSectionHeader";
import NativeCategoryRow from "../components/native/NativeCategoryRow";
import NativeBestsellersGrid from "../components/native/NativeBestsellersGrid";
import { HomePageSkeleton } from "../components/loading";
import { FIGMA } from "../theme/figmaApp";
import { useAuth } from "../context/AuthContext";
import { fetchMyNotifications } from "../services/userService";
import { spacing } from "../theme/tokens";
import { useDeliveryLocation } from "../hooks/useDeliveryLocation";

function useRedirectToFindLocationWhenNeeded(navigation, isAuthenticated) {
  const { bootstrapped, needsFindScreen } = useDeliveryLocation();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web" || !bootstrapped || !isAuthenticated || !needsFindScreen) {
        return undefined;
      }
      const task = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "FindLocation" }],
        });
      }, 0);
      return () => clearTimeout(task);
    }, [bootstrapped, isAuthenticated, needsFindScreen, navigation])
  );
}

const nativeHomeStyles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.xs,
    paddingHorizontal: 0,
    gap: spacing.md,
  },
  bannerWrap: {
    paddingHorizontal: FIGMA.gutter,
    marginBottom: spacing.xs,
  },
  emptyWrap: {
    paddingHorizontal: FIGMA.gutter,
  },
  divider: {
    marginHorizontal: FIGMA.gutter,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  filmWrap: {
    marginTop: spacing.sm,
  },
  processWrap: {
    paddingHorizontal: FIGMA.gutter,
    marginTop: spacing.sm,
  },
});

const homeGridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {},
});

const styles = StyleSheet.create({
  webHomeScroll: Platform.select({
    web: {
      paddingHorizontal: 0,
      overflow: "visible",
    },
    default: {},
  }),
  webHomeBody: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
  },
  webSection: {
    width: "100%",
  },
});

function HomeQuote({ isDark }) {
  const { isXs } = useKankregLayout();
  const quoteStyles = createQuoteBlockStyles(isDark);
  return (
    <View style={[quoteStyles.wrap, isXs && quoteStyles.wrapXs]}>
      <Text style={quoteStyles.mark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        “
      </Text>
      <View style={quoteStyles.block}>
        <Text style={[quoteStyles.text, isXs && quoteStyles.textXs]}>{HOME_SCREEN_UI.quote.text}</Text>
        <Text style={quoteStyles.who}>{HOME_SCREEN_UI.quote.attribution}</Text>
      </View>
    </View>
  );
}

export default function KankregHomeScreen({ navigation }) {
  const { colors: c, isDark } = useTheme();
  const { catalogCardCompact: layoutCompact, isMobileWeb, pageGutterClamp } = useKankregLayout();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [homeView, setHomeView] = useState(DEFAULT_HOME_VIEW_CONFIG);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { displayLabel } = useDeliveryLocation();
  useRedirectToFindLocationWhenNeeded(navigation, isAuthenticated);

  const load = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    else setLoading(true);
    setConfigError("");
    try {
      const [list, config] = await Promise.all([
        getProducts().catch(() => []),
        getHomeViewConfig().catch(() => null),
      ]);
      setProducts(Array.isArray(list) ? list : []);
      setHomeView(config || DEFAULT_HOME_VIEW_CONFIG);
      if (!Array.isArray(list) || !list.length) {
        setConfigError("Could not load products. Check your connection and try again.");
      }
    } catch {
      setProducts([]);
      setHomeView(DEFAULT_HOME_VIEW_CONFIG);
      setConfigError("Could not load the store. Try again when the server is online.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setHasUnreadNotifications(false);
      return;
    }
    let cancelled = false;
    fetchMyNotifications(token)
      .then((list) => {
        if (cancelled) return;
        const items = Array.isArray(list) ? list : [];
        setHasUnreadNotifications(items.some((n) => !n.isRead && !n.isArchived));
      })
      .catch(() => {
        if (!cancelled) setHasUnreadNotifications(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  const catalogCardCompact =
    homeView?.productCardStyle === "comfortable" ? false : homeView?.productCardStyle === "compact" ? true : layoutCompact;

  const homeCatalog = useMemo(() => getHomeCatalogProducts(products), [products]);
  const featuredProduct = homeCatalog[0] || products.find((p) => p.inStock !== false) || products[0];

  useEffect(() => {
    if (Platform.OS !== "web" || loading) return undefined;
    let cancelled = false;
    import("gsap/ScrollTrigger")
      .then(({ ScrollTrigger }) => {
        if (!cancelled) ScrollTrigger.refresh();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [loading, homeCatalog.length]);
  const handleAdd = (p) => addToCart(productToCartLine(p));
  const handleRemove = (id) => removeFromCart(id);

  const primeTitle = homeView?.primeSectionTitle || HOME_SCREEN_UI.bestsellers.titleFallback;
  const showPrime = homeView?.showPrimeSection !== false;
  const showCategories = homeView?.showProductTypeSections !== false;
  const showHomeExtras = homeView?.showHomeSections !== false;
  const ready = !loading;
  if (Platform.OS !== "web") {
    return (
      <CustomerScreenShell style={nativeHomeStyles.shell}>
        <NativeHomeHeader
          navigation={navigation}
          hasNotifications={hasUnreadNotifications}
          locationLabel={displayLabel}
          onRefreshLocation={() => {
            if (!isAuthenticated) {
              navigation.navigate("Login");
              return;
            }
            navigation.navigate("FindLocation", { force: true });
          }}
        />
        <KankregScrollPage
          scrollVariant="inner"
          topInsetOwner="external"
          style={nativeHomeStyles.scroll}
          showFooter={false}
          contentContainerStyle={nativeHomeStyles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.primary} />
          }
        >
          {configError && !loading ? (
            <View style={nativeHomeStyles.bannerWrap}>
              <PremiumErrorBanner
                severity="error"
                message={configError}
                actionLabel="Retry"
                onActionPress={() => load()}
              />
            </View>
          ) : null}

          <NativeHomeHeroSlider navigation={navigation} heroSlides={homeView?.heroSlides} />

          {loading ? <HomePageSkeleton showHeader={false} /> : null}

          {showCategories && ready ? (
            <>
              <NativeSectionHeader
                title={HOME_SCREEN_UI.categories.title}
                actionLabel={HOME_SCREEN_UI.categories.action}
                onAction={() => navigation.navigate("Shop")}
                tight
              />
              <NativeCategoryRow
                products={products}
                onPress={(label) => navigation.navigate("Shop", { category: label })}
              />
            </>
          ) : null}

          {showPrime && ready ? (
            <>
              <NativeSectionHeader
                title={primeTitle}
                actionLabel={HOME_SCREEN_UI.bestsellers.action}
                onAction={() => navigation.navigate("Shop")}
              />
              {homeCatalog.length ? (
                <NativeBestsellersGrid
                  products={homeCatalog}
                  onProductPress={(item) => navigation.navigate("Product", { productId: item.id })}
                  onAddToCart={handleAdd}
                />
              ) : ready ? (
                <View style={nativeHomeStyles.emptyWrap}>
                  <PremiumEmptyState
                    iconName="bag-outline"
                    title={HOME_SCREEN_UI.empty.productsTitle}
                    description={HOME_SCREEN_UI.empty.productsDescription}
                    ctaLabel={HOME_SCREEN_UI.empty.productsCta}
                    onCtaPress={() => navigation.navigate("Shop")}
                  />
                </View>
              ) : null}
            </>
          ) : null}

          {ready ? (
            <View style={nativeHomeStyles.filmWrap}>
              <HomeTimelineVideoSection />
            </View>
          ) : null}

          {ready ? (
            <View style={nativeHomeStyles.processWrap}>
              <HomeProcessJourney />
            </View>
          ) : null}

        </KankregScrollPage>
        <BottomNavBar />
      </CustomerScreenShell>
    );
  }

  const showWebHero = HOME_SCREEN_UI.web?.showWebHero !== false;
  const showGheePremium = HOME_SCREEN_UI.web?.showGheePremiumSections !== false;
  const showCommunity = HOME_SCREEN_UI.web?.showCommunitySection !== false;
  const showLegacyTrustStrip =
    showHomeExtras && HOME_SCREEN_UI.web?.showTrustStrip && ready && !showWebHero;
  const aboutSection = homeView?.aboutSection ?? DEFAULT_HOME_VIEW_CONFIG.aboutSection;
  const communitySection =
    homeView?.communitySection ?? DEFAULT_HOME_VIEW_CONFIG.communitySection;
  const compareSection =
    homeView?.compareSection ?? DEFAULT_HOME_VIEW_CONFIG.compareSection;
  const showAboutStory = ready && normalizeAboutSection(aboutSection).enabled;
  const showCommunitySection =
    showCommunity &&
    ready &&
    normalizeCommunitySection(communitySection).enabled;
  const webCreamShell =
    Platform.OS === "web" && !isDark ? { backgroundColor: KANKREG_CHROME.cream } : null;

  return (
    <CustomerScreenShell style={[{ flex: 1 }, webCreamShell]} topAccent={!showWebHero}>
      <KankregGrainOverlay />
      <KankregScrollPage
        scrollVariant="page"
        contentContainerStyle={styles.webHomeScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.primary} />
        }
      >
        {showWebHero ? (
          <WebPremiumHero navigation={navigation} heroSlides={homeView?.heroSlides} />
        ) : null}

        <View
          style={[
            styles.webHomeBody,
            {
              paddingHorizontal: pageGutterClamp,
              paddingTop: showWebHero ? HOME_SECTION_GAP : HOME_SPACE.lg,
            },
          ]}
        >
          <KankregPageWrap gap={HOME_SECTION_GAP}>
            {loading ? <HomePageSkeleton /> : null}

            {configError && !loading ? (
              <PremiumErrorBanner
                severity="error"
                message={configError}
                actionLabel="Retry"
                onActionPress={() => load()}
              />
            ) : null}

            {showLegacyTrustStrip ? (
              <ScrollFadeUp index={0}>
                <KankregTrustStrip />
              </ScrollFadeUp>
            ) : null}

            {showCategories && ready ? (
              <ScrollFadeUp index={0}>
                {isMobileWeb ? (
                  <>
                    <NativeSectionHeader
                      title={HOME_SCREEN_UI.categories.title}
                      actionLabel={HOME_SCREEN_UI.categories.action}
                      onAction={() => navigation.navigate("Shop")}
                      tight
                    />
                    <NativeCategoryRow
                      products={products}
                      onPress={(label) => navigation.navigate("Shop", { category: label })}
                    />
                  </>
                ) : (
                  <HomeCategoryCards
                    products={products}
                    productTypeTitle={homeView?.productTypeTitle}
                    onBrowse={(label) => navigation.navigate("Shop", { category: label })}
                    onOpenShop={() => navigation.navigate("Shop")}
                  />
                )}
              </ScrollFadeUp>
            ) : null}

            {showPrime && ready ? (
              <ScrollFadeUp index={1}>
                <View style={styles.webSection} nativeID="home-bestsellers">
                  <SectionHeader
                    eyebrow={primeTitle}
                    title={HOME_SCREEN_UI.bestsellers.webSectionTitle}
                    right={
                      <HomeCatalogViewAllLink
                        label={HOME_SCREEN_UI.bestsellers.webAction}
                        onPress={() => navigation.navigate("Shop")}
                      />
                    }
                  />
                  <View nativeID="home-catalog">
                    {homeCatalog.length ? (
                      <CatalogGridReveal
                        immediateFirst={Math.min(homeCatalog.length, 8)}
                        staggerGap={52}
                        staggerInitialDelay={48}
                      >
                        {homeCatalog.map((item, idx) => (
                          <HomeCatalogGridCard
                            key={item.id}
                            idx={idx}
                            item={item}
                            variant="editorial"
                            compact={catalogCardCompact}
                            navigation={navigation}
                            quantity={getItemQuantity(item.id)}
                            styles={homeGridStyles}
                            isOutOfStock={item.inStock === false}
                            onAddToCart={() => handleAdd(item)}
                            onRemoveFromCart={() => handleRemove(item.id)}
                          />
                        ))}
                      </CatalogGridReveal>
                    ) : (
                      <PremiumEmptyState
                        iconName="bag-outline"
                        title={HOME_SCREEN_UI.empty.productsTitle}
                        description={HOME_SCREEN_UI.empty.productsDescription}
                        ctaLabel={HOME_SCREEN_UI.empty.productsCta}
                        onCtaPress={() => navigation.navigate("Shop")}
                      />
                    )}
                  </View>
                </View>
              </ScrollFadeUp>
            ) : null}

            {ready ? (
              <ScrollFadeUp index={2}>
                <HomeTimelineVideoSection />
              </ScrollFadeUp>
            ) : null}

            {ready ? (
              <LazyWhenVisible minHeight={560} rootMargin="240px">
                <ScrollFadeUp index={3}>
                  <HomeProcessJourney />
                </ScrollFadeUp>
              </LazyWhenVisible>
            ) : null}

            {showAboutStory ? (
              <LazyWhenVisible minHeight={480} rootMargin="400px">
                <ScrollFadeUp index={4}>
                  <AboutKankregMedia
                    aboutSection={aboutSection}
                    navigation={navigation}
                    variant="editorial"
                  />
                </ScrollFadeUp>
              </LazyWhenVisible>
            ) : null}

            {showCommunitySection ? (
              <LazyWhenVisible minHeight={520} rootMargin="360px">
                <HomeCommunitySection communitySection={communitySection} />
              </LazyWhenVisible>
            ) : null}

            {showGheePremium && ready ? (
              <LazyWhenVisible minHeight={640} rootMargin="360px">
                <HomeGheePremiumWeb compareSection={compareSection} />
              </LazyWhenVisible>
            ) : null}

            {showHomeExtras && HOME_SCREEN_UI.web?.showStatsStrip && !isMobileWeb && ready ? (
              <ScrollFadeUp index={5}>
                <HomeStatsStrip c={c} isDark={isDark} />
              </ScrollFadeUp>
            ) : null}
            {showHomeExtras && HOME_SCREEN_UI.web?.showMarquee && !isMobileWeb && ready ? (
              <ScrollFadeUp index={6}>
                <HomeMarqueeTicker />
              </ScrollFadeUp>
            ) : null}
            {showHomeExtras && HOME_SCREEN_UI.web?.showFeaturedEditorial && featuredProduct && ready ? (
              <ScrollFadeUp index={7}>
                <HomeFeaturedEditorial product={featuredProduct} navigation={navigation} />
              </ScrollFadeUp>
            ) : null}
            {showHomeExtras && HOME_SCREEN_UI.web?.showTestimonials && !isMobileWeb && ready ? (
              <ScrollFadeUp index={8}>
                <HomeTestimonials c={c} isDark={isDark} />
              </ScrollFadeUp>
            ) : null}
            {showHomeExtras && HOME_SCREEN_UI.web?.showBrandQuote && !isMobileWeb && ready ? (
              <ScrollFadeUp index={9} preset="fade-in">
                <HomeQuote isDark={isDark} />
              </ScrollFadeUp>
            ) : null}
          </KankregPageWrap>
        </View>
      </KankregScrollPage>
      <BottomNavBar />
    </CustomerScreenShell>
  );
}
