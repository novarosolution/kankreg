import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { FIGMA } from "../../theme/figmaApp";
import { StorefrontProductRails } from "../StorefrontProductRail";

/** Home bestsellers — same storefront listing as web. */
export default function NativeBestsellersGrid({ products, onAddToCart, navigation }) {
  const items = Array.isArray(products) ? products : [];
  if (Platform.OS === "web" || !items.length) return null;

  return (
    <View style={styles.wrap}>
      <StorefrontProductRails products={items} navigation={navigation} onAddToCart={onAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingLeft: FIGMA.gutter,
  },
});
