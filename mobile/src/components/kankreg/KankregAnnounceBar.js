import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { KANKREG_ANNOUNCE_COPY } from "../../content/appContent";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";
import { WEB_ANNOUNCE_HEIGHT } from "../../theme/web";

/** Storefront promo strip — centered offer + coupon. */
export default function KankregAnnounceBar({ onPressSeason }) {
  const promo = KANKREG_ANNOUNCE_COPY.promo || KANKREG_ANNOUNCE_COPY.delivery;

  return (
    <Pressable
      onPress={onPressSeason}
      style={styles.bar}
      accessibilityRole="link"
      accessibilityLabel={promo}
    >
      <Text style={styles.text} numberOfLines={1}>
        {promo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: KANKREG_CHROME.announceBg,
    minHeight: WEB_ANNOUNCE_HEIGHT,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    ...Platform.select({
      web: { cursor: "pointer" },
      default: {},
    }),
  },
  text: {
    color: KANKREG_CHROME.onAccent,
    fontSize: 13,
    fontFamily: fonts.medium,
    letterSpacing: 0.2,
    textAlign: "center",
  },
});
