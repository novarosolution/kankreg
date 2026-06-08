import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FIGMA } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";

/** Premium home loading placeholders */
export default function NativeHomeSkeleton() {
  if (Platform.OS === "web") return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <LinearGradient colors={["#ece3d2", "#e3d8c4"]} style={StyleSheet.absoluteFillObject} />
      </View>
      <View style={styles.catRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.cat} />
        ))}
      </View>
      <View style={styles.grid}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.card}>
            <View style={styles.tile} />
            <View style={styles.lineShort} />
            <View style={styles.lineLong} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
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
    backgroundColor: FIGMA.paper2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: FIGMA.gutter,
    gap: 11,
  },
  card: {
    width: "47.5%",
    backgroundColor: FIGMA.card,
    borderRadius: FIGMA.radiusCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    padding: 10,
    gap: 8,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: FIGMA.paper2,
  },
  lineShort: {
    height: 8,
    width: "40%",
    borderRadius: 4,
    backgroundColor: FIGMA.paper2,
  },
  lineLong: {
    height: 10,
    width: "75%",
    borderRadius: 4,
    backgroundColor: FIGMA.paper2,
  },
});
