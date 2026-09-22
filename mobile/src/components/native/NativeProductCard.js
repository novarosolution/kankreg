import React from "react";
import StorefrontProductCard from "../StorefrontProductCard";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/** Native + shop product tile — same storefront card as web listings. */
export default function NativeProductCard({
  product,
  onPress,
  onAddToCart,
  isOutOfStock = false,
  isComingSoon = false,
  comingSoonNote = "",
  compact: compactProp,
}) {
  const { catalogCardCompact } = useKankregLayout();
  const compact = compactProp ?? catalogCardCompact;
  return (
    <StorefrontProductCard
      product={product}
      onPress={onPress}
      onAddToCart={onAddToCart}
      isOutOfStock={isOutOfStock}
      isComingSoon={isComingSoon}
      comingSoonNote={comingSoonNote}
      compact={compact}
    />
  );
}
