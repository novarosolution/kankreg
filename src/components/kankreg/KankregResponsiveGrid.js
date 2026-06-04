import React from "react";
import { StyleSheet, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/**
 * Flex-wrap grid matching kankreg.html `.pgrid` / `.reward-grid` breakpoints.
 */
export default function KankregResponsiveGrid({ children, variant = "catalog", style }) {
  const { catalogGridCol, statCols, isXs, catalogCardCompact } = useKankregLayout();
  const colStyle =
    variant === "stats"
      ? {
          width: statCols === 1 ? "100%" : statCols === 2 ? "48%" : "23%",
          maxWidth: statCols === 1 ? "100%" : statCols === 2 ? "48%" : "25%",
          minWidth: isXs ? "100%" : variant === "stats" && statCols === 4 ? 180 : 140,
          paddingHorizontal: 6,
        }
      : catalogGridCol;

  const gridMargin = variant === "catalog" && (isXs || catalogCardCompact) ? -5 : -9;

  return (
    <View style={[styles.grid, { marginHorizontal: gridMargin }, style]}>
      {React.Children.map(children, (child) =>
        child ? (
          <View style={[styles.cell, colStyle, catalogCardCompact && styles.cellCompact]}>{child}</View>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -9,
    width: "100%",
  },
  cell: {
    marginBottom: 14,
  },
  cellCompact: {
    marginBottom: 12,
  },
});
