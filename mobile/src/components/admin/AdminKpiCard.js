import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { FONT_PRICE } from "../../theme/typographyRoles";
import { fonts } from "../../theme/tokens";

export default function AdminKpiCard({ label, value, delta, deltaUp = true, style }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      {delta ? (
        <Text style={[styles.delta, deltaUp ? styles.up : styles.down]} numberOfLines={1}>
          {deltaUp ? "▲" : "▼"} {delta}
        </Text>
      ) : null}
    </View>
  );
}

export function AdminKpiGrid({ children, columns = 4, compact = false }) {
  return (
    <View
      style={[
        stylesGrid.grid,
        compact && stylesGrid.gridCompact,
        columns === 2 && stylesGrid.grid2,
        columns === 3 && stylesGrid.grid3,
      ]}
    >
      {children}
    </View>
  );
}

const stylesGrid = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 4,
  },
  gridCompact: {
    gap: 10,
    marginBottom: 2,
  },
  grid2: {},
  grid3: {},
});

function createStyles(chrome) {
  return StyleSheet.create({
    card: {
      flexGrow: 1,
      flexBasis: Platform.select({ web: "22%", default: "48%" }),
      minWidth: Platform.select({ web: 140, default: 148 }),
      maxWidth: Platform.select({ web: undefined, default: "48%" }),
      backgroundColor: chrome.card,
      borderWidth: 1,
      borderColor: chrome.line,
      borderRadius: 14,
      padding: 18,
    },
    label: {
      fontSize: 11,
      color: chrome.inkFaint,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      fontFamily: fonts.medium,
    },
    value: {
      fontFamily: FONT_PRICE,
      fontSize: 27,
      fontWeight: "600",
      color: chrome.ink,
      marginTop: 7,
    },
    delta: {
      fontSize: 11.5,
      fontFamily: fonts.semibold,
      marginTop: 6,
    },
    up: { color: chrome.green },
    down: { color: chrome.danger },
  });
}
