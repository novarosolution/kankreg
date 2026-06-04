import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { customerPanel, customerWebStickyTop } from "../../theme/screenLayout";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { fonts, spacing, typography } from "../../theme/tokens";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * kankreg.html `.summary` — order recap, coupon, totals, CTA slot, Razorpay footnote.
 */
export default function OrderSummaryAside({
  title = "Order summary",
  itemCount = 0,
  children,
  summaryRows,
  totalLabel = "Total",
  totalValue,
  ctaSlot,
  footnote,
  style,
}) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { useSplitLayout } = useKankregLayout();
  const panel = useMemo(() => customerPanel(c, shadowPremium, isDark), [c, shadowPremium, isDark]);

  const sticky =
    Platform.OS === "web" && useSplitLayout
      ? { position: "sticky", top: customerWebStickyTop(insets, 12) }
      : null;

  return (
    <View style={[panel, styles.wrap, sticky, style]}>
      <Text style={[styles.h3, { color: c.textPrimary }]}>{title}</Text>
      {itemCount > 0 ? (
        <View style={styles.itemRow}>
          <Text style={[styles.rowLabel, { color: c.textSecondary }]}>Items ({itemCount})</Text>
        </View>
      ) : null}
      {children}
      {summaryRows}
      {totalValue != null ? (
        <View style={[styles.totalRow, { borderTopColor: c.border }]}>
          <Text style={[styles.totalLabel, { color: c.textPrimary }]}>{totalLabel}</Text>
          <Text style={[styles.totalValue, { color: c.primary }]}>{totalValue}</Text>
        </View>
      ) : null}
      {ctaSlot ? <View style={styles.cta}>{ctaSlot}</View> : null}
      {footnote ? (
        <Text style={[styles.footnote, { color: c.textMuted }]}>{footnote}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  h3: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h3,
    fontWeight: "500",
    marginBottom: spacing.md,
  },
  itemRow: {
    marginBottom: spacing.sm,
  },
  rowLabel: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.medium,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.body,
    fontWeight: "600",
  },
  totalValue: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h2,
    fontWeight: "600",
  },
  cta: {
    marginTop: spacing.md,
  },
  footnote: {
    textAlign: "center",
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
});
