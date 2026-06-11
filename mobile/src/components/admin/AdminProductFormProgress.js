import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { fonts, radius, spacing } from "../../theme/tokens";

export default function AdminProductFormProgress({ items, activeKey, onSelect, style }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  return (
    <View style={[styles.wrap, style]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        const pct = Math.round(Math.min(100, Math.max(0, item.percent || 0)));
        const done = pct >= 100;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect?.(item.key)}
            style={({ pressed }) => [
              styles.item,
              active && styles.itemActive,
              pressed && styles.itemPressed,
            ]}
          >
            <View style={styles.itemHead}>
              <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
              {done ? (
                <Ionicons name="checkmark-circle" size={14} color={chrome.green} />
              ) : (
                <Text style={styles.pct}>{pct}%</Text>
              )}
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%` }, done && styles.fillDone]} />
            </View>
            {item.hint ? <Text style={styles.hint}>{item.hint}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(chrome) {
  return StyleSheet.create({
    wrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    item: {
      flexGrow: 1,
      flexBasis: 140,
      minWidth: 120,
      padding: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.paper,
      ...Platform.select({
        web: { cursor: "pointer", transition: "border-color .15s ease" },
        default: {},
      }),
    },
    itemActive: {
      borderColor: chrome.goldDeep,
      backgroundColor: chrome.chipOnBg,
    },
    itemPressed: {
      opacity: 0.9,
    },
    itemHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    label: {
      fontSize: 12,
      fontFamily: fonts.semibold,
      color: chrome.inkSoft,
    },
    labelActive: {
      color: chrome.ink,
    },
    pct: {
      fontSize: 10,
      fontFamily: fonts.bold,
      color: chrome.inkFaint,
    },
    track: {
      height: 4,
      borderRadius: radius.full,
      backgroundColor: chrome.lineSoft,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: radius.full,
      backgroundColor: chrome.gold,
    },
    fillDone: {
      backgroundColor: chrome.green,
    },
    hint: {
      marginTop: 4,
      fontSize: 10,
      color: chrome.inkFaint,
      fontFamily: fonts.regular,
    },
  });
}
