import React, { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { normalizeAboutSection } from "../../utils/homeViewMedia";
import { SectionHeader, ScrollFadeUp } from "./editorial";
import GoldHairline from "../ui/GoldHairline";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SPACE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { fonts, icon, radius } from "../../theme/tokens";
import { getHomePhoneBleed } from "../../utils/homeSectionBleed";

function PillarCard({ pillar, isDark, ink, muted, index }) {
  return (
    <ScrollFadeUp index={index} delay={index * 50} preset="fade-up" style={styles.cardWrap}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={[styles.iconBadge, isDark && styles.iconBadgeDark]}>
          <Ionicons
            name={pillar.icon}
            size={icon.sm + 2}
            color={isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold}
          />
        </View>
        <Text style={[styles.cardTitle, { color: ink }]} numberOfLines={2}>
          {pillar.title}
        </Text>
        {pillar.body ? (
          <Text style={[styles.cardBody, { color: muted }]} numberOfLines={4}>
            {pillar.body}
          </Text>
        ) : null}
      </View>
    </ScrollFadeUp>
  );
}

/** Mission + pillars — real, already-authored about-page content that previously
 *  rendered only on the dedicated About screen, never on Home. */
export default function WebPillarsSection({ aboutSection }) {
  const { isDark } = useTheme();
  const { isMobileWeb, pageGutterClamp } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);

  const about = useMemo(() => normalizeAboutSection(aboutSection), [aboutSection]);
  const pillars = useMemo(
    () => (about.pillars || []).filter((p) => p.enabled),
    [about.pillars]
  );

  if (!about.enabled || !pillars.length) return null;

  const bleed = getHomePhoneBleed({ isMobileWeb, pageGutterClamp, nativeFullWidth: true });
  const [introParagraph, secondParagraph] = about.mission.paragraphs;

  return (
    <View
      nativeID="home-mission"
      style={[styles.section, isMobileWeb && styles.sectionPhone, bleed.outer, isDark && styles.sectionDark]}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(214, 173, 91, 0.07)", "transparent", "rgba(60, 98, 72, 0.06)"]
            : ["rgba(214, 173, 91, 0.08)", "transparent", "rgba(60, 98, 72, 0.05)"]
        }
        locations={[0, 0.5, 1]}
        style={styles.sectionWash}
        pointerEvents="none"
      />

      <View style={[styles.headerBlock, bleed.inner]}>
        <SectionHeader
          eyebrow={about.mission.eyebrow}
          title={about.mission.title}
          kicker={introParagraph}
          align="center"
          flush
        />
      </View>

      <GoldHairline
        {...GOLD_HAIRLINE_EDITORIAL.subtle}
        marginVertical={0}
        style={[styles.headerHairline, bleed.inner]}
      />

      <View style={[styles.grid, bleed.inner]}>
        {pillars.map((pillar, idx) => (
          <PillarCard key={pillar.id} pillar={pillar} isDark={isDark} ink={ink} muted={muted} index={idx} />
        ))}
      </View>

      {secondParagraph ? (
        <Text style={[styles.tagline, { color: muted }]} numberOfLines={3}>
          {secondParagraph}
        </Text>
      ) : null}
    </View>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow:
      "inset 0 1px 0 rgba(255, 253, 248, 0.96), 0 2px 6px rgba(60, 45, 20, 0.04), 0 28px 64px -32px rgba(80, 60, 25, 0.16)",
  },
  ios: {
    shadowColor: "#3D2A12",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
  },
  android: { elevation: 5 },
  default: {},
});

const cardItemShadow = Platform.select({
  web: { boxShadow: "0 10px 28px -20px rgba(25, 20, 15, 0.18)" },
  default: {},
});

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingTop: HOME_SPACE.xl + 12,
    paddingBottom: HOME_SPACE.xl + 8,
    paddingHorizontal: HOME_SPACE.lg + 6,
    borderRadius: radius.xl + 10,
    backgroundColor: KANKREG_CHROME.cream,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.18)",
    borderTopWidth: 3,
    borderTopColor: "rgba(214, 173, 91, 0.6)",
    overflow: "hidden",
    position: "relative",
    gap: HOME_SPACE.lg,
    ...cardShadow,
  },
  sectionPhone: {
    paddingHorizontal: HOME_SPACE.md,
    paddingVertical: HOME_SPACE.lg + 6,
    borderRadius: radius.xl + 6,
  },
  sectionDark: {
    backgroundColor: "rgba(24, 21, 19, 0.74)",
    borderColor: "rgba(214, 173, 91, 0.22)",
    borderTopColor: "rgba(214, 173, 91, 0.5)",
  },
  sectionWash: { ...StyleSheet.absoluteFillObject },
  headerBlock: { width: "100%", alignItems: "center", zIndex: 1 },
  headerHairline: { width: "100%", maxWidth: 420, alignSelf: "center", opacity: 0.55, zIndex: 1 },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.md,
    zIndex: 1,
  },
  cardWrap: {
    flexGrow: 1,
    flexBasis: 220,
    minWidth: 220,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.14)",
    backgroundColor: "rgba(255, 253, 248, 0.7)",
    padding: HOME_SPACE.md,
    gap: HOME_SPACE.xs + 2,
    ...cardItemShadow,
  },
  cardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(214, 173, 91, 0.12)",
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(214, 173, 91, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(214, 173, 91, 0.24)",
    marginBottom: 2,
  },
  iconBadgeDark: {
    backgroundColor: "rgba(214, 173, 91, 0.16)",
    borderColor: "rgba(214, 173, 91, 0.28)",
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
  },
  cardBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  tagline: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 640,
    alignSelf: "center",
    zIndex: 1,
  },
});
