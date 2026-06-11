import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { spacing } from "../../theme/tokens";

/** Back link to admin dashboard — used in mobile admin shell header. */
export default function AdminBackLink({ navigation, label = "Dashboard", target = "AdminDashboard", style }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, style, pressed ? styles.pressed : null]}
      onPress={() => navigation.navigate(target)}
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
    >
      <Ionicons name="chevron-back" size={18} color={chrome.inkSoft} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

function createStyles(chrome) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: spacing.sm,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
    },
    pressed: { opacity: 0.85 },
    text: {
      fontSize: 13,
      fontWeight: "700",
      color: chrome.ink,
    },
  });
}
