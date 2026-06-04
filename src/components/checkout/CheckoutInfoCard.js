import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { customerPanel } from "../../theme/screenLayout";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { spacing, typography } from "../../theme/tokens";

/** kankreg.html `.info-card` wrapper for checkout sections. */
export default function CheckoutInfoCard({ title, children, style }) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const panel = useMemo(() => customerPanel(c, shadowPremium, isDark), [c, shadowPremium, isDark]);

  return (
    <View style={[panel, styles.card, style]}>
      {title ? (
        <Text style={[styles.title, { color: c.textPrimary }]}>{title}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h3,
    fontWeight: "500",
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
});
