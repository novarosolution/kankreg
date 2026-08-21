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

  const renderCell = (child, key) => (
    <View key={key} style={[styles.cell, colStyle, catalogCardCompact && styles.cellCompact]}>
      {child}
    </View>
  );

  /** Center a trailing row that doesn't fill all columns instead of leaving it
   *  stuck to the left with a dead empty gap beside it. */
  const columns = variant === "catalog" ? Math.round(100 / parseFloat(colStyle.width || "100")) : 1;
  const childArray = React.Children.toArray(children).filter(Boolean);
  const orphanCount = columns > 1 ? childArray.length % columns : 0;

  if (!orphanCount) {
    return (
      <View style={[styles.grid, { marginHorizontal: gridMargin }, style]}>
        {childArray.map((child, i) => renderCell(child, child.key ?? i))}
      </View>
    );
  }

  const fullRowChildren = childArray.slice(0, childArray.length - orphanCount);
  const orphanChildren = childArray.slice(childArray.length - orphanCount);

  return (
    <View style={style}>
      <View style={[styles.grid, { marginHorizontal: gridMargin }]}>
        {fullRowChildren.map((child, i) => renderCell(child, child.key ?? i))}
      </View>
      <View style={[styles.grid, styles.gridCentered, { marginHorizontal: gridMargin }]}>
        {orphanChildren.map((child, i) => renderCell(child, child.key ?? `orphan-${i}`))}
      </View>
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
  gridCentered: {
    justifyContent: "center",
  },
  cell: {
    marginBottom: 14,
  },
  cellCompact: {
    marginBottom: 12,
  },
});
