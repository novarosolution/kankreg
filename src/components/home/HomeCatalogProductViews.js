import React, { memo } from "react";
import { View } from "react-native";
import PremiumProductCard from "../PremiumProductCard";

/** Single-row catalog layout (memoized). */
export const HomeCatalogListRow = memo(function HomeCatalogListRow({
  item,
  index,
  totalInGroup,
  styles,
  navigation,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  isOutOfStock,
}) {
  return (
    <View
      style={[
        styles.productListRow,
        index < totalInGroup - 1 ? styles.productListRowDivider : styles.productListRowLast,
      ]}
    >
      <PremiumProductCard
        index={index}
        imagePriority={index < 4 ? "high" : "normal"}
        isOutOfStock={isOutOfStock}
        product={item}
        onPress={() => navigation.navigate("Product", { productId: item.id })}
        quantity={quantity}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
      />
    </View>
  );
});

/** Grid cell for responsive grid layout (memoized). */
export const HomeCatalogGridCard = memo(function HomeCatalogGridCard({
  item,
  idx,
  styles,
  catalogGridColStyle,
  navigation,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  isOutOfStock,
}) {
  return (
    <View style={[styles.productGridCell, catalogGridColStyle]}>
      <PremiumProductCard
        index={idx}
        imagePriority={idx < 4 ? "high" : "normal"}
        isOutOfStock={isOutOfStock}
        product={item}
        onPress={() => navigation.navigate("Product", { productId: item.id })}
        quantity={quantity}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
      />
    </View>
  );
});
