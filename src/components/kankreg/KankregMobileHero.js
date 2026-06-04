import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PremiumButton from "../ui/PremiumButton";
import { createKankregEyebrowStyle } from "../../theme/kankregScreenStyles";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { fonts, spacing, typography } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/** Compact hero when editorial split hero is hidden (<900px) */
export default function KankregMobileHero({ navigation, featuredProduct, heroTitle, heroSubtitle }) {
  const { isDark } = useTheme();
  const { useSplitLayout, isXs } = useKankregLayout();
  if (useSplitLayout) return null;

  const title = heroTitle || "Everyday goods, made extraordinary.";
  const subtitle = heroSubtitle || "Live tracking, secure checkout, and rewards on every order.";

  return (
    <View style={[styles.wrap, isXs && styles.wrapXs]}>
      <Text style={createKankregEyebrowStyle(isDark)}>Curated essentials</Text>
      <Text
        style={[
          styles.h1,
          isXs && styles.h1Xs,
          { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink },
        ]}
      >
        {title}
      </Text>
      <Text style={[styles.lead, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
        {subtitle}
      </Text>
      <View style={styles.ctas}>
        <PremiumButton
          label="Shop now"
          variant="primary"
          onPress={() => navigation.navigate("Shop")}
        />
        <PremiumButton
          label="Rewards"
          variant="ghost"
          onPress={() => navigation.navigate("RedeemRewards")}
        />
      </View>
      {featuredProduct?.name ? (
        <Text style={styles.featured} numberOfLines={1}>
          Featured: {featuredProduct.name}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
  },
  wrapXs: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  h1: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h2 + 4,
    lineHeight: typography.h2 + 10,
    marginTop: spacing.sm,
  },
  h1Xs: {
    fontSize: typography.h2,
    lineHeight: typography.h2 + 4,
  },
  lead: {
    fontSize: typography.bodySmall,
    lineHeight: 22,
    marginTop: spacing.sm,
    maxWidth: 400,
  },
  ctas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  featured: {
    marginTop: spacing.md,
    fontSize: typography.caption,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.gold,
  },
});
