import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/** kankreg.html `.split` / `.deliv-grid` — main + sticky aside on wide screens */
export default function KankregSplitLayout({
  main,
  aside,
  reverseOnStack,
  variant = "default",
  mainStyle,
  asideStyle,
}) {
  const { useSplitLayout } = useKankregLayout();
  const asideColStyle = variant === "delivery" ? styles.asideColDelivery : styles.asideCol;

  if (!useSplitLayout) {
    return (
      <View style={styles.stack}>
        {main}
        {aside}
      </View>
    );
  }

  return (
    <View style={[styles.split, reverseOnStack && styles.splitReverse]}>
      <View style={[styles.mainCol, mainStyle]}>{main}</View>
      <View style={[asideColStyle, asideStyle]}>{aside}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 20,
  },
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 28,
  },
  splitReverse: {
    flexDirection: "column",
  },
  mainCol: {
    flex: 1.35,
    minWidth: 0,
  },
  asideCol: {
    flex: 1,
    minWidth: 280,
    maxWidth: 420,
    ...Platform.select({
      web: {
        position: "sticky",
        top: 100,
        alignSelf: "flex-start",
      },
      default: {},
    }),
  },
  asideColDelivery: {
    width: 360,
    maxWidth: 360,
    flexShrink: 0,
    minWidth: 280,
  },
});
