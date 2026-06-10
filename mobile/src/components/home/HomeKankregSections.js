import React, { useEffect, useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryGridCellStyle, useKankregLayout } from "../../theme/kankregBreakpoints";
import PremiumButton from "../ui/PremiumButton";
import PremiumEmptyState from "../ui/PremiumEmptyState";
import { SectionHeader } from "./editorial";
import {
  HOME_EYEBROW_LETTER_SPACING,
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { createKankregEyebrowStyle } from "../../theme/kankregScreenStyles";
import { fonts, icon, radius, spacing, typography } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";
import { HOME_SCREEN_UI } from "../../content/appContent";
import { formatINR } from "../../utils/currency";
import { isWebLean } from "../../theme/webLean";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";

const CATEGORY_GRADIENTS = [
  ["#f3e7cc", "#e3cfa6"],
  ["#e7eee6", "#cdddcf"],
  ["#f1e3d6", "#dcc3ad"],
  ["#eee7dd", "#d6c7b1"],
];

const MARQUEE_CSS_ID = "kankreg-home-marquee-keyframes";
const MARQUEE_CLASS = "kankreg-home-marquee";

const CAT_CARD_CSS_ID = "kankreg-home-category-card";
const CAT_CARD_CLASS = "kankreg-cat-card";
const CAT_PHOTO_CLASS = "kankreg-cat-photo";

/** Uniform lookbook tile aspect ratio (image frame). */
const CATEGORY_IMAGE_ASPECT = 4 / 5;

function useCategoryCardHoverCss() {
  useEffect(() => {
    injectWebCssOnce(
      CAT_CARD_CSS_ID,
      `.${CAT_CARD_CLASS} {
  transition: transform 0.38s ease, box-shadow 0.38s ease;
}
.${CAT_CARD_CLASS}:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 44px -28px rgba(25, 20, 15, 0.28);
}
.${CAT_PHOTO_CLASS} {
  transition: transform 0.6s ease-out;
}
.${CAT_CARD_CLASS}:hover .${CAT_PHOTO_CLASS} {
  transform: scale(1.04);
}
@media (prefers-reduced-motion: reduce) {
  .${CAT_CARD_CLASS}, .${CAT_PHOTO_CLASS} { transition: none !important; }
  .${CAT_CARD_CLASS}:hover { transform: none; box-shadow: 0 8px 24px -20px rgba(25, 20, 15, 0.18); }
  .${CAT_CARD_CLASS}:hover .${CAT_PHOTO_CLASS} { transform: none; }
}`
    );
  }, []);
}

function CategoryLookbookCard({ cat, cellStyle, onPress, isDark }) {
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const isWeb = Platform.OS === "web";

  return (
    <Pressable
      onPress={onPress}
      className={isWeb ? CAT_CARD_CLASS : undefined}
      style={({ focused }) => [
        styles.catCard,
        cellStyle,
        isDark && styles.catCardDark,
        focused && isWeb ? styles.catCardFocus : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${cat.label}`}
    >
      <View style={styles.catImageFrame}>
        <LinearGradient colors={cat.gradient} style={StyleSheet.absoluteFillObject} />
        {cat.image ? (
          <Image
            source={{ uri: cat.image }}
            className={isWeb ? CAT_PHOTO_CLASS : undefined}
            style={styles.catPhoto}
            contentFit="cover"
            contentPosition="center"
            transition={280}
          />
        ) : null}
        {cat.icon ? (
          <View style={[styles.catIconRing, isDark && styles.catIconRingDark]} pointerEvents="none">
            <Ionicons
              name={cat.icon}
              size={icon.lg}
              color={isDark ? KANKREG_PALETTE.goldBright : KANKREG_PALETTE.gold}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.catCopy}>
        <View style={[styles.catGoldMark, isDark && styles.catGoldMarkDark]} />
        <Text style={[styles.catLabel, { color: ink }]} numberOfLines={2}>
          {cat.label.toUpperCase()}
        </Text>
        <Text style={[styles.catMeta, { color: muted }]} numberOfLines={1}>
          {cat.count} {HOME_SCREEN_UI.categories.itemsSuffix}
        </Text>
      </View>
    </Pressable>
  );
}

function useMarqueeKeyframes() {
  useEffect(() => {
    injectWebCssOnce(
      MARQUEE_CSS_ID,
      `@keyframes kankregHomeMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.${MARQUEE_CLASS} { animation: kankregHomeMarquee 32s linear infinite; }`
    );
  }, []);
}

/** Scrolling ticker like kankreg.html `.marquee` */
export function HomeMarqueeTicker() {
  const { isDark } = useTheme();
  useMarqueeKeyframes();
  const text = HOME_SCREEN_UI.marquee.join("  ✦  ");
  const segment = `${text}  ✦  `;
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.marqueeWrap, isDark && styles.marqueeWrapDark]}>
      {isWeb ? (
        <View style={styles.marqueeTrack}>
          <View className={MARQUEE_CLASS} style={styles.marqueeScroller}>
            <Text
              style={[styles.marqueeText, styles.marqueeTextWeb, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.inkSoft }]}
            >
              {segment}
              {segment}
            </Text>
          </View>
        </View>
      ) : (
        <Text
          style={[styles.marqueeText, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.inkSoft }]}
          numberOfLines={1}
        >
          {segment}
          {segment}
        </Text>
      )}
    </View>
  );
}

/** Category lookbook grid — categories present on products from API. */
export function HomeCategoryCards({ products = [], onBrowse, onOpenShop, productTypeTitle = "" }) {
  const { isDark } = useTheme();
  const { categoryCols } = useKankregLayout();
  const cellStyle = getCategoryGridCellStyle(categoryCols);
  useCategoryCardHoverCss();

  const categories = useMemo(() => {
    const tileIcons = HOME_SCREEN_UI.categories.webTileIcons || [];
    const fromProducts = [...new Set(products.map((p) => String(p.category || "").trim()).filter(Boolean))].slice(0, 4);
    return fromProducts.map((label, i) => ({
      key: label,
      label,
      count: products.filter((p) => p.category === label).length,
      gradient: CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length],
      image: products.find((p) => p.category === label)?.image,
      icon: tileIcons[i % tileIcons.length] || "grid-outline",
    }));
  }, [products]);

  if (!categories.length) {
    return (
      <PremiumEmptyState
        iconName="grid-outline"
        title={HOME_SCREEN_UI.empty.categoriesTitle}
        description={HOME_SCREEN_UI.empty.categoriesDescription}
        ctaLabel={HOME_SCREEN_UI.empty.categoriesCta}
        onCtaPress={onOpenShop}
      />
    );
  }

  const sectionTitle = productTypeTitle || HOME_SCREEN_UI.categories.webTitleFallback;

  return (
    <View style={styles.catSection}>
      <SectionHeader
        eyebrow={HOME_SCREEN_UI.categories.webShopBy}
        title={sectionTitle}
      />
      <View style={styles.catGrid}>
        {categories.map((cat) => (
          <CategoryLookbookCard
            key={cat.key}
            cat={cat}
            cellStyle={cellStyle}
            isDark={isDark}
            onPress={() => onBrowse?.(cat.label)}
          />
        ))}
      </View>
    </View>
  );
}

/** Featured editorial block like `.feature` */
export function HomeFeaturedEditorial({ product, navigation }) {
  const { isDark } = useTheme();
  const { useAuthSplit } = useKankregLayout();
  const image = product?.image || product?.images?.[0];
  const title = String(product?.name || "").trim();
  const body = String(product?.description || "").trim();
  if (!title) return null;

  return (
    <View
      style={[
        styles.feature,
        isDark && styles.featureDark,
        !useAuthSplit && styles.featureStack,
      ]}
    >
      <View style={styles.featureArt}>
        <LinearGradient
          colors={["#f0e3c5", "#cdb079", "#2c2620"]}
          locations={[0, 0.55, 1]}
          start={{ x: 0.7, y: 0.1 }}
          end={{ x: 0.3, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {image ? <Image source={{ uri: image }} style={styles.featureImage} contentFit="contain" /> : null}
      </View>
      <View style={[styles.featureCopy, isDark && { backgroundColor: "#181513" }]}>
        <Text style={[styles.featureTitle, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {title}
        </Text>
        {body ? (
          <Text style={[styles.featureBody, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]} numberOfLines={4}>
            {body}
          </Text>
        ) : null}
        <View style={styles.featureCtas}>
          <PremiumButton
            label={formatINR(product?.price)}
            variant="primary"
            size="md"
            onPress={() => product?.id && navigation.navigate("Product", { productId: product.id })}
          />
        </View>
      </View>
    </View>
  );
}

/** Web editorial hero (copy + visual) — complements marketing slider on large screens */
export function HomeEditorialHero({ navigation, featuredProduct, heroTitle, heroSubtitle }) {
  const { isDark } = useTheme();
  const { showEditorialHero, stackEditorialHero } = useKankregLayout();
  if (!showEditorialHero) return null;

  const image = featuredProduct?.image || featuredProduct?.images?.[0];
  const title = heroTitle || HOME_SCREEN_UI.hero.titleFallback;
  const subtitle = heroSubtitle || HOME_SCREEN_UI.hero.subtitleFallback;

  return (
    <View style={[styles.editorialHero, stackEditorialHero && styles.editorialHeroStack]}>
      <View style={styles.editorialCopy}>
        {!isWebLean() ? (
          <Text style={createKankregEyebrowStyle(isDark)}>{HOME_SCREEN_UI.editorial.overline}</Text>
        ) : null}
        <Text style={[styles.editorialH1, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.editorialLead, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
            {subtitle}
          </Text>
        ) : null}
        <View style={styles.editorialCtas}>
          <PremiumButton
            label={HOME_SCREEN_UI.editorial.ctaExplore}
            variant="primary"
            onPress={() => {
              if (typeof globalThis?.document !== "undefined") {
                const el = globalThis.document.getElementById("home-catalog");
                el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
              } else {
                navigation.navigate("Shop");
              }
            }}
          />
          <PremiumButton
            label={HOME_SCREEN_UI.editorial.ctaRewards}
            variant="ghost"
            onPress={() => navigation.navigate("RedeemRewards")}
          />
        </View>
        {!isWebLean() && HOME_SCREEN_UI.web?.heroStats?.length ? (
          <View
            style={[
              styles.editorialStats,
              isDark && { borderTopColor: "rgba(232, 200, 90, 0.18)" },
            ]}
          >
            {HOME_SCREEN_UI.web.heroStats.map((stat) => (
              <View key={stat.key} style={styles.statCell}>
                <Text style={[styles.statN, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statL, { color: isDark ? "rgba(245,239,228,0.65)" : KANKREG_PALETTE.inkFaint }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      <View style={styles.editorialVisual}>
        <LinearGradient
          colors={["#f1e4c6", "#d9c096", "#2c2620"]}
          locations={[0, 0.48, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {image ? <Image source={{ uri: image }} style={styles.editorialPhoto} contentFit="cover" /> : null}
        <View
          style={[
            styles.floatA,
            isDark && {
              backgroundColor: "rgba(24, 21, 19, 0.92)",
              borderColor: "rgba(232, 200, 90, 0.22)",
            },
          ]}
        >
          {featuredProduct?.name ? (
            <Text style={[styles.floatTitle, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
              {featuredProduct.name}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.floatB,
            isDark && {
              backgroundColor: "rgba(24, 21, 19, 0.92)",
              borderColor: "rgba(232, 200, 90, 0.22)",
            },
          ]}
        >
          <View style={styles.swatch} />
          <View>
            <Text style={[styles.floatFrom, { color: isDark ? "rgba(245,239,228,0.65)" : KANKREG_PALETTE.inkFaint }]}>
              {HOME_SCREEN_UI.hero.fromLabel}
            </Text>
            <Text style={[styles.floatPrice, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
              {featuredProduct?.price != null ? formatINR(featuredProduct.price) : HOME_SCREEN_UI.editorial.shopNowLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marqueeWrap: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    overflow: "hidden",
  },
  marqueeWrapDark: {
    borderColor: "#3f3933",
  },
  marqueeTrack: {
    width: "100%",
    overflow: "hidden",
  },
  marqueeScroller: {
    flexDirection: "row",
    width: "max-content",
  },
  marqueeText: {
    fontFamily: fonts.medium,
    fontSize: typography.caption,
    letterSpacing: 0.8,
  },
  marqueeTextWeb: {
    flexShrink: 0,
    paddingRight: spacing.xl,
  },
  catSection: {
    width: "100%",
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: HOME_SPACE.lg,
    width: "100%",
    ...Platform.select({
      web: { rowGap: HOME_SPACE.lg, columnGap: HOME_SPACE.lg },
      default: { gap: HOME_SPACE.md },
    }),
  },
  catCard: {
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    backgroundColor: KANKREG_PALETTE.card,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px -20px rgba(25, 20, 15, 0.18)",
        cursor: "pointer",
      },
      default: {},
    }),
  },
  catCardDark: {
    backgroundColor: "#181513",
    borderColor: "#3f3933",
    ...Platform.select({
      web: { boxShadow: "0 12px 32px -24px rgba(0, 0, 0, 0.42)" },
      default: {},
    }),
  },
  catCardFocus: {
    ...Platform.select({
      web: {
        outlineStyle: "solid",
        outlineWidth: 2,
        outlineColor: KANKREG_PALETTE.gold,
        outlineOffset: 2,
      },
      default: {},
    }),
  },
  catImageFrame: {
    width: "100%",
    aspectRatio: CATEGORY_IMAGE_ASPECT,
    overflow: "hidden",
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  catPhoto: {
    width: "100%",
    height: "100%",
  },
  catIconRing: {
    position: "absolute",
    alignSelf: "center",
    top: "32%",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 253, 248, 0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.28)",
    ...Platform.select({
      web: { backdropFilter: "blur(6px)" },
      default: {},
    }),
  },
  catIconRingDark: {
    backgroundColor: "rgba(24, 21, 19, 0.62)",
    borderColor: "rgba(232, 200, 90, 0.22)",
  },
  catCopy: {
    paddingHorizontal: HOME_SPACE.md,
    paddingTop: HOME_SPACE.sm + 2,
    paddingBottom: HOME_SPACE.md,
    gap: HOME_SPACE.xs,
  },
  catGoldMark: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: KANKREG_PALETTE.gold,
    opacity: 0.55,
    marginBottom: 2,
  },
  catGoldMarkDark: {
    backgroundColor: KANKREG_PALETTE.goldBright,
    opacity: 0.42,
  },
  catLabel: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow,
    lineHeight: HOME_TYPE.eyebrow + 4,
    letterSpacing: HOME_EYEBROW_LETTER_SPACING,
  },
  catMeta: {
    fontFamily: fonts.regular,
    fontSize: HOME_TYPE.kicker - 1,
    lineHeight: 18,
    letterSpacing: 0.15,
  },
  feature: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    marginVertical: spacing.xl,
    ...Platform.select({
      web: { boxShadow: "0 1px 2px rgba(25,20,15,.04), 0 14px 38px -20px rgba(25,20,15,.28)" },
      default: {},
    }),
  },
  featureStack: {
    flexDirection: "column",
  },
  featureDark: {
    borderColor: "#3f3933",
  },
  featureArt: {
    flex: 1,
    minHeight: 280,
    position: "relative",
  },
  featureImage: {
    width: "72%",
    height: "72%",
    alignSelf: "center",
    marginTop: "14%",
  },
  featureCopy: {
    flex: 1,
    padding: spacing.xl + 8,
    justifyContent: "center",
    backgroundColor: KANKREG_PALETTE.card,
    gap: spacing.sm,
  },
  featureEyebrow: {
    fontFamily: fonts.semibold,
    fontSize: typography.overline,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  featureTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: typography.h2 + 4,
    letterSpacing: -0.5,
    lineHeight: typography.h2 + 8,
  },
  featureBody: {
    fontSize: typography.bodySmall + 1,
    lineHeight: 22,
    maxWidth: 420,
  },
  featureCtas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editorialHero: {
    flexDirection: "row",
    gap: spacing.xl + 8,
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
    flexWrap: "wrap",
  },
  editorialHeroStack: {
    flexDirection: "column",
  },
  editorialCopy: {
    flex: 1.04,
    minWidth: 0,
  },
  editorialH1: {
    fontFamily: FONT_DISPLAY,
    fontSize: Platform.OS === "web" ? 52 : 36,
    lineHeight: Platform.OS === "web" ? 50 : 40,
    letterSpacing: -1.2,
    marginTop: spacing.md,
  },
  editorialEm: {
    fontStyle: "italic",
    color: KANKREG_PALETTE.gold,
  },
  editorialLead: {
    marginTop: spacing.lg,
    fontSize: typography.body + 1,
    lineHeight: 26,
    maxWidth: 420,
  },
  editorialCtas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  editorialStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
    marginTop: spacing.xl + 4,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: KANKREG_PALETTE.line,
  },
  statCell: {
    minWidth: 88,
  },
  statN: {
    fontFamily: FONT_DISPLAY,
    fontSize: 28,
    letterSpacing: -0.4,
  },
  statL: {
    fontSize: 11.5,
    color: KANKREG_PALETTE.inkFaint,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 2,
    fontFamily: fonts.semibold,
  },
  editorialVisual: {
    flex: 0.96,
    aspectRatio: 5 / 6,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      web: { boxShadow: "0 50px 90px -40px rgba(25,20,15,.40)" },
      default: {},
    }),
  },
  editorialPhoto: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },
  floatA: {
    position: "absolute",
    top: 22,
    left: 22,
    backgroundColor: "rgba(255,253,248,0.94)",
    borderRadius: 15,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  floatEyebrow: {
    fontSize: typography.overline,
    color: KANKREG_PALETTE.gold,
    fontFamily: fonts.semibold,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  floatTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    color: KANKREG_PALETTE.ink,
    marginTop: 2,
  },
  floatB: {
    position: "absolute",
    bottom: 22,
    right: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(255,253,248,0.94)",
    borderRadius: 15,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: KANKREG_PALETTE.goldBright,
  },
  floatFrom: {
    fontSize: 11,
    color: KANKREG_PALETTE.inkFaint,
  },
  floatPrice: {
    fontFamily: FONT_DISPLAY,
    fontSize: 19,
    color: KANKREG_PALETTE.ink,
  },
});
