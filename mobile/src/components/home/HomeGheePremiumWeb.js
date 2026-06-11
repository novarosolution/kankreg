import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HOME_STORY_CONTENT } from "../../content/appContent";
import HomeGheeCompare from "./HomeGheeCompare";
import { SectionHeader, ScrollFadeUp } from "./editorial";
import GoldHairline from "../ui/GoldHairline";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SECTION_GAP,
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { fonts, radius } from "../../theme/tokens";

function StoryDivider() {
  return <GoldHairline {...GOLD_HAIRLINE_EDITORIAL.subtle} marginVertical={HOME_SPACE.md} />;
}

/** Stagger delay (ms) — matches process + community rails for one cinematic scroll rhythm. */
const STORY_STAGGER_MS = 70;

function WhyKankrejSection() {
  const { isDark } = useTheme();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const { whyKankrej } = HOME_STORY_CONTENT;

  return (
    <ScrollFadeUp index={5} preset="fade-up">
      <View nativeID="home-why-kankrej" style={[styles.section, styles.sectionTint, isDark && styles.sectionTintDark]}>
        <SectionHeader eyebrow={whyKankrej.eyebrow} title={whyKankrej.title} kicker={whyKankrej.subtitle} />
        <ScrollFadeUp index={0} delay={STORY_STAGGER_MS} preset="fade-up">
          <Text style={[styles.whyBody, { color: muted }]}>{whyKankrej.body}</Text>
        </ScrollFadeUp>
        <View style={styles.statsGrid}>
          {whyKankrej.stats.map((stat, idx) => (
            <ScrollFadeUp
              key={stat.value}
              index={idx}
              delay={idx * STORY_STAGGER_MS}
              preset="fade-up"
              style={styles.statRevealCell}
            >
              <View style={[styles.statCard, isDark && styles.statCardDark]}>
                <Text style={[styles.statValue, { color: "#1F4D36" }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: KANKREG_PALETTE.gold }]}>{stat.label}</Text>
                <Text style={[styles.statDesc, { color: muted }]}>{stat.description}</Text>
              </View>
            </ScrollFadeUp>
          ))}
        </View>
      </View>
    </ScrollFadeUp>
  );
}

function BenefitsSection() {
  const { isDark } = useTheme();
  const { width } = useKankregLayout();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const { benefits } = HOME_STORY_CONTENT;
  const cardBasis = width >= 1080 ? "31.5%" : width >= 720 ? "48%" : "100%";

  return (
    <ScrollFadeUp index={6} preset="fade-up">
      <View nativeID="home-benefits" style={styles.section}>
        <SectionHeader eyebrow={benefits.eyebrow} title={benefits.title} align="center" />
        <View style={styles.benefitsGrid}>
          {benefits.items.map((item, idx) => (
            <ScrollFadeUp
              key={item.title}
              index={idx}
              delay={idx * STORY_STAGGER_MS}
              preset="fade-up"
              style={{ width: cardBasis, maxWidth: cardBasis, minWidth: 220 }}
            >
              <View style={[styles.benefitCard, isDark && styles.benefitCardDark]}>
                <Text style={[styles.benefitTitle, { color: ink }]}>{item.title}</Text>
                <Text style={[styles.benefitDesc, { color: muted }]}>{item.description}</Text>
              </View>
            </ScrollFadeUp>
          ))}
        </View>
      </View>
    </ScrollFadeUp>
  );
}

function TestimonialsSection() {
  const { isDark } = useTheme();
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const { testimonials } = HOME_STORY_CONTENT;

  return (
    <ScrollFadeUp index={7} preset="fade-up">
      <View nativeID="home-testimonials" style={[styles.section, styles.sectionTint, isDark && styles.sectionTintDark]}>
        <SectionHeader eyebrow={testimonials.eyebrow} title={testimonials.title} align="center" />
        <View style={styles.testimonialGrid}>
          {testimonials.items.map((item, idx) => (
            <ScrollFadeUp
              key={item.name}
              index={idx}
              delay={idx * STORY_STAGGER_MS}
              preset="fade-up"
              style={styles.testimonialRevealCell}
            >
              <View style={[styles.testimonialCard, isDark && styles.testimonialCardDark]}>
                <Text style={[styles.testimonialQuote, { color: ink }]}>&ldquo;{item.quote}&rdquo;</Text>
                <GoldHairline {...GOLD_HAIRLINE_EDITORIAL.subtle} marginVertical={HOME_SPACE.sm} />
                <Text style={[styles.testimonialName, { color: ink }]}>{item.name}</Text>
                <Text style={[styles.testimonialLoc, { color: muted }]}>{item.location}</Text>
              </View>
            </ScrollFadeUp>
          ))}
        </View>
      </View>
    </ScrollFadeUp>
  );
}

/** Premium ghee brand story blocks for web home (process → trust). */
export default function HomeGheePremiumWeb({ compareSection }) {
  if (Platform.OS !== "web") return null;

  return (
    <View style={styles.storyStack} nativeID="home-story-continuum">
      <GoldHairline {...GOLD_HAIRLINE_EDITORIAL.section} marginVertical={HOME_SPACE.lg} />
      <HomeGheeCompare compareSection={compareSection} />
      <StoryDivider />
      <WhyKankrejSection />
      <StoryDivider />
      <BenefitsSection />
      <StoryDivider />
      <TestimonialsSection />
    </View>
  );
}

const cardBase = Platform.select({
  web: { boxShadow: "0 12px 32px -22px rgba(25, 20, 15, 0.2)" },
  default: {},
});

const styles = StyleSheet.create({
  storyStack: {
    width: "100%",
    gap: HOME_SPACE.sm,
    paddingBottom: HOME_SECTION_GAP,
  },
  section: {
    width: "100%",
    paddingVertical: HOME_SPACE.md,
  },
  sectionTint: {
    marginHorizontal: -4,
    paddingHorizontal: HOME_SPACE.md,
    paddingVertical: HOME_SPACE.lg,
    borderRadius: radius.lg,
    backgroundColor: "rgba(201, 146, 30, 0.04)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.12)",
  },
  sectionTintDark: {
    backgroundColor: "rgba(201, 146, 30, 0.06)",
    borderColor: "rgba(169, 119, 46, 0.18)",
  },
  whyBody: {
    fontFamily: fonts.regular,
    fontSize: HOME_TYPE.body.max - 1,
    lineHeight: HOME_TYPE.body.lineHeight + 3,
    maxWidth: 720,
    marginBottom: HOME_SPACE.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.md,
  },
  statRevealCell: {
    flex: 1,
    minWidth: 180,
  },
  statCard: {
    flex: 1,
    minWidth: 180,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(201, 146, 30, 0.25)",
    backgroundColor: KANKREG_PALETTE.card,
    padding: HOME_SPACE.md,
    ...cardBase,
  },
  statCardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: HOME_TYPE.kicker + 2,
  },
  statLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 4,
  },
  statDesc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: HOME_SPACE.xs,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.md,
    width: "100%",
  },
  benefitCard: {
    width: "100%",
    flexGrow: 1,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
    padding: HOME_SPACE.md,
    ...cardBase,
  },
  benefitCardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  benefitTitle: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.kicker,
    marginBottom: HOME_SPACE.xs,
  },
  benefitDesc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  testimonialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.md,
  },
  testimonialRevealCell: {
    flex: 1,
    minWidth: 220,
  },
  testimonialCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
    padding: HOME_SPACE.md,
    ...cardBase,
  },
  testimonialCardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
  },
  testimonialQuote: {
    fontFamily: fonts.regular,
    fontSize: HOME_TYPE.kicker,
    lineHeight: HOME_TYPE.body.lineHeight + 2,
    flex: 1,
  },
  testimonialName: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.kicker,
  },
  testimonialLoc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 2,
  },
});
