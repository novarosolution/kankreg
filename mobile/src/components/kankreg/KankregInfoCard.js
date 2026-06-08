import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import PremiumButton from "../ui/PremiumButton";
import { useTheme } from "../../context/ThemeContext";
import { ALCHEMY, FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { customerPanel } from "../../theme/screenLayout";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { spacing, typography } from "../../theme/tokens";

/** kankreg.html `.info-card` — title row + optional ghost action + body. */
export default function KankregInfoCard({ title, actionLabel, onAction, children, style }) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const { isXs } = useKankregLayout();
  const panel = useMemo(() => customerPanel(c, shadowPremium, isDark), [c, shadowPremium, isDark]);

  return (
    <View
      style={[
        panel,
        styles.card,
        isXs && styles.cardCompact,
        { backgroundColor: isDark ? c.surface : ALCHEMY.cardBg },
        style,
      ]}
    >
      {title ? (
        <View style={styles.head}>
          <Text style={[styles.title, { color: isDark ? c.textPrimary : KANKREG_PALETTE.ink }]}>{title}</Text>
          {actionLabel && onAction ? (
            <PremiumButton label={actionLabel} variant="ghost" size="sm" onPress={onAction} />
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md + 2,
    padding: spacing.lg,
    borderRadius: 18,
  },
  cardCompact: {
    padding: spacing.md + 2,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h3,
    fontWeight: "500",
    letterSpacing: -0.3,
  },
});
