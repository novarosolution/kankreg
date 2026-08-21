import React, { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { normalizeAboutSection } from "../../utils/homeViewMedia";
import GoldHairline from "../ui/GoldHairline";
import PremiumButton from "../ui/PremiumButton";
import { GOLD_HAIRLINE_EDITORIAL, HOME_SPACE } from "../../theme/homeEditorial";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts, radius } from "../../theme/tokens";
import { FONT_HEADING } from "../../theme/typographyRoles";
import { getHomePhoneBleed } from "../../utils/homeSectionBleed";

/** Closing call-to-action band — real, already-authored ctaBand content from the
 *  about section that previously rendered only on the dedicated About screen. */
export default function WebHomeCtaBand({ aboutSection, navigation }) {
  const { isMobileWeb, pageGutterClamp } = useKankregLayout();

  const cta = useMemo(() => {
    const about = normalizeAboutSection(aboutSection);
    if (!about.enabled) return null;
    const { title, body, ctaLabel, ctaSecondaryLabel } = about.ctaBand || {};
    if (!title && !ctaLabel) return null;
    return { title, body, ctaLabel, ctaSecondaryLabel };
  }, [aboutSection]);

  if (!cta) return null;

  const bleed = getHomePhoneBleed({ isMobileWeb, pageGutterClamp, nativeFullWidth: true });

  return (
    <View
      nativeID="home-cta-band"
      style={[styles.section, isMobileWeb && styles.sectionPhone, bleed.outer]}
    >
      <LinearGradient
        colors={["#171310", "#1f1a15", "#182019"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(214, 173, 91, 0.16)", "transparent"]}
        locations={[0, 1]}
        style={styles.sectionGlow}
        pointerEvents="none"
      />

      <GoldHairline
        {...GOLD_HAIRLINE_EDITORIAL.subtle}
        marginVertical={0}
        style={styles.hairline}
      />

      <View style={[styles.inner, bleed.inner]}>
        {cta.title ? (
          <Text style={styles.title} numberOfLines={3}>
            {cta.title}
          </Text>
        ) : null}
        {cta.body ? (
          <Text style={styles.body} numberOfLines={3}>
            {cta.body}
          </Text>
        ) : null}

        <View style={[styles.actions, isMobileWeb && styles.actionsPhone]}>
          {cta.ctaLabel ? (
            <PremiumButton
              label={cta.ctaLabel}
              variant="gold"
              size="lg"
              onPress={() => navigation.navigate("Shop")}
              iconRight="arrow-forward"
              fullWidth={isMobileWeb}
            />
          ) : null}
          {cta.ctaSecondaryLabel ? (
            <Pressable
              onPress={() => navigation.navigate("Support")}
              style={({ hovered, pressed }) => [
                styles.secondaryBtn,
                hovered && styles.secondaryBtnHover,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={cta.ctaSecondaryLabel}
            >
              <Text style={styles.secondaryText}>{cta.ctaSecondaryLabel}</Text>
              <Ionicons name="chevron-forward" size={14} color="rgba(245, 239, 228, 0.82)" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingTop: HOME_SPACE.xl + 10,
    paddingBottom: HOME_SPACE.xl + 10,
    paddingHorizontal: HOME_SPACE.lg + 6,
    borderRadius: radius.xl + 10,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      web: {
        boxShadow: "0 40px 90px -40px rgba(10, 8, 6, 0.55), inset 0 1px 0 rgba(214, 173, 91, 0.1)",
      },
      default: {},
    }),
  },
  sectionPhone: {
    paddingHorizontal: HOME_SPACE.md,
    paddingVertical: HOME_SPACE.lg + 10,
    borderRadius: radius.xl + 6,
  },
  sectionGlow: {
    position: "absolute",
    top: -80,
    left: "50%",
    marginLeft: -260,
    width: 520,
    height: 260,
    borderRadius: 260,
  },
  hairline: { width: "100%", maxWidth: 260, alignSelf: "center", marginBottom: HOME_SPACE.lg, opacity: 0.7 },
  inner: {
    width: "100%",
    alignItems: "center",
    gap: HOME_SPACE.md,
    zIndex: 1,
  },
  title: {
    fontFamily: FONT_HEADING,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.4,
    color: "#F6ECD7",
    textAlign: "center",
    maxWidth: 560,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: "rgba(245, 239, 228, 0.72)",
    textAlign: "center",
    maxWidth: 480,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: HOME_SPACE.lg,
    marginTop: HOME_SPACE.xs,
  },
  actionsPhone: {
    flexDirection: "column",
    width: "100%",
    gap: HOME_SPACE.md,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  secondaryBtnHover: {
    ...Platform.select({ web: { opacity: 0.85 }, default: {} }),
  },
  secondaryText: {
    fontFamily: fonts.semibold,
    fontSize: 14.5,
    color: "rgba(245, 239, 228, 0.92)",
    letterSpacing: 0.1,
  },
});
