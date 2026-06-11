import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SectionHeader } from "./editorial";
import HomePromoVideo from "./HomePromoVideo";
import GoldHairline from "../ui/GoldHairline";
import { GOLD_HAIRLINE_EDITORIAL, HOME_SPACE } from "../../theme/homeEditorial";
import { HOME_SCREEN_UI } from "../../content/appContent";

/** Dedicated timeline brand film — sits after the home product grid, separate from Our Story. */
export default function HomeTimelineVideoSection() {
  const isFocused = useIsFocused();
  const { eyebrow, title, kicker } = HOME_SCREEN_UI.timelineVideo;

  return (
    <View style={styles.wrap} nativeID="home-timeline-video">
      <GoldHairline {...GOLD_HAIRLINE_EDITORIAL.subtle} marginVertical={0} />
      <SectionHeader eyebrow={eyebrow} title={title} kicker={kicker} compact flush style={styles.header} />
      <HomePromoVideo isScreenFocused={isFocused} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: HOME_SPACE.md,
    paddingTop: Platform.OS === "web" ? HOME_SPACE.sm : HOME_SPACE.xs,
  },
  header: {
    marginBottom: 4,
  },
});
