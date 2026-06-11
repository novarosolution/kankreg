import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { fonts, spacing } from "../../theme/tokens";

export default function AdminTopBar({
  title,
  subtitle,
  onNotifications,
  hasNotifications = false,
  headerRight,
  compact,
}) {
  const { colors: c, isDark, mode, setMode } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  const themeIcon =
    mode === "dark" ? "moon" : mode === "light" ? "sunny" : "phone-portrait-outline";
  const cycleTheme = () => {
    setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  };

  return (
    <View style={[styles.bar, compact && styles.barCompact]}>
      <View style={styles.titleCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.sub, compact && styles.subCompact]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.iconBtn}
          onPress={cycleTheme}
          accessibilityLabel={`Theme: ${mode}`}
        >
          <Ionicons name={themeIcon} size={16} color={chrome.inkSoft} />
        </Pressable>
        {onNotifications ? (
          <Pressable style={styles.iconBtn} onPress={onNotifications} accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={16} color={chrome.inkSoft} />
            {hasNotifications ? <View style={styles.dot} /> : null}
          </Pressable>
        ) : null}
        {headerRight}
      </View>
    </View>
  );
}

function createStyles(chrome) {
  return StyleSheet.create({
    bar: {
      minHeight: 64,
      borderBottomWidth: 1,
      borderBottomColor: chrome.line,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingHorizontal: 26,
      paddingVertical: 12,
      backgroundColor: chrome.topBarBg,
      flexWrap: "wrap",
    },
    barCompact: {
      paddingHorizontal: 0,
      backgroundColor: "transparent",
      borderBottomWidth: 1,
      borderBottomColor: chrome.line,
      minHeight: 0,
      paddingVertical: spacing.sm,
      marginBottom: spacing.xs,
      gap: 10,
    },
    titleCol: { flexShrink: 1, minWidth: 120 },
    title: {
      fontFamily: FONT_HEADING,
      fontWeight: "400",
      fontSize: 23,
      color: chrome.ink,
    },
    sub: {
      fontSize: 12,
      color: chrome.inkFaint,
      marginTop: 2,
      fontFamily: fonts.regular,
    },
    subCompact: {
      fontSize: 11,
      marginTop: 1,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginLeft: "auto",
    },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    dot: {
      position: "absolute",
      top: 7,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: chrome.gold,
      borderWidth: 1.5,
      borderColor: chrome.card,
    },
  });
}
