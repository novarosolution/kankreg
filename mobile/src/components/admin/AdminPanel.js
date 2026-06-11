import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { adminPanel, getAdminChrome } from "../../theme/adminLayout";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { fonts } from "../../theme/tokens";

export default function AdminPanel({ title, meta, action, onAction, children, style, noPadding }) {
  const { colors: c, shadowPremium, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(
    () => createStyles(chrome, adminPanel(c, shadowPremium, isDark)),
    [chrome, c, shadowPremium, isDark]
  );

  return (
    <View style={[styles.panel, style]}>
      {title ? (
        <View style={styles.head}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          </View>
          {action ? (
            <Pressable onPress={onAction} hitSlop={8} style={styles.actionBtn}>
              <Text style={styles.action}>{action}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <View style={noPadding ? null : styles.body}>{children}</View>
    </View>
  );
}

function createStyles(chrome, panelBase) {
  return StyleSheet.create({
    panel: {
      ...panelBase,
      ...Platform.select({
        web: {
          boxShadow: panelBase.boxShadow || "0 1px 2px rgba(25,20,15,.03)",
        },
        default: {},
      }),
    },
    head: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 14,
    },
    titleRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: 8,
      minWidth: 0,
    },
    title: {
      fontFamily: FONT_HEADING,
      fontSize: 17,
      fontWeight: "500",
      color: chrome.ink,
    },
    meta: {
      fontSize: 11,
      color: chrome.inkFaint,
      fontFamily: fonts.regular,
    },
    actionBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.paper,
    },
    action: {
      fontSize: 11,
      color: chrome.goldDeep,
      fontFamily: fonts.semibold,
    },
    body: {},
  });
}
