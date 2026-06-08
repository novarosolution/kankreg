import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PremiumButton from "../ui/PremiumButton";
import PremiumStickyBar from "../ui/PremiumStickyBar";
import { formatINR } from "../../utils/currency";
import { customerFloatingNavOffset } from "../../theme/screenLayout";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { figmaTextPrimary } from "../../theme/figmaApp";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { fonts } from "../../theme/tokens";
import NativeStickyBuyBar from "../native/NativeStickyBuyBar";

/** kankreg.html `#buybar` sticky product CTA */
export default function KankregBuyBar({
  visible,
  productName,
  price,
  onAddToCart,
  onBuyNow,
}) {
  const { isDark } = useTheme();
  const { isXs, showMobileWebTabBar } = useKankregLayout();
  const insets = useSafeAreaInsets();
  const bottomOffset =
    Platform.OS === "web"
      ? showMobileWebTabBar
        ? customerFloatingNavOffset(insets, { mobileWebTabBar: true })
        : 0
      : customerFloatingNavOffset(insets);
  if (!visible) return null;

  if (Platform.OS !== "web") {
    return (
      <NativeStickyBuyBar
        visible={visible}
        price={price}
        onAddToCart={onAddToCart}
        ctaLabel="Add to cart"
      />
    );
  }

  return (
    <PremiumStickyBar
      variant="glass"
      align={isXs ? "column" : "row"}
      style={[styles.barOuter, { bottom: bottomOffset }]}
    >
      <View style={[styles.inner, isXs && styles.innerStack]}>
        <View style={styles.meta}>
          <Text style={[styles.name, figmaTextPrimary(isDark)]} numberOfLines={1}>
            {productName}
          </Text>
          <Text style={styles.price}>{formatINR(price)}</Text>
        </View>
        <View style={[styles.actions, isXs && styles.actionsStack]}>
          <PremiumButton
            label="Add to cart"
            variant="primary"
            size="sm"
            onPress={onAddToCart}
            style={isXs ? styles.actionFull : null}
          />
          <PremiumButton
            label="Buy now"
            variant="gold"
            size="sm"
            onPress={onBuyNow}
            style={isXs ? styles.actionFull : null}
          />
        </View>
      </View>
    </PremiumStickyBar>
  );
}

const styles = StyleSheet.create({
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
    gap: 12,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },
  innerStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  meta: { flex: 1, minWidth: 0 },
  name: {
    fontFamily: FONT_DISPLAY,
    fontSize: 15,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: KANKREG_PALETTE.gold,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    flexShrink: 0,
  },
  actionsStack: {
    width: "100%",
  },
  actionFull: {
    flex: 1,
  },
});
