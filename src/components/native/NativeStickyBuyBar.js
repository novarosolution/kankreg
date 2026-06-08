import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FIGMA, figmaDisplayTitle, figmaStickyFooter } from "../../theme/figmaApp";
import { customerFloatingNavOffset } from "../../theme/screenLayout";
import { formatINR } from "../../utils/currency";
import { fonts } from "../../theme/tokens";

/** figmaforkankreg.html product sticky buy bar */
export default function NativeStickyBuyBar({
  visible,
  price,
  onAddToCart,
  disabled = false,
  ctaLabel = "Add to cart",
}) {
  const insets = useSafeAreaInsets();
  if (Platform.OS === "web" || !visible) return null;

  return (
    <View
      style={[
        figmaStickyFooter(),
        styles.bar,
        { bottom: customerFloatingNavOffset(insets), paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Total</Text>
        <Text style={[figmaDisplayTitle(20), styles.price]}>{formatINR(price)}</Text>
      </View>
      <Pressable
        onPress={onAddToCart}
        disabled={disabled}
        style={({ pressed }) => [styles.ctaWrap, (pressed || disabled) && { opacity: 0.88 }]}
      >
        <LinearGradient
          colors={disabled ? ["#9a9a9a", "#7a7a7a"] : ["#cba24e", "#9c6b27"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 90,
  },
  meta: {
    flexShrink: 0,
  },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: FIGMA.inkFaint,
  },
  price: {
    fontWeight: "600",
  },
  ctaWrap: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
  cta: {
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 999,
  },
  ctaText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: "#fff",
  },
});
