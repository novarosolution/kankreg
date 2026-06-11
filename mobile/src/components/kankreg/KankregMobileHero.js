import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import PremiumButton from "../ui/PremiumButton";
import { createKankregEyebrowStyle } from "../../theme/kankregScreenStyles";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { fonts, spacing, typography } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { navigateCustomerRoute } from "../../navigation/customerNavigate";
import { HOME_SCREEN_UI } from "../../content/appContent";

/** Compact hero when editorial split hero is hidden (<900px) */
export default function KankregMobileHero({ navigation, featuredProduct, heroTitle, heroSubtitle }) {
  const { isDark } = useTheme();
  const { useSplitLayout, isXs, isMobileWeb } = useKankregLayout();
  if (useSplitLayout) return null;

  const title = heroTitle || HOME_SCREEN_UI.hero.titleFallback;
  const subtitle = heroSubtitle || HOME_SCREEN_UI.hero.subtitleFallback;
  const welcomeTag = HOME_SCREEN_UI.web?.welcomeTag;

  return (
    <View style={[styles.wrap, isXs && styles.wrapXs, isMobileWeb && styles.wrapMobileWeb, isDark && styles.wrapDark]}>
      {welcomeTag && isMobileWeb ? (
        <Text style={[styles.welcomeTag, { color: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.goldDeep }]}>
          {welcomeTag}
        </Text>
      ) : (
        <Text style={createKankregEyebrowStyle(isDark)}>{HOME_SCREEN_UI.editorial.overline}</Text>
      )}
      <Text
        style={[
          styles.h1,
          isXs && styles.h1Xs,
          { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.lead, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
          {subtitle}
        </Text>
      ) : null}
      <View style={[styles.ctas, isXs && styles.ctasStack, !subtitle && styles.ctasTight]}>
        <PremiumButton
          label={HOME_SCREEN_UI.editorial.ctaShop}
          variant="primary"
          onPress={() => navigateCustomerRoute(navigation, "Shop")}
          style={isXs ? styles.ctaFull : null}
        />
        <PremiumButton
          label={HOME_SCREEN_UI.editorial.ctaRewards}
          variant="ghost"
          onPress={() => navigation.navigate("RedeemRewards")}
          style={isXs ? styles.ctaFull : null}
        />
      </View>
      {featuredProduct?.name && !isMobileWeb ? (
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
  wrapMobileWeb: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md + 2,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
    ...Platform.select({
      web: {
        boxShadow: "0 18px 44px -28px rgba(25,20,15,.28), inset 0 1px 0 rgba(255,255,255,.92)",
      },
      default: {},
    }),
  },
  wrapDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
    ...Platform.select({
      web: {
        boxShadow: "0 18px 44px -28px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.04)",
      },
      default: {},
    }),
  },
  wrapXs: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  welcomeTag: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  h1: {
    fontFamily: FONT_HEADING,
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
  ctasStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  ctasTight: {
    marginTop: spacing.md,
  },
  ctaFull: {
    width: "100%",
  },
  featured: {
    marginTop: spacing.md,
    fontSize: typography.caption,
    fontFamily: fonts.medium,
    color: KANKREG_PALETTE.gold,
  },
});
