import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, RefreshControl, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomerScreenShell from "../components/CustomerScreenShell";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import {
  HomeCategoryCards,
  HomeEditorialHero,
  HomeFeaturedEditorial,
  HomeMarqueeTicker,
} from "../components/home/HomeKankregSections";
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
import { HOME_BRAND_QUOTE } from "../content/appContent";
import { CUSTOMER_SHELL_GRADIENT_LOCATIONS, getCustomerShellGradient } from "../theme/customerAlchemy";
import { spacing } from "../theme/tokens";
import { productToCartLine } from "../utils/productCart";

function HomeQuote() {
  const { isXs } = useKankregLayout();
  return (
    <View style={[quoteStyles.wrap, isXs && quoteStyles.wrapXs]}>
      <Text style={quoteStyles.mark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        “
      </Text>
      <View style={quoteStyles.block}>
        <Text style={[quoteStyles.text, isXs && quoteStyles.textXs]}>{HOME_BRAND_QUOTE.text}</Text>
        <Text style={quoteStyles.who}>{HOME_BRAND_QUOTE.attribution}</Text>
      </View>
    </View>
  );
}

const quoteStyles = StyleSheet.create({
  wrap: {
    borderRadius: 26,
    overflow: "hidden",
    paddingVertical: 48,
    paddingHorizontal: 24,
    marginVertical: spacing.xl,
    backgroundColor: "#211c16",
  },
  wrapXs: {
    paddingVertical: 32,
    paddingHorizontal: 18,
    marginVertical: spacing.lg,
    borderRadius: 20,
  },
  mark: {
    position: "absolute",
    top: 20,
    left: 24,
    fontSize: 120,
    lineHeight: 72,
    color: "rgba(214, 173, 91, 0.2)",
    fontFamily: "Fraunces_700Bold",
  },
  block: { alignItems: "center" },
  text: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 28,
    lineHeight: 36,
    color: "#f5efe4",
    textAlign: "center",
    maxWidth: 320,
    fontStyle: "italic",
  },
  textXs: {
    fontSize: 20,
    lineHeight: 28,
    maxWidth: "100%",
  },
  who: {
    marginTop: 22,
    fontSize: 12.5,
    letterSpacing: 1,
    color: "#d6ad5b",
    textTransform: "uppercase",
  },
});

export default function KankregHomeScreen({ navigation }) {
  const { colors: c, isDark } = useTheme();
  const { catalogCardCompact: layoutCompact, showEditorialHero } = useKankregLayout();
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [homeView, setHomeView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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

  const catalogCardCompact =
    homeView?.productCardStyle === "comfortable" ? false : homeView?.productCardStyle === "compact" ? true : layoutCompact;

  const bestsellers = useMemo(() => products.filter((p) => p.inStock !== false).slice(0, 4), [products]);
  const shellColors = getCustomerShellGradient(isDark, c);
  const handleAdd = (p) => addToCart(productToCartLine(p));
  const handleRemove = (id) => removeFromCart(id);

  const heroTitle = homeView?.heroTitle;
  const heroSubtitle = homeView?.heroSubtitle;
  const primeTitle = homeView?.primeSectionTitle || "Prime picks";
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
              <KankregAnimatedSection index={3} preset="fade-in">
                <HomeMarqueeTicker />
              </KankregAnimatedSection>
            </>
          ) : null}

          {showCategories && ready ? (
            <KankregAnimatedSection index={4}>
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
              <KankregAnimatedSection index={5}>
                <GoldHairline />
                <KankregSectionHead
                  index={2}
                  eyebrow="Catalog"
                  title={primeTitle}
                  right={
                    <PremiumButton
                      label="View all"
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
                    title="No products yet"
                    description="Add inventory in Admin to populate your catalog."
                    ctaLabel="Browse shop"
                    onCtaPress={() => navigation.navigate("Shop")}
                  />
                )}
              </View>
            </>
          ) : null}

          {showHomeExtras && products[0] && ready ? (
            <KankregAnimatedSection index={6}>
              <GoldHairline />
              <HomeFeaturedEditorial product={products[0]} navigation={navigation} />
            </KankregAnimatedSection>
          ) : null}

          {showHomeExtras && ready ? (
            <KankregAnimatedSection index={7} preset="scale-in">
              <HomeQuote />
            </KankregAnimatedSection>
          ) : null}

          {loading && !ready ? <CatalogGridSkeleton count={4} /> : null}
        </KankregPageWrap>
      </KankregScrollPage>
    </CustomerScreenShell>
  );
}

const homeGridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {},
});
