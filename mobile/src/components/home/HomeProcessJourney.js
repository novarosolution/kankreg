import React, { useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { HOME_STORY_CONTENT } from "../../content/appContent";
import { SectionHeader, ScrollFadeUp } from "./editorial";
import GoldHairline from "../ui/GoldHairline";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { fonts, radius } from "../../theme/tokens";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { resolveImageSource } from "../../utils/mediaSource";

/** Portrait photo frame — matches step assets (~3:4). */
const PROCESS_IMAGE_ASPECT = 3 / 4;
const PROCESS_RAIL_CARD_WIDTH = 248;

function formatStepNum(step) {
  return String(step).padStart(2, "0");
}

function ProcessStepCard({ step, isDark, ink, muted, compact = false }) {
  const imageSource = resolveImageSource(step.image);
  const imageFit = step.imageFit === "contain" ? "contain" : "cover";
  const imagePosition = step.imagePosition || "top center";

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        isDark && styles.cardDark,
        Platform.OS === "web" ? styles.cardWeb : null,
      ]}
    >
      <View style={[styles.imageFrame, isDark && styles.imageFrameDark]}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit={imageFit}
            contentPosition={imagePosition}
            transition={280}
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(8, 6, 4, 0.42)"]}
          locations={[0.55, 1]}
          style={styles.imageScrim}
          pointerEvents="none"
        />
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{formatStepNum(step.step)}</Text>
        </View>
      </View>
      <View style={[styles.cardBody, isDark && styles.cardBodyDark]}>
        <Text style={[styles.cardTitle, { color: ink }]} numberOfLines={2}>
          {step.title}
        </Text>
        <Text style={[styles.cardDesc, { color: muted }]} numberOfLines={3}>
          {step.description}
        </Text>
      </View>
    </View>
  );
}

/**
 * Immersive Bilona process — image-led steps. All copy + images in `gheeHomeContent.js`.
 */
export default function HomeProcessJourney() {
  const { isDark } = useTheme();
  const { width, isMd } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const { process } = HOME_STORY_CONTENT;

  const layout = useMemo(() => {
    if (width >= 1080) return { cols: 3, rail: false };
    if (width >= 720) return { cols: 2, rail: false };
    if (Platform.OS === "web" && width < 720) return { cols: 1, rail: true };
    return { cols: 1, rail: false };
  }, [width]);

  const cellStyle = useMemo(() => {
    if (layout.cols === 3) {
      return { width: "31.8%", maxWidth: "31.8%", minWidth: 0 };
    }
    if (layout.cols === 2) {
      return { width: "48.2%", maxWidth: "48.2%", minWidth: 0 };
    }
    return { width: "100%", maxWidth: "100%" };
  }, [layout.cols]);

  return (
    <ScrollFadeUp index={3}>
      <View
        nativeID="home-process"
        style={[styles.section, isDark && styles.sectionDark]}
      >
        <View style={styles.headerWrap}>
          <SectionHeader
            eyebrow={process.eyebrow}
            title={process.title}
            kicker={process.subtitle}
            align={isMd ? "left" : "center"}
          />
          <GoldHairline
            {...GOLD_HAIRLINE_EDITORIAL.subtle}
            marginVertical={HOME_SPACE.xs}
            style={{ alignSelf: isMd ? "flex-start" : "center", width: isMd ? 120 : 96 }}
          />
          <Text
            style={[
              styles.journeyLabel,
              { color: muted, alignSelf: isMd ? "flex-start" : "center" },
            ]}
          >
            {process.journeyLabel}
          </Text>
        </View>

        {layout.rail ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
            snapToInterval={PROCESS_RAIL_CARD_WIDTH + HOME_SPACE.md}
            snapToAlignment="start"
            disableIntervalMomentum
            contentContainerStyle={styles.railContent}
            style={styles.rail}
          >
            {process.steps.map((step, idx) => (
              <View
                key={step.step}
                style={{ width: PROCESS_RAIL_CARD_WIDTH, marginRight: HOME_SPACE.md }}
              >
                <ScrollFadeUp index={idx} delay={idx * 70} preset="fade-up">
                  <ProcessStepCard
                    step={step}
                    isDark={isDark}
                    ink={ink}
                    muted={muted}
                    compact
                  />
                </ScrollFadeUp>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.grid}>
            {process.steps.map((step, idx) => (
              <View key={step.step} style={[styles.gridCell, cellStyle]}>
                <ScrollFadeUp index={idx} delay={idx * 70} preset="fade-up" style={styles.gridReveal}>
                  <ProcessStepCard step={step} isDark={isDark} ink={ink} muted={muted} />
                </ScrollFadeUp>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollFadeUp>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow:
      "0 1px 2px rgba(60, 45, 20, 0.05), 0 10px 28px -14px rgba(80, 60, 25, 0.14)",
  },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: HOME_SPACE.xl,
    paddingHorizontal: HOME_SPACE.lg,
    borderRadius: radius.xl,
    backgroundColor: KANKREG_CHROME.cream,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.12)",
    ...Platform.select({
      web: {
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.85)",
      },
      default: {},
    }),
  },
  sectionDark: {
    backgroundColor: "rgba(24, 21, 19, 0.55)",
    borderColor: "#3f3933",
  },
  headerWrap: {
    width: "100%",
    gap: HOME_SPACE.xs,
    marginBottom: HOME_SPACE.lg + 4,
  },
  journeyLabel: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginTop: HOME_SPACE.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: HOME_SPACE.md + 4,
    columnGap: HOME_SPACE.md,
    width: "100%",
  },
  gridCell: {
    flexGrow: 0,
    flexShrink: 0,
  },
  gridReveal: {
    flex: 1,
    width: "100%",
  },
  rail: {
    width: "100%",
    marginHorizontal: -HOME_SPACE.lg,
    paddingHorizontal: HOME_SPACE.lg,
  },
  railContent: {
    paddingRight: HOME_SPACE.lg,
    paddingBottom: HOME_SPACE.xs,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.lineSoft,
    backgroundColor: KANKREG_PALETTE.card,
    ...cardShadow,
  },
  cardWeb: Platform.select({
    web: {
      cursor: "default",
      transition: "transform 0.22s ease, box-shadow 0.22s ease",
    },
    default: {},
  }),
  cardCompact: {
    width: PROCESS_RAIL_CARD_WIDTH,
  },
  cardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  imageFrame: {
    width: "100%",
    aspectRatio: PROCESS_IMAGE_ASPECT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: KANKREG_PALETTE.paper2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: KANKREG_PALETTE.lineSoft,
  },
  imageFrameDark: {
    backgroundColor: "#1a1714",
    borderBottomColor: "#3f3933",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  imageFallback: {
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  stepBadge: {
    position: "absolute",
    left: HOME_SPACE.sm + 2,
    bottom: HOME_SPACE.sm + 2,
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(27, 48, 34, 0.88)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(214, 173, 91, 0.35)",
    ...Platform.select({
      web: { backdropFilter: "blur(8px)" },
      default: {},
    }),
  },
  stepBadgeText: {
    fontFamily: FONT_DISPLAY,
    fontSize: 15,
    color: KANKREG_PALETTE.goldBright,
    letterSpacing: 0.4,
  },
  cardBody: {
    paddingHorizontal: HOME_SPACE.md,
    paddingTop: HOME_SPACE.sm + 2,
    paddingBottom: HOME_SPACE.sm + 4,
    gap: 5,
    minHeight: 96,
    backgroundColor: KANKREG_PALETTE.card,
  },
  cardBodyDark: {
    backgroundColor: "#181513",
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.kicker,
    lineHeight: HOME_TYPE.body.lineHeight,
  },
  cardDesc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
});
