import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import CustomerScreenShell from "../components/CustomerScreenShell";
import { HomeCatalogGridCard } from "../components/home/HomeCatalogProductViews";
import { KankregGrainOverlay, KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import KankregUnifiedPageHeader from "../components/kankreg/KankregUnifiedPageHeader";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../services/productService";
import { KANKREG_PALETTE } from "../theme/kankregWeb";
import {
  createKankregEyebrowStyle,
  createKankregResultBold,
  createKankregResultMeta,
  KANKREG_PAGE_SECTION_GAP,
} from "../theme/kankregScreenStyles";
import { getKankregChromeTop } from "../components/kankreg/KankregSiteHeader";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import KankregFilterChips from "../components/kankreg/KankregFilterChips";
import KankregAnimatedSection from "../components/kankreg/KankregAnimatedSection";
import CatalogGridReveal from "../components/kankreg/CatalogGridReveal";
import CatalogGridSkeleton from "../components/kankreg/CatalogGridSkeleton";
import SectionReveal from "../components/motion/SectionReveal";
import { customerPanel } from "../theme/screenLayout";
import { fonts, spacing } from "../theme/tokens";
import { productToCartLine } from "../utils/productCart";
import { Ionicons } from "@expo/vector-icons";
import useReducedMotion from "../hooks/useReducedMotion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SHOP_PILLS = ["All", "New in", "On sale", "Premium"];
const RATING_OPTIONS = ["4★ & above", "3★ & above", "Any rating"];
const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price ↑" },
  { key: "newest", label: "Newest" },
];

function FilterCheck({ label, on, onPress, isDark }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.chkRow}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
    >
      <View style={[styles.chkBox, on && styles.chkBoxOn, isDark && on && styles.chkBoxOnDark]}>
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
  const resultMetaStyle = useMemo(() => createKankregResultMeta(isDark), [isDark]);
  const resultBoldStyle = useMemo(() => createKankregResultBold(isDark), [isDark]);
  const eyebrowStyle = useMemo(() => createKankregEyebrowStyle(isDark), [isDark]);
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
  const [minRating, setMinRating] = useState(4);
  const [pill, setPill] = useState("All");
  const [sortKey, setSortKey] = useState("featured");

  const { showShopSidebar, isXs, catalogCardCompact } = useKankregLayout();
  const showSidebar = showShopSidebar;

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
    setCategories((prev) => {
      if (prev.includes(label)) {
        const next = prev.filter((cat) => cat !== label);
        return next.length ? next : [label];
      }
      return [...prev, label];
    });
  };

  const handleRatingChip = (label) => {
    if (label === "4★ & above") setMinRating(4);
    else if (label === "3★ & above") setMinRating(3);
    else setMinRating(0);
  };

  const categoryOptions = useMemo(
    () =>
      [...new Set(products.map((p) => String(p.category || "").trim()).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.inStock !== false);
    if (categories.length) {
      list = list.filter((p) => {
        const cat = String(p.category || "").trim();
        return categories.some((c) => c === cat || cat.toLowerCase() === c.toLowerCase());
      });
    }
    if (pill === "On sale") {
      list = list.filter((p) => {
        const mrp = Number(p.mrp);
        const price = Number(p.price);
        return Number.isFinite(mrp) && mrp > price;
      });
    } else if (pill === "Premium") {
      list = list.filter((p) => Number(p.price) >= 1500);
    } else if (pill === "New in") {
      list = [...list].reverse().slice(0, Math.max(list.length, 8));
    }
    if (minRating >= 4) {
      list = list.filter((p) => Number(p.rating || p.averageRating || 5) >= 4);
    } else if (minRating >= 3) {
      list = list.filter((p) => Number(p.rating || p.averageRating || 5) >= 3);
    }
    if (sortKey === "price-asc") {
      list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortKey === "newest") {
      list = [...list].reverse();
    }
    return list;
  }, [products, categories, pill, minRating, sortKey]);

  const activeCategoryLabel = categories.length === 1 ? categories[0] : "All categories";
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label || "Featured";
  const mobileTitle = isXs ? "Shop" : "Shop everything";
  const headerSubtitle = showSidebar ? undefined : "Curated pieces for home & kitchen";

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
            <KankregUnifiedPageHeader
              eyebrow="Catalog"
              title={mobileTitle}
              subtitle={headerSubtitle}
              navigation={navigation}
              showBack={false}
            />
          </KankregAnimatedSection>

          <View style={[styles.shopGrid, !showSidebar && styles.shopGridStack]}>
            {showSidebar ? (
              <KankregAnimatedSection index={1} style={styles.filters}>
              <View style={[styles.filtersInner, filterPanelStyle]}>
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterH5, isDark && styles.filterH5Dark]}>Category</Text>
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
                  <Text style={[styles.filterH5, isDark && styles.filterH5Dark]}>Price</Text>
                  <View style={styles.rangeTrack}>
                    <View style={styles.rangeFill} />
                  </View>
                  <View style={styles.rangeLabels}>
                    <Text style={styles.rangeLabel}>₹500</Text>
                    <Text style={styles.rangeLabel}>₹8,000</Text>
                  </View>
                </View>
                <View style={styles.filterGroup}>
                  <Text style={[styles.filterH5, isDark && styles.filterH5Dark]}>Rating</Text>
                  <FilterCheck
                    label="4★ & above"
                    on={minRating === 4}
                    onPress={() => setMinRating(4)}
                    isDark={isDark}
                  />
                  <FilterCheck
                    label="3★ & above"
                    on={minRating === 3}
                    onPress={() => setMinRating(3)}
                    isDark={isDark}
                  />
                </View>
              </View>
              </KankregAnimatedSection>
            ) : null}

            <View style={styles.mainCol}>
              {!showSidebar ? (
                <KankregAnimatedSection index={1}>
                <View style={styles.mobileFilters}>
                  <KankregFilterChips
                    title="Category"
                    options={categoryOptions}
                    selected={categories}
                    multi
                    onToggle={toggleCategory}
                    compact
                  />
                  <KankregFilterChips
                    title="Collection"
                    options={SHOP_PILLS}
                    selected={pill}
                    multi={false}
                    onToggle={setPill}
                    compact
                  />
                  <KankregFilterChips
                    title="Rating"
                    options={RATING_OPTIONS}
                    selected={ratingLabelFromValue(minRating)}
                    multi={false}
                    onToggle={handleRatingChip}
                    compact
                  />
                </View>
                </KankregAnimatedSection>
              ) : null}

              <KankregAnimatedSection index={showSidebar ? 2 : 2}>
              <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
                <View style={styles.resultRow}>
                  <Text style={resultMetaStyle}>
                    <Text style={resultBoldStyle}>{filtered.length}</Text> of {products.length} products
                  </Text>
                  <Text style={eyebrowStyle} numberOfLines={1}>
                    {activeCategoryLabel}
                  </Text>
                </View>

                <View style={[styles.toolbar, isXs && styles.toolbarStack]}>
                  {showSidebar ? (
                    <View style={styles.pills}>
                      {SHOP_PILLS.map((p) => (
                        <Pressable
                          key={p}
                          onPress={() => setPill(p)}
                          style={[styles.pill, pill === p && styles.pillOn]}
                        >
                          <Text style={[styles.pillText, pill === p && styles.pillTextOn]}>{p}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                  <AnimatedPressable
                    onPress={cycleSort}
                    style={[
                      styles.sortBtn,
                      isXs && !showSidebar && styles.sortBtnMobile,
                      sortAnimStyle,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Sort by ${sortLabel}`}
                  >
                    <Ionicons name="swap-vertical" size={16} color={KANKREG_PALETTE.gold} />
                    <Text style={styles.sortNative}>{sortLabel}</Text>
                  </AnimatedPressable>
                </View>
              </View>
              </KankregAnimatedSection>

              {loading ? (
                <CatalogGridSkeleton count={6} />
              ) : filtered.length === 0 ? (
                <SectionReveal index={3} preset="fade-in">
                  <PremiumEmptyState
                    compact
                    iconName="search-outline"
                    title="No matches"
                    description="Try another category or clear filters to see more products."
                    ctaLabel="View all"
                    onCtaPress={() => {
                      setPill("All");
                      setCategories([]);
                      setMinRating(0);
                    }}
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
    </CustomerScreenShell>
  );
}

const gridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {},
});

const styles = StyleSheet.create({
  shopGrid: {
    flexDirection: "row",
    gap: 28,
    alignItems: "flex-start",
  },
  shopGridStack: { flexDirection: "column", gap: 0 },
  filters: {
    width: 248,
    flexShrink: 0,
    ...Platform.select({
      web: { position: "sticky", top: getKankregChromeTop() + 12 },
      default: {},
    }),
  },
  filtersInner: {
    width: "100%",
  },
  filterGroup: { marginBottom: 22 },
  filterH5: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    marginBottom: 10,
    color: KANKREG_PALETTE.ink,
  },
  filterH5Dark: { color: KANKREG_PALETTE.paper },
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
  chkBoxOn: { backgroundColor: KANKREG_PALETTE.ink, borderColor: KANKREG_PALETTE.ink },
  chkBoxOnDark: { backgroundColor: KANKREG_PALETTE.goldDeep, borderColor: KANKREG_PALETTE.gold },
  chkTick: { color: "#fff", fontSize: 11, fontWeight: "700" },
  chkLabel: { fontSize: 14 },
  rangeTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: KANKREG_PALETTE.paper2,
    marginBottom: 8,
    overflow: "hidden",
  },
  rangeFill: {
    height: "100%",
    width: "50%",
    marginLeft: "18%",
    backgroundColor: KANKREG_PALETTE.gold,
    borderRadius: 2,
  },
  rangeLabels: { flexDirection: "row", justifyContent: "space-between" },
  rangeLabel: { fontSize: 12, color: KANKREG_PALETTE.inkFaint },
  mainCol: { flex: 1, minWidth: 0 },
  mobileFilters: {
    marginBottom: spacing.sm,
  },
  resultCard: {
    backgroundColor: KANKREG_PALETTE.card,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  resultCardDark: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(232, 200, 90, 0.18)",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm + 2,
    flexWrap: "wrap",
    gap: 6,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  toolbarStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: KANKREG_PALETTE.paper2,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
  },
  pillOn: { backgroundColor: KANKREG_PALETTE.ink, borderColor: KANKREG_PALETTE.ink },
  pillText: { fontSize: 13, fontFamily: fonts.semibold, color: KANKREG_PALETTE.inkFaint },
  pillTextOn: { color: KANKREG_PALETTE.paper },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.paper,
  },
  sortBtnMobile: {
    alignSelf: "stretch",
    justifyContent: "center",
  },
  sortNative: { fontSize: 13, fontFamily: fonts.semibold, color: KANKREG_PALETTE.ink },
});
