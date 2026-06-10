import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { KANKREG_ANNOUNCE_COPY } from "../../content/appContent";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";

/** kankreg.html `.announce` — all platforms */
export default function KankregAnnounceBar({ onPressSeason }) {
  const { hideAnnounceSecondary } = useKankregLayout();

  return (
    <View style={styles.bar}>
      <Text style={styles.text}>
        <Text>{KANKREG_ANNOUNCE_COPY.delivery}</Text>
        {!hideAnnounceSecondary && KANKREG_ANNOUNCE_COPY.rewards ? <Text style={styles.sep}> · </Text> : null}
        {!hideAnnounceSecondary && KANKREG_ANNOUNCE_COPY.rewards ? (
          <Text>{KANKREG_ANNOUNCE_COPY.rewards}</Text>
        ) : null}
        {!hideAnnounceSecondary && KANKREG_ANNOUNCE_COPY.seasonCta ? <Text style={styles.sep}> · </Text> : null}
        {KANKREG_ANNOUNCE_COPY.seasonCta ? (
          <Pressable onPress={onPressSeason} accessibilityRole="link">
            <Text style={styles.bold}>{KANKREG_ANNOUNCE_COPY.seasonCta}</Text>
          </Pressable>
        ) : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: KANKREG_PALETTE.ink,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: KANKREG_PALETTE.paper,
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  sep: { opacity: 0.4 },
  bold: {
    color: KANKREG_PALETTE.goldBright,
    fontFamily: fonts.semibold,
  },
});
