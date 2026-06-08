import React, { useEffect, useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategoryGridCellStyle, useKankregLayout } from "../../theme/kankregBreakpoints";
import PremiumButton from "../ui/PremiumButton";
import PremiumEmptyState from "../ui/PremiumEmptyState";
import HomeSectionHeader from "./HomeSectionHeader";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { createKankregEyebrowStyle, kankregSectionIndex } from "../../theme/kankregScreenStyles";
import { fonts, radius, spacing, typography } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";
import { HOME_SCREEN_UI } from "../../content/appContent";

const CATEGORY_GRADIENTS = [
  ["#f3e7cc", "#e3cfa6"],
  ["#e7eee6", "#cdddcf"],
  ["#f1e3d6", "#dcc3ad"],
  ["#eee7dd", "#d6c7b1"],
];

const MARQUEE_KEYFRAMES_ID = "kankreg-home-marquee-keyframes";

function useMarqueeKeyframes() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    if (document.getElementById(MARQUEE_KEYFRAMES_ID)) return;
    const node = document.createElement("style");
    node.id = MARQUEE_KEYFRAMES_ID;
    node.textContent =
      "@keyframes kankregHomeMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }";
    document.head.appendChild(node);
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
          <View style={styles.marqueeScroller}>
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

/** Category tiles like `.cat-card` — only categories present on products from API. */
export function HomeCategoryCards({ products = [], onBrowse, onOpenShop, productTypeTitle = "" }) {
  const { categoryCols, categoryCompact } = useKankregLayout();
  const cols = categoryCols;
  const cellStyle = getCategoryGridCellStyle(cols);

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
      <HomeSectionHeader overline={HOME_SCREEN_UI.categories.webShopBy} title={sectionTitle} />
      <View style={[styles.catGrid, categoryCompact && styles.catGridCompact]}>
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => onBrowse?.(cat.label)}
            style={({ hovered }) => [
              styles.catCard,
              cellStyle,
              categoryCompact ? styles.catCardCompact : styles.catCardWide,
              hovered && Platform.OS === "web" ? styles.catCardHover : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Browse ${cat.label}`}
          >
            <LinearGradient colors={cat.gradient} style={StyleSheet.absoluteFillObject} />
            {cat.image ? (
              <Image
                source={{ uri: cat.image }}
                style={[styles.catImage, categoryCompact && styles.catImageCompact]}
                contentFit="cover"
              />
            ) : null}
            <LinearGradient
              colors={
                categoryCompact
                  ? ["rgba(25,20,15,0.08)", "rgba(25,20,15,0.72)"]
                  : ["transparent", "rgba(25,20,15,0.62)"]
              }
              locations={categoryCompact ? [0, 1] : [0.3, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.catBadge, categoryCompact && styles.catBadgeCompact]}>
              <Ionicons name={cat.icon} size={categoryCompact ? 14 : 16} color={KANKREG_PALETTE.goldBright} />
            </View>
            <View style={[styles.catCardFooter, categoryCompact && styles.catCardFooterCompact]}>
              <Text style={[styles.catName, categoryCompact && styles.catNameCompact]} numberOfLines={2}>
                {cat.label}
              </Text>
              <View style={styles.catCountPill}>
                <Text style={styles.catCount}>
                  {cat.count} {HOME_SCREEN_UI.categories.itemsSuffix}
                </Text>
              </View>
            </View>
          </Pressable>
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
        <Text style={createKankregEyebrowStyle(isDark)}>
          {kankregSectionIndex(3)} {HOME_SCREEN_UI.featured.sectionLabel}
        </Text>
        <Text style={[styles.featureEyebrow, { color: KANKREG_PALETTE.gold }]}>
          {HOME_SCREEN_UI.featured.eyebrow}
        </Text>
        <Text style={[styles.featureTitle, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {HOME_SCREEN_UI.featured.title}
        </Text>
        <Text style={[styles.featureBody, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
          {HOME_SCREEN_UI.featured.body}
        </Text>
        <View style={styles.featureCtas}>
          <PremiumButton
            label={HOME_SCREEN_UI.featured.ctaPrimary}
            variant="primary"
            size="md"
            onPress={() => product?.id && navigation.navigate("Product", { productId: product.id })}
          />
          <PremiumButton
            label={HOME_SCREEN_UI.featured.ctaSecondary}
            variant="ghost"
            size="md"
            onPress={() => navigation.navigate("Shop")}
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
        <Text style={createKankregEyebrowStyle(isDark)}>{HOME_SCREEN_UI.editorial.overline}</Text>
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
        {HOME_SCREEN_UI.web?.heroStats?.length ? (
          <View style={styles.editorialStats}>
            {HOME_SCREEN_UI.web.heroStats.map((stat) => (
              <View key={stat.key} style={styles.statCell}>
                <Text style={[styles.statN, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statL}>{stat.label}</Text>
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
        <View style={styles.floatA}>
          <Text style={styles.floatEyebrow}>{HOME_SCREEN_UI.editorial.featuredLabel}</Text>
          <Text style={styles.floatTitle}>{featuredProduct?.name || HOME_SCREEN_UI.bestsellers.titleFallback}</Text>
        </View>
        <View style={styles.floatB}>
          <View style={styles.swatch} />
          <View>
            <Text style={styles.floatFrom}>{HOME_SCREEN_UI.hero.fromLabel}</Text>
            <Text style={styles.floatPrice}>{HOME_SCREEN_UI.editorial.shopNowLabel}</Text>
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
    ...Platform.select({
      web: {
        animationName: "kankregHomeMarquee",
        animationDuration: "32s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      },
      default: {},
    }),
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
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  catHeadRow: {
    marginBottom: spacing.xs,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.sm,
    width: "100%",
  },
  catGridCompact: {
    gap: spacing.sm + 2,
  },
  catCard: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    position: "relative",
    ...Platform.select({
      web: {
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        boxShadow: "0 10px 28px -18px rgba(25,20,15,.32)",
      },
      default: {},
    }),
  },
  catCardWide: {
    aspectRatio: 5 / 4,
    borderRadius: radius.xl,
    minHeight: 0,
  },
  catCardCompact: {
    aspectRatio: 16 / 11,
    borderRadius: radius.lg + 2,
    minHeight: 0,
    maxHeight: 148,
  },
  catCardHover: {
    transform: [{ translateY: -4 }],
    ...Platform.select({
      web: { boxShadow: "0 22px 48px -24px rgba(25,20,15,.42)" },
      default: {},
    }),
  },
  catImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.38,
  },
  catImageCompact: {
    opacity: 0.32,
  },
  catBadge: {
    position: "absolute",
    top: spacing.sm + 2,
    left: spacing.sm + 2,
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,253,248,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
  },
  catBadgeCompact: {
    width: 28,
    height: 28,
    borderRadius: 8,
    top: spacing.sm,
    left: spacing.sm,
  },
  catCardFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: spacing.md + 2,
    gap: spacing.sm,
  },
  catCardFooterCompact: {
    padding: spacing.sm + 2,
    alignItems: "center",
  },
  catName: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    color: "#fff",
    flex: 1,
    lineHeight: 22,
  },
  catNameCompact: {
    fontSize: 15,
    lineHeight: 18,
  },
  catCountPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,253,248,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  catCount: {
    fontSize: 10,
    fontFamily: fonts.semibold,
    color: "rgba(255,255,255,0.92)",
    letterSpacing: 0.2,
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
