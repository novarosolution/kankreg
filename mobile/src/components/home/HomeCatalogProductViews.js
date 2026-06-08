import React, { memo } from "react";
import { View } from "react-native";
import PremiumProductCard from "../PremiumProductCard";

/** Grid cell for responsive catalog layout (memoized). */
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
  compact = false,
}) {
  return (
    <View style={[styles.productGridCell, catalogGridColStyle]}>
      <PremiumProductCard
        index={idx}
        compact={compact}
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
