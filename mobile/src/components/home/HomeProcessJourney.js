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
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";
import { getHomePhoneBleed } from "../../utils/homeSectionBleed";

const PROCESS_IMAGE_ASPECT = 3 / 4;
const PROCESS_RAIL_CARD_WIDTH = 256;
const PROCESS_CARD_CLASS = "kankreg-process-step-card";

if (Platform.OS === "web") {
  injectWebCssOnce(
    "kankreg-process-journey-premium",
    `.${PROCESS_CARD_CLASS} {
  transition: transform 0.28s cubic-bezier(0.2, 0.7, 0.3, 1), box-shadow 0.28s ease;
}
.${PROCESS_CARD_CLASS}:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(60, 45, 20, 0.06), 0 22px 48px -16px rgba(80, 60, 25, 0.22) !important;
}
@media (prefers-reduced-motion: reduce) {
  .${PROCESS_CARD_CLASS}:hover { transform: none !important; }
}`
  );
}

function formatStepNum(step) {
  return String(step).padStart(2, "0");
}

function ProcessStepCard({ step, isDark, ink, muted, compact = false, totalSteps = 6, phone = false }) {
  const imageSource = resolveImageSource(step.image);
  const imageFit = step.imageFit === "contain" ? "contain" : "cover";
  const imagePosition = step.imagePosition || "top center";
  const imageAspect = phone ? 4 / 5 : PROCESS_IMAGE_ASPECT;

  return (
    <View
      className={Platform.OS === "web" ? PROCESS_CARD_CLASS : undefined}
      style={[
        styles.card,
        compact && styles.cardCompact,
        phone && styles.cardPhone,
        isDark && styles.cardDark,
      ]}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(214, 173, 91, 0.14)", "transparent"]
            : ["rgba(214, 173, 91, 0.22)", "transparent"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardTopAccent}
        pointerEvents="none"
      />
      <View style={[styles.imageFrame, { aspectRatio: imageAspect }, isDark && styles.imageFrameDark]}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit={imageFit}
            contentPosition={imagePosition}
            transition={320}
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
            cachePolicy="memory-disk"
            recyclingKey={`process-${step.step}`}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}
        <LinearGradient
          colors={["rgba(8, 6, 4, 0.08)", "transparent", "rgba(8, 6, 4, 0.55)"]}
          locations={[0, 0.42, 1]}
          style={styles.imageScrim}
          pointerEvents="none"
        />
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeEyebrow}>Step</Text>
          <Text style={styles.stepBadgeText}>{formatStepNum(step.step)}</Text>
        </View>
        <View style={styles.imageGoldRule} pointerEvents="none" />
      </View>
      <View style={[styles.cardBody, isDark && styles.cardBodyDark]}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.titleDot, isDark && styles.titleDotDark]} />
          <Text style={[styles.cardTitle, { color: ink }]} numberOfLines={2}>
            {step.title}
          </Text>
        </View>
        <Text style={[styles.cardDesc, { color: muted }]} numberOfLines={3}>
          {step.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={[styles.cardFooterText, { color: muted }]}>
            {formatStepNum(step.step)} / {formatStepNum(totalSteps)}
          </Text>
          <View style={[styles.cardFooterLine, isDark && styles.cardFooterLineDark]} />
        </View>
      </View>
    </View>
  );
}

/**
 * Immersive Bilona process — image-led steps. All copy + images in `gheeHomeContent.js`.
 */
export default function HomeProcessJourney() {
  const { isDark } = useTheme();
  const { width, isMd, isLg, isMobileWeb, pageGutterClamp } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const { process } = HOME_STORY_CONTENT;
  const totalSteps = process.steps.length;
  const bleed = getHomePhoneBleed({
    isMobileWeb,
    pageGutterClamp,
    width,
    nativeFullWidth: true,
  });

  const layout = useMemo(() => {
    if (width >= 1080) return { cols: 3, rail: false };
    if (width >= 720) return { cols: 2, rail: false };
    return { cols: 1, rail: true };
  }, [width]);

  const railCardWidth = useMemo(() => {
    if (width < 720) return Math.round(width * 0.86);
    return PROCESS_RAIL_CARD_WIDTH;
  }, [width]);

  const railGap = width < 720 ? 12 : HOME_SPACE.md;

  const cellStyle = useMemo(() => {
    if (layout.cols === 3) {
      return { width: "31.6%", maxWidth: "31.6%", minWidth: 0 };
    }
    if (layout.cols === 2) {
      return { width: "48.4%", maxWidth: "48.4%", minWidth: 0 };
    }
    return { width: "100%", maxWidth: "100%" };
  }, [layout.cols]);

  const phoneLayout = width < 720;

  return (
      <View
        nativeID="home-process"
        style={[
          styles.section,
          phoneLayout && styles.sectionPhone,
          bleed.outer,
          isDark && styles.sectionDark,
        ]}
      >
        {!phoneLayout ? <View style={styles.sectionFrameTop} pointerEvents="none" /> : null}
        {!phoneLayout ? (
          <View style={[styles.sectionFrameInset, isDark && styles.sectionFrameInsetDark]} pointerEvents="none" />
        ) : null}
        <LinearGradient
          colors={
            isDark
              ? ["rgba(214, 173, 91, 0.06)", "transparent", "rgba(60, 98, 72, 0.04)"]
              : ["rgba(214, 173, 91, 0.1)", "transparent", "rgba(60, 98, 72, 0.05)"]
          }
          locations={[0, 0.55, 1]}
          style={styles.sectionWash}
          pointerEvents="none"
        />

        <View style={[styles.headerWrap, bleed.inner, isLg && styles.headerWrapDesktop]}>
          <View style={styles.headerCopy}>
            <SectionHeader
              eyebrow={process.eyebrow}
              title={process.title}
              kicker={process.subtitle}
              align={isMd ? "left" : "center"}
              flush
            />
          </View>
          {isLg ? (
            <View style={[styles.journeyChip, isDark && styles.journeyChipDark]}>
              <Text style={[styles.journeyChipEyebrow, { color: KANKREG_PALETTE.gold }]}>
                {process.journeyLabel}
              </Text>
              <Text style={[styles.journeyChipMeta, { color: muted }]}>
                {totalSteps} handcrafted stages
              </Text>
            </View>
          ) : null}
        </View>

        <GoldHairline
          {...GOLD_HAIRLINE_EDITORIAL.subtle}
          marginVertical={HOME_SPACE.sm}
          style={[styles.headerHairline, bleed.inner]}
        />

        {!isLg ? (
          <View style={[styles.journeyChipInline, bleed.inner, isDark && styles.journeyChipDark]}>
            <Text style={[styles.journeyChipEyebrow, { color: KANKREG_PALETTE.gold }]}>
              {process.journeyLabel}
            </Text>
          </View>
        ) : null}

        {layout.rail ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
            snapToInterval={railCardWidth + railGap}
            snapToAlignment="start"
            disableIntervalMomentum
            contentContainerStyle={[styles.railContent, bleed.railPad]}
            style={[styles.rail, phoneLayout && styles.railPhone]}
          >
            {process.steps.map((step, idx) => (
              <View
                key={step.step}
                style={{ width: railCardWidth, marginRight: railGap }}
              >
                <ScrollFadeUp index={idx} delay={idx * 70} preset="fade-up">
                  <ProcessStepCard
                    step={step}
                    isDark={isDark}
                    ink={ink}
                    muted={muted}
                    compact
                    phone={phoneLayout}
                    totalSteps={totalSteps}
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
                  <ProcessStepCard
                    step={step}
                    isDark={isDark}
                    ink={ink}
                    muted={muted}
                    totalSteps={totalSteps}
                  />
                </ScrollFadeUp>
              </View>
            ))}
          </View>
        )}
      </View>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow:
      "0 2px 4px rgba(60, 45, 20, 0.04), 0 14px 36px -18px rgba(80, 60, 25, 0.16)",
  },
  ios: {
    shadowColor: "#19140f",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
  },
  android: { elevation: 4 },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: HOME_SPACE.xl + 12,
    paddingHorizontal: HOME_SPACE.lg + 6,
    borderRadius: radius.xl + 8,
    backgroundColor: KANKREG_CHROME.cream,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.2)",
    borderTopWidth: 3,
    borderTopColor: "rgba(201, 162, 39, 0.78)",
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.94), 0 2px 4px rgba(60, 45, 20, 0.04), 0 28px 64px -36px rgba(80, 60, 25, 0.18)",
      },
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.1,
        shadowRadius: 28,
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  sectionPhone: {
    paddingHorizontal: 0,
    paddingVertical: HOME_SPACE.lg + 6,
    borderRadius: 0,
  },
  sectionDark: {
    backgroundColor: "rgba(24, 21, 19, 0.72)",
    borderColor: "rgba(214, 173, 91, 0.16)",
    borderTopColor: "rgba(214, 173, 91, 0.55)",
  },
  sectionFrameTop: {
    position: "absolute",
    top: 3,
    left: HOME_SPACE.lg,
    right: HOME_SPACE.lg,
    height: 1,
    backgroundColor: "rgba(255, 253, 248, 0.55)",
    zIndex: 2,
  },
  sectionFrameInset: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderRadius: radius.xl + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.14)",
    zIndex: 1,
    pointerEvents: "none",
  },
  sectionFrameInsetDark: {
    borderColor: "rgba(214, 173, 91, 0.1)",
  },
  headerHairline: {
    width: "100%",
    opacity: 0.65,
  },
  sectionWash: {
    ...StyleSheet.absoluteFillObject,
  },
  headerWrap: {
    width: "100%",
    gap: HOME_SPACE.sm,
    marginBottom: HOME_SPACE.xs,
    zIndex: 1,
  },
  headerWrapDesktop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: HOME_SPACE.lg,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  journeyChip: {
    alignItems: "flex-end",
    gap: 4,
    paddingVertical: HOME_SPACE.sm,
    paddingHorizontal: HOME_SPACE.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.28)",
    backgroundColor: "rgba(255, 253, 248, 0.72)",
    ...Platform.select({
      web: { backdropFilter: "blur(8px)" },
      default: {},
    }),
  },
  journeyChipInline: {
    alignSelf: "flex-start",
    marginBottom: HOME_SPACE.md,
    paddingVertical: HOME_SPACE.xs + 2,
    paddingHorizontal: HOME_SPACE.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.28)",
    backgroundColor: "rgba(255, 253, 248, 0.8)",
  },
  journeyChipDark: {
    backgroundColor: "rgba(24, 21, 19, 0.55)",
    borderColor: "rgba(214, 173, 91, 0.22)",
  },
  journeyChipEyebrow: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  journeyChipMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: HOME_SPACE.lg,
    columnGap: HOME_SPACE.md,
    width: "100%",
    marginTop: HOME_SPACE.md,
    zIndex: 1,
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
    marginTop: HOME_SPACE.md,
    zIndex: 1,
  },
  railPhone: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  railContent: {
    paddingBottom: HOME_SPACE.sm,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg + 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.22)",
    backgroundColor: KANKREG_PALETTE.card,
    ...cardShadow,
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 1px 0 rgba(255, 253, 248, 0.9), 0 2px 4px rgba(60, 45, 20, 0.04), 0 16px 40px -20px rgba(80, 60, 25, 0.14)",
      },
      default: {},
    }),
  },
  cardCompact: {
    width: "100%",
  },
  cardPhone: {
    borderRadius: radius.xl + 4,
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 1px 0 rgba(255, 253, 248, 0.92), 0 8px 28px -10px rgba(80, 60, 25, 0.22)",
      },
      default: {},
    }),
  },
  cardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  cardTopAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 3,
  },
  imageFrame: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  imageFrameDark: {
    backgroundColor: "#1a1714",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  imageGoldRule: {
    position: "absolute",
    left: HOME_SPACE.md,
    right: HOME_SPACE.md,
    bottom: 0,
    height: 1,
    backgroundColor: "rgba(214, 173, 91, 0.45)",
  },
  imageFallback: {
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  stepBadge: {
    position: "absolute",
    left: HOME_SPACE.md,
    top: HOME_SPACE.md,
    minWidth: 48,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(27, 48, 34, 0.9)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(214, 173, 91, 0.42)",
    gap: 1,
    ...Platform.select({
      web: { backdropFilter: "blur(10px)" },
      default: {},
    }),
  },
  stepBadgeEyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "rgba(245, 239, 228, 0.72)",
  },
  stepBadgeText: {
    fontFamily: FONT_DISPLAY,
    fontSize: 20,
    lineHeight: 22,
    color: KANKREG_PALETTE.goldBright,
    letterSpacing: 0.3,
  },
  cardBody: {
    paddingHorizontal: HOME_SPACE.md + 2,
    paddingTop: HOME_SPACE.md,
    paddingBottom: HOME_SPACE.md + 2,
    gap: HOME_SPACE.xs,
    backgroundColor: KANKREG_PALETTE.card,
  },
  cardBodyDark: {
    backgroundColor: "#181513",
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: HOME_SPACE.sm,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: KANKREG_PALETTE.gold,
    flexShrink: 0,
  },
  titleDotDark: {
    backgroundColor: KANKREG_PALETTE.goldBright,
  },
  cardTitle: {
    flex: 1,
    fontFamily: FONT_DISPLAY,
    fontSize: HOME_TYPE.kicker + 1,
    lineHeight: HOME_TYPE.body.lineHeight + 4,
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    paddingLeft: HOME_SPACE.sm + 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: HOME_SPACE.sm,
    marginTop: HOME_SPACE.xs,
    paddingLeft: HOME_SPACE.sm + 6,
  },
  cardFooterText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  cardFooterLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(169, 119, 46, 0.22)",
  },
  cardFooterLineDark: {
    backgroundColor: "rgba(214, 173, 91, 0.18)",
  },
});
