import React, { useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import { HOME_NATIVE_INGREDIENTS } from "../../content/appContent";
import {
  HOME_BRAND_PROMO_POSTER,
  HOME_HERO_MOBILE_SLIDER_SLIDES,
  HOME_HERO_WEB_SLIDER_SLIDES,
} from "../../constants/marketingAssets";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { WEB_DISPLAY_FONT_STACK } from "../../theme/webFonts";

const CREAM = "#F3E9C9";
const GOLD = "#B8892D";
const GREEN = "#1A5C48";

const CARD_IMAGES = {
  land: HOME_BRAND_PROMO_POSTER,
  look: HOME_HERO_MOBILE_SLIDER_SLIDES[1]?.image,
  cut: HOME_HERO_WEB_SLIDER_SLIDES[1]?.image,
  herd: HOME_HERO_WEB_SLIDER_SLIDES[2]?.image,
};

function FoliageWash() {
  return (
    <View pointerEvents="none" style={styles.foliage}>
      <Svg width="100%" height="100%" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice">
        <G fill="rgba(196, 162, 74, 0.16)">
          <Circle cx="180" cy="80" r="10" />
          <Ellipse cx="200" cy="500" rx="200" ry="80" />
          <Ellipse cx="720" cy="515" rx="320" ry="90" />
          <Ellipse cx="1280" cy="500" rx="200" ry="78" />
          <Path d="M80 470 C80 380 20 350 90 280 C140 350 200 370 180 470 Z" />
          <Path d="M1180 480 C1180 370 1080 330 1200 250 C1290 330 1360 360 1340 480 Z" />
        </G>
      </Svg>
    </View>
  );
}

function IngredientCard({ card, stacked }) {
  const image = CARD_IMAGES[card.imageKey];
  const light = card.tone === "light";
  const titleColor = light ? GREEN : "#FFFFFF";
  const bodyColor = light ? "rgba(26, 43, 34, 0.78)" : "rgba(255,255,255,0.92)";
  const overlay = light
    ? ["rgba(255,252,244,0.42)", "rgba(255,252,244,0.08)"]
    : ["rgba(18, 28, 22, 0.62)", "rgba(18, 28, 22, 0.18)"];

  return (
    <View style={[styles.card, stacked && styles.cardStacked]}>
      {image ? (
        <Image source={image} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.photoFallback]} />
      )}
      <LinearGradient colors={overlay} style={StyleSheet.absoluteFillObject} />
      <View style={styles.copy}>
        <Text style={[styles.cardTitle, { color: titleColor }]}>{card.title}</Text>
        <Text style={[styles.cardBody, { color: bodyColor }]}>{card.body}</Text>
      </View>
    </View>
  );
}

export default function HomeNativeIngredients() {
  const { isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const stacked = isMobileWeb || Platform.OS !== "web" || width < 900;
  const copy = HOME_NATIVE_INGREDIENTS;

  const fullBleed = useMemo(() => {
    if (Platform.OS !== "web") return { width: "100%" };
    if (isMobileWeb) return { width: "100%", alignSelf: "stretch" };
    return {
      width: "100vw",
      maxWidth: "100vw",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
      alignSelf: "center",
    };
  }, [isMobileWeb]);

  return (
    <View style={[styles.shell, fullBleed]} accessibilityRole="region" accessibilityLabel={copy.title}>
      <View style={styles.band}>
        <FoliageWash />
        <View style={[styles.inner, { paddingHorizontal: pageGutterClamp }]}>
          <Text style={styles.title}>{copy.title}</Text>
          <View style={[styles.grid, stacked && styles.gridStacked]}>
            {copy.cards.map((card) => (
              <IngredientCard key={card.key} card={card} stacked={stacked} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
  },
  band: {
    width: "100%",
    backgroundColor: CREAM,
    overflow: "hidden",
    paddingTop: 64,
    paddingBottom: 64,
    position: "relative",
  },
  foliage: {
    ...StyleSheet.absoluteFillObject,
  },
  inner: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    gap: 24,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    color: GOLD,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.semibold,
    ...Platform.select({
      web: {
        fontFamily: `Georgia, "Iowan Old Style", Palatino, ${WEB_DISPLAY_FONT_STACK}`,
        fontSize: 38,
        lineHeight: 44,
        letterSpacing: 0.15,
        scrollMarginTop: 120,
      },
      default: {},
    }),
  },
  grid: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 16,
  },
  gridStacked: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: 340,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-start",
    ...Platform.select({
      web: { boxShadow: "0 18px 36px -20px rgba(61, 42, 18, 0.35)" },
      default: {},
    }),
  },
  cardStacked: {
    width: "100%",
    minHeight: 240,
  },
  copy: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    gap: 8,
    zIndex: 1,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  cardBody: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  photoFallback: {
    backgroundColor: "#D8C48A",
  },
});
