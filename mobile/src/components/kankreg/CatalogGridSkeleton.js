import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonBlock from "../ui/SkeletonBlock";
import KankregResponsiveGrid from "./KankregResponsiveGrid";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import useLoadingShell from "../loading/useLoadingShell";

/** Placeholder tiles while catalog loads. */
export default function CatalogGridSkeleton({ count = 4 }) {
  const { catalogCardCompact } = useKankregLayout();
  const shell = useLoadingShell();
  const h = catalogCardCompact ? 220 : 280;

  return (
    <View style={shell.wrap}>
    <KankregResponsiveGrid>
      {Array.from({ length: count }).map((_, i) => (
        <View key={`sk-${i}`} style={styles.cell}>
          <SkeletonBlock height={h * 0.58} rounded={14} />
          <SkeletonBlock height={9} width="60%" rounded="sm" style={styles.gapSm} />
          <SkeletonBlock height={12} width="40%" rounded="sm" style={styles.gapXs} />
        </View>
      ))}
    </KankregResponsiveGrid>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { width: "100%", paddingBottom: 8 },
  gapSm: { marginTop: 9 },
  gapXs: { marginTop: 7 },
});
