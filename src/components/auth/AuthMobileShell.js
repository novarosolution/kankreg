import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BrandLogo from "../BrandLogo";
import { BRAND_LOGO_SIZE } from "../../constants/brand";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { ALCHEMY, FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, lineHeight, spacing, typography } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

/**
 * Phone-native auth shell: single card with gradient header + form (kankreg.html `.auth` stacked).
 */
export default function AuthMobileShell({ children, artTitle, artSubtitle }) {
  const { isXs } = useKankregLayout();
  const title =
    artTitle ||
    (isXs ? "Goods worth coming back for." : "Goods worth\ncoming back for.");

  return (
    <View style={[styles.card, cardShadow]}>
      <View style={[styles.art, isXs && styles.artCompact]}>
        <LinearGradient
          colors={["#ead9b2", "#b6985c", "#2a241e"]}
          locations={[0, 0.48, 1]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={["rgba(255, 247, 224, 0.45)", "rgba(255, 247, 224, 0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.85 }}
          style={[StyleSheet.absoluteFillObject, styles.artSpotlight]}
          pointerEvents="none"
        />
        <View style={styles.artIconWrap} pointerEvents="none">
          <Ionicons name="bag-handle" size={isXs ? 56 : 72} color="rgba(255,255,255,0.28)" />
        </View>
        <BrandLogo
          width={isXs ? BRAND_LOGO_SIZE.authHero - 20 : BRAND_LOGO_SIZE.authHero - 8}
          height={isXs ? BRAND_LOGO_SIZE.authHero - 20 : BRAND_LOGO_SIZE.authHero - 8}
          style={styles.logo}
        />
        <Text style={styles.eyebrow}>Welcome to kankreg</Text>
        <Text style={[styles.artTitle, isXs && styles.artTitleCompact]}>{title}</Text>
        {artSubtitle ? (
          <Text style={styles.artSub} numberOfLines={2}>
            {artSubtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.form, isXs && styles.formCompact]}>{children}</View>
    </View>
  );
}

const cardShadow = platformShadow({
  web: {
    boxShadow: "0 18px 44px rgba(25, 20, 15, 0.1), 0 4px 14px rgba(25, 20, 15, 0.06)",
  },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
  },
  android: { elevation: 5 },
});

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 468,
    alignSelf: "center",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
  },
  art: {
    minHeight: 168,
    paddingVertical: spacing.lg + 4,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  artCompact: {
    minHeight: 148,
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md + 2,
  },
  artSpotlight: {
    opacity: 0.9,
  },
  artIconWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.md,
  },
  logo: {
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  eyebrow: {
    zIndex: 1,
    fontFamily: fonts.semibold,
    fontSize: typography.overline,
    letterSpacing: 2.6,
    textTransform: "uppercase",
    color: ALCHEMY.goldBright,
    marginBottom: spacing.xs,
  },
  artTitle: {
    zIndex: 1,
    textAlign: "center",
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h2 + 2,
    lineHeight: lineHeight.h2 + 4,
    color: KANKREG_PALETTE.paper,
    letterSpacing: -0.4,
  },
  artTitleCompact: {
    fontSize: typography.h3,
    lineHeight: lineHeight.h3 + 2,
  },
  artSub: {
    zIndex: 1,
    marginTop: spacing.xs,
    textAlign: "center",
    fontSize: typography.caption,
    color: "rgba(245, 239, 228, 0.88)",
    maxWidth: 300,
    lineHeight: 18,
  },
  form: {
    paddingHorizontal: spacing.lg + 4,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg + 6,
    backgroundColor: KANKREG_PALETTE.card,
  },
  formCompact: {
    paddingHorizontal: spacing.md + 2,
    paddingTop: spacing.md + 4,
    paddingBottom: spacing.md + 6,
  },
});
