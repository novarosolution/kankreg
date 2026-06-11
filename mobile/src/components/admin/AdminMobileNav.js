import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { fonts, spacing } from "../../theme/tokens";

/** Horizontal admin nav for phone / narrow layouts (kankreg.html mobile admin strip). */
export default function AdminMobileNav({ links, current, onNavigate }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome), [chrome]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
      contentContainerStyle={styles.row}
    >
      {links.map((link) => {
        const on = current === link.key;
        return (
          <Pressable
            key={link.key}
            onPress={() => onNavigate(link.key)}
            style={[styles.chip, on && styles.chipOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Ionicons
              name={link.icon}
              size={14}
              color={on ? chrome.goldBright : chrome.inkFaint}
            />
            <Text style={[styles.label, on && styles.labelOn]}>{link.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function createStyles(chrome) {
  return StyleSheet.create({
    wrap: {
      marginBottom: spacing.sm,
      marginHorizontal: -4,
    },
    row: {
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
    },
    chipOn: {
      backgroundColor: chrome.chipOnBg,
      borderColor: chrome.chipOnBorder,
    },
    label: {
      fontSize: 12,
      fontFamily: fonts.medium,
      color: chrome.inkSoft,
    },
    labelOn: {
      color: chrome.ink,
      fontFamily: fonts.semibold,
    },
  });
}
