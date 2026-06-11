import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getAdminChrome } from "../../theme/adminLayout";
import { fonts } from "../../theme/tokens";

/**
 * Responsive admin table — horizontal scroll on narrow screens.
 * columns: { key, label, flex?, width?, align?, render?(row) }
 *
 * When `onRowPress` is set, rows are clickable but must not nest inner buttons (web hydration).
 * Use `actionDecorative` on column builders so action cells render as text only.
 */
export default function AdminDataTable({ columns, rows, keyExtractor, onRowPress, compact }) {
  const { colors: c, isDark } = useTheme();
  const chrome = useMemo(() => getAdminChrome(c, isDark), [c, isDark]);
  const styles = useMemo(() => createStyles(chrome, Boolean(onRowPress)), [chrome, onRowPress]);
  const getKey = keyExtractor || ((row, i) => String(row.id || row._id || i));

  return (
    <ScrollView horizontal={compact} showsHorizontalScrollIndicator={compact} style={compact ? styles.hScroll : null}>
      <View style={[styles.table, compact && styles.tableMin]}>
        <View style={styles.headRow}>
          {columns.map((col) => (
            <View
              key={col.key}
              style={[
                styles.th,
                col.flex ? { flex: col.flex } : null,
                col.width ? { width: col.width, flex: 0 } : null,
                col.align === "right" ? styles.alignRight : null,
              ]}
            >
              <Text style={styles.thText}>{col.label}</Text>
            </View>
          ))}
        </View>
        {rows.map((row, rowIdx) => {
          const cells = columns.map((col) => {
            const raw = col.render ? col.render(row) : row[col.key];
            const content =
              typeof raw === "string" || typeof raw === "number" ? (
                <Text style={[styles.tdText, col.strong && styles.tdStrong]} numberOfLines={2}>
                  {raw}
                </Text>
              ) : (
                raw
              );
            return (
              <View
                key={col.key}
                style={[
                  styles.td,
                  col.flex ? { flex: col.flex } : null,
                  col.width ? { width: col.width, flex: 0 } : null,
                  col.align === "right" ? styles.alignRight : null,
                ]}
              >
                {content}
              </View>
            );
          });

          if (onRowPress) {
            return (
              <Pressable
                key={getKey(row, rowIdx)}
                onPress={() => onRowPress(row)}
                accessibilityRole={Platform.OS === "web" ? "link" : "button"}
                accessibilityLabel="Open row"
                style={({ pressed }) => [styles.tr, styles.trInteractive, pressed ? styles.trPressed : null]}
              >
                {cells}
              </Pressable>
            );
          }

          return (
            <View key={getKey(row, rowIdx)} style={styles.tr}>
              {cells}
            </View>
          );
        })}
        {rows.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No records</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function createStyles(chrome, interactive) {
  return StyleSheet.create({
    hScroll: { marginHorizontal: -6 },
    table: { width: "100%" },
    tableMin: { minWidth: 640 },
    headRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: chrome.line,
      paddingVertical: 4,
    },
    th: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 9,
      minWidth: 72,
    },
    thText: {
      fontSize: 10,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: chrome.inkFaint,
      fontFamily: fonts.semibold,
    },
    tr: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: chrome.lineSoft,
    },
    trInteractive: interactive
      ? Platform.select({
          web: { cursor: "pointer" },
          default: {},
        })
      : {},
    trPressed: {
      backgroundColor: chrome.rowHover,
      ...Platform.select({ web: { opacity: 0.92 }, default: {} }),
    },
    td: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 11,
      justifyContent: "center",
      minWidth: 72,
    },
    tdText: {
      fontSize: 12.5,
      color: chrome.inkSoft,
      fontFamily: fonts.regular,
    },
    tdStrong: {
      color: chrome.ink,
      fontFamily: fonts.semibold,
    },
    alignRight: { alignItems: "flex-end" },
    empty: { padding: 24, alignItems: "center" },
    emptyText: { fontSize: 13, color: chrome.inkFaint },
  });
}
