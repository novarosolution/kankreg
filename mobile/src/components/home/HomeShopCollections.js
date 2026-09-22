import React, { useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { HOME_SHOP_COLLECTIONS } from "../../content/appContent";
import {
  HOME_BRAND_PROMO_POSTER,
  HOME_HERO_MOBILE_SLIDER_SLIDES,
  HOME_HERO_PRODUCT_PHONE_SLIDE,
} from "../../constants/marketingAssets";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { fonts } from "../../theme/tokens";
import { WEB_DISPLAY_FONT_STACK } from "../../theme/webFonts";

const GREEN = KANKREG_CHROME.announceBg;

const IMAGES = {
  ghee: HOME_HERO_PRODUCT_PHONE_SLIDE.image,
  oils: HOME_HERO_MOBILE_SLIDER_SLIDES[2]?.image || HOME_HERO_PRODUCT_PHONE_SLIDE.image,
  atta: HOME_HERO_MOBILE_SLIDER_SLIDES[1]?.image || HOME_BRAND_PROMO_POSTER,
};

function CollectionTile({ item, stacked, onPress }) {
  const image = IMAGES[item.imageKey];
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.tile,
        stacked && styles.tileStacked,
        hovered && styles.tileHover,
        pressed && { opacity: 0.94 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      {image ? (
        <Image source={image} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.tileFallback]} />
      )}
      <LinearGradient
        colors={["rgba(12, 28, 22, 0.08)", "rgba(12, 28, 22, 0.72)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.tileCopy}>
        <Text style={styles.tileTitle}>{item.title}</Text>
        <Text style={styles.tileSubtitle}>{item.subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeShopCollections({ navigation, onRetry }) {
  const { isMobileWeb, width } = useKankregLayout();
  const stacked = isMobileWeb || Platform.OS !== "web" || width < 760;
  const copy = HOME_SHOP_COLLECTIONS;

  const openShop = (category) => {
    navigation.navigate({
      name: "Shop",
      params: { category },
      merge: true,
    });
  };

  const retry = useMemo(
    () =>
      typeof onRetry === "function" ? (
        <Pressable onPress={onRetry} style={styles.retry} accessibilityRole="button" accessibilityLabel="Retry loading products">
          <Text style={styles.retryText}>Products will appear here when the catalog is online · Retry</Text>
        </Pressable>
      ) : null,
    [onRetry]
  );

  return (
    <View style={styles.wrap} accessibilityRole="region" accessibilityLabel={copy.title}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
        <Text style={styles.title}>{copy.title}</Text>
        <View style={styles.goldRule} />
      </View>
      <View style={[styles.grid, stacked && styles.gridStacked]}>
        {copy.items.map((item) => (
          <CollectionTile
            key={item.key}
            item={item}
            stacked={stacked}
            onPress={() => openShop(item.category)}
          />
        ))}
      </View>
      {retry}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: 18,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: GREEN,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: "#1A2B22",
    ...Platform.select({
      web: { fontFamily: `Georgia, "Iowan Old Style", Palatino, ${WEB_DISPLAY_FONT_STACK}` },
      default: { fontFamily: fonts.semibold },
    }),
  },
  goldRule: {
    width: 48,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(196, 162, 74, 0.85)",
  },
  grid: {
    flexDirection: "row",
    gap: 16,
    alignItems: "stretch",
  },
  gridStacked: {
    flexDirection: "column",
  },
  tile: {
    flex: 1,
    minWidth: 0,
    minHeight: 240,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    ...Platform.select({
      web: {
        cursor: "pointer",
        boxShadow: "0 18px 36px -22px rgba(26, 43, 34, 0.4)",
        transition: "transform 180ms ease",
      },
      default: {},
    }),
  },
  tileStacked: {
    width: "100%",
    minHeight: 200,
  },
  tileHover: {
    ...Platform.select({
      web: { transform: "translateY(-3px)" },
      default: {},
    }),
  },
  tileFallback: {
    backgroundColor: "#1A5C48",
  },
  tileCopy: {
    padding: 18,
    gap: 4,
    zIndex: 1,
  },
  tileTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    color: "#FFFFFF",
  },
  tileSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.88)",
  },
  retry: {
    alignSelf: "flex-start",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  retryText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: "rgba(26, 92, 72, 0.62)",
  },
});
