import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Platform, RefreshControl, StyleSheet, View } from "react-native";
import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import WebPremiumHero from "../components/home/WebPremiumHero";
import StorefrontCampaignHero from "../components/home/StorefrontCampaignHero";
import { prefetchHomePageImages } from "../utils/pageContentReady";
import HomePromiseStrip from "../components/home/HomePromiseStrip";
import HomeQualityProof from "../components/home/HomeQualityProof";
import HomeNativeIngredients from "../components/home/HomeNativeIngredients";
import HomeWhyChoose from "../components/home/HomeWhyChoose";
import HomeShopCollections from "../components/home/HomeShopCollections";
import { StorefrontProductRails } from "../components/StorefrontProductRail";
import { KankregGrainOverlay, KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { HOME_SECTION_GAP, HOME_SPACE } from "../theme/homeEditorial";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts, invalidateProductsCache, peekProductsCache, revalidateProductsInBackground } from "../services/productService";
import { getHomeCatalogProducts, getShopCatalogProducts } from "../utils/productAvailability";
import { productToCartLine } from "../utils/productCart";
import NativeHomeHeader from "../components/native/NativeHomeHeader";
import NativeBestsellersGrid from "../components/native/NativeBestsellersGrid";
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
    width: "100%",
    maxWidth: "100%",
  },
  emptyWrap: {
    paddingHorizontal: FIGMA.gutter,
  },
});

const styles = StyleSheet.create({
  webHomeScroll: Platform.select({
    web: {
      paddingHorizontal: 0,
      overflow: "visible",
      width: "100%",
      maxWidth: "100%",
      alignSelf: "stretch",
    },
    default: {},
  }),
  webHomeScrollClipX: Platform.select({
    web: { overflowX: "clip", width: "100%", maxWidth: "100%" },
    default: {},
  }),
  webHomeBodyMobile: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  webHomeBody: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
  },
});


export default function KankregHomeScreen({ navigation }) {
  const { colors: c, isDark } = useTheme();
  const { isMobileWeb, pageGutterClamp } = useKankregLayout();
  const { addToCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [products, setProducts] = useState(() => peekProductsCache() || []);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [configError, setConfigError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { displayLabel } = useDeliveryLocation();
  useRedirectToFindLocationWhenNeeded(navigation, isAuthenticated);

  const load = useCallback(async (pull = false) => {
    if (pull) {
      setRefreshing(true);
      invalidateProductsCache();
    }
    setConfigError("");
    let productsFetchFailed = false;
    try {
    const list = await getProducts().catch(() => {
        productsFetchFailed = true;
        return peekProductsCache() || [];
      });
      const nextProducts = Array.isArray(list) ? list : [];
      setProducts(nextProducts);
      prefetchHomePageImages({ products: nextProducts, heroSlides: [] });
      if (productsFetchFailed && !nextProducts.length) {
        setConfigError("Could not load products. Check your connection and try again.");
      }
    } catch {
      if (!peekProductsCache()?.length) setProducts([]);
      setConfigError("Could not load the store. Try again when the server is online.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      revalidateProductsInBackground((list) => {
        if (!cancelled && Array.isArray(list)) setProducts(list);
      }).catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [])
  );

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

  const homeCatalog = useMemo(() => {
    const featured = getHomeCatalogProducts(products);
    return featured.length ? featured : getShopCatalogProducts(products);
  }, [products]);
  const handleAdd = (p) => addToCart(productToCartLine(p));

  const catalogBlock = homeCatalog.length ? (
    Platform.OS === "web" ? (
      <StorefrontProductRails products={homeCatalog} navigation={navigation} onAddToCart={handleAdd} />
    ) : (
      <NativeBestsellersGrid products={homeCatalog} navigation={navigation} onAddToCart={handleAdd} />
    )
  ) : (
    <HomeShopCollections navigation={navigation} onRetry={() => load()} />
  );

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
          <StorefrontCampaignHero navigation={navigation} />
          <HomePromiseStrip />
          <View style={nativeHomeStyles.emptyWrap}>{catalogBlock}</View>
          <HomeQualityProof />
          <HomeNativeIngredients />
          <HomeWhyChoose />
        </KankregScrollPage>
        <BottomNavBar />
      </CustomerScreenShell>
    );
  }

  const webPaperShell = !isDark ? { backgroundColor: "#FFFFFF" } : null;

  return (
    <CustomerScreenShell style={[{ flex: 1 }, webPaperShell]} topAccent={false}>
      <KankregGrainOverlay />
      <KankregScrollPage
        scrollVariant="page"
        flushWebGutter={isMobileWeb}
        contentContainerStyle={[styles.webHomeScroll, isMobileWeb && styles.webHomeScrollClipX]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={c.primary} />
        }
      >
        <WebPremiumHero navigation={navigation} />
        <HomePromiseStrip />

        <View
          style={[
            styles.webHomeBody,
            isMobileWeb && styles.webHomeBodyMobile,
            {
              paddingHorizontal: pageGutterClamp,
              paddingTop: HOME_SPACE.lg,
              paddingBottom: HOME_SPACE.xl,
            },
          ]}
        >
          <KankregPageWrap gap={isMobileWeb ? spacing.lg : HOME_SECTION_GAP}>
            <View nativeID="home-bestsellers">{catalogBlock}</View>
          </KankregPageWrap>
        </View>
        <HomeQualityProof />
        <HomeNativeIngredients />
        <HomeWhyChoose />
      </KankregScrollPage>
      <BottomNavBar />
    </CustomerScreenShell>
  );
}
