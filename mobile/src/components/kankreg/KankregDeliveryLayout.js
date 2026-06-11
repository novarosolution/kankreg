import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OrderLiveMapCard from "../orders/OrderLiveMapCard";
import KankregSplitLayout from "./KankregSplitLayout";
import { useTheme } from "../../context/ThemeContext";
import { getKankregSurfaces } from "../../theme/kankregWeb";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { icon, spacing } from "../../theme/tokens";

/** kankreg.html `.deliv-grid` — assignments + route map */
export default function KankregDeliveryLayout({ main, activeOrderId, etaLabel }) {
  const { colors: c, isDark } = useTheme();
  const surfaces = useMemo(() => getKankregSurfaces(isDark, c), [isDark, c]);
  const styles = useMemo(() => createStyles(surfaces, isDark), [surfaces, isDark]);

  const aside = (
    <View style={styles.mapCard}>
      {activeOrderId ? (
        <OrderLiveMapCard orderId={activeOrderId} />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={icon.xl} color={surfaces.textMuted} />
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

function createStyles(surfaces, isDark) {
  return StyleSheet.create({
    mapCard: {
      minHeight: 320,
      height: 420,
      borderRadius: 22,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: surfaces.border,
      backgroundColor: isDark ? surfaces.cardMuted : surfaces.cardMuted,
    },
    mapPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
      gap: spacing.sm,
    },
    mapPlaceholderTitle: {
      fontFamily: FONT_HEADING,
      fontSize: 18,
      color: surfaces.text,
    },
    mapPlaceholderSub: {
      fontSize: 13,
      color: surfaces.textMuted,
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
      backgroundColor: isDark ? "rgba(24, 21, 19, 0.92)" : "rgba(255,252,247,0.92)",
      borderWidth: 1,
      borderColor: surfaces.border,
    },
    etaText: {
      fontSize: 13,
      color: surfaces.text,
    },
  });
}
