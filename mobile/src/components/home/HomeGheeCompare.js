import React, { useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ScrollFadeUp } from "./editorial";
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
import { fonts, icon, radius } from "../../theme/tokens";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { resolveCompareDisplay } from "../../utils/homeViewMedia";
import { resolveImageSource } from "../../utils/mediaSource";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";

const CINEMA_FRAME_BG = "#0a0908";
const COMPARE_IMAGE_HEIGHT = 148;
const OPENER_HEIGHT = 200;
const STORY_STAGGER_MS = 80;
const COMPARE_ORDINARY_CLASS = "kankreg-compare-ordinary-img";
const COMPARE_CINEMA_CLASS = "kankreg-compare-cinema";
const COMPARE_OURS_DRIFT_CLASS = "kankreg-compare-ours-drift";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

if (Platform.OS === "web") {
  injectWebCssOnce(
    "kankreg-compare-cinema-v2",
    `@keyframes kankregCompareOursDrift {
  from { transform: scale(1.03); }
  to { transform: scale(1.08); }
}
.${COMPARE_ORDINARY_CLASS} {
  filter: grayscale(0.72) saturate(0.55) brightness(0.88);
}
.${COMPARE_CINEMA_CLASS}::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}
.${COMPARE_OURS_DRIFT_CLASS} {
  animation: kankregCompareOursDrift 22s ease-in-out infinite alternate;
  transform-origin: center center;
}
@media (prefers-reduced-motion: reduce) {
  .${COMPARE_OURS_DRIFT_CLASS} { animation: none !important; transform: none !important; }
}`
  );
}

function CompareImagePanel({ source, variant, label, isDark, drift = false }) {
  const isOurs = variant === "ours";
  const imageSource = resolveImageSource(source);

  return (
    <View style={[styles.panel, isOurs ? styles.panelOurs : styles.panelOrdinary]}>
      <View style={[styles.imageStage, isOurs ? styles.imageStageOurs : styles.imageStageOrdinary]}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.image,
              drift && isOurs && Platform.OS === "web" ? styles.imageDrift : null,
            ]}
            className={
              !isOurs && Platform.OS === "web"
                ? COMPARE_ORDINARY_CLASS
                : drift && isOurs && Platform.OS === "web"
                  ? COMPARE_OURS_DRIFT_CLASS
                  : undefined
            }
            contentFit="cover"
            contentPosition="center"
            transition={320}
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
          />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}
        <LinearGradient
          colors={
            isOurs
              ? ["rgba(25, 15, 5, 0.12)", "transparent", "rgba(8, 6, 4, 0.48)"]
              : ["rgba(40, 38, 36, 0.2)", "transparent", "rgba(8, 6, 4, 0.58)"]
          }
          locations={[0, 0.45, 1]}
          style={styles.imageScrim}
          pointerEvents="none"
        />
        <View style={[styles.panelBadge, isOurs ? styles.panelBadgeOurs : styles.panelBadgeOrdinary]}>
          <Ionicons
            name={isOurs ? "checkmark-circle" : "close-circle-outline"}
            size={icon.sm}
            color={isOurs ? "#9ee0b8" : "rgba(245, 239, 228, 0.55)"}
          />
          <Text style={[styles.panelBadgeText, isOurs ? styles.panelBadgeTextOurs : styles.panelBadgeTextOrdinary]}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CompareRowCard({ row, sceneNum, isDark, ink, muted, stackPanels, oursLabel, ordinaryLabel, idx }) {
  const preset = idx % 2 === 0 ? "slide-right" : "fade-up";

  return (
    <ScrollFadeUp index={idx} delay={idx * STORY_STAGGER_MS} preset={preset}>
      <View style={[styles.rowCard, isDark && styles.rowCardDark]}>
        <View style={styles.rowMeta}>
          <View style={styles.sceneBadge}>
            <Text style={styles.sceneBadgeText}>Scene {sceneNum}</Text>
          </View>
          <View style={styles.rowLabelRow}>
            <View style={styles.rowLabelDash} />
            <Text style={[styles.rowLabel, { color: ink }]}>{row.label}</Text>
          </View>
        </View>
        <View style={[styles.rowPanels, stackPanels && styles.rowPanelsStack]}>
          <View style={[styles.rowPanelCol, stackPanels && styles.rowPanelColStack]}>
            <CompareImagePanel source={row.oursImage} variant="ours" label={oursLabel} isDark={isDark} drift />
            <Text style={[styles.rowCopy, styles.rowCopyOurs, { color: ink }]}>{row.ours}</Text>
          </View>
          <View style={[styles.vsDivider, stackPanels && styles.vsDividerStack]}>
            <View style={[styles.vsLine, stackPanels && styles.vsLineStack]} />
            <Text style={styles.vsText}>vs</Text>
            <View style={[styles.vsLine, stackPanels && styles.vsLineStack]} />
          </View>
          <View style={[styles.rowPanelCol, stackPanels && styles.rowPanelColStack]}>
            <CompareImagePanel source={row.ordinaryImage} variant="ordinary" label={ordinaryLabel} isDark={isDark} />
            <Text style={[styles.rowCopy, { color: muted }]}>{row.ordinary}</Text>
          </View>
        </View>
      </View>
    </ScrollFadeUp>
  );
}

/**
 * Cinematic “Ours vs ordinary” — admin-managed via `compareSection` in Home View.
 */
export default function HomeGheeCompare({ compareSection }) {
  const { isDark } = useTheme();
  const { width } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const content = useMemo(() => resolveCompareDisplay(compareSection), [compareSection]);
  const stackPanels = width < 720;

  if (Platform.OS !== "web" || !content) return null;

  const openerImage = content.rows[0]?.oursImage;

  return (
    <ScrollFadeUp index={4} preset="scale-in">
      <View nativeID="home-differentiators" style={styles.section}>
        <ScrollFadeUp index={0} delay={STORY_STAGGER_MS} preset="fade-in">
          <View style={[styles.storyPrologue, isDark && styles.storyPrologueDark]}>
            <Text style={[styles.storyChapter, { color: KANKREG_PALETTE.gold }]}>{content.storyChapter}</Text>
            <Text
              style={[
                styles.storyTitle,
                width < 720 && styles.storyTitlePhone,
                { color: ink },
              ]}
            >
              {content.title}
            </Text>
            <Text style={[styles.storyOpening, { color: muted }]}>{content.openingLine}</Text>
          </View>
        </ScrollFadeUp>

        <ScrollFadeUp index={1} delay={STORY_STAGGER_MS * 2} preset="scale-in">
          <View
            className={Platform.OS === "web" ? COMPARE_CINEMA_CLASS : undefined}
            style={[styles.cinemaStage, isDark && styles.cinemaStageDark]}
          >
            <View style={styles.openerStrip}>
              {openerImage ? (
                <Image
                  source={resolveImageSource(openerImage)}
                  style={styles.openerImage}
                  contentFit="cover"
                  contentPosition="center"
                  transition={320}
                  placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
                />
              ) : null}
              <LinearGradient
                colors={["rgba(8, 6, 4, 0.55)", "rgba(8, 6, 4, 0.2)", "rgba(8, 6, 4, 0.82)"]}
                locations={[0, 0.45, 1]}
                style={styles.openerScrim}
                pointerEvents="none"
              />
              <View style={styles.openerCopy} pointerEvents="none">
                <Text style={styles.openerEyebrow}>{content.eyebrow}</Text>
                <Text style={styles.openerFilm}>{content.filmLabel}</Text>
              </View>
            </View>

            <View style={styles.cinemaChrome}>
              <View style={styles.filmBadge}>
                <View style={styles.filmBadgeDot} />
                <Text style={styles.filmBadgeText}>{content.storyChapter}</Text>
              </View>
              <View style={styles.cinemaTitles}>
                <Text style={styles.cinemaTitleOurs}>{content.oursLabel}</Text>
                <Text style={styles.cinemaVs}>✦</Text>
                <Text style={styles.cinemaTitleOrdinary}>{content.ordinaryLabel}</Text>
              </View>
            </View>
            <View style={styles.cinemaFrameLineTop} pointerEvents="none" />
            <View style={styles.rowsWrap}>
              {content.rows.map((row, idx) => (
                <CompareRowCard
                  key={row.id || row.label}
                  row={row}
                  sceneNum={ROMAN[idx] || String(idx + 1)}
                  isDark={isDark}
                  ink={ink}
                  muted={muted}
                  stackPanels={stackPanels}
                  oursLabel={content.oursLabel}
                  ordinaryLabel={content.ordinaryLabel}
                  idx={idx}
                />
              ))}
            </View>
            <View style={styles.cinemaFrameLineBottom} pointerEvents="none" />
          </View>
        </ScrollFadeUp>

        {content.subtitle ? (
          <ScrollFadeUp index={2} delay={STORY_STAGGER_MS * 3} preset="fade-in">
            <Text style={[styles.storyKicker, { color: muted }]}>{content.subtitle}</Text>
          </ScrollFadeUp>
        ) : null}
      </View>
    </ScrollFadeUp>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow:
      "0 2px 4px rgba(60, 40, 15, 0.08), 0 32px 64px -20px rgba(70, 48, 18, 0.26)",
  },
  default: {},
});

const rowShadow = Platform.select({
  web: {
    boxShadow: "0 1px 2px rgba(60, 45, 20, 0.04), 0 16px 36px rgba(80, 60, 25, 0.1)",
  },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: HOME_SPACE.lg,
    gap: HOME_SPACE.lg,
  },
  storyPrologue: {
    alignItems: "center",
    textAlign: "center",
    paddingVertical: HOME_SPACE.lg,
    paddingHorizontal: HOME_SPACE.md,
    borderRadius: radius.xl,
    backgroundColor: "rgba(250, 245, 233, 0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.14)",
    gap: HOME_SPACE.sm,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 2px rgba(60, 45, 20, 0.04), 0 20px 44px rgba(80, 60, 25, 0.08)",
      },
      default: {},
    }),
  },
  storyPrologueDark: {
    backgroundColor: "rgba(24, 21, 19, 0.55)",
    borderColor: "#3f3933",
  },
  storyChapter: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  storyTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.6,
    maxWidth: 560,
    textAlign: "center",
  },
  storyTitlePhone: {
    fontSize: 28,
    lineHeight: 32,
  },
  storyOpening: {
    fontFamily: fonts.medium,
    fontSize: HOME_TYPE.kicker + 1,
    lineHeight: HOME_TYPE.body.lineHeight + 4,
    maxWidth: 520,
    textAlign: "center",
    fontStyle: "italic",
  },
  storyKicker: {
    fontFamily: fonts.regular,
    fontSize: HOME_TYPE.kicker,
    lineHeight: HOME_TYPE.body.lineHeight,
    textAlign: "center",
    maxWidth: 560,
    alignSelf: "center",
  },
  cinemaStage: {
    width: "100%",
    borderRadius: radius.xl + 4,
    overflow: "hidden",
    backgroundColor: CINEMA_FRAME_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.32)",
    position: "relative",
    ...cardShadow,
  },
  cinemaStageDark: {
    borderColor: "#3f3933",
  },
  openerStrip: {
    height: OPENER_HEIGHT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: CINEMA_FRAME_BG,
  },
  openerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  openerScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  openerCopy: {
    position: "absolute",
    left: HOME_SPACE.lg,
    right: HOME_SPACE.lg,
    bottom: HOME_SPACE.md,
    gap: 4,
  },
  openerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(255, 253, 248, 0.62)",
  },
  openerFilm: {
    fontFamily: FONT_DISPLAY,
    fontSize: 26,
    lineHeight: 30,
    color: "#F6ECD7",
    letterSpacing: -0.3,
  },
  cinemaChrome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: HOME_SPACE.md + 4,
    paddingVertical: HOME_SPACE.md,
    gap: HOME_SPACE.md,
    flexWrap: "wrap",
  },
  filmBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: "rgba(28, 18, 8, 0.55)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 253, 248, 0.14)",
  },
  filmBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: KANKREG_PALETTE.gold,
  },
  filmBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(255, 253, 248, 0.82)",
  },
  cinemaTitles: {
    flexDirection: "row",
    alignItems: "center",
    gap: HOME_SPACE.sm,
    marginLeft: "auto",
  },
  cinemaTitleOurs: {
    fontFamily: FONT_DISPLAY,
    fontSize: 20,
    color: "#F6ECD7",
    letterSpacing: -0.2,
  },
  cinemaTitleOrdinary: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: "rgba(245, 239, 228, 0.48)",
    letterSpacing: 0.2,
  },
  cinemaVs: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: KANKREG_PALETTE.gold,
    opacity: 0.85,
  },
  cinemaFrameLineTop: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 253, 248, 0.14)",
  },
  cinemaFrameLineBottom: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 253, 248, 0.08)",
  },
  rowsWrap: {
    padding: HOME_SPACE.md,
    gap: HOME_SPACE.md,
  },
  rowCard: {
    borderRadius: radius.lg + 2,
    backgroundColor: "rgba(255, 254, 250, 0.97)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.lineSoft,
    padding: HOME_SPACE.md,
    gap: HOME_SPACE.md,
    ...rowShadow,
  },
  rowCardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  rowMeta: {
    gap: HOME_SPACE.xs,
  },
  sceneBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: "rgba(201, 146, 30, 0.12)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.22)",
  },
  sceneBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.goldDeep,
  },
  rowLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: HOME_SPACE.sm,
  },
  rowLabelDash: {
    width: 22,
    height: StyleSheet.hairlineWidth,
    backgroundColor: KANKREG_PALETTE.gold,
    opacity: 0.75,
  },
  rowLabel: {
    fontFamily: fonts.bold,
    fontSize: HOME_TYPE.kicker,
    letterSpacing: 0.15,
  },
  rowPanels: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: HOME_SPACE.sm,
  },
  rowPanelsStack: {
    flexDirection: "column",
    gap: HOME_SPACE.md,
  },
  rowPanelCol: {
    flex: 1,
    minWidth: 0,
    gap: HOME_SPACE.sm,
  },
  rowPanelColStack: {
    flex: undefined,
    width: "100%",
  },
  vsDivider: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: HOME_SPACE.xs,
  },
  vsDividerStack: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 0,
    gap: HOME_SPACE.sm,
  },
  vsLine: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    backgroundColor: "rgba(169, 119, 46, 0.28)",
    minHeight: 20,
  },
  vsLineStack: {
    width: undefined,
    height: StyleSheet.hairlineWidth,
    minHeight: 0,
    flex: 1,
  },
  vsText: {
    fontFamily: FONT_DISPLAY,
    fontSize: 11,
    color: KANKREG_PALETTE.gold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  panel: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  panelOurs: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(31, 77, 54, 0.35)",
  },
  panelOrdinary: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(120, 110, 95, 0.28)",
    opacity: 0.92,
  },
  imageStage: {
    height: COMPARE_IMAGE_HEIGHT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#1a1410",
  },
  imageStageOurs: {
    backgroundColor: "#1a1410",
  },
  imageStageOrdinary: {
    backgroundColor: "#2a2826",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageDrift: {},
  imageFallback: {
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  panelBadge: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  panelBadgeOurs: {
    backgroundColor: "rgba(31, 77, 54, 0.62)",
    borderColor: "rgba(158, 224, 184, 0.22)",
  },
  panelBadgeOrdinary: {
    backgroundColor: "rgba(40, 38, 36, 0.62)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  panelBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  panelBadgeTextOurs: {
    color: "#E8F5EC",
  },
  panelBadgeTextOrdinary: {
    color: "rgba(245, 239, 228, 0.65)",
  },
  rowCopy: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 2,
  },
  rowCopyOurs: {
    fontFamily: fonts.medium,
  },
});
