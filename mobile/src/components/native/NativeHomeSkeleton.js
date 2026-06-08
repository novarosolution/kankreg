import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { FIGMA, figmaRowBorder, figmaSurfaceBg } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";

/** Premium home loading placeholders */
export default function NativeHomeSkeleton() {
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;

  const shimmer = isDark ? "#24201d" : FIGMA.paper2;
  const cardBg = figmaSurfaceBg(isDark);
  const border = figmaRowBorder(isDark);

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <LinearGradient
          colors={isDark ? ["#1a1714", "#24201d"] : ["#ece3d2", "#e3d8c4"]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={styles.catRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.cat, { backgroundColor: shimmer }]} />
        ))}
      </View>
      <View style={styles.grid}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.card, border, { backgroundColor: cardBg }]}>
            <View style={[styles.tile, { backgroundColor: shimmer }]} />
            <View style={[styles.lineShort, { backgroundColor: shimmer }]} />
            <View style={[styles.lineLong, { backgroundColor: shimmer }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
    backgroundColor: "transparent",
  },
  hero: {
    height: 158,
    borderRadius: FIGMA.radiusHero,
    marginHorizontal: FIGMA.gutter,
    overflow: "hidden",
    opacity: 0.7,
  },
  catRow: {
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: FIGMA.gutter,
  },
  cat: {
    width: 78,
    height: 78,
    borderRadius: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: FIGMA.gutter,
    gap: 11,
  },
  card: {
    width: "47.5%",
    borderRadius: FIGMA.radiusCard,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    gap: 8,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 12,
  },
  lineShort: {
    height: 8,
    width: "40%",
    borderRadius: 4,
  },
  lineLong: {
    height: 10,
    width: "75%",
    borderRadius: 4,
  },
});
