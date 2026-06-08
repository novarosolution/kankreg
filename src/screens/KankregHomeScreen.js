import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, RefreshControl, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import {
  HomeCategoryCards,
  HomeEditorialHero,
  HomeFeaturedEditorial,
  HomeMarqueeTicker,
} from "../components/home/HomeKankregSections";
import HomeStatsStrip from "../components/home/HomeStatsStrip";
import HomeTestimonials from "../components/home/HomeTestimonials";
import { HomeCatalogGridCard } from "../components/home/HomeCatalogProductViews";
import { KankregGrainOverlay, KankregPageWrap, KankregSectionHead } from "../components/kankreg/KankregPageChrome";
import KankregTrustStrip from "../components/kankreg/KankregTrustStrip";
import KankregMobileHero from "../components/kankreg/KankregMobileHero";
import KankregAnimatedSection from "../components/kankreg/KankregAnimatedSection";
import CatalogGridReveal from "../components/kankreg/CatalogGridReveal";
import CatalogGridSkeleton from "../components/kankreg/CatalogGridSkeleton";
import HeroParallax from "../components/motion/HeroParallax";
import GoldHairline from "../components/ui/GoldHairline";
import PremiumButton from "../components/ui/PremiumButton";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import PremiumErrorBanner from "../components/ui/PremiumErrorBanner";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { KANKREG_PAGE_SECTION_GAP } from "../theme/kankregScreenStyles";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getHomeViewConfig, getProducts } from "../services/productService";
import { HOME_SCREEN_UI } from "../content/appContent";
import { CUSTOMER_SHELL_GRADIENT_LOCATIONS, getCustomerShellGradient } from "../theme/customerAlchemy";
import { createQuoteBlockStyles } from "../theme/screenThemes";
import { productToCartLine } from "../utils/productCart";
import NativeHomeHeader from "../components/native/NativeHomeHeader";
import NativeHeroBanner from "../components/native/NativeHeroBanner";
import NativeSectionHeader from "../components/native/NativeSectionHeader";
import NativeCategoryRow from "../components/native/NativeCategoryRow";
import NativeBestsellersGrid from "../components/native/NativeBestsellersGrid";
import NativeHomeSkeleton from "../components/native/NativeHomeSkeleton";
import { FIGMA } from "../theme/figmaApp";
import { useAuth } from "../context/AuthContext";
import { fetchMyNotifications } from "../services/userService";
import { spacing } from "../theme/tokens";
import { useDeliveryLocation } from "../hooks/useDeliveryLocation";

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
});

const homeGridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {},
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
  const { catalogCardCompact: layoutCompact, showEditorialHero, isMobileWeb } = useKankregLayout();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [homeView, setHomeView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { displayLabel } = useDeliveryLocation();

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
      if (config) {
        setHomeView(config);
      } else {
        setHomeView(null);
        setConfigError("Home layout could not be loaded. Check the API and MongoDB connection.");
      }
    } catch {
      setProducts([]);
      setHomeView(null);
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

  const bestsellers = useMemo(() => products.filter((p) => p.inStock !== false).slice(0, 4), [products]);
  const shellColors = getCustomerShellGradient(isDark, c);
  const handleAdd = (p) => addToCart(productToCartLine(p));
  const handleRemove = (id) => removeFromCart(id);

  const heroTitle = homeView?.heroTitle;
  const heroSubtitle = homeView?.heroSubtitle;
  const primeTitle = homeView?.primeSectionTitle || HOME_SCREEN_UI.bestsellers.titleFallback;
  const heroEyebrow = HOME_SCREEN_UI.hero.eyebrow;
  const heroTitleFallback = HOME_SCREEN_UI.hero.titleFallback;
  const heroSubtitleFallback = HOME_SCREEN_UI.hero.subtitleFallback;
  const showPrime = homeView?.showPrimeSection !== false;
  const showCategories = homeView?.showProductTypeSections !== false;
  const showHomeExtras = homeView?.showHomeSections !== false;
  const ready = !loading && homeView != null;
  const editorialHero = (
    <HomeEditorialHero
      navigation={navigation}
      featuredProduct={products[0]}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
    />
  );

  if (Platform.OS !== "web") {
    return (
      <CustomerScreenShell style={nativeHomeStyles.shell}>
        <NativeHomeHeader
          navigation={navigation}
          hasNotifications={hasUnreadNotifications}
          locationLabel={displayLabel}
          onRefreshLocation={() => navigation.navigate("FindLocation", { force: true })}
        />
        <KankregScrollPage
          scrollVariant="inner"
          topInsetOwner="external"
          style={nativeHomeStyles.scroll}
          showFooter={false}
          contentContainerStyle={nativeHomeStyles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FIGMA.gold} />
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

          <NativeHeroBanner
            eyebrow={heroEyebrow}
            title={heroTitle || heroTitleFallback}
            subtitle={heroSubtitle || heroSubtitleFallback}
            featuredProduct={products[0]}
            onPress={() => navigation.navigate("Shop")}
            loading={loading && !ready}
          />

          {ready ? <GoldHairline style={nativeHomeStyles.divider} /> : null}

          {loading && !ready ? <NativeHomeSkeleton /> : null}

          {showCategories && ready ? (
            <>
              <NativeSectionHeader
                title={HOME_SCREEN_UI.categories.title}
                actionLabel={HOME_SCREEN_UI.categories.action}
                onAction={() => navigation.navigate("Shop")}
                tight
              />
              <NativeCategoryRow onPress={(label) => navigation.navigate("Shop", { category: label })} />
            </>
          ) : null}

          {showPrime && ready ? (
            <>
              <NativeSectionHeader
                title={primeTitle}
                actionLabel={HOME_SCREEN_UI.bestsellers.action}
                onAction={() => navigation.navigate("Shop")}
              />
              {bestsellers.length ? (
                <NativeBestsellersGrid
                  products={bestsellers}
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

        </KankregScrollPage>
        <BottomNavBar />
      </CustomerScreenShell>
    );
  }

  return (
    <CustomerScreenShell style={{ flex: 1 }}>
      <KankregGrainOverlay />
      <LinearGradient
        colors={shellColors}
        locations={CUSTOMER_SHELL_GRADIENT_LOCATIONS}
        style={StyleSheet.absoluteFillObject}
      />
      <KankregScrollPage
        scrollVariant="page"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.primary} />
        }
      >
        <KankregPageWrap gap={KANKREG_PAGE_SECTION_GAP}>
          {configError && !loading ? (
            <PremiumErrorBanner
              severity="error"
              message={configError}
              actionLabel="Retry"
              onActionPress={() => load()}
            />
          ) : null}

          {showEditorialHero && ready ? (
            <KankregAnimatedSection index={0} preset="fade-in">
              {Platform.OS === "web" ? (
                <HeroParallax strength="subtle" maxScroll={320}>
                  {editorialHero}
                </HeroParallax>
              ) : (
                editorialHero
              )}
            </KankregAnimatedSection>
          ) : null}

          {ready ? (
            <KankregAnimatedSection index={1}>
              <KankregMobileHero
                navigation={navigation}
                featuredProduct={products[0]}
                heroTitle={heroTitle}
                heroSubtitle={heroSubtitle}
              />
            </KankregAnimatedSection>
          ) : null}

          {showHomeExtras && ready ? (
            <>
              <KankregAnimatedSection index={2}>
                <KankregTrustStrip />
              </KankregAnimatedSection>
              {HOME_SCREEN_UI.web?.showStatsStrip && !isMobileWeb ? (
                <KankregAnimatedSection index={3} preset="fade-up">
                  <HomeStatsStrip c={c} isDark={isDark} />
                </KankregAnimatedSection>
              ) : null}
              {!isMobileWeb ? (
                <KankregAnimatedSection index={4} preset="fade-in">
                  <HomeMarqueeTicker />
                </KankregAnimatedSection>
              ) : null}
            </>
          ) : null}

          {showCategories && ready ? (
            <KankregAnimatedSection index={5}>
              <GoldHairline />
              <HomeCategoryCards
                products={products}
                productTypeTitle={homeView?.productTypeTitle}
                onBrowse={(label) => navigation.navigate("Shop", { category: label })}
                onOpenShop={() => navigation.navigate("Shop")}
              />
            </KankregAnimatedSection>
          ) : null}

          {showPrime && ready ? (
            <>
              <KankregAnimatedSection index={6}>
                <GoldHairline />
                <KankregSectionHead
                  index={2}
                  eyebrow={HOME_SCREEN_UI.bestsellers.webEyebrow}
                  title={primeTitle}
                  right={
                    <PremiumButton
                      label={HOME_SCREEN_UI.bestsellers.webAction}
                      variant="ghost"
                      size="sm"
                      onPress={() => navigation.navigate("Shop")}
                    />
                  }
                />
              </KankregAnimatedSection>
              <View nativeID="home-catalog">
                {loading ? (
                  <CatalogGridSkeleton count={4} />
                ) : bestsellers.length ? (
                  <CatalogGridReveal>
                    {bestsellers.map((item, idx) => (
                      <HomeCatalogGridCard
                        key={item.id}
                        idx={idx}
                        item={item}
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
            </>
          ) : null}

          {showHomeExtras && products[0] && ready ? (
            <KankregAnimatedSection index={7}>
              <GoldHairline />
              <HomeFeaturedEditorial product={products[0]} navigation={navigation} />
            </KankregAnimatedSection>
          ) : null}

          {showHomeExtras && HOME_SCREEN_UI.web?.showTestimonials && !isMobileWeb && ready ? (
            <KankregAnimatedSection index={8} preset="fade-up">
              <GoldHairline />
              <HomeTestimonials c={c} isDark={isDark} />
            </KankregAnimatedSection>
          ) : null}

          {showHomeExtras && HOME_SCREEN_UI.web?.showBrandQuote && !isMobileWeb && ready ? (
            <KankregAnimatedSection index={9} preset="scale-in">
              <HomeQuote isDark={isDark} />
            </KankregAnimatedSection>
          ) : null}

          {loading && !ready ? <CatalogGridSkeleton count={4} /> : null}
        </KankregPageWrap>
      </KankregScrollPage>
      <BottomNavBar />
    </CustomerScreenShell>
  );
}
