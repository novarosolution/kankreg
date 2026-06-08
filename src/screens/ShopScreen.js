import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import { HomeCatalogGridCard } from "../components/home/HomeCatalogProductViews";
import { KankregGrainOverlay, KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import KankregCustomerPageHeader from "../components/kankreg/KankregCustomerPageHeader";
import { SHOP_SCREEN_UI } from "../content/appContent";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../services/productService";
import { KANKREG_PALETTE } from "../theme/kankregWeb";
import { KANKREG_PAGE_SECTION_GAP } from "../theme/kankregScreenStyles";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import KankregFilterChips from "../components/kankreg/KankregFilterChips";
import KankregAnimatedSection from "../components/kankreg/KankregAnimatedSection";
import CatalogGridReveal from "../components/kankreg/CatalogGridReveal";
import CatalogGridSkeleton from "../components/kankreg/CatalogGridSkeleton";
import SectionReveal from "../components/motion/SectionReveal";
import { customerPanel } from "../theme/screenLayout";
import { fonts, spacing, typography } from "../theme/tokens";
import { productToCartLine } from "../utils/productCart";
import useReducedMotion from "../hooks/useReducedMotion";
import NativeSearchBar from "../components/native/NativeSearchBar";
import NativeProductCard from "../components/native/NativeProductCard";
import { FIGMA } from "../theme/figmaApp";
import { applyShopFilters, getProductCategoryLabels } from "../utils/shopFilters";
import GoldHairline from "../components/ui/GoldHairline";
import {
  ShopCollectionPills,
  ShopFilterSidebarHeader,
  ShopMobileFilterCard,
  ShopNativeMetaLine,
  ShopResultToolbar,
  ShopTrustStrip,
  shopFilterSidebarStyle,
} from "../components/shop/ShopPageChrome";

const RATING_OPTIONS = ["4★ & above", "3★ & above", "Any rating"];
const SHOP_PILLS = SHOP_SCREEN_UI.collectionPills;
const SORT_OPTIONS = SHOP_SCREEN_UI.sortOptions;

function FilterCheck({ label, on, onPress, isDark }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.chkRow}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
    >
      <View
        style={[
          styles.chkBox,
          isDark && styles.chkBoxDark,
          on && styles.chkBoxOn,
          isDark && on && styles.chkBoxOnDark,
        ]}
      >
        {on ? <Text style={styles.chkTick}>✓</Text> : null}
      </View>
      <Text style={[styles.chkLabel, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.inkSoft }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ratingLabelFromValue(minRating) {
  if (minRating >= 4) return "4★ & above";
  if (minRating >= 3) return "3★ & above";
  return "Any rating";
}

export default function ShopScreen({ navigation, route }) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const filterPanelStyle = useMemo(() => customerPanel(c, shadowPremium, isDark), [c, shadowPremium, isDark]);
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState(() => {
    const seed = route.params?.category;
    return seed ? [String(seed)] : [];
  });
  const reducedMotion = useReducedMotion();
  const sortPulse = useSharedValue(1);
  const [minRating, setMinRating] = useState(0);
  const [pill, setPill] = useState("All");
  const [sortKey, setSortKey] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { showShopSidebar, isXs, isMobileWeb, catalogCardCompact } = useKankregLayout();
  const showSidebar = showShopSidebar;
  const compactShop = isXs || isMobileWeb || Platform.OS !== "web";

  const load = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    else setLoading(true);
    try {
      const list = await getProducts();
      setProducts(Array.isArray(list) ? list : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (route.params?.category) {
      setCategories([String(route.params.category)]);
    }
  }, [route.params?.category]);

  useEffect(() => {
    const pillParam = route.params?.pill;
    if (pillParam && SHOP_PILLS.includes(pillParam)) {
      setPill(pillParam);
    }
  }, [route.params?.pill]);

  const toggleCategory = (label) => {
    setCategories((prev) =>
      prev.includes(label) ? prev.filter((cat) => cat !== label) : [...prev, label]
    );
  };

  const clearAllFilters = () => {
    setPill("All");
    setCategories([]);
    setMinRating(0);
    setSortKey("featured");
  };

  const handlePillSelect = (next) => {
    setPill(next);
    if (next === "All") {
      setCategories([]);
    }
  };

  const handleRatingChip = (label) => {
    if (label === "4★ & above") setMinRating(4);
    else if (label === "3★ & above") setMinRating(3);
    else setMinRating(0);
  };

  const categoryOptions = useMemo(() => {
    const labels = products.flatMap((p) => getProductCategoryLabels(p));
    return [...new Set(labels)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filtered = useMemo(
    () => applyShopFilters(products, { categories, pill, minRating, sortKey }),
    [products, categories, pill, minRating, sortKey]
  );

  const hasActiveFilters =
    pill !== "All" || categories.length > 0 || minRating > 0 || sortKey !== "featured";

  const activeCategoryLabel =
    categories.length === 1 ? categories[0] : categories.length > 1 ? `${categories.length} categories` : "All categories";
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label || "Featured";
  const mobileTitle = isXs ? SHOP_SCREEN_UI.pageTitle : SHOP_SCREEN_UI.pageTitleWide;
  const headerSubtitle = showSidebar ? undefined : SHOP_SCREEN_UI.pageSubtitle;

  const sortAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sortPulse.value }],
  }));

  const cycleSort = () => {
    if (!reducedMotion) {
      sortPulse.value = withSequence(withSpring(0.9, { damping: 12 }), withSpring(1, { damping: 10 }));
    }
    const idx = SORT_OPTIONS.findIndex((o) => o.key === sortKey);
    const next = SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length];
    setSortKey(next.key);
  };

  const nativeFilterPanel = filtersOpen ? (
    <View style={[styles.nativeFiltersCard, isDark && styles.nativeFiltersCardDark]}>
      <KankregFilterChips
        title={SHOP_SCREEN_UI.filterCategory}
        options={categoryOptions}
        selected={categories}
        multi
        onToggle={toggleCategory}
        compact
      />
      <KankregFilterChips
        title={SHOP_SCREEN_UI.filterRating}
        options={RATING_OPTIONS}
        selected={ratingLabelFromValue(minRating)}
        multi={false}
        onToggle={handleRatingChip}
        compact
      />
      {hasActiveFilters ? (
        <Pressable onPress={clearAllFilters} style={styles.nativeClearLink}>
          <Text style={styles.nativeClearText}>{SHOP_SCREEN_UI.clearFilters}</Text>
        </Pressable>
      ) : null}
    </View>
  ) : null;

  if (Platform.OS !== "web") {
    return (
      <CustomerScreenShell style={{ flex: 1 }}>
        <KankregScrollPage
          scrollVariant="page"
          showFooter={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={KANKREG_PALETTE.gold} />
          }
        >
          <KankregCustomerPageHeader
            eyebrow={SHOP_SCREEN_UI.pageEyebrow}
            title={SHOP_SCREEN_UI.pageTitle}
            showBack={false}
            compactNative
          />
          <GoldHairline marginVertical={spacing.xs} />
          <ShopTrustStrip />
          <NativeSearchBar
            onPress={() => {}}
            onFilterPress={() => setFiltersOpen((open) => !open)}
            placeholder={SHOP_SCREEN_UI.searchPlaceholder}
          />
          <ShopCollectionPills selected={pill} onSelect={handlePillSelect} compact />
          {nativeFilterPanel}
          <ShopNativeMetaLine filtered={filtered.length} total={products.length} />
          {loading ? (
            <CatalogGridSkeleton count={6} />
          ) : filtered.length ? (
            <View style={nativeShopGrid.grid}>
              {filtered.map((item, idx) => (
                <View key={item.id} style={nativeShopGrid.cell}>
                  <NativeProductCard
                    product={item}
                    index={idx}
                    isOutOfStock={item.inStock === false}
                    onPress={() => navigation.navigate("Product", { productId: item.id })}
                    onAddToCart={() => addToCart(productToCartLine(item))}
                  />
                </View>
              ))}
            </View>
          ) : (
            <PremiumEmptyState
              iconName="search-outline"
              title={SHOP_SCREEN_UI.emptyTitle}
              description={SHOP_SCREEN_UI.emptyDescription}
              ctaLabel={SHOP_SCREEN_UI.clearFilters}
              onCtaPress={clearAllFilters}
            />
          )}
        </KankregScrollPage>
        <BottomNavBar />
      </CustomerScreenShell>
    );
  }

  const mobileWebFilters = !showSidebar ? (
    <ShopMobileFilterCard onClear={clearAllFilters} hasFilters={hasActiveFilters}>
      <KankregFilterChips
        title={SHOP_SCREEN_UI.filterCategory}
        options={categoryOptions}
        selected={categories}
        multi
        onToggle={toggleCategory}
        compact
      />
      <KankregFilterChips
        title={SHOP_SCREEN_UI.filterCollection}
        options={SHOP_PILLS}
        selected={pill}
        multi={false}
        onToggle={handlePillSelect}
        compact
      />
      <KankregFilterChips
        title={SHOP_SCREEN_UI.filterRating}
        options={RATING_OPTIONS}
        selected={ratingLabelFromValue(minRating)}
        multi={false}
        onToggle={handleRatingChip}
        compact
      />
    </ShopMobileFilterCard>
  ) : null;

  return (
    <CustomerScreenShell style={{ flex: 1 }}>
      <KankregGrainOverlay />
      <KankregScrollPage
        scrollVariant="page"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={KANKREG_PALETTE.gold} />
        }
      >
        <KankregPageWrap gap={KANKREG_PAGE_SECTION_GAP}>
          <KankregAnimatedSection index={0}>
            <KankregCustomerPageHeader
              eyebrow={SHOP_SCREEN_UI.pageEyebrow}
              title={mobileTitle}
              subtitle={headerSubtitle}
              navigation={navigation}
              showBack={false}
              figmaOnWeb={compactShop}
            />
            <ShopTrustStrip />
          </KankregAnimatedSection>

          <View style={[styles.shopGrid, !showSidebar && styles.shopGridStack]}>
            {showSidebar ? (
              <KankregAnimatedSection index={1} style={shopFilterSidebarStyle()}>
                <View style={[styles.filtersInner, filterPanelStyle]}>
                  <ShopFilterSidebarHeader onReset={clearAllFilters} hasFilters={hasActiveFilters} />
                  <View style={styles.filterGroup}>
                    <Text style={[styles.filterH5, isDark && styles.filterH5Dark]}>{SHOP_SCREEN_UI.filterCategory}</Text>
                    {categoryOptions.map((label) => (
                      <FilterCheck
                        key={label}
                        label={label}
                        on={categories.includes(label)}
                        onPress={() => toggleCategory(label)}
                        isDark={isDark}
                      />
                    ))}
                  </View>
                  <View style={styles.filterGroup}>
                    <Text style={[styles.filterH5, isDark && styles.filterH5Dark]}>{SHOP_SCREEN_UI.filterPrice}</Text>
                    <View style={[styles.rangeTrack, isDark && styles.rangeTrackDark]}>
                      <View style={styles.rangeFill} />
                    </View>
                    <View style={styles.rangeLabels}>
                      <Text style={[styles.rangeLabel, isDark && styles.rangeLabelDark]}>{SHOP_SCREEN_UI.priceMin}</Text>
                      <Text style={[styles.rangeLabel, isDark && styles.rangeLabelDark]}>{SHOP_SCREEN_UI.priceMax}</Text>
                    </View>
                  </View>
                  <View style={styles.filterGroup}>
                    <Text style={[styles.filterH5, isDark && styles.filterH5Dark]}>{SHOP_SCREEN_UI.filterRating}</Text>
                    <FilterCheck label="4★ & above" on={minRating === 4} onPress={() => setMinRating(4)} isDark={isDark} />
                    <FilterCheck label="3★ & above" on={minRating === 3} onPress={() => setMinRating(3)} isDark={isDark} />
                    <FilterCheck label="Any rating" on={minRating === 0} onPress={() => setMinRating(0)} isDark={isDark} />
                  </View>
                </View>
              </KankregAnimatedSection>
            ) : null}

            <View style={styles.mainCol}>
              {!showSidebar ? (
                <KankregAnimatedSection index={1}>{mobileWebFilters}</KankregAnimatedSection>
              ) : null}

              <KankregAnimatedSection index={showSidebar ? 2 : 2}>
                <ShopResultToolbar
                  filtered={filtered.length}
                  total={products.length}
                  categoryLabel={activeCategoryLabel}
                  sortLabel={sortLabel}
                  onSort={cycleSort}
                  sortAnimStyle={sortAnimStyle}
                  showPills={showSidebar}
                  pill={pill}
                  onPill={handlePillSelect}
                  compact={compactShop}
                  isDark={isDark}
                />
              </KankregAnimatedSection>

              {loading ? (
                <CatalogGridSkeleton count={6} />
              ) : filtered.length === 0 ? (
                <SectionReveal index={3} preset="fade-in">
                  <PremiumEmptyState
                    compact
                    iconName="search-outline"
                    title={SHOP_SCREEN_UI.emptyMatchesTitle}
                    description={SHOP_SCREEN_UI.emptyMatchesDescription}
                    ctaLabel={SHOP_SCREEN_UI.viewAllCta}
                    onCtaPress={clearAllFilters}
                  />
                </SectionReveal>
              ) : (
                <CatalogGridReveal>
                  {filtered.map((item, idx) => (
                    <HomeCatalogGridCard
                      key={item.id}
                      idx={idx}
                      item={item}
                      compact={catalogCardCompact}
                      navigation={navigation}
                      quantity={getItemQuantity(item.id)}
                      styles={gridStyles}
                      isOutOfStock={item.inStock === false}
                      onAddToCart={() => addToCart(productToCartLine(item))}
                      onRemoveFromCart={() => removeFromCart(item.id)}
                    />
                  ))}
                </CatalogGridReveal>
              )}
            </View>
          </View>
        </KankregPageWrap>
      </KankregScrollPage>
      <BottomNavBar />
    </CustomerScreenShell>
  );
}

const gridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {},
});

const nativeShopGrid = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: FIGMA.gutter,
    gap: 11,
    paddingBottom: spacing.md,
  },
  cell: {
    width: "47.5%",
    minWidth: 0,
  },
});

const styles = StyleSheet.create({
  shopGrid: {
    flexDirection: "row",
    gap: 28,
    alignItems: "flex-start",
  },
  shopGridStack: { flexDirection: "column", gap: 0 },
  nativeFiltersCard: {
    marginHorizontal: FIGMA.gutter,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
  },
  nativeFiltersCardDark: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(232, 200, 90, 0.18)",
  },
  nativeClearLink: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
  nativeClearText: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    color: KANKREG_PALETTE.goldDeep,
  },
  filtersInner: {
    width: "100%",
  },
  filterGroup: { marginBottom: 22 },
  filterH5: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 10,
    color: KANKREG_PALETTE.inkSoft,
  },
  filterH5Dark: { color: KANKREG_PALETTE.goldBright },
  chkRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9 },
  chkBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: KANKREG_PALETTE.line,
    alignItems: "center",
    justifyContent: "center",
  },
  chkBoxDark: {
    borderColor: "rgba(232, 200, 90, 0.28)",
  },
  chkBoxOn: { backgroundColor: KANKREG_PALETTE.ink, borderColor: KANKREG_PALETTE.ink },
  chkBoxOnDark: { backgroundColor: KANKREG_PALETTE.goldDeep, borderColor: KANKREG_PALETTE.goldDeep },
  chkTick: { color: "#fff", fontSize: 11, fontWeight: "700" },
  chkLabel: { fontSize: 14, fontFamily: fonts.medium },
  rangeTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: KANKREG_PALETTE.paper2,
    marginBottom: 8,
    overflow: "hidden",
  },
  rangeTrackDark: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  rangeFill: {
    height: "100%",
    width: "50%",
    marginLeft: "18%",
    backgroundColor: KANKREG_PALETTE.gold,
    borderRadius: 2,
  },
  rangeLabels: { flexDirection: "row", justifyContent: "space-between" },
  rangeLabel: { fontSize: 12, color: KANKREG_PALETTE.inkFaint, fontFamily: fonts.medium },
  rangeLabelDark: { color: "rgba(245, 239, 228, 0.55)" },
  mainCol: { flex: 1, minWidth: 0 },
});
