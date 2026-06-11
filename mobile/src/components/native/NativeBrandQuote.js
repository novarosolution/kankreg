import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HOME_BRAND_QUOTE } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { FIGMA, figmaDisplayTitle, figmaRowBorder, figmaSurfaceBg, figmaTextSecondary } from "../../theme/figmaApp";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const cardShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

/** Editorial quote card — boutique home footer moment */
export default function NativeBrandQuote() {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;

  return (
    <View
      style={[
        styles.card,
        cardShadow,
        figmaRowBorder(isDark),
        { backgroundColor: figmaSurfaceBg(isDark) },
      ]}
    >
      <Text style={[styles.mark, { color: isDark ? FIGMA.goldBright : FIGMA.gold }]} accessibilityElementsHidden>
        “
      </Text>
      <Text style={[styles.quote, figmaDisplayTitle(15, isDark), figmaTextSecondary(isDark)]}>
        {HOME_BRAND_QUOTE.text}
      </Text>
      <View style={[styles.rule, { backgroundColor: isDark ? "#3f3933" : FIGMA.line }]} />
      <Text style={[styles.who, { color: isDark ? FIGMA.goldBright : FIGMA.goldDeep }]}>
        {HOME_BRAND_QUOTE.attribution}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: FIGMA.gutter,
    marginTop: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  mark: {
    fontFamily: FONT_HEADING,
    fontSize: 36,
    lineHeight: 36,
    opacity: 0.55,
    marginBottom: 4,
  },
  quote: {
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 22,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
    width: 48,
  },
  who: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
