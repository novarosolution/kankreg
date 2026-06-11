import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing as ReanimatedEasing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useReducedMotion from "../../hooks/useReducedMotion";
import { fonts, radius } from "../../theme/tokens";
import { getOrderStatusLabel } from "../../utils/orderStatus";

export function AdminPaymentStatusChip({ paymentStatus, c }) {
  const ps = String(paymentStatus || "pending").toLowerCase();
  const label =
    ps === "paid"
      ? "Paid"
      : ps === "pending"
        ? "Payment pending"
        : ps === "failed"
          ? "Payment failed"
          : ps === "refunded"
            ? "Refunded"
            : String(paymentStatus || "—");
  const bg =
    ps === "paid"
      ? c.secondarySoft
      : ps === "failed"
        ? "rgba(220, 38, 38, 0.08)"
        : ps === "refunded"
          ? c.surfaceMuted
          : c.primarySoft;
  const border =
    ps === "paid" ? c.secondaryBorder : ps === "failed" ? c.danger : ps === "refunded" ? c.border : c.primaryBorder;
  const textColor =
    ps === "paid" ? c.secondaryDark : ps === "failed" ? c.danger : ps === "refunded" ? c.textMuted : c.primaryDark;

  return (
    <View style={[styles.paymentBadge, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.paymentBadgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export function AdminOrderStatusBadge({ status, c, compact }) {
  const reducedMotion = useReducedMotion();
  const s = String(status || "");
  let target = 1;
  if (s === "cancelled") target = 0;
  else if (s === "delivered") target = 3;
  else if (["shipped", "out_for_delivery", "ready_for_pickup"].includes(s)) target = 2;
  else if (["pending", "pending_payment", "confirmed", "preparing", "paid"].includes(s)) target = 1;

  const anim = useSharedValue(reducedMotion ? target : 0);
  useEffect(() => {
    if (reducedMotion) {
      anim.value = target;
      return;
    }
    anim.value = withTiming(target, {
      duration: 360,
      easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
    });
  }, [target, reducedMotion, anim]);

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      anim.value,
      [0, 1, 2, 3],
      [c.surfaceMuted, c.primarySoft, c.secondarySoft, c.secondarySoft]
    ),
    borderColor: interpolateColor(
      anim.value,
      [0, 1, 2, 3],
      [c.danger, c.primaryBorder, c.secondaryBorder, c.secondaryBorder]
    ),
  }));

  return (
    <Animated.View style={[styles.statusBadge, compact && styles.statusBadgeCompact, pillStyle]}>
      <Text style={[styles.statusBadgeText, { color: c.textPrimary }]}>{getOrderStatusLabel(s)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeCompact: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  paymentBadge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  paymentBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  },
});
