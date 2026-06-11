import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "./editorial";
import HomePromoVideo from "./HomePromoVideo";
import GoldHairline from "../ui/GoldHairline";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { HOME_SCREEN_UI } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, radius } from "../../theme/tokens";
import { getHomePhoneBleed } from "../../utils/homeSectionBleed";

/** Dedicated timeline brand banner — after home catalog, separate from Our Story. */
export default function HomeTimelineVideoSection() {
  const { isDark } = useTheme();
  const { isLg, isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const muted = homeEditorialMuted(isDark);
  const { eyebrow, title, kicker, filmLabel } = HOME_SCREEN_UI.timelineVideo;
  const bleed = getHomePhoneBleed({ isMobileWeb, pageGutterClamp, width, nativeFullWidth: true });
  const phoneLayout = width < 720;

  return (
    <View style={styles.wrap} nativeID="home-timeline-video">
      <View
        style={[
          styles.panel,
          phoneLayout && styles.panelPhone,
          bleed.outer,
          isDark && styles.panelDark,
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(214, 173, 91, 0.05)", "transparent", "rgba(60, 98, 72, 0.04)"]
              : ["rgba(214, 173, 91, 0.12)", "transparent", "rgba(60, 98, 72, 0.05)"]
          }
          locations={[0, 0.5, 1]}
          style={styles.panelWash}
          pointerEvents="none"
        />
        {!phoneLayout ? <View style={styles.panelFrameInset} pointerEvents="none" /> : null}

        <View style={[styles.headerRow, bleed.inner, isLg && styles.headerRowDesktop]}>
          <View style={styles.headerCopy}>
            <SectionHeader eyebrow={eyebrow} title={title} kicker={kicker} compact flush />
          </View>
          {isLg ? (
            <View style={[styles.liveChip, isDark && styles.liveChipDark]}>
              <View style={styles.liveDot} />
              <Text style={[styles.liveChipText, { color: muted }]}>{filmLabel}</Text>
            </View>
          ) : null}
        </View>

        <GoldHairline
          {...GOLD_HAIRLINE_EDITORIAL.subtle}
          marginVertical={HOME_SPACE.sm}
          style={[styles.hairline, bleed.inner]}
        />

        <HomePromoVideo fullBleed={phoneLayout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    paddingTop: Platform.OS === "web" ? HOME_SPACE.sm : HOME_SPACE.xs,
  },
  panel: {
    width: "100%",
    borderRadius: radius.xl + 8,
    paddingVertical: HOME_SPACE.lg + 4,
    paddingHorizontal: HOME_SPACE.lg + 2,
    backgroundColor: KANKREG_CHROME.cream,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.18)",
    borderTopWidth: 3,
    borderTopColor: "rgba(201, 162, 39, 0.75)",
    overflow: "hidden",
    position: "relative",
    gap: HOME_SPACE.sm,
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 28px 64px -36px rgba(80, 60, 25, 0.16)",
      },
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  panelPhone: {
    paddingHorizontal: 0,
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  panelDark: {
    backgroundColor: "rgba(24, 21, 19, 0.68)",
    borderColor: "rgba(214, 173, 91, 0.14)",
    borderTopColor: "rgba(214, 173, 91, 0.5)",
  },
  panelWash: {
    ...StyleSheet.absoluteFillObject,
  },
  panelFrameInset: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: radius.xl + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.12)",
    pointerEvents: "none",
  },
  headerRow: {
    width: "100%",
    gap: HOME_SPACE.sm,
    zIndex: 1,
  },
  headerRowDesktop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  hairline: {
    width: "100%",
    opacity: 0.6,
    zIndex: 1,
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: HOME_SPACE.xs + 2,
    paddingHorizontal: HOME_SPACE.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.28)",
    backgroundColor: "rgba(255, 253, 248, 0.75)",
    ...Platform.select({
      web: { backdropFilter: "blur(8px)" },
      default: {},
    }),
  },
  liveChipDark: {
    backgroundColor: "rgba(24, 21, 19, 0.55)",
    borderColor: "rgba(214, 173, 91, 0.2)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: KANKREG_PALETTE.green,
  },
  liveChipText: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
});
