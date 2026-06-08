import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FIGMA, figmaCardShell } from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { formatINR } from "../../utils/currency";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";
import KankregCartCouponStrip from "./KankregCartCouponStrip";
import KankregCartPayBar from "./KankregCartPayBar";

const cardShadow = platformShadow({
  web: { boxShadow: "0 8px 24px rgba(61, 42, 18, 0.07)" },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  android: { elevation: 3 },
});

/** Web cart aside / inline summary — figma cart footer card */
export default function KankregCartSummaryCard({
  subtotal,
  discount = 0,
  discountLabel,
  platformFee = 0,
  total,
  ctaLabel,
  onPress,
  disabled,
  loading,
  showCoupon = false,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  appliedCouponText,
  itemCount = 0,
}) {
  const { isDark } = useTheme();

  return (
    <View style={[figmaCardShell(isDark), styles.card, cardShadow]}>
      {showCoupon ? (
        <KankregCartCouponStrip
          value={couponCode}
          onChangeText={onCouponChange}
          onApply={onApplyCoupon}
          appliedLabel={appliedCouponText}
        />
      ) : null}

      <View style={styles.lines}>
        <View style={styles.line}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatINR(subtotal)}</Text>
        </View>
        {platformFee > 0 ? (
          <View style={styles.line}>
            <Text style={styles.label}>Service fee</Text>
            <Text style={styles.value}>{formatINR(platformFee)}</Text>
          </View>
        ) : null}
        {discount > 0 ? (
          <View style={styles.line}>
            <Text style={[styles.label, styles.discount]}>{discountLabel || "Discount"}</Text>
            <Text style={[styles.value, styles.discount]}>−{formatINR(discount)}</Text>
          </View>
        ) : null}
      </View>

      <KankregCartPayBar
        mode="inline"
        compact
        subtotal={subtotal}
        total={total}
        ctaLabel={ctaLabel}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
        style={styles.payInline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.md + 2,
    gap: spacing.sm,
  },
  metaLine: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: FIGMA.inkSoft,
    marginTop: 2,
  },
  lines: {
    gap: 4,
    marginTop: spacing.xs,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: FIGMA.inkSoft,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: FIGMA.ink,
  },
  discount: {
    color: FIGMA.green,
  },
  payInline: {
    marginTop: spacing.xs,
    paddingHorizontal: 0,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: FIGMA.line,
    backgroundColor: "transparent",
  },
});
