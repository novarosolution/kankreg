import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomerScreenShell from "../components/CustomerScreenShell";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import {
  HomeCategoryCards,
  HomeEditorialHero,
  HomeFeaturedEditorial,
  HomeMarqueeTicker} from "../components/home/HomeKankregSections";
import { HomeCatalogGridCard } from "../components/home/HomeCatalogProductViews";
import { KankregGrainOverlay, KankregPageWrap, KankregSectionHead } from "../components/kankreg/KankregPageChrome";
import KankregTrustStrip from "../components/kankreg/KankregTrustStrip";
import KankregResponsiveGrid from "../components/kankreg/KankregResponsiveGrid";
import KankregMobileHero from "../components/kankreg/KankregMobileHero";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import PremiumButton from "../components/ui/PremiumButton";
import PremiumLoader from "../components/ui/PremiumLoader";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../services/productService";
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
        <Text style={[quoteStyles.text, isXs && quoteStyles.textXs]}>
          The packaging alone felt like a gift. kankreg has quietly become the only place I shop for the home.
        </Text>
        <Text style={quoteStyles.who}>— VERIFIED BUYER · KANKREG</Text>
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
    backgroundColor: "#211c16"},
  wrapXs: {
    paddingVertical: 32,
    paddingHorizontal: 18,
    marginVertical: spacing.lg,
    borderRadius: 20},
  mark: {
    position: "absolute",
    top: 20,
    left: 24,
    fontSize: 120,
    lineHeight: 72,
    color: "rgba(214, 173, 91, 0.2)",
    fontFamily: "Fraunces_700Bold"},
  block: { alignItems: "center" },
  text: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 28,
    lineHeight: 36,
    color: "#f5efe4",
    textAlign: "center",
    maxWidth: 320,
    fontStyle: "italic"},
  textXs: {
    fontSize: 20,
    lineHeight: 28,
    maxWidth: "100%"},
  who: {
    marginTop: 22,
    fontSize: 12.5,
    letterSpacing: 1,
    color: "#d6ad5b",
    textTransform: "uppercase"}});

export default function KankregHomeScreen({ navigation }) {
  const { colors: c, isDark } = useTheme();
    const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const bestsellers = useMemo(() => products.filter((p) => p.inStock !== false).slice(0, 4), [products]);
  const shellColors = getCustomerShellGradient(isDark, c);
  const handleAdd = (p) => addToCart(productToCartLine(p));
  const handleRemove = (id) => removeFromCart(id);

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
        <KankregPageWrap>
          <HomeEditorialHero navigation={navigation} featuredProduct={products[0]} />
          <KankregMobileHero navigation={navigation} featuredProduct={products[0]} />
          <KankregTrustStrip />
          <HomeMarqueeTicker />
          <HomeCategoryCards
            products={products}
            onBrowse={(label) => navigation.navigate("Shop", { category: label })}
          />
          <KankregSectionHead
            index={2}
            eyebrow="Bestsellers"
            title="Loved this season"
            right={
              <PremiumButton
                label="View all"
                variant="ghost"
                size="sm"
                onPress={() => navigation.navigate("Shop")}
              />
            }
          />
          {loading ? (
            <PremiumLoader label="Loading catalog…" />
          ) : (
            <KankregResponsiveGrid>
              {bestsellers.map((item, idx) => (
                <HomeCatalogGridCard
                  key={item.id}
                  idx={idx}
                  item={item}
                  navigation={navigation}
                  quantity={getItemQuantity(item.id)}
                  styles={homeGridStyles}
                  isOutOfStock={item.inStock === false}
                  onAddToCart={() => handleAdd(item)}
                  onRemoveFromCart={() => handleRemove(item.id)}
                />
              ))}
            </KankregResponsiveGrid>
          )}
          {products[0] ? <HomeFeaturedEditorial product={products[0]} navigation={navigation} /> : null}
          <HomeQuote />
        </KankregPageWrap>
      </KankregScrollPage>
    </CustomerScreenShell>
  );
}

const homeGridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {}});

