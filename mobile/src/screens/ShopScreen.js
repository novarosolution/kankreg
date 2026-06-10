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
import { getShopTheme } from "../theme/shopTheme";
import KankregFilterChips from "../components/kankreg/KankregFilterChips";
import KankregAnimatedSection from "../components/kankreg/KankregAnimatedSection";
import CatalogGridReveal from "../components/kankreg/CatalogGridReveal";
import { ShopCatalogSkeleton } from "../components/loading";
import SectionReveal from "../components/motion/SectionReveal";
import { customerPanel } from "../theme/screenLayout";
import { fonts, spacing, typography } from "../theme/tokens";
import { productToCartLine } from "../utils/productCart";
import useReducedMotion from "../hooks/useReducedMotion";
import NativeSearchBar from "../components/native/NativeSearchBar";
import NativeProductCard from "../components/native/NativeProductCard";
import { FIGMA } from "../theme/figmaApp";
import {
  applyShopFilters,
  countShopFilterBadge,
  formatPriceRangeLabel,
  getCatalogPriceBounds,
  getProductCategoryLabels,
  hasActiveShopFilters,
} from "../utils/shopFilters";
import ShopPriceFilter from "../components/shop/ShopPriceFilter";
import ShopFilterSection from "../components/shop/ShopFilterSection";
import ShopActiveFilters from "../components/shop/ShopActiveFilters";
import {
  ShopCollectionPills,
  ShopCompactToolbar,
  ShopFilterCheck,
  ShopFilterSidebarHeader,
  ShopMobileFilterCard,
  ShopNativeMetaLine,
  ShopTrustStrip,
  shopFilterSidebarStyle,
} from "../components/shop/ShopPageChrome";

const RATING_OPTIONS = ["4★ & above", "3★ & above", "Any rating"];
const SHOP_PILLS = SHOP_SCREEN_UI.collectionPills;
const SORT_OPTIONS = SHOP_SCREEN_UI.sortOptions;

function ratingLabelFromValue(minRating) {
  if (minRating >= 4) return "4★ & above";
  if (minRating >= 3) return "3★ & above";
  return "Any rating";
}

function buildActiveFilterChips({ pill, categories, minRating, minPrice, maxPrice, sortKey }) {
  const chips = [];
  if (pill !== "All") chips.push({ key: "pill", label: pill });
  categories.forEach((cat) => chips.push({ key: `cat:${cat}`, label: cat }));
  if (minRating >= 4) chips.push({ key: "rating", label: "4★ & above" });
  else if (minRating >= 3) chips.push({ key: "rating", label: "3★ & above" });
  if (minPrice != null || maxPrice != null) {
    chips.push({ key: "price", label: formatPriceRangeLabel(minPrice, maxPrice) });
  }
  if (sortKey !== "featured") {
    const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label || sortKey;
    chips.push({ key: "sort", label: sortLabel });
  }
  return chips;
}

export default function ShopScreen({ navigation, route }) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const shopTheme = useMemo(() => getShopTheme(isDark), [isDark]);
  const filterPanelStyle = useMemo(
    () => ({
      ...customerPanel(c, shadowPremium, isDark),
      ...(Platform.OS === "web" && shopTheme.panelGradient
        ? { backgroundImage: shopTheme.panelGradient }
        : null),
      ...(Platform.OS === "web" ? { boxShadow: shopTheme.panelShadow } : null),
    }),
    [c, shadowPremium, isDark, shopTheme]
  );
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
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
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
    setMinPrice(null);
    setMaxPrice(null);
    setSortKey("featured");
  };

  const handlePriceChange = ({ min, max }) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handlePillSelect = (next) => {
    setPill(next);
    if (next === "All") {
      setCategories([]);
    }
  };

  const handleRatingChip = (label) => {
    if (label === "4★ & above") setMinRating((prev) => (prev === 4 ? 0 : 4));
    else if (label === "3★ & above") setMinRating((prev) => (prev === 3 ? 0 : 3));
    else setMinRating(0);
  };

  const toggleRating = (value) => {
    setMinRating((prev) => (prev === value ? 0 : value));
  };

  const handleRemoveFilterChip = (key) => {
    if (key === "pill") setPill("All");
    else if (key.startsWith("cat:")) toggleCategory(key.slice(4));
    else if (key === "rating") setMinRating(0);
    else if (key === "price") {
      setMinPrice(null);
      setMaxPrice(null);
    } else if (key === "sort") setSortKey("featured");
  };

  const categoryOptions = useMemo(() => {
    const labels = products.flatMap((p) => getProductCategoryLabels(p));
    return [...new Set(labels)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const priceBounds = useMemo(() => getCatalogPriceBounds(products), [products]);

  const filterState = useMemo(
    () => ({ pill, categories, minRating, minPrice, maxPrice, sortKey }),
    [pill, categories, minRating, minPrice, maxPrice, sortKey]
  );

  const filtered = useMemo(
    () => applyShopFilters(products, filterState),
    [products, filterState]
  );

  const hasActiveFilters = hasActiveShopFilters(filterState);
  const filterBadgeCount = countShopFilterBadge(filterState);
  const activeFilterChips = useMemo(() => buildActiveFilterChips(filterState), [filterState]);
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label || "Featured";
  const mobileTitle = isXs ? SHOP_SCREEN_UI.pageTitle : SHOP_SCREEN_UI.pageTitleWide;
  const headerSubtitle =
    Platform.OS === "web" ? undefined : showSidebar ? undefined : SHOP_SCREEN_UI.pageSubtitle;

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

  const renderFilterSections = (variant = "chips", { skipCollection = false } = {}) => (
    <>
      {!skipCollection ? (
        <ShopFilterSection title={SHOP_SCREEN_UI.filterCollection} icon="collection">
          {variant === "chips" ? (
            <KankregFilterChips
              options={SHOP_PILLS}
              selected={pill}
              multi={false}
              onToggle={handlePillSelect}
              compact
            />
          ) : (
            <ShopCollectionPills selected={pill} onSelect={handlePillSelect} compact scroll />
          )}
        </ShopFilterSection>
      ) : null}

      <ShopFilterSection title={SHOP_SCREEN_UI.filterCategory} icon="category">
        {variant === "chips" ? (
          <KankregFilterChips
            options={categoryOptions}
            selected={categories}
            multi
            onToggle={toggleCategory}
            compact
          />
        ) : (
          categoryOptions.map((label) => (
            <ShopFilterCheck
              key={label}
              label={label}
              on={categories.includes(label)}
              onPress={() => toggleCategory(label)}
            />
          ))
        )}
      </ShopFilterSection>

      <ShopFilterSection title={SHOP_SCREEN_UI.filterPrice} icon="price">
        <ShopPriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChange={handlePriceChange}
          bounds={priceBounds}
          variant={variant === "chips" ? "chips" : "sidebar"}
        />
      </ShopFilterSection>

      <ShopFilterSection title={SHOP_SCREEN_UI.filterRating} icon="rating" last>
        {variant === "chips" ? (
          <KankregFilterChips
            options={RATING_OPTIONS}
            selected={ratingLabelFromValue(minRating)}
            multi={false}
            onToggle={handleRatingChip}
            compact
          />
        ) : (
          <>
            <ShopFilterCheck label="4★ & above" on={minRating === 4} onPress={() => toggleRating(4)} />
            <ShopFilterCheck label="3★ & above" on={minRating === 3} onPress={() => toggleRating(3)} />
            <ShopFilterCheck label="Any rating" on={minRating === 0} onPress={() => setMinRating(0)} />
          </>
        )}
      </ShopFilterSection>
    </>
  );

  const nativeFilterPanel = filtersOpen ? (
    <View
      style={[
        styles.nativeFiltersCard,
        {
          backgroundColor: shopTheme.surface,
          borderColor: shopTheme.border,
          borderTopColor: shopTheme.borderTopAccent,
        },
      ]}
    >
      {renderFilterSections("chips", { skipCollection: true })}
      {hasActiveFilters ? (
        <Pressable onPress={clearAllFilters} style={styles.nativeClearLink}>
          <Text style={[styles.nativeClearText, { color: shopTheme.accent }]}>
            {SHOP_SCREEN_UI.clearFilters}
          </Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.primary} />
          }
        >
          <KankregCustomerPageHeader
            title={SHOP_SCREEN_UI.pageTitle}
            showBack={false}
            compactNative
          />
          {SHOP_SCREEN_UI.trustLine ? <ShopTrustStrip compact /> : null}
          <View style={styles.nativeToolbar}>
            <NativeSearchBar
              onPress={() => {}}
              onFilterPress={() => setFiltersOpen((open) => !open)}
              placeholder={SHOP_SCREEN_UI.searchPlaceholder}
              filterBadgeCount={filterBadgeCount}
            />
            <View style={styles.nativePillsWrap}>
              <ShopCollectionPills selected={pill} onSelect={handlePillSelect} compact scroll />
            </View>
            {activeFilterChips.length ? (
              <View style={styles.nativeActiveFilters}>
                <ShopActiveFilters
                  chips={activeFilterChips}
                  onRemove={handleRemoveFilterChip}
                  onClearAll={clearAllFilters}
                  inline
                />
              </View>
            ) : null}
            {nativeFilterPanel}
            <ShopNativeMetaLine filtered={filtered.length} total={products.length} />
          </View>
          {loading ? (
            <ShopCatalogSkeleton count={6} />
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

  const mobileWebFilters =
    !showSidebar && filtersOpen ? (
      <ShopMobileFilterCard
        onClear={clearAllFilters}
        hasFilters={hasActiveFilters}
        filterCount={filterBadgeCount}
        compact
      >
        {renderFilterSections("chips", { skipCollection: true })}
      </ShopMobileFilterCard>
    ) : null;

  const sidebarFilters = showSidebar ? (
    <View style={[styles.filtersInner, filterPanelStyle]}>
      <ShopFilterSidebarHeader
        onReset={clearAllFilters}
        hasFilters={hasActiveFilters}
        filterCount={filterBadgeCount}
      />
      {renderFilterSections("sidebar")}
    </View>
  ) : null;

  return (
    <CustomerScreenShell style={{ flex: 1 }}>
      <KankregGrainOverlay />
      <KankregScrollPage
        scrollVariant="page"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.primary} />
        }
      >
        <KankregPageWrap gap={KANKREG_PAGE_SECTION_GAP}>
          <KankregAnimatedSection index={0} immediate>
            <KankregCustomerPageHeader
              title={mobileTitle}
              subtitle={headerSubtitle}
              navigation={navigation}
              showBack={false}
              figmaOnWeb={compactShop}
            />
            {SHOP_SCREEN_UI.trustLine ? <ShopTrustStrip compact /> : null}
          </KankregAnimatedSection>

          <View style={[styles.shopGrid, !showSidebar && styles.shopGridStack]}>
            {showSidebar ? (
              <KankregAnimatedSection index={1} style={shopFilterSidebarStyle()}>
                {sidebarFilters}
              </KankregAnimatedSection>
            ) : null}

            <View style={styles.mainCol}>
              {!showSidebar ? (
                <KankregAnimatedSection index={1}>
                  <ShopCompactToolbar
                    filtered={filtered.length}
                    total={products.length}
                    pill={pill}
                    onPill={handlePillSelect}
                    sortLabel={sortLabel}
                    onSort={cycleSort}
                    sortAnimStyle={sortAnimStyle}
                    filtersOpen={filtersOpen}
                    onToggleFilters={() => setFiltersOpen((open) => !open)}
                    filterBadgeCount={filterBadgeCount}
                    activeChips={activeFilterChips}
                    onRemoveChip={handleRemoveFilterChip}
                    onClearAll={clearAllFilters}
                  />
                  {mobileWebFilters}
                </KankregAnimatedSection>
              ) : (
                <KankregAnimatedSection index={2} immediate>
                  <ShopCompactToolbar
                    variant="sidebar"
                    filtered={filtered.length}
                    total={products.length}
                    pill={pill}
                    onPill={handlePillSelect}
                    sortLabel={sortLabel}
                    onSort={cycleSort}
                    sortAnimStyle={sortAnimStyle}
                    activeChips={activeFilterChips}
                    onRemoveChip={handleRemoveFilterChip}
                    onClearAll={clearAllFilters}
                  />
                </KankregAnimatedSection>
              )}

              {loading ? (
                <ShopCatalogSkeleton count={8} />
              ) : filtered.length === 0 ? (
                <SectionReveal index={3} preset="fade-in" immediate>
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
                <CatalogGridReveal immediateFirst={12}>
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
    gap: 32,
    alignItems: "flex-start",
  },
  shopGridStack: { flexDirection: "column", gap: 0 },
  nativeToolbar: {
    gap: spacing.xs,
  },
  nativePillsWrap: {
    paddingHorizontal: FIGMA.gutter,
  },
  nativeFiltersCard: {
    marginHorizontal: FIGMA.gutter,
    marginBottom: spacing.xs,
    padding: spacing.sm + 4,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 2,
  },
  nativeActiveFilters: {
    marginHorizontal: FIGMA.gutter,
    marginBottom: 0,
  },
  nativeClearLink: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  nativeClearText: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
  },
  filtersInner: {
    width: "100%",
  },
  mainCol: { flex: 1, minWidth: 0 },
});
