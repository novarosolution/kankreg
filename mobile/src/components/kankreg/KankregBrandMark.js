import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { APP_DISPLAY_NAME } from "../../constants/brand";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { WEB_DISPLAY_FONT_STACK } from "../../theme/webFonts";

/** Storefront wordmark — dark green script, same role as Anveshan’s header logo. */
export default function KankregBrandMark({ onPress, compact = false, tone = "onLight" }) {
  const ink = tone === "onDark" ? KANKREG_CHROME.footerOnGreen : KANKREG_CHROME.announceBg;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.hit,
        compact && styles.hitCompact,
        pressed && { opacity: 0.88 },
        Platform.OS === "web" ? { cursor: "pointer" } : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${APP_DISPLAY_NAME} — Home`}
    >
      <View style={styles.row}>
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact, { color: ink }]} numberOfLines={1}>
          kankreg
        </Text>
        <Text style={[styles.reg, { color: ink }]}>®</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingRight: 8,
    minWidth: 132,
  },
  hitCompact: {
    minWidth: 108,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  wordmark: {
    color: KANKREG_CHROME.announceBg,
    fontSize: 34,
    lineHeight: 38,
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: -0.6,
    ...Platform.select({
      web: {
        fontFamily: `Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, ${WEB_DISPLAY_FONT_STACK}`,
      },
      default: {
        fontFamily: "Georgia",
      },
    }),
  },
  wordmarkCompact: {
    fontSize: 26,
    lineHeight: 30,
  },
  reg: {
    marginTop: 4,
    marginLeft: 1,
    fontSize: 9,
    color: KANKREG_CHROME.announceBg,
    fontFamily: Platform.OS === "web" ? WEB_DISPLAY_FONT_STACK : undefined,
  },
});
