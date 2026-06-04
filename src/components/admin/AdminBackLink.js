import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { ALCHEMY } from "../../theme/customerAlchemy";
import { fonts, getSemanticColors, icon, semanticRadius, spacing, typography } from "../../theme/tokens";

/**
 * Gold-accent back link to the admin dashboard (shared across admin tools).
 */
export default function AdminBackLink({ navigation, label = "Dashboard", target = "AdminDashboard" }) {
  const { colors: c, isDark } = useTheme();
  const semantic = getSemanticColors(c);
  const styles = useMemo(() => createStyles(c, isDark, semantic), [c, isDark, semantic]);

  return (
    <Pressable
      style={({ hovered, pressed }) => [
        styles.row,
        hovered && Platform.OS === "web" ? styles.rowHover : null,
        pressed ? { opacity: 0.86 } : null,
      ]}
      onPress={() => navigation.navigate(target)}
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
    >
      <Ionicons name="chevron-back" size={icon.md} color={isDark ? c.primary : ALCHEMY.brown} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

function createStyles(c, isDark, semantic) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginBottom: spacing.lg,
      paddingVertical: 8,
      paddingRight: spacing.md,
      paddingLeft: spacing.sm,
      borderRadius: semanticRadius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? semantic.border.accent : ALCHEMY.pillInactive,
      backgroundColor: isDark ? c.primarySoft : ALCHEMY.creamDeep,
      gap: 4,
      ...Platform.select({
        web: {
          cursor: "pointer",
          transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        },
        default: {},
      }),
    },
    rowHover: {
      backgroundColor: isDark ? "rgba(201, 162, 39, 0.14)" : "#FFF7EA",
      borderColor: isDark ? semantic.border.accent : ALCHEMY.lineStrong,
      ...Platform.select({
        web: {
          transform: [{ translateY: -1 }],
          boxShadow: "0 8px 18px rgba(61, 42, 18, 0.1)",
        },
        default: {},
      }),
    },
    text: {
      fontFamily: fonts.bold,
      fontSize: typography.bodySmall,
      color: isDark ? c.textPrimary : ALCHEMY.brown,
      letterSpacing: 0.1,
    },
  });
}
