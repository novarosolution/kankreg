import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useTheme } from "../../context/ThemeContext";
import { customerFloatingNavOffset } from "../../theme/screenLayout";
import { formatINR } from "../../utils/currency";
import { fonts } from "../../theme/tokens";
import { PRODUCT_SCREEN } from "../../content/appContent";

/** Premium sticky buy bar — design board screen 08 */
export default function NativeStickyBuyBar({
  visible,
  price,
  quantity = 0,
  onAddToCart,
  onBuyNow,
  disabled = false,
  ctaLabel = "Add to cart",
}) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  if (Platform.OS === "web" || !visible) return null;

  const sheetBg = isDark ? "rgba(28,25,23,0.96)" : "rgba(255,253,248,0.97)";

  return (
    <View
      style={[
        styles.bar,
        {
          bottom: customerFloatingNavOffset(insets),
          paddingBottom: Math.max(insets.bottom, 14),
          backgroundColor: sheetBg,
          borderTopColor: isDark ? "rgba(255,255,255,0.08)" : KANKREG_PALETTE.line,
        },
      ]}
    >
      <View style={styles.meta}>
        <Text style={styles.metaLabel}>{PRODUCT_SCREEN.stickyPriceLabel || "Total"}</Text>
        <Text style={[styles.price, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {formatINR(price)}
        </Text>
        {quantity > 0 ? (
          <Text style={styles.qtyHint}>{quantity} in bag</Text>
        ) : null}
      </View>

      <View style={styles.ctaCol}>
        {onBuyNow && !disabled ? (
          <Pressable
            onPress={onBuyNow}
            style={({ pressed }) => [styles.buyNow, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
          >
            <Text style={styles.buyNowText}>Buy now</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onAddToCart}
          disabled={disabled}
          style={({ pressed }) => [styles.ctaWrap, (pressed || disabled) && { opacity: 0.88 }]}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={disabled ? ["#9a9a9a", "#7a7a7a"] : ["#cba24e", "#9c6b27"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 90,
    paddingTop: 12,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  meta: { flexShrink: 0, minWidth: 88 },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: 9,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.inkFaint,
  },
  price: {
    fontFamily: FONT_DISPLAY,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  qtyHint: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: KANKREG_PALETTE.goldDeep,
    marginTop: 2,
  },
  ctaCol: {
    flex: 1,
    gap: 8,
  },
  buyNow: {
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
  },
  buyNowText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: KANKREG_PALETTE.inkSoft,
  },
  ctaWrap: {
    borderRadius: 999,
    overflow: "hidden",
  },
  cta: {
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 999,
  },
  ctaText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: "#fff",
    letterSpacing: 0.2,
  },
});
