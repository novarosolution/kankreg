import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OrderLiveMapCard from "../orders/OrderLiveMapCard";
import KankregSplitLayout from "./KankregSplitLayout";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { icon, spacing } from "../../theme/tokens";

/** kankreg.html `.deliv-grid` — assignments + route map */
export default function KankregDeliveryLayout({ main, activeOrderId, etaLabel }) {
  const aside = (
    <View style={styles.mapCard}>
      {activeOrderId ? (
        <OrderLiveMapCard orderId={activeOrderId} />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={icon.xl} color={KANKREG_PALETTE.inkFaint} />
          <Text style={styles.mapPlaceholderTitle}>Route map</Text>
          <Text style={styles.mapPlaceholderSub}>Select an active delivery to preview the route.</Text>
        </View>
      )}
      {etaLabel ? (
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>{etaLabel}</Text>
        </View>
      ) : null}
    </View>
  );

  return <KankregSplitLayout variant="delivery" main={main} aside={aside} />;
}

const styles = StyleSheet.create({
  mapCard: {
    minHeight: 320,
    height: 420,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  mapPlaceholderTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    color: KANKREG_PALETTE.ink,
  },
  mapPlaceholderSub: {
    fontSize: 13,
    color: KANKREG_PALETTE.inkFaint,
    textAlign: "center",
    maxWidth: 240,
  },
  etaPill: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,252,247,0.92)",
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
  },
  etaText: {
    fontSize: 13,
    color: KANKREG_PALETTE.ink,
  },
});
