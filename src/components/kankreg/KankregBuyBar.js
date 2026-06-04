import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PremiumButton from "../ui/PremiumButton";
import { formatINR } from "../../utils/currency";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { fonts } from "../../theme/tokens";

/** kankreg.html `#buybar` sticky product CTA */
export default function KankregBuyBar({
  visible,
  productName,
  price,
  onAddToCart,
  onBuyNow,
}) {
  const insets = useSafeAreaInsets();
  const { isXs, pageGutterClamp } = useKankregLayout();
  if (!visible) return null;

  return (
    <View
      style={[
        styles.bar,
        isXs && styles.barStack,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          paddingHorizontal: pageGutterClamp,
        },
      ]}
    >
      <View style={[styles.inner, isXs && styles.innerStack]}>
        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {productName}
          </Text>
          <Text style={styles.price}>{formatINR(price)}</Text>
        </View>
        <View style={[styles.actions, isXs && styles.actionsStack]}>
          <PremiumButton
            label="Add to cart"
            variant="primary"
            size="sm"
            onPress={onAddToCart}
            style={isXs ? styles.actionFull : null}
          />
          <PremiumButton
            label="Buy now"
            variant="gold"
            size="sm"
            onPress={onBuyNow}
            style={isXs ? styles.actionFull : null}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 253, 248, 0.96)",
    borderTopWidth: 1,
    borderTopColor: KANKREG_PALETTE.line,
    zIndex: 90,
    ...Platform.select({
      web: { backdropFilter: "blur(12px)" },
      default: {},
    }),
  },
  barStack: {
    paddingTop: 12,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },
  innerStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  meta: { flex: 1, minWidth: 0 },
  name: {
    fontFamily: FONT_DISPLAY,
    fontSize: 15,
    color: KANKREG_PALETTE.ink,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: KANKREG_PALETTE.gold,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    flexShrink: 0,
  },
  actionsStack: {
    width: "100%",
  },
  actionFull: {
    flex: 1,
  },
});
