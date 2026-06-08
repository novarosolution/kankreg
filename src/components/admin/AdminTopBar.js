import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, spacing } from "../../theme/tokens";

export default function AdminTopBar({
  title,
  subtitle,
  searchPlaceholder = "Search orders, products…",
  onNotifications,
  headerRight,
  compact,
}) {
  return (
    <View style={[styles.bar, compact && styles.barCompact]}>
      <View style={styles.titleCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && !compact ? (
          <Text style={styles.sub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {!compact && Platform.OS === "web" ? (
        <View style={styles.search}>
          <Ionicons name="search" size={14} color={KANKREG_PALETTE.inkFaint} />
          <Text style={styles.searchText}>{searchPlaceholder}</Text>
        </View>
      ) : null}
      <View style={styles.actions}>
        {onNotifications ? (
          <Pressable style={styles.iconBtn} onPress={onNotifications} accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={16} color={KANKREG_PALETTE.inkSoft} />
            <View style={styles.dot} />
          </Pressable>
        ) : null}
        {headerRight}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: KANKREG_PALETTE.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 26,
    paddingVertical: 12,
    backgroundColor: "rgba(245,239,228,0.7)",
    flexWrap: "wrap",
  },
  barCompact: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    minHeight: 0,
    paddingVertical: 0,
    marginBottom: spacing.sm,
  },
  titleCol: { flexShrink: 1, minWidth: 120 },
  title: {
    fontFamily: FONT_DISPLAY,
    fontWeight: "400",
    fontSize: 23,
    color: KANKREG_PALETTE.ink,
  },
  sub: {
    fontSize: 12,
    color: KANKREG_PALETTE.inkFaint,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  search: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: KANKREG_PALETTE.card,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 8,
    width: 240,
    maxWidth: "100%",
  },
  searchText: {
    fontSize: 12.5,
    color: KANKREG_PALETTE.inkFaint,
    fontFamily: fonts.regular,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: Platform.OS === "web" ? 0 : "auto",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
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
    backgroundColor: KANKREG_PALETTE.gold,
    borderWidth: 1.5,
    borderColor: KANKREG_PALETTE.card,
  },
});
