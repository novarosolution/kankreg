import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HOME_BRAND_QUOTE } from "../../content/appContent";
import { FIGMA, figmaDisplayTitle } from "../../theme/figmaApp";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
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
  if (Platform.OS === "web") return null;

  return (
    <View style={[styles.card, cardShadow]}>
      <Text style={styles.mark} accessibilityElementsHidden>
        “
      </Text>
      <Text style={styles.quote}>{HOME_BRAND_QUOTE.text}</Text>
      <View style={styles.rule} />
      <Text style={styles.who}>{HOME_BRAND_QUOTE.attribution}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: FIGMA.gutter,
    marginTop: spacing.lg,
    backgroundColor: FIGMA.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  mark: {
    fontFamily: FONT_DISPLAY,
    fontSize: 36,
    lineHeight: 36,
    color: FIGMA.gold,
    opacity: 0.55,
    marginBottom: 4,
  },
  quote: {
    ...figmaDisplayTitle(15),
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 22,
    color: FIGMA.inkSoft,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: FIGMA.line,
    marginVertical: 14,
    width: 48,
  },
  who: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: FIGMA.goldDeep,
  },
});
