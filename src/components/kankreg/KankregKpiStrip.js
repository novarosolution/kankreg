import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { getKankregSurfaces } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, spacing } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";
import SectionReveal from "../motion/SectionReveal";

const cardShadow = platformShadow({
  web: { boxShadow: "0 8px 22px rgba(25, 20, 15, 0.06)" },
  ios: {
    shadowColor: "#19140f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
});

/** kankreg.html `.kpis` row on profile (Orders / Saved / Points). */
export default function KankregKpiStrip({ items = [] }) {
  const { colors: c, isDark } = useTheme();
  const surfaces = getKankregSurfaces(isDark, c);
  const { isXs, isMobileWeb } = useKankregLayout();
  const stackVertically = isXs && !isMobileWeb;

  return (
    <View style={[styles.row, stackVertically ? styles.rowStack : styles.rowInline]}>
      {items.map((item, idx) => (
        <SectionReveal
          key={item.key}
          index={idx}
          preset="fade-up"
          delay={idx * 40}
          style={stackVertically ? styles.cellStack : styles.cellInline}
        >
          <Pressable
            onPress={item.onPress}
            disabled={!item.onPress}
            style={({ pressed, hovered }) => [
              styles.kpi,
              stackVertically ? styles.kpiStacked : styles.kpiInline,
              {
                backgroundColor: surfaces.card,
                borderColor: surfaces.border,
              },
              (pressed || (Platform.OS === "web" && hovered)) && item.onPress ? styles.kpiPressed : null,
            ]}
            accessibilityRole={item.onPress ? "button" : "text"}
          >
            <Text style={[styles.lbl, { color: surfaces.textMuted }]}>{item.label}</Text>
            <Text style={[styles.n, { color: surfaces.text }]}>{item.value}</Text>
          </Pressable>
        </SectionReveal>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    alignSelf: "stretch",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  rowInline: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  rowStack: {
    flexDirection: "column",
  },
  cellInline: {
    flex: 1,
    minWidth: 0,
  },
  cellStack: {
    width: "100%",
    alignSelf: "stretch",
  },
  kpi: {
    padding: spacing.md + 4,
    borderRadius: 16,
    borderWidth: 1,
    ...cardShadow,
  },
  kpiInline: {
    flex: 1,
    minWidth: 0,
    minHeight: 88,
  },
  kpiStacked: {
    width: "100%",
    alignSelf: "stretch",
  },
  kpiPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  lbl: {
    fontSize: 11.5,
    fontFamily: fonts.semibold,
    letterSpacing: 0.06,
    textTransform: "uppercase",
  },
  n: {
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    fontWeight: "600",
    marginTop: spacing.sm,
    letterSpacing: -0.5,
  },
});
