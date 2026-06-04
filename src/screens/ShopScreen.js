import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View} from "react-native";
import CustomerScreenShell from "../components/CustomerScreenShell";
import { HomeCatalogGridCard } from "../components/home/HomeCatalogProductViews";
import { KankregGrainOverlay, KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import KankregUnifiedPageHeader from "../components/kankreg/KankregUnifiedPageHeader";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import PremiumLoader from "../components/ui/PremiumLoader";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../services/productService";
import { KANKREG_PALETTE } from "../theme/kankregWeb";
import { createKankregEyebrowStyle } from "../theme/kankregScreenStyles";
import { getKankregChromeTop } from "../components/kankreg/KankregSiteHeader";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import KankregFilterChips from "../components/kankreg/KankregFilterChips";
import KankregResponsiveGrid from "../components/kankreg/KankregResponsiveGrid";
import { customerPanel } from "../theme/screenLayout";
import { fonts } from "../theme/tokens";
import { productToCartLine } from "../utils/productCart";

const FILTER_CATEGORIES_LIST = ["Home & Kitchen", "Lifestyle", "Wellness", "Accessories"];
const SHOP_PILLS = ["All", "New in", "On sale", "Premium"];
const SORT_OPTIONS = [
  { key: "featured", label: "Sort: Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "newest", label: "Newest" },
];

function FilterCheck({ label, on, onPress, isDark }) {
  return (
    <Pressable onPress={onPress} style={styles.chkRow} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
      <View style={[styles.chkBox, on && styles.chkBoxOn]}>
        {on ? <Text style={styles.chkTick}>✓</Text> : null}
      </View>
      <Text style={[styles.chkLabel, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.inkSoft }]}>{label}</Text>
    </Pressable>
  );
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
    return seed ? [String(seed)] : [...FILTER_CATEGORIES_LIST.slice(0, 1)];
  });
  const [minRating, setMinRating] = useState(4);
  const [pill, setPill] = useState("All");
  const [sortKey, setSortKey] = useState("featured");

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
        const next = prev.filter((c) => c !== label);
        return next.length ? next : [label];
      }
      return [...prev, label];
    });
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.inStock !== false);
    if (categories.length) {
      list = list.filter((p) => {
        const cat = String(p.category || "").trim();
        return categories.some((c) => cat.toLowerCase().includes(c.split("&")[0].trim().toLowerCase()) || c === cat);
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

  const { showShopSidebar } = useKankregLayout();
  const showSidebar = showShopSidebar;

  const activeCategoryLabel = categories.length === 1 ? categories[0] : "All categories";

  return (
    <CustomerScreenShell style={{ flex: 1 }}>
      <KankregGrainOverlay />
      <KankregScrollPage
        scrollVariant="page"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={KANKREG_PALETTE.gold} />
        }
      >
        <KankregPageWrap>
          <KankregUnifiedPageHeader eyebrow="Catalog" title="Shop everything" navigation={navigation} showBack={false} />
          <View style={[styles.shopGrid, !showSidebar && styles.shopGridStack]}>
            {showSidebar ? (
              <View style={[styles.filters, filterPanelStyle]}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterH5}>Category</Text>
                  {FILTER_CATEGORIES_LIST.map((label) => (
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
                  <Text style={styles.filterH5}>Price</Text>
                  <View style={styles.rangeTrack}>
                    <View style={styles.rangeFill} />
                  </View>
                  <View style={styles.rangeLabels}>
                    <Text style={styles.rangeLabel}>₹500</Text>
                    <Text style={styles.rangeLabel}>₹8,000</Text>
                  </View>
                </View>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterH5}>Rating</Text>
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
            ) : null}

            <View style={styles.mainCol}>
              {!showSidebar ? (
                <>
                  <KankregFilterChips
                    title="Category"
                    options={FILTER_CATEGORIES_LIST}
                    selected={categories}
                    multi
                    onToggle={toggleCategory}
                  />
                </>
              ) : null}
              <View style={styles.resultRow}>
                <Text style={styles.resultMeta}>
                  Showing <Text style={styles.resultBold}>{filtered.length}</Text> of {products.length} products
                </Text>
                <Text style={createKankregEyebrowStyle(isDark)}>{activeCategoryLabel}</Text>
              </View>
              <View style={styles.toolbar}>
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
                <Pressable
                  onPress={() => {
                    const idx = SORT_OPTIONS.findIndex((o) => o.key === sortKey);
                    const next = SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length];
                    setSortKey(next.key);
                  }}
                  style={styles.sortBtn}
                >
                  <Text style={styles.sortNative}>
                    {SORT_OPTIONS.find((o) => o.key === sortKey)?.label || "Sort"}
                  </Text>
                </Pressable>
              </View>

              {loading ? (
                <PremiumLoader label="Loading shop…" />
              ) : (
                <KankregResponsiveGrid>
                  {filtered.map((item, idx) => (
                    <HomeCatalogGridCard
                      key={item.id}
                      idx={idx}
                      item={item}
                      navigation={navigation}
                      quantity={getItemQuantity(item.id)}
                      styles={gridStyles}
                      isOutOfStock={item.inStock === false}
                      onAddToCart={() => addToCart(productToCartLine(item))}
                      onRemoveFromCart={() => removeFromCart(item.id)}
                    />
                  ))}
                </KankregResponsiveGrid>
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
  productListRow: {}});

const styles = StyleSheet.create({
  shopGrid: {
    flexDirection: "row",
    gap: 34,
    alignItems: "flex-start"},
  shopGridStack: { flexDirection: "column" },
  filters: {
    width: 248,
    flexShrink: 0,
    ...Platform.select({
      web: { position: "sticky", top: getKankregChromeTop() + 12 },
      default: {}})},
  filterGroup: { marginBottom: 26 },
  filterH5: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    marginBottom: 12,
    color: KANKREG_PALETTE.ink},
  chkRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  chkBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: KANKREG_PALETTE.line,
    alignItems: "center",
    justifyContent: "center"},
  chkBoxOn: { backgroundColor: KANKREG_PALETTE.ink, borderColor: KANKREG_PALETTE.ink },
  chkTick: { color: "#fff", fontSize: 11, fontWeight: "700" },
  chkLabel: { fontSize: 14 },
  rangeTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: KANKREG_PALETTE.paper2,
    marginBottom: 8,
    overflow: "hidden"},
  rangeFill: {
    height: "100%",
    width: "50%",
    marginLeft: "18%",
    backgroundColor: KANKREG_PALETTE.gold,
    borderRadius: 2},
  rangeLabels: { flexDirection: "row", justifyContent: "space-between" },
  rangeLabel: { fontSize: 12, color: KANKREG_PALETTE.inkFaint },
  mainCol: { flex: 1, minWidth: 0 },
  resultRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8},
  resultMeta: { fontSize: 13.5, color: KANKREG_PALETTE.inkFaint },
  resultBold: { color: KANKREG_PALETTE.ink, fontFamily: fonts.semibold },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    flexWrap: "wrap",
    gap: 12},
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: KANKREG_PALETTE.paper2},
  pillOn: { backgroundColor: KANKREG_PALETTE.ink },
  pillText: { fontSize: 13, fontFamily: fonts.semibold, color: KANKREG_PALETTE.inkFaint },
  pillTextOn: { color: KANKREG_PALETTE.paper },
  sortBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card},
  sortNative: { fontSize: 13, fontFamily: fonts.semibold, color: KANKREG_PALETTE.ink },
  pgrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -11}});
