import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { fonts, radius, spacing } from "../../theme/tokens";

/** Numbered repeat card for trust chips, variants, USPs, etc. */
export default function AdminRepeatBlock({ index, title, subtitle, onRemove, children, style }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onRemove ? (
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            style={({ pressed }) => [styles.removeBtn, pressed && styles.removeBtnPressed]}
            accessibilityLabel={`Remove ${title}`}
          >
            <Ionicons name="trash-outline" size={16} color={chrome.danger} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

function createStyles(chrome) {
  return StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: chrome.line,
      borderRadius: radius.lg,
      backgroundColor: chrome.card,
      marginBottom: spacing.sm,
      overflow: "hidden",
      ...Platform.select({
        web: { boxShadow: "0 1px 2px rgba(25,20,15,.04)" },
        default: {},
      }),
    },
    head: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: chrome.line,
      backgroundColor: chrome.paper,
    },
    indexBadge: {
      width: 26,
      height: 26,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.chipOnBg,
      borderWidth: 1,
      borderColor: chrome.chipOnBorder,
    },
    indexText: {
      fontSize: 12,
      fontFamily: fonts.bold,
      color: chrome.goldDeep,
    },
    titleCol: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontSize: 13,
      fontFamily: fonts.semibold,
      color: chrome.ink,
    },
    subtitle: {
      fontSize: 11,
      color: chrome.inkFaint,
      marginTop: 1,
      fontFamily: fonts.regular,
    },
    removeBtn: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(180, 60, 50, 0.25)",
      backgroundColor: "rgba(180, 60, 50, 0.06)",
    },
    removeBtnPressed: {
      opacity: 0.85,
    },
    body: {
      padding: spacing.md,
      paddingTop: spacing.sm,
    },
  });
}
