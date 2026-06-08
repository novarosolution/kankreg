import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FIGMA } from "../../theme/figmaApp";
import { spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";
import NativeProductCard from "./NativeProductCard";

const gridShadow = platformShadow({
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  android: { elevation: 2 },
});

/** Premium 2-up product grid for home bestsellers */
export default function NativeBestsellersGrid({ products, onProductPress, onAddToCart }) {
  if (Platform.OS === "web") return null;

  return (
    <View style={[styles.shell, gridShadow]}>
      <LinearGradient
        colors={["rgba(255,253,248,0.98)", FIGMA.card]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.grid}>
        {products.map((item, idx) => (
          <View key={item.id} style={styles.cell}>
            <NativeProductCard
              product={item}
              index={idx}
              category={item.category || item.homeSection}
              isOutOfStock={item.inStock === false}
              isFeatured={idx === 0}
              onPress={() => onProductPress?.(item)}
              onAddToCart={() => onAddToCart?.(item)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: FIGMA.gutter,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
    overflow: "hidden",
    padding: 11,
    paddingTop: 13,
    marginBottom: spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  cell: {
    width: "47.8%",
    minWidth: 0,
  },
});
