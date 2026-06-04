import React, { useMemo } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import PremiumButton from "../ui/PremiumButton";
import PremiumEmptyState from "../ui/PremiumEmptyState";
import HomeSectionHeader from "./HomeSectionHeader";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { createKankregEyebrowStyle, kankregSectionIndex } from "../../theme/kankregScreenStyles";
import { fonts, radius, spacing, typography } from "../../theme/tokens";
import { useTheme } from "../../context/ThemeContext";

const MARQUEE_ITEMS = [
  "Free delivery over ₹1,499",
  "Live order tracking",
  "Razorpay secure checkout",
  "7-day easy returns",
  "Earn rewards every order",
  "Crafted in India",
];

const CATEGORY_GRADIENTS = [
  ["#f3e7cc", "#e3cfa6"],
  ["#e7eee6", "#cdddcf"],
  ["#f1e3d6", "#dcc3ad"],
  ["#eee7dd", "#d6c7b1"],
];

/** Scrolling ticker like kankreg.html `.marquee` */
export function HomeMarqueeTicker() {
  const { isDark } = useTheme();
  const text = MARQUEE_ITEMS.join("  ✦  ");
  return (
    <View style={[styles.marqueeWrap, isDark && styles.marqueeWrapDark]}>
      <Text style={[styles.marqueeText, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.inkSoft }]} numberOfLines={1}>
        {text}  ✦  {text}
      </Text>
    </View>
  );
}

/** Category tiles like `.cat-card` — only categories present on products from API. */
export function HomeCategoryCards({ products = [], onBrowse, onOpenShop, productTypeTitle = "" }) {
  const { categoryCols } = useKankregLayout();
  const { isDark } = useTheme();
  const cols = categoryCols;
  const cellPct = `${100 / cols}%`;

  const categories = useMemo(() => {
    const fromProducts = [...new Set(products.map((p) => String(p.category || "").trim()).filter(Boolean))].slice(0, 4);
    return fromProducts.map((label, i) => ({
      key: label,
      label,
      count: `${products.filter((p) => p.category === label).length} items`,
      gradient: CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length],
      image: products.find((p) => p.category === label)?.image,
    }));
  }, [products]);

  if (!categories.length) {
    return (
      <PremiumEmptyState
        iconName="grid-outline"
        title="No categories yet"
        description="Add products with categories in Admin to show collection tiles here."
        ctaLabel="Go to shop"
        onCtaPress={onOpenShop}
      />
    );
  }

  const sectionTitle = productTypeTitle || "Browse the categories";

  return (
    <View style={styles.catSection}>
      <View style={styles.catHeadRow}>
        <Text style={createKankregEyebrowStyle(isDark)}>{kankregSectionIndex(1)} Collections</Text>
      </View>
      <HomeSectionHeader overline="Shop by category" title={sectionTitle} />
      <View style={styles.catGrid}>
        {categories.map((cat, idx) => (
          <Pressable
            key={cat.key}
            onPress={() => onBrowse?.(cat.label)}
            style={({ hovered }) => [
              styles.catCard,
              { width: cellPct, maxWidth: cellPct },
              hovered && Platform.OS === "web" ? styles.catCardHover : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Browse ${cat.label}`}
          >
            <LinearGradient colors={cat.gradient} style={StyleSheet.absoluteFillObject} />
            {cat.image ? (
              <Image source={{ uri: cat.image }} style={styles.catImage} contentFit="cover" />
            ) : null}
            <LinearGradient
              colors={["transparent", "rgba(25,20,15,0.62)"]}
              locations={[0.3, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.catCardFooter}>
              <Text style={styles.catName}>{cat.label}</Text>
              <Text style={styles.catCount}>{cat.count}</Text>
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
        <Text style={createKankregEyebrowStyle(isDark)}>{kankregSectionIndex(3)} Featured</Text>
        <Text style={[styles.featureEyebrow, { color: KANKREG_PALETTE.gold }]}>The morning ritual</Text>
        <Text style={[styles.featureTitle, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          Slow coffee, beautifully made.
        </Text>
        <Text style={[styles.featureBody, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
          Hand-finished essentials designed to live on the counter — and to last for years.
        </Text>
        <View style={styles.featureCtas}>
          <PremiumButton
            label="Shop the set →"
            variant="primary"
            size="md"
            onPress={() => product?.id && navigation.navigate("Product", { productId: product.id })}
          />
          <PremiumButton label="Browse catalog" variant="ghost" size="md" onPress={() => navigation.navigate("Home")} />
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
  const title = heroTitle || "Everyday goods, made extraordinary.";
  const subtitle =
    heroSubtitle ||
    "Design-led home, wellness and lifestyle — live tracking, Razorpay checkout, rewards on every order.";

  return (
    <View style={[styles.editorialHero, stackEditorialHero && styles.editorialHeroStack]}>
      <View style={styles.editorialCopy}>
        <Text style={createKankregEyebrowStyle(isDark)}>Curated essentials · Est. 2025</Text>
        <Text style={[styles.editorialH1, { color: isDark ? KANKREG_PALETTE.paper : KANKREG_PALETTE.ink }]}>
          {title}
        </Text>
        <Text style={[styles.editorialLead, { color: isDark ? "#c8bdaf" : KANKREG_PALETTE.inkSoft }]}>
          {subtitle}
        </Text>
        <View style={styles.editorialCtas}>
          <PremiumButton
            label="Explore the collection →"
            variant="primary"
            onPress={() => {
              if (typeof globalThis?.document !== "undefined") {
                const el = globalThis.document.getElementById("home-catalog");
                el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
              }
            }}
          />
          <PremiumButton label="Join rewards" variant="ghost" onPress={() => navigation.navigate("RedeemRewards")} />
        </View>
      </View>
      <View style={styles.editorialVisual}>
        <LinearGradient
          colors={["#f1e4c6", "#d9c096", "#2c2620"]}
          locations={[0, 0.48, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {image ? <Image source={{ uri: image }} style={styles.editorialPhoto} contentFit="cover" /> : null}
        <View style={styles.floatA}>
          <Text style={styles.floatEyebrow}>Featured</Text>
          <Text style={styles.floatTitle}>{featuredProduct?.name || "Bestseller"}</Text>
        </View>
        <View style={styles.floatB}>
          <View style={styles.swatch} />
          <View>
            <Text style={styles.floatFrom}>From</Text>
            <Text style={styles.floatPrice}>Shop now</Text>
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
  marqueeText: {
    fontFamily: fonts.medium,
    fontSize: typography.caption,
    letterSpacing: 0.8,
  },
  catSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  catHeadRow: {
    marginBottom: spacing.xs,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  catCard: {
    aspectRatio: 3 / 4,
    borderRadius: radius.xxl,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
    minHeight: 160,
    ...Platform.select({
      web: { transition: "transform 0.3s ease, box-shadow 0.3s ease" },
      default: {},
    }),
  },
  catCardHover: {
    transform: [{ translateY: -5 }],
    ...Platform.select({
      web: { boxShadow: "0 50px 90px -40px rgba(25,20,15,.40)" },
      default: {},
    }),
  },
  catImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  catCardFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md + 2,
    gap: spacing.sm,
  },
  catName: {
    fontFamily: FONT_DISPLAY,
    fontSize: 19,
    color: "#fff",
    flex: 1,
  },
  catCount: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
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
  },
  statN: {
    fontFamily: FONT_DISPLAY,
    fontSize: 28,
  },
  statL: {
    fontSize: 11.5,
    color: KANKREG_PALETTE.inkFaint,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 2,
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
