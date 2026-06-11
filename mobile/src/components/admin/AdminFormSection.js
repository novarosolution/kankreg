import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { fonts, radius, spacing } from "../../theme/tokens";

/**
 * Premium collapsible block for long admin forms — one topic per card.
 */
export default function AdminFormSection({
  title,
  subtitle,
  icon = "layers-outline",
  children,
  defaultOpen = false,
  complete,
  badge,
  style,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  const statusLabel =
    complete === true ? "Done" : complete === false ? "Optional" : badge || null;

  return (
    <View style={[styles.wrap, style]}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.head, pressed && styles.headPressed]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={chrome.goldDeep} />
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {statusLabel ? (
          <View style={[styles.badge, complete === true && styles.badgeDone, complete === false && styles.badgeOptional]}>
            <Text style={[styles.badgeText, complete === true && styles.badgeTextDone]}>{statusLabel}</Text>
          </View>
        ) : null}
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color={chrome.inkFaint} />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

function createStyles(chrome) {
  return StyleSheet.create({
    wrap: {
      borderWidth: 1,
      borderColor: chrome.line,
      borderRadius: radius.lg,
      backgroundColor: chrome.paper,
      overflow: "hidden",
      marginBottom: spacing.sm,
      ...Platform.select({
        web: { transition: "box-shadow .18s ease" },
        default: {},
      }),
    },
    head: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      minHeight: 52,
    },
    headPressed: {
      opacity: 0.92,
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.chipOnBg,
      borderWidth: 1,
      borderColor: chrome.chipOnBorder,
    },
    titleCol: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontSize: 14,
      fontFamily: fonts.semibold,
      color: chrome.ink,
    },
    subtitle: {
      marginTop: 2,
      fontSize: 11,
      fontFamily: fonts.regular,
      color: chrome.inkFaint,
      lineHeight: 15,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.full,
      backgroundColor: chrome.lineSoft,
    },
    badgeDone: {
      backgroundColor: "rgba(34, 120, 72, 0.12)",
    },
    badgeOptional: {
      backgroundColor: chrome.chipOnBg,
    },
    badgeText: {
      fontSize: 10,
      fontFamily: fonts.bold,
      color: chrome.inkFaint,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    badgeTextDone: {
      color: chrome.green,
    },
    body: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: chrome.line,
    },
  });
}
