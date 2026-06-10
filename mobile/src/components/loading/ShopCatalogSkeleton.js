import React from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme/tokens";
import SkeletonBlock from "../ui/SkeletonBlock";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import useLoadingShell from "./useLoadingShell";

/** Shop catalog loading — toolbar + product grid shimmer. */
export default function ShopCatalogSkeleton({ count = 6 }) {
  const { catalogCardCompact } = useKankregLayout();
  const shell = useLoadingShell();
  const tileH = catalogCardCompact ? 200 : 248;

  return (
    <View style={[styles.wrap, shell.wrap]}>
      <View style={styles.pillRow}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} width={68} height={28} rounded="pill" />
        ))}
      </View>

      <View style={styles.toolbar}>
        <SkeletonBlock width={88} height={34} rounded="md" />
        <SkeletonBlock width={72} height={34} rounded="md" />
        <SkeletonBlock width={96} height={34} rounded="md" />
      </View>

      <View style={styles.grid}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={styles.cell}>
            <SkeletonBlock width="100%" height={tileH * 0.58} rounded="lg" />
            <SkeletonBlock width="70%" height={12} rounded="sm" style={styles.gapSm} />
            <SkeletonBlock width="45%" height={16} rounded="sm" style={styles.gapXs} />
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  cell: {
    width: "47.5%",
    minWidth: 0,
  },
  gapXs: { marginTop: 7 },
  gapSm: { marginTop: 10 },
});
