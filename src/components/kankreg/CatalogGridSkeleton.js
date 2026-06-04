import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonBlock from "../ui/SkeletonBlock";
import KankregResponsiveGrid from "./KankregResponsiveGrid";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/** Placeholder tiles while catalog loads. */
export default function CatalogGridSkeleton({ count = 4 }) {
  const { catalogCardCompact } = useKankregLayout();
  const h = catalogCardCompact ? 220 : 280;

  return (
    <KankregResponsiveGrid>
      {Array.from({ length: count }).map((_, i) => (
        <View key={`sk-${i}`} style={styles.cell}>
          <SkeletonBlock height={h * 0.55} rounded="lg" />
          <SkeletonBlock height={14} rounded="sm" style={styles.gap} />
          <SkeletonBlock height={18} width="70%" rounded="sm" />
          <SkeletonBlock height={36} width={36} rounded="full" style={styles.gap} />
        </View>
      ))}
    </KankregResponsiveGrid>
  );
}

const styles = StyleSheet.create({
  cell: { width: "100%", paddingBottom: 8 },
  gap: { marginTop: 10 },
});
