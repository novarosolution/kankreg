import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { APP_DISPLAY_NAME, BRAND_LOGO_SIZE } from "../../constants/brand";
import BrandLogo from "../BrandLogo";

/** Web header — transparent wordmark only (no duplicate text). */
export default function KankregBrandMark({ onPress, compact = false }) {
  const logoHeight = compact ? BRAND_LOGO_SIZE.headerCompact : BRAND_LOGO_SIZE.headerDefault;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.hit,
        pressed && { opacity: 0.88 },
        Platform.OS === "web" ? { cursor: "pointer" } : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${APP_DISPLAY_NAME} — Home`}
    >
      <BrandLogo height={logoHeight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
