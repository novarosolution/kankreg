import React, { useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { resolveCompareDisplay } from "../../utils/homeViewMedia";
import { SectionHeader, ScrollFadeUp } from "./editorial";
import GoldHairline from "../ui/GoldHairline";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SPACE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { fonts, icon, radius } from "../../theme/tokens";
import { resolveImageSource } from "../../utils/mediaSource";
import { getHomePhoneBleed } from "../../utils/homeSectionBleed";

function CompareRow({ row, oursLabel, ordinaryLabel, isDark, ink, muted, index }) {
  const oursImage = resolveImageSource(row.oursImage);

  return (
    <ScrollFadeUp index={index} delay={index * 50} preset="fade-up">
      <View style={[styles.row, isDark && styles.rowDark]}>
        <Text style={[styles.rowLabel, { color: muted }]} numberOfLines={2}>
          {row.label}
        </Text>
        <View style={styles.rowCells}>
          <View style={[styles.cell, styles.cellOrdinary, isDark && styles.cellOrdinaryDark]}>
            <View style={[styles.cellCross, isDark && styles.cellCrossDark]}>
              <Ionicons name="close" size={icon.xs} color={isDark ? "rgba(245,239,228,0.55)" : KANKREG_PALETTE.inkFaint} />
            </View>
            <View style={styles.cellTextCol}>
              <Text style={[styles.cellKicker, { color: isDark ? "rgba(245,239,228,0.42)" : KANKREG_PALETTE.inkFaint }]} numberOfLines={1}>
                {ordinaryLabel}
              </Text>
              <Text style={[styles.cellText, styles.cellTextOrdinary, { color: muted }]} numberOfLines={3}>
                {row.ordinary}
              </Text>
            </View>
          </View>

          <View style={[styles.cell, styles.cellOurs, isDark && styles.cellOursDark]}>
            {oursImage ? (
              <Image source={oursImage} style={styles.cellThumb} contentFit="cover" cachePolicy="memory-disk" />
            ) : (
              <View style={[styles.cellCheck, isDark && styles.cellCheckDark]}>
                <Ionicons name="checkmark" size={icon.xs} color={KANKREG_PALETTE.green} />
              </View>
            )}
            <View style={styles.cellTextCol}>
              <Text style={[styles.cellKicker, { color: isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold }]} numberOfLines={1}>
                {oursLabel}
              </Text>
              <Text style={[styles.cellText, { color: ink }]} numberOfLines={3}>
                {row.ours}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollFadeUp>
  );
}

/** "Ours vs ordinary" comparison — real, already-authored content that previously had
 *  no customer-facing component (admin could configure it, but nothing rendered it). */
export default function WebCompareSection({ compareSection }) {
  const { isDark } = useTheme();
  const { isMobileWeb, pageGutterClamp } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);

  const compare = useMemo(() => resolveCompareDisplay(compareSection), [compareSection]);

  if (!compare) return null;

  const bleed = getHomePhoneBleed({ isMobileWeb, pageGutterClamp, nativeFullWidth: true });

  return (
    <View
      nativeID="home-compare"
      style={[styles.section, isMobileWeb && styles.sectionPhone, bleed.outer, isDark && styles.sectionDark]}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(60, 98, 72, 0.08)", "transparent", "rgba(214, 173, 91, 0.05)"]
            : ["rgba(60, 98, 72, 0.06)", "transparent", "rgba(214, 173, 91, 0.08)"]
        }
        locations={[0, 0.5, 1]}
        style={styles.sectionWash}
        pointerEvents="none"
      />

      <View style={[styles.headerBlock, bleed.inner]}>
        <SectionHeader eyebrow={compare.eyebrow} title={compare.title} kicker={compare.subtitle} align="center" flush />
      </View>

      <GoldHairline {...GOLD_HAIRLINE_EDITORIAL.subtle} marginVertical={0} style={[styles.headerHairline, bleed.inner]} />

      <View style={[styles.rows, bleed.inner]}>
        {compare.rows.map((row, idx) => (
          <CompareRow
            key={row.id}
            row={row}
            oursLabel={compare.oursLabel}
            ordinaryLabel={compare.ordinaryLabel}
            isDark={isDark}
            ink={ink}
            muted={muted}
            index={idx}
          />
        ))}
      </View>

      {compare.closingTagline ? (
        <Text style={[styles.tagline, { color: muted }]} numberOfLines={2}>
          {compare.closingTagline}
        </Text>
      ) : null}
    </View>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow:
      "inset 0 1px 0 rgba(255, 253, 248, 0.96), 0 2px 6px rgba(60, 45, 20, 0.04), 0 28px 64px -32px rgba(80, 60, 25, 0.16)",
  },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
  },
  android: { elevation: 5 },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingTop: HOME_SPACE.xl + 12,
    paddingBottom: HOME_SPACE.xl + 8,
    paddingHorizontal: HOME_SPACE.lg + 6,
    borderRadius: radius.xl + 10,
    backgroundColor: KANKREG_CHROME.cream,
    borderWidth: 1,
    borderColor: "rgba(60, 98, 72, 0.18)",
    borderTopWidth: 3,
    borderTopColor: "rgba(60, 98, 72, 0.55)",
    overflow: "hidden",
    position: "relative",
    gap: HOME_SPACE.lg,
    ...cardShadow,
  },
  sectionPhone: {
    paddingHorizontal: HOME_SPACE.md,
    paddingVertical: HOME_SPACE.lg + 6,
    borderRadius: radius.xl + 6,
  },
  sectionDark: {
    backgroundColor: "rgba(24, 21, 19, 0.74)",
    borderColor: "rgba(60, 98, 72, 0.3)",
    borderTopColor: "rgba(134, 239, 172, 0.4)",
  },
  sectionWash: { ...StyleSheet.absoluteFillObject },
  headerBlock: { width: "100%", alignItems: "center", zIndex: 1 },
  headerHairline: { width: "100%", maxWidth: 420, alignSelf: "center", opacity: 0.55, zIndex: 1 },
  rows: { width: "100%", gap: HOME_SPACE.sm + 2, zIndex: 1 },
  row: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.14)",
    backgroundColor: "rgba(255, 253, 248, 0.6)",
    padding: HOME_SPACE.sm + 2,
    gap: HOME_SPACE.xs + 2,
  },
  rowDark: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(214, 173, 91, 0.1)",
  },
  rowLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  rowCells: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.sm,
  },
  cell: {
    flexGrow: 1,
    flexBasis: 220,
    flexDirection: "row",
    alignItems: "center",
    gap: HOME_SPACE.sm,
    borderRadius: radius.md,
    paddingVertical: HOME_SPACE.sm,
    paddingHorizontal: HOME_SPACE.sm + 2,
  },
  cellOrdinary: {
    backgroundColor: "rgba(120, 108, 90, 0.06)",
  },
  cellOrdinaryDark: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  cellOurs: {
    backgroundColor: "rgba(60, 98, 72, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(60, 98, 72, 0.16)",
  },
  cellOursDark: {
    backgroundColor: "rgba(134, 239, 172, 0.06)",
    borderColor: "rgba(134, 239, 172, 0.18)",
  },
  cellCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(60, 98, 72, 0.14)",
    flexShrink: 0,
  },
  cellCross: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(120, 108, 90, 0.1)",
    flexShrink: 0,
  },
  cellCrossDark: {
    backgroundColor: "rgba(245, 239, 228, 0.06)",
  },
  cellCheckDark: {
    backgroundColor: "rgba(134, 239, 172, 0.16)",
  },
  cellThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    flexShrink: 0,
  },
  cellTextCol: { flex: 1, minWidth: 0, gap: 1 },
  cellKicker: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cellText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  cellTextOrdinary: {
    textDecorationLine: "line-through",
    textDecorationColor: "rgba(120, 108, 90, 0.35)",
  },
  tagline: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.3,
    zIndex: 1,
  },
});
