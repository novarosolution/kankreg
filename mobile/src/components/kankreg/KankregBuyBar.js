import React, { useEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getGsap } from "../../utils/loadGsap";
import useReducedMotion from "../../hooks/useReducedMotion";
import PremiumButton from "../ui/PremiumButton";
import PremiumStickyBar from "../ui/PremiumStickyBar";
import { formatINR } from "../../utils/currency";
import { customerFloatingNavOffset } from "../../theme/screenLayout";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { figmaTextPrimary } from "../../theme/figmaApp";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_BODY_SEMIBOLD, FONT_PRICE } from "../../theme/typographyRoles";
import { fonts, icon } from "../../theme/tokens";
import { PRODUCT_SCREEN, fillProductScreen } from "../../content/appContent";
import NativeStickyBuyBar from "../native/NativeStickyBuyBar";

/** kankreg.html `#buybar` sticky product CTA */
export default function KankregBuyBar({
  visible,
  productName,
  price,
  quantity = 0,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
}) {
  const { isDark } = useTheme();
  const { useProductSplit, showMobileWebTabBar } = useKankregLayout();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const barRef = useRef(null);
  const bottomOffset =
    Platform.OS === "web"
      ? showMobileWebTabBar
        ? customerFloatingNavOffset(insets, { mobileWebTabBar: true })
        : 0
      : customerFloatingNavOffset(insets);

  useEffect(() => {
    if (Platform.OS !== "web" || !visible || reducedMotion) return undefined;
    const node = barRef.current;
    if (!node || typeof Element === "undefined" || !(node instanceof Element)) return undefined;
    let cancelled = false;
    (async () => {
      const gsap = await getGsap();
      if (cancelled || !gsap) return;
      gsap.fromTo(
        node,
        { y: 72, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [reducedMotion, visible]);

  if (!visible) return null;

  if (Platform.OS !== "web") {
    return (
      <NativeStickyBuyBar
        visible={visible}
        productName={productName}
        price={price}
        quantity={quantity}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onBuyNow={onBuyNow}
        ctaLabel="Add to cart"
      />
    );
  }

  const inCart = quantity > 0;
  const lineTotal = inCart ? price * quantity : price;
  const priceLabel = inCart ? PRODUCT_SCREEN.stickyPriceLabel || "Total" : "Price";

  if (!useProductSplit) {
    return (
      <View
        ref={barRef}
        style={[
          styles.mbarOuter,
          {
            bottom: bottomOffset,
            backgroundColor: isDark ? "rgba(15,12,10,0.96)" : "rgba(255,254,250,0.97)",
            borderTopColor: isDark ? "rgba(255,255,255,0.08)" : KANKREG_PALETTE.line,
          },
        ]}
      >
        <Text style={[styles.mbarPrice, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {formatINR(lineTotal)}
        </Text>
        <Pressable style={styles.mbarBtn} onPress={quantity > 0 ? onBuyNow : onAddToCart} accessibilityRole="button">
          <LinearGradient colors={["#C9971F", "#A0741A"]} style={styles.mbarBtnGrad}>
            <Text style={styles.mbarBtnText}>{quantity > 0 ? "Buy Now" : PRODUCT_SCREEN.addToCart}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View ref={barRef} style={[styles.barOuter, { bottom: bottomOffset }]}>
    <PremiumStickyBar variant="glass" align="row">
      <View style={styles.inner}>
        <View style={styles.meta}>
          <Text style={styles.metaLabel}>{priceLabel}</Text>
          <Text style={[styles.price, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
            {formatINR(lineTotal)}
          </Text>
          {quantity > 0 ? (
            <Text style={styles.qtyHint}>
              {fillProductScreen(PRODUCT_SCREEN.inCartCount, { count: String(quantity) })}
            </Text>
          ) : (
            <Text style={[styles.name, figmaTextPrimary(isDark)]} numberOfLines={1}>
              {productName}
            </Text>
          )}
        </View>
        {quantity > 0 && onRemoveFromCart ? (
          <View style={styles.stepper}>
            <Pressable onPress={onRemoveFromCart} style={styles.stepBtn} accessibilityLabel="Decrease quantity">
              <Ionicons name="remove" size={icon.sm} color="#fff" />
            </Pressable>
            <Text style={styles.stepCount}>{quantity}</Text>
            <Pressable onPress={onAddToCart} style={styles.stepBtn} accessibilityLabel="Increase quantity">
              <Ionicons name="add" size={icon.sm} color="#fff" />
            </Pressable>
          </View>
        ) : null}
        <View style={styles.actions}>
          <PremiumButton label="Buy now" variant="outline" size="sm" onPress={onBuyNow} style={styles.actionBuy} />
          {!inCart ? (
            <PremiumButton
              label="Add to cart"
              variant="primary"
              size="sm"
              onPress={onAddToCart}
              style={styles.actionCart}
            />
          ) : null}
        </View>
      </View>
    </PremiumStickyBar>
    </View>
  );
}

const styles = StyleSheet.create({
  mbarOuter: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    ...Platform.select({
      web: {
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 -8px 24px rgba(60, 40, 15, 0.08)",
      },
      default: {},
    }),
  },
  mbarPrice: {
    fontFamily: FONT_PRICE,
    fontWeight: "700",
    fontSize: 20,
    flexShrink: 0,
  },
  mbarBtn: {
    flex: 1,
    borderRadius: 13,
    overflow: "hidden",
  },
  mbarBtnGrad: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mbarBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#FFF9EC",
  },
  barOuter: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(25,20,15,0.05)",
    flexShrink: 0,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KANKREG_PALETTE.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCount: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: KANKREG_PALETTE.ink,
    minWidth: 20,
    textAlign: "center",
  },
  innerStack: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.inkFaint,
  },
  name: {
    fontFamily: FONT_BODY_SEMIBOLD,
    fontSize: 14,
    marginTop: 2,
  },
  price: {
    fontFamily: FONT_PRICE,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  qtyHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: KANKREG_PALETTE.goldDeep,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    flexShrink: 0,
  },
  actionsStack: {
    width: "100%",
  },
  actionBuy: {
    minWidth: 108,
  },
  actionCart: {
    minWidth: 132,
  },
  actionFull: {
    flex: 1,
  },
});
