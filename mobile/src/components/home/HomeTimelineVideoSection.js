import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "./editorial";
import HomePromoVideo from "./HomePromoVideo";
import GoldHairline from "../ui/GoldHairline";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { HOME_SCREEN_UI } from "../../content/appContent";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { fonts, icon, radius } from "../../theme/tokens";
import { getHomePhoneBleed } from "../../utils/homeSectionBleed";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";

const TIMELINE_PANEL_CLASS = "kankreg-timeline-cinema-panel";
const SPLIT_MIN_HEIGHT = 448;

if (Platform.OS === "web") {
  injectWebCssOnce(
    "kankreg-timeline-cinema-premium",
    `.${TIMELINE_PANEL_CLASS} {
  transition: box-shadow 0.35s ease, transform 0.35s ease;
}
.${TIMELINE_PANEL_CLASS}:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 6px 14px rgba(60, 45, 20, 0.05),
    0 40px 80px -36px rgba(80, 60, 25, 0.24) !important;
}
@media (prefers-reduced-motion: reduce) {
  .${TIMELINE_PANEL_CLASS}:hover { box-shadow: inherit !important; transform: none !important; }
}`
  );
}

function JourneyPill({ label, isDark, last = false, wide = false }) {
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  return (
    <View style={[styles.pillRow, wide && styles.pillRowWide]}>
      <View style={[styles.pill, wide && styles.pillWide, isDark && styles.pillDark]}>
        <View style={styles.pillDot} />
        <Text style={[styles.pillText, { color: ink }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      {!last && !wide ? (
        <Ionicons
          name="chevron-forward"
          size={icon.micro}
          color={muted}
          style={styles.pillChevron}
        />
      ) : null}
    </View>
  );
}

function LiveFilmChip({ label, isDark, muted, prominent = false }) {
  return (
    <View
      style={[
        styles.liveChip,
        prominent && styles.liveChipProminent,
        isDark && styles.liveChipDark,
      ]}
    >
      <View style={styles.liveDot} />
      <Text style={[styles.liveChipText, { color: muted }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function RailMetaLine({ text, muted, fullWidth = false }) {
  return (
    <View style={[styles.railMeta, fullWidth && styles.railMetaFull]}>
      <GoldHairline
        {...GOLD_HAIRLINE_EDITORIAL.subtle}
        marginVertical={0}
        style={styles.railMetaLine}
      />
      <Text style={[styles.railMetaText, { color: muted }]} numberOfLines={2}>
        {text}
      </Text>
      <GoldHairline
        {...GOLD_HAIRLINE_EDITORIAL.subtle}
        marginVertical={0}
        style={styles.railMetaLine}
      />
    </View>
  );
}

/** Dedicated timeline brand banner — after home catalog, separate from Our Story. */
export default function HomeTimelineVideoSection() {
  const { isDark } = useTheme();
  const { isLg, isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const muted = homeEditorialMuted(isDark);
  const {
    eyebrow,
    title,
    kicker,
    filmLabel,
    filmDuration,
    loopingLabel,
    journeyPills,
    railMeta,
  } = HOME_SCREEN_UI.timelineVideo;
  const bleed = getHomePhoneBleed({ isMobileWeb, pageGutterClamp, nativeFullWidth: true });
  const phoneLayout = width < 720;
  const splitLayout = isLg && Platform.OS === "web";

  const pillsBlock =
    journeyPills?.length > 0 ? (
      <View style={[styles.pillRail, !splitLayout && bleed.inner, splitLayout && styles.pillRailSplit]}>
        {journeyPills.map((pill, idx) => (
          <JourneyPill
            key={pill}
            label={pill}
            isDark={isDark}
            last={idx === journeyPills.length - 1}
            wide={splitLayout}
          />
        ))}
      </View>
    ) : null;

  const videoBlock = (
    <View
      style={[
        styles.videoStage,
        bleed.inner,
        phoneLayout && styles.videoStagePhone,
        splitLayout && styles.videoStageSplit,
      ]}
    >
      <HomePromoVideo
        fullBleed={false}
        embedded={splitLayout}
        filmLabel={filmLabel}
        filmDuration={filmDuration}
        loopingLabel={loopingLabel}
        stageHeight={splitLayout ? SPLIT_MIN_HEIGHT : undefined}
      />
    </View>
  );

  return (
    <View style={styles.wrap} nativeID="home-timeline-video">
      <View
        className={Platform.OS === "web" ? TIMELINE_PANEL_CLASS : undefined}
        style={[
          styles.panel,
          splitLayout && styles.panelSplit,
          phoneLayout && styles.panelPhone,
          bleed.outer,
          isDark && styles.panelDark,
        ]}
      >
        <View style={[styles.panelFrameTop, splitLayout && styles.panelFrameTopSplit]} pointerEvents="none" />
        {!phoneLayout ? (
          <View style={[styles.panelFrameInset, isDark && styles.panelFrameInsetDark]} pointerEvents="none" />
        ) : null}
        <LinearGradient
          colors={
            isDark
              ? ["rgba(214, 173, 91, 0.06)", "transparent", "rgba(60, 98, 72, 0.04)"]
              : ["rgba(214, 173, 91, 0.11)", "transparent", "rgba(255, 253, 248, 0.4)"]
          }
          locations={[0, 0.42, 1]}
          style={styles.panelWash}
          pointerEvents="none"
        />
        {!splitLayout ? (
          <>
            <View style={[styles.cornerMark, styles.cornerMarkTL]} pointerEvents="none" />
            <View style={[styles.cornerMark, styles.cornerMarkTR]} pointerEvents="none" />
          </>
        ) : null}

        {splitLayout ? (
          <View style={styles.splitBody}>
            <View style={[styles.splitLeft, { minHeight: SPLIT_MIN_HEIGHT }]}>
              <View style={styles.splitLeftTop}>
                <SectionHeader eyebrow={eyebrow} title={title} kicker={kicker} compact flush />
                {pillsBlock}
              </View>
              <View style={styles.splitLeftBottom}>
                <RailMetaLine text={railMeta} muted={muted} fullWidth />
                <LiveFilmChip label={filmLabel} isDark={isDark} muted={muted} prominent />
              </View>
            </View>
            <View style={[styles.splitRight, { minHeight: SPLIT_MIN_HEIGHT }]}>{videoBlock}</View>
          </View>
        ) : (
          <>
            <View style={styles.headerBlock}>
              <View style={[styles.headerRow, bleed.inner, isLg && styles.headerRowDesktop]}>
                <View style={styles.headerCopy}>
                  <SectionHeader eyebrow={eyebrow} title={title} kicker={kicker} compact flush />
                </View>
                <LiveFilmChip label={filmLabel} isDark={isDark} muted={muted} />
              </View>
              {pillsBlock}
              <View style={bleed.inner}>
                <RailMetaLine text={railMeta} muted={muted} />
              </View>
              {!phoneLayout ? (
                <GoldHairline
                  {...GOLD_HAIRLINE_EDITORIAL.subtle}
                  marginVertical={HOME_SPACE.sm}
                  style={[styles.hairline, bleed.inner]}
                />
              ) : null}
            </View>
            {videoBlock}
          </>
        )}
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
    borderRadius: radius.xl + 10,
    paddingVertical: HOME_SPACE.lg + 10,
    paddingHorizontal: HOME_SPACE.lg + 6,
    backgroundColor: KANKREG_CHROME.cream,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.18)",
    borderTopWidth: 3,
    borderTopColor: "rgba(201, 162, 39, 0.8)",
    overflow: "hidden",
    position: "relative",
    gap: HOME_SPACE.md,
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 2px 6px rgba(60, 45, 20, 0.04), 0 30px 64px -32px rgba(80, 60, 25, 0.18)",
      },
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.1,
        shadowRadius: 26,
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  panelSplit: {
    paddingVertical: HOME_SPACE.xl,
    paddingHorizontal: HOME_SPACE.xl + 4,
    gap: 0,
  },
  panelPhone: {
    paddingHorizontal: HOME_SPACE.md,
    paddingVertical: HOME_SPACE.lg + 4,
    borderRadius: radius.xl + 6,
  },
  panelDark: {
    backgroundColor: "rgba(24, 21, 19, 0.74)",
    borderColor: "rgba(214, 173, 91, 0.15)",
    borderTopColor: "rgba(214, 173, 91, 0.52)",
  },
  panelFrameTop: {
    position: "absolute",
    top: 3,
    left: HOME_SPACE.lg + 4,
    right: HOME_SPACE.lg + 4,
    height: 1,
    backgroundColor: "rgba(255, 253, 248, 0.6)",
    zIndex: 2,
  },
  panelFrameTopSplit: {
    left: HOME_SPACE.xl + 8,
    right: HOME_SPACE.xl + 8,
  },
  panelWash: {
    ...StyleSheet.absoluteFillObject,
  },
  panelFrameInset: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: radius.xl + 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.12)",
    zIndex: 1,
    pointerEvents: "none",
  },
  panelFrameInsetDark: {
    borderColor: "rgba(214, 173, 91, 0.09)",
  },
  cornerMark: {
    position: "absolute",
    width: 24,
    height: 24,
    zIndex: 2,
    borderColor: "rgba(201, 162, 39, 0.32)",
  },
  cornerMarkTL: {
    top: 22,
    left: 22,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerMarkTR: {
    top: 22,
    right: 22,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  splitBody: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: HOME_SPACE.xl,
    zIndex: 1,
  },
  splitLeft: {
    width: "34%",
    minWidth: 268,
    maxWidth: 360,
    justifyContent: "space-between",
    gap: HOME_SPACE.lg,
    paddingVertical: HOME_SPACE.xs,
  },
  splitLeftTop: {
    gap: HOME_SPACE.md + 2,
  },
  splitLeftBottom: {
    gap: HOME_SPACE.md,
    paddingTop: HOME_SPACE.sm,
  },
  splitRight: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  headerBlock: {
    width: "100%",
    gap: HOME_SPACE.sm,
    zIndex: 1,
  },
  headerRow: {
    width: "100%",
    gap: HOME_SPACE.sm,
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
  pillRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: HOME_SPACE.xs,
  },
  pillRailSplit: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: HOME_SPACE.sm,
    marginTop: HOME_SPACE.xs,
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pillRowWide: {
    width: "100%",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: HOME_SPACE.xs + 2,
    paddingHorizontal: HOME_SPACE.md,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 253, 248, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.16)",
    ...Platform.select({
      web: { boxShadow: "0 1px 2px rgba(60, 45, 20, 0.04)" },
      default: {},
    }),
  },
  pillWide: {
    alignSelf: "stretch",
  },
  pillDark: {
    backgroundColor: "rgba(24, 21, 19, 0.5)",
    borderColor: "rgba(214, 173, 91, 0.16)",
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KANKREG_PALETTE.gold,
  },
  pillText: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow + 1,
    letterSpacing: 0.2,
  },
  pillChevron: {
    opacity: 0.5,
    marginHorizontal: 2,
  },
  railMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: HOME_SPACE.sm,
    marginTop: HOME_SPACE.xs,
  },
  railMetaFull: {
    marginTop: 0,
    width: "100%",
  },
  railMetaLine: {
    flex: 1,
    opacity: 0.38,
  },
  railMetaText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    flexShrink: 1,
    textAlign: "center",
    maxWidth: 200,
  },
  hairline: {
    width: "100%",
    opacity: 0.5,
  },
  videoStage: {
    width: "100%",
    zIndex: 1,
  },
  videoStagePhone: {
    paddingHorizontal: 0,
  },
  videoStageSplit: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 0,
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: HOME_SPACE.xs + 3,
    paddingHorizontal: HOME_SPACE.md + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.22)",
    backgroundColor: "rgba(255, 253, 248, 0.9)",
    ...Platform.select({
      web: { boxShadow: "0 1px 3px rgba(60, 45, 20, 0.05)" },
      default: {},
    }),
  },
  liveChipProminent: {
    paddingVertical: HOME_SPACE.sm,
    paddingHorizontal: HOME_SPACE.lg,
    alignSelf: "flex-start",
  },
  liveChipDark: {
    backgroundColor: "rgba(24, 21, 19, 0.52)",
    borderColor: "rgba(214, 173, 91, 0.18)",
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
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
});
