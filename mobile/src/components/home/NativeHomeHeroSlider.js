import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HOME_HERO_MOBILE_SLIDER_SLIDES } from "../../constants/marketingAssets";
import { HOME_SCREEN_UI, HOME_TRUST_STRIP } from "../../content/appContent";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useTheme } from "../../context/ThemeContext";
import { fonts, icon, spacing, typography } from "../../theme/tokens";
import { getActiveHeroSlides, mapMarketingSlidesToHero } from "../../utils/homeViewMedia";
import GoldHairline from "../ui/GoldHairline";
import HeroMediaSlider from "./HeroMediaSlider";

/** Premium home banner slider for iOS / Android. */
export default function NativeHomeHeroSlider({ navigation, heroSlides = [] }) {
  const { isDark } = useTheme();

  const activeSlides = useMemo(() => {
    const adminSlides = getActiveHeroSlides(heroSlides);
    if (adminSlides.length) return adminSlides;
    return mapMarketingSlidesToHero(HOME_HERO_MOBILE_SLIDER_SLIDES);
  }, [heroSlides]);

  if (!activeSlides.length) return null;

  const showTrust = HOME_SCREEN_UI.web?.showHeroTrustChips !== false;

  return (
    <View style={styles.wrap}>
      <HeroMediaSlider
        variant="native"
        slides={activeSlides}
        onPress={() => navigation.navigate("Shop")}
        editorialEyebrow={HOME_SCREEN_UI.native?.heroEyebrow || HOME_SCREEN_UI.web?.heroEyebrow}
      />
      {showTrust ? (
        <View style={[styles.trustRibbon, isDark && styles.trustRibbonDark]}>
          {HOME_TRUST_STRIP.map((item) => (
            <View key={item.key} style={styles.trustItem}>
              <View style={[styles.trustIconWrap, isDark && styles.trustIconWrapDark]}>
                <Ionicons name={item.icon} size={icon.xs} color={KANKREG_PALETTE.goldBright} />
              </View>
              <Text style={[styles.trustText, isDark && styles.trustTextDark]} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <GoldHairline marginVertical={spacing.sm} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignSelf: "stretch",
    marginBottom: spacing.xs,
  },
  trustRibbon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(255,253,248,0.96)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.lineSoft,
  },
  trustRibbonDark: {
    backgroundColor: "rgba(24,21,19,0.94)",
    borderColor: "rgba(232,200,90,0.14)",
  },
  trustItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minWidth: 0,
  },
  trustIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(169, 119, 46, 0.1)",
  },
  trustIconWrapDark: {
    backgroundColor: "rgba(232, 200, 90, 0.12)",
  },
  trustText: {
    fontFamily: fonts.semibold,
    fontSize: typography.caption,
    color: KANKREG_PALETTE.inkSoft,
    letterSpacing: 0.15,
  },
  trustTextDark: {
    color: "rgba(245,239,228,0.78)",
  },
});
