import React from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { HOME_STORY_CONTENT } from "../../content/appContent";
import { SectionHeader, ScrollFadeUp } from "./editorial";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import {
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { fonts, radius } from "../../theme/tokens";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { resolveImageSource } from "../../utils/mediaSource";

const PROCESS_CARD_WIDTH = 300;
const PROCESS_IMAGE_HEIGHT = 188;

function formatStepNum(step) {
  return String(step).padStart(2, "0");
}

function ProcessStepCard({ step, isDark, ink, muted, compact = false }) {
  const imageSource = resolveImageSource(step.image);

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        isDark && styles.cardDark,
      ]}
    >
      <View style={styles.imageWrap}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="cover"
            contentPosition="center"
            transition={280}
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(8, 6, 4, 0.55)"]}
          locations={[0.45, 1]}
          style={styles.imageScrim}
          pointerEvents="none"
        />
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{formatStepNum(step.step)}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
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
  const useHorizontalRail = Platform.OS === "web" && width < 900;
  const gridCols = width >= 1080 ? 3 : width >= 720 ? 2 : 1;
  const cellBasis =
    gridCols === 3 ? "31.5%" : gridCols === 2 ? "48%" : "100%";

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
          <Text
            style={[
              styles.journeyLabel,
              { color: muted, alignSelf: isMd ? "flex-start" : "center" },
            ]}
          >
            {process.journeyLabel}
          </Text>
        </View>

        {useHorizontalRail ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
            snapToInterval={PROCESS_CARD_WIDTH + HOME_SPACE.md}
            snapToAlignment="start"
            disableIntervalMomentum
            contentContainerStyle={styles.railContent}
            style={styles.rail}
          >
            {process.steps.map((step, idx) => (
              <View
                key={step.step}
                style={{ width: PROCESS_CARD_WIDTH, marginRight: HOME_SPACE.md }}
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
              <View
                key={step.step}
                style={[styles.gridCell, { width: cellBasis, maxWidth: cellBasis }]}
              >
                <ScrollFadeUp index={idx} delay={idx * 70} preset="fade-up">
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
      "0 1px 2px rgba(60, 45, 20, 0.04), 0 18px 40px rgba(80, 60, 25, 0.1)",
  },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: HOME_SPACE.lg + 4,
    paddingHorizontal: HOME_SPACE.md,
    borderRadius: radius.xl + 2,
    backgroundColor: "rgba(250, 245, 233, 0.65)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.14)",
    ...Platform.select({
      web: {
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.7)",
      },
      default: {},
    }),
  },
  sectionDark: {
    backgroundColor: "rgba(24, 21, 19, 0.5)",
    borderColor: "#3f3933",
  },
  headerWrap: {
    width: "100%",
    gap: HOME_SPACE.sm,
    marginBottom: HOME_SPACE.lg,
  },
  journeyLabel: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.md,
    width: "100%",
  },
  gridCell: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 240,
  },
  rail: {
    width: "100%",
    marginHorizontal: -HOME_SPACE.md,
    paddingHorizontal: HOME_SPACE.md,
  },
  railContent: {
    paddingRight: HOME_SPACE.lg,
    paddingBottom: HOME_SPACE.xs,
  },
  card: {
    borderRadius: radius.lg + 4,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.lineSoft,
    backgroundColor: KANKREG_PALETTE.card,
    ...cardShadow,
    ...Platform.select({
      web: { transition: "transform 0.22s ease, box-shadow 0.22s ease" },
      default: {},
    }),
  },
  cardCompact: {
    width: PROCESS_CARD_WIDTH,
  },
  cardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  imageWrap: {
    width: "100%",
    height: PROCESS_IMAGE_HEIGHT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#0a0908",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  stepBadge: {
    position: "absolute",
    left: HOME_SPACE.md,
    bottom: HOME_SPACE.md,
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(28, 18, 8, 0.62)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 253, 248, 0.2)",
    ...Platform.select({
      web: { backdropFilter: "blur(6px)" },
      default: {},
    }),
  },
  stepBadgeText: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    color: KANKREG_PALETTE.goldBright,
    letterSpacing: 0.5,
  },
  cardBody: {
    paddingHorizontal: HOME_SPACE.md + 2,
    paddingVertical: HOME_SPACE.md,
    gap: HOME_SPACE.xs,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.kicker + 1,
    lineHeight: HOME_TYPE.body.lineHeight + 2,
  },
  cardDesc: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
