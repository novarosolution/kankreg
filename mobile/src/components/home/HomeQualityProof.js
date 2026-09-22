import React, { useMemo } from "react";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import { HOME_QUALITY_PROOF } from "../../content/appContent";
import { HOME_HERO_MOBILE_SLIDER_SLIDES, HOME_HERO_WEB_SLIDER_SLIDES } from "../../constants/marketingAssets";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { WEB_DISPLAY_FONT_STACK } from "../../theme/webFonts";

const GREEN = KANKREG_CHROME.announceBg;
const MINT = "#B9E4E8";

const CARD_IMAGES = {
  team: HOME_HERO_WEB_SLIDER_SLIDES[0]?.image,
  scope: HOME_HERO_MOBILE_SLIDER_SLIDES[1]?.image,
  pour: HOME_HERO_WEB_SLIDER_SLIDES[2]?.image,
  report: HOME_HERO_WEB_SLIDER_SLIDES[3]?.image,
};

function PastureWash() {
  return (
    <View pointerEvents="none" style={styles.pasture}>
      <Svg width="100%" height="100%" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice">
        <G fill="rgba(26, 92, 72, 0.08)">
          <Circle cx="220" cy="70" r="22" fill="none" stroke="rgba(26, 92, 72, 0.12)" strokeWidth="2" />
          <Circle cx="220" cy="70" r="8" />
          <Circle cx="1220" cy="80" r="20" fill="none" stroke="rgba(26, 92, 72, 0.12)" strokeWidth="2" />
          <Circle cx="1220" cy="80" r="7" />
          <Ellipse cx="160" cy="500" rx="180" ry="70" />
          <Ellipse cx="520" cy="510" rx="240" ry="80" />
          <Ellipse cx="980" cy="515" rx="280" ry="88" />
          <Ellipse cx="1340" cy="500" rx="170" ry="70" />
          <Path d="M90 470 C90 390 40 360 90 300 C130 360 180 380 170 470 Z" />
          <Path d="M430 480 C430 390 370 350 440 290 C490 350 550 370 530 480 Z" />
          <Path d="M1120 485 C1120 385 1030 345 1140 270 C1220 345 1290 370 1270 485 Z" />
        </G>
      </Svg>
    </View>
  );
}

function QualityCard({ card, stacked }) {
  const image = CARD_IMAGES[card.imageKey];
  return (
    <View style={[styles.card, stacked && styles.cardStacked]}>
      <Text style={styles.cardTitle}>{card.title}</Text>
      <Text style={styles.cardBody}>{card.body}</Text>
      <View style={styles.photo}>
        {image ? (
          <Image source={image} style={styles.photoImg} contentFit="cover" />
        ) : (
          <View style={styles.photoFallback} />
        )}
      </View>
    </View>
  );
}

export default function HomeQualityProof() {
  const { isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const stacked = isMobileWeb || Platform.OS !== "web" || width < 900;
  const copy = HOME_QUALITY_PROOF;

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
    <View
      style={[styles.shell, fullBleed]}
      accessibilityRole="region"
      accessibilityLabel={copy.title}
    >
      <View style={styles.band}>
        <PastureWash />
        <View style={[styles.inner, { paddingHorizontal: pageGutterClamp }]}>
          <Text style={styles.title}>{copy.title}</Text>
          <View style={[styles.grid, stacked && styles.gridStacked]}>
            {copy.cards.map((card) => (
              <QualityCard key={card.key} card={card} stacked={stacked} />
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
    backgroundColor: MINT,
    overflow: "hidden",
    paddingTop: 44,
    paddingBottom: 48,
    position: "relative",
  },
  pasture: {
    ...StyleSheet.absoluteFillObject,
  },
  inner: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    gap: 22,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    color: GREEN,
    fontSize: 32,
    lineHeight: 38,
    fontFamily: fonts.bold,
    ...Platform.select({
      web: {
        fontFamily: `Georgia, "Iowan Old Style", Palatino, ${WEB_DISPLAY_FONT_STACK}`,
        fontSize: 40,
        lineHeight: 46,
        letterSpacing: 0.15,
      },
      default: {},
    }),
  },
  grid: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 18,
  },
  gridStacked: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#F7F0D8",
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
    ...Platform.select({
      web: {
        boxShadow: "0 16px 32px -22px rgba(26, 43, 34, 0.28)",
        transition: "transform 180ms ease",
      },
      default: {},
    }),
  },
  cardStacked: {
    width: "100%",
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 19,
    lineHeight: 25,
    color: GREEN,
    textAlign: "center",
  },
  cardBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(26, 92, 72, 0.78)",
    textAlign: "center",
    minHeight: 0,
  },
  photo: {
    marginTop: 4,
    height: 228,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  photoImg: {
    width: "100%",
    height: "100%",
  },
  photoFallback: {
    flex: 1,
    backgroundColor: "rgba(26, 92, 72, 0.08)",
  },
});
