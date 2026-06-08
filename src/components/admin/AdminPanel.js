import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

export default function AdminPanel({ title, meta, action, onAction, children, style, noPadding }) {
  return (
    <View style={[styles.panel, style]}>
      {title ? (
        <View style={styles.head}>
          <Text style={styles.title}>{title}</Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          {action ? (
            <Pressable onPress={onAction} hitSlop={8}>
              <Text style={styles.action}>{action}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <View style={noPadding ? null : styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: KANKREG_PALETTE.card,
    borderWidth: 1,
    borderColor: KANKREG_PALETTE.line,
    borderRadius: 14,
    padding: 18,
    ...Platform.select({
      web: { boxShadow: "0 1px 2px rgba(25,20,15,.03)" },
      default: {},
    }),
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: 17,
    fontWeight: "500",
    color: KANKREG_PALETTE.ink,
    flex: 1,
  },
  meta: {
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
    fontFamily: fonts.regular,
  },
  action: {
    fontSize: 11,
    color: KANKREG_PALETTE.goldDeep,
    fontFamily: fonts.semibold,
  },
  body: {},
});
