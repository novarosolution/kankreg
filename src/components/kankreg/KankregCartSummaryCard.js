import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FIGMA, figmaCardShell, figmaRowBorder, figmaTextPrimary, figmaTextSecondary } from "../../theme/figmaApp";
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
  const textSecondary = figmaTextSecondary(isDark);
  const textPrimary = figmaTextPrimary(isDark);

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
          <Text style={[styles.label, textSecondary]}>Subtotal</Text>
          <Text style={[styles.value, textPrimary]}>{formatINR(subtotal)}</Text>
        </View>
        {platformFee > 0 ? (
          <View style={styles.line}>
            <Text style={[styles.label, textSecondary]}>Service fee</Text>
            <Text style={[styles.value, textPrimary]}>{formatINR(platformFee)}</Text>
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
        style={[styles.payInline, figmaRowBorder(isDark)]}
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
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  discount: {
    color: FIGMA.green,
  },
  payInline: {
    marginTop: spacing.xs,
    paddingHorizontal: 0,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
  },
});
