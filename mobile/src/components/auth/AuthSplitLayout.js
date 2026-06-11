import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { KankregGrainOverlay } from "../kankreg/KankregPageChrome";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { ALCHEMY } from "../../theme/customerAlchemy";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, lineHeight, radius, spacing, typography } from "../../theme/tokens";

/**
 * kankreg.html `.auth` split panel — used on web for Login / Register.
 */
export default function AuthSplitLayout({ artTitle, artSubtitle, children }) {
  const { useAuthSplit, isXs } = useKankregLayout();
  const useSplit = useAuthSplit;

  if (!useSplit) {
    return <View style={styles.mobileOnly}>{children}</View>;
  }

  return (
    <View style={[styles.split, isXs && styles.splitStack]}>
      <View style={[styles.art, isXs && styles.artStack]}>
        <LinearGradient
          colors={["#ead9b2", "#b6985c", "#2a241e"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <KankregGrainOverlay />
        <View style={[styles.heroIllo, styles.heroIlloPeNone]}>
          <Ionicons name="bag-handle" size={Platform.OS === "web" ? 120 : 88} color="rgba(255,255,255,0.35)" />
        </View>
        <View style={styles.artCopy}>
          <Text style={styles.artEyebrow}>Welcome to kankreg</Text>
          {artTitle ? (
            <Text style={styles.artTitle}>{artTitle}</Text>
          ) : (
            <Text style={styles.artTitle}>
              Goods worth{"\n"}coming back for.
            </Text>
          )}
          {artSubtitle ? <Text style={styles.artSub}>{artSubtitle}</Text> : null}
        </View>
      </View>
      <View style={[styles.form, isXs && styles.formStack]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileOnly: {
    width: "100%",
  },
  split: {
    flexDirection: "row",
    minHeight: 520,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
  },
  splitStack: {
    flexDirection: "column",
    minHeight: 0,
  },
  art: {
    flex: 1,
    minHeight: 320,
    position: "relative",
    overflow: "hidden",
  },
  heroIllo: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: "18%",
  },
  heroIlloPeNone: {
    pointerEvents: "none",
  },
  artStack: {
    minHeight: 220,
    flex: 0,
  },
  artCopy: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xl + 8,
  },
  artEyebrow: {
    fontFamily: fonts.semibold,
    fontSize: typography.overline,
    letterSpacing: 3.6,
    textTransform: "uppercase",
    color: ALCHEMY.goldBright,
    marginBottom: spacing.sm,
  },
  artTitle: {
    fontFamily: FONT_HEADING,
    fontSize: typography.h2 + 6,
    lineHeight: lineHeight.h2 + 4,
    color: KANKREG_PALETTE.paper,
    letterSpacing: -0.5,
  },
  artSub: {
    marginTop: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall,
    color: "rgba(245, 239, 228, 0.85)",
    maxWidth: 280,
  },
  form: {
    flex: 1,
    backgroundColor: KANKREG_PALETTE.card,
    padding: spacing.xl + 12,
    justifyContent: "center",
    minWidth: 280,
  },
  formStack: {
    minWidth: 0,
    width: "100%",
  },
});
