import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  FIGMA,
  figmaDisplayTitle,
  figmaStickyFooter,
  figmaTextSecondary,
} from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { customerFloatingNavOffset } from "../../theme/screenLayout";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { formatINR } from "../../utils/currency";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const barShadow = platformShadow({
  web: { boxShadow: "0 -8px 24px rgba(61, 42, 18, 0.08)" },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: { elevation: 8 },
});

/**
 * figmaforkankreg.html cart sticky footer — app + web.
 * `mode="sticky"` pins above tab bar on native; `inline` for web summary panels.
 */
export default function KankregCartPayBar({
  subtotal,
  discount = 0,
  discountLabel,
  total,
  ctaLabel,
  onPress,
  disabled = false,
  loading = false,
  mode = "sticky",
  compact = false,
  style,
}) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { showMobileWebTabBar } = useKankregLayout();
  const isSticky = mode === "sticky";
  const showBreakdown = !compact;
  const dockBottom = customerFloatingNavOffset(insets, { mobileWebTabBar: showMobileWebTabBar });

  return (
    <View
      style={[
        figmaStickyFooter(isDark),
        styles.bar,
        barShadow,
        isSticky && {
          position: Platform.OS === "web" && showMobileWebTabBar ? "fixed" : "absolute",
          left: 0,
          right: 0,
          bottom: dockBottom,
          paddingBottom: Math.max(insets.bottom, 12),
          zIndex: Platform.OS === "web" && showMobileWebTabBar ? 850 : 40,
          ...(Platform.OS === "web" && showMobileWebTabBar
            ? {
                maxWidth: "100%",
                marginHorizontal: "auto",
                paddingHorizontal: 14,
              }
            : {}),
        },
        style,
      ]}
    >
      {showBreakdown ? (
        <View style={styles.line}>
          <Text style={[styles.meta, figmaTextSecondary(isDark)]}>Subtotal</Text>
          <Text style={[styles.meta, figmaTextSecondary(isDark)]}>{formatINR(subtotal)}</Text>
        </View>
      ) : null}
      {showBreakdown && discount > 0 ? (
        <View style={styles.line}>
          <Text style={[styles.meta, styles.discountMeta]}>{discountLabel || "Discount"}</Text>
          <Text style={[styles.meta, styles.discountMeta]}>−{formatINR(discount)}</Text>
        </View>
      ) : null}
      <View style={[styles.line, styles.totalLine]}>
        <Text style={[figmaDisplayTitle(13, isDark), styles.totalLabel]}>Total</Text>
        <Text style={[figmaDisplayTitle(19, isDark), styles.totalValue]}>{formatINR(total)}</Text>
      </View>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed, hovered }) => [
          styles.ctaWrap,
          (pressed || disabled) && { opacity: 0.88 },
          Platform.OS === "web" && hovered && !disabled && { opacity: 0.94 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
      >
        <LinearGradient
          colors={disabled ? ["#9a9a9a", "#7a7a7a"] : ["#19140f", "#2a241e"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>{loading ? "Please wait…" : ctaLabel}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: spacing.md,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  discountMeta: {
    color: FIGMA.green,
  },
  totalLine: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: spacing.sm + 4,
  },
  totalLabel: {
    fontWeight: "500",
  },
  totalValue: {
    fontWeight: "600",
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
    color: FIGMA.paper,
  },
});
