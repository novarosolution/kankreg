import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { APP_DISPLAY_NAME } from "../constants/brand";
import { useTheme } from "../context/ThemeContext";

/** Premium wordmark + tagline — `reference/logo/kankreg-brand-premium.png`. */
export const BRAND_LOGO_ASPECT = 1024 / 430;

const BRAND_IMAGE = require("../../assets/kankreg-brand.png");

/**
 * KankreG brand logo (gold wordmark, transparent background).
 * Used app-wide — headers, splash, auth, footers, cart.
 */
export default function BrandLogo({
  width,
  height,
  size,
  style,
  glow = false,
  variant,
}) {
  const { isDark } = useTheme();
  const resolvedVariant = variant ?? (isDark ? "default" : "onLight");
  const resolvedHeight = height ?? size ?? 50;
  const resolvedWidth = width ?? resolvedHeight * BRAND_LOGO_ASPECT;

  const styles = useMemo(() => createStyles(glow, resolvedVariant), [glow, resolvedVariant]);

  return (
    <View
      style={[styles.wrap, { width: resolvedWidth, height: resolvedHeight }, style]}
      accessibilityRole="image"
      accessibilityLabel={APP_DISPLAY_NAME}
    >
      <Image
        source={BRAND_IMAGE}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        transition={120}
        cachePolicy="memory-disk"
      />
    </View>
  );
}

function createStyles(glow, variant) {
  const onLight = variant === "onLight";
  return StyleSheet.create({
    wrap: {
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
      ...(glow
        ? Platform.select({
            web: {
              filter: onLight
                ? "drop-shadow(0 8px 22px rgba(138,95,34,0.22))"
                : "drop-shadow(0 14px 36px rgba(0,0,0,0.35))",
            },
            default: {
              shadowColor: onLight ? "#8A5F22" : "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: onLight ? 0.2 : 0.28,
              shadowRadius: 14,
              elevation: 8,
            },
          })
        : null),
    },
  });
}
