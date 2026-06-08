import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ALCHEMY, FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { useTheme } from "../../context/ThemeContext";
import { formatINR } from "../../utils/currency";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { customerScrollPaddingBottomWithSticky, FIGMA_STICKY_FOOTER_HEIGHT } from "../../theme/screenLayout";
import { fonts, icon, spacing } from "../../theme/tokens";
import { PRODUCT_SCREEN, fillProductScreen } from "../../content/appContent";
import NativeStickyBuyBar from "./NativeStickyBuyBar";
import NativeProductCard from "./NativeProductCard";
import GoldHairline from "../ui/GoldHairline";

function StarRow({ rating, muted }) {
  const filled = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <Text style={[styles.stars, muted && styles.starsMuted]}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </Text>
  );
}

/** kankreg design board screen 08 — premium product detail */
export default function NativeProductView({
  product,
  navigation,
  heroImageUri,
  imageFailed,
  galleryImages,
  selectedImage,
  onSelectImage,
  variants,
  selectedVariantLabel,
  onSelectVariant,
  displayPrice,
  showMrp,
  mrp,
  offPct,
  liveRatingAvg,
  reviewCountDisplay,
  isOutOfStock,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
  quantity = 0,
  relatedProducts,
  onRelatedPress,
  onAddRelated,
}) {
  const insets = useSafeAreaInsets();
  const { colors: c, isDark } = useTheme();
  if (Platform.OS === "web") return null;

  const pageBg = isDark ? c.background : KANKREG_PALETTE.paper;
  const sheetBg = isDark ? c.surface : KANKREG_PALETTE.card;
  const iconColor = isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft;
  const categoryLabel =
    product?.badgeText ||
    product?.homeSection ||
    product?.category ||
    "Essentials";
  const unit = product?.unit || PRODUCT_SCREEN.unitFallback;
  const usps = Array.isArray(product?.usps) ? product.usps.filter(Boolean).slice(0, 4) : [];

  return (
    <View style={[styles.root, { backgroundColor: pageBg }]}>
      <LinearGradient
        colors={
          isDark
            ? ["rgba(201,162,39,0.12)", "rgba(28,25,23,0.4)", c.background]
            : ["#f3e7cc", "#ece3d2", KANKREG_PALETTE.paper]
        }
        locations={[0, 0.55, 1]}
        style={styles.heroBg}
      />

      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable
          style={[styles.circleBtn, isDark && styles.circleBtnDark]}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={18} color={iconColor} />
        </Pressable>
        <Pressable style={[styles.circleBtn, isDark && styles.circleBtnDark]} accessibilityLabel="Wishlist">
          <Ionicons name="heart-outline" size={17} color={iconColor} />
        </Pressable>
      </View>

      <View style={styles.heroStage}>
        {heroImageUri && !imageFailed ? (
          <Image
            source={{ uri: heroImageUri }}
            style={styles.heroImage}
            contentFit="contain"
            transition={220}
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
          />
        ) : (
          <View style={styles.heroFallback}>
            <Ionicons name="cube-outline" size={72} color={KANKREG_PALETTE.goldDeep} />
          </View>
        )}
        <View style={styles.heroShadow} />
      </View>

      <ScrollView
        style={styles.sheetScroll}
        contentContainerStyle={[
          styles.sheetContent,
          { paddingBottom: customerScrollPaddingBottomWithSticky(insets, FIGMA_STICKY_FOOTER_HEIGHT + 8) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sheet, { backgroundColor: sheetBg }]}>
          <View style={[styles.sheetAccent, { backgroundColor: isDark ? ALCHEMY.goldBright : ALCHEMY.gold }]} />

          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <View style={styles.tagRow}>
                <View style={styles.tagGold}>
                  <Text style={styles.tagGoldText}>{String(categoryLabel).toUpperCase()}</Text>
                </View>
                {isOutOfStock ? (
                  <View style={styles.tagMuted}>
                    <Text style={styles.tagMutedText}>{PRODUCT_SCREEN.heroOutOfStock}</Text>
                  </View>
                ) : (
                  <View style={styles.tagOk}>
                    <Ionicons name="checkmark-circle" size={11} color={KANKREG_PALETTE.green} />
                    <Text style={styles.tagOkText}>{PRODUCT_SCREEN.metaReadyToShip}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.title, { color: isDark ? c.textPrimary : KANKREG_PALETTE.ink }]}>
                {product?.name}
              </Text>
            </View>
            {liveRatingAvg > 0 ? (
              <View style={styles.ratingCol}>
                <StarRow rating={liveRatingAvg} />
                <Text style={styles.ratingMeta}>
                  {liveRatingAvg.toFixed(1)} · {reviewCountDisplay}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.priceBand}>
            <Text style={[styles.price, { color: isDark ? c.textPrimary : KANKREG_PALETTE.ink }]}>
              {formatINR(displayPrice)}
            </Text>
            {showMrp && mrp ? (
              <Text style={styles.mrp}>{formatINR(mrp)}</Text>
            ) : null}
            <Text style={styles.unit}>/{unit}</Text>
            {offPct != null && offPct > 0 ? (
              <View style={styles.saveChip}>
                <Ionicons name="pricetag" size={11} color={KANKREG_PALETTE.green} />
                <Text style={styles.saveChipText}>
                  {fillProductScreen(PRODUCT_SCREEN.savePctChip, { pct: String(offPct) })}
                </Text>
              </View>
            ) : null}
          </View>

          {(product?.eta || unit) && (
            <View style={styles.trustRow}>
              {unit ? (
                <View style={styles.trustPill}>
                  <Ionicons name="cube-outline" size={12} color={KANKREG_PALETTE.goldDeep} />
                  <Text style={styles.trustText}>{unit}</Text>
                </View>
              ) : null}
              {product?.eta ? (
                <View style={styles.trustPill}>
                  <Ionicons name="time-outline" size={12} color={KANKREG_PALETTE.goldDeep} />
                  <Text style={styles.trustText}>{product.eta}</Text>
                </View>
              ) : null}
            </View>
          )}

          {product?.description ? (
            <Text style={[styles.desc, { color: isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft }]}>
              {product.description}
            </Text>
          ) : null}

          <GoldHairline marginVertical={spacing.sm} />

          {variants.length > 0 ? (
            <View style={styles.variantBlock}>
              <Text style={styles.variantLabel}>{PRODUCT_SCREEN.variantOverline}</Text>
              <View style={styles.variantRow}>
                {variants.map((v) => {
                  const label = String(v.label || v.name || "");
                  const active = selectedVariantLabel === label;
                  return (
                    <Pressable
                      key={label}
                      onPress={() => onSelectVariant(label)}
                      style={[
                        styles.variantPill,
                        active ? styles.variantPillOn : styles.variantPillOff,
                        isDark && !active && { borderColor: c.border },
                      ]}
                    >
                      <Text style={[styles.variantText, active && styles.variantTextOn]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {galleryImages.length > 1 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
              {galleryImages.map((uri) => (
                <Pressable
                  key={uri}
                  onPress={() => onSelectImage(uri)}
                  style={[styles.thumb, selectedImage === uri && styles.thumbOn]}
                >
                  <Image source={{ uri }} style={styles.thumbImage} contentFit="cover" />
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          {usps.length > 0 ? (
            <View style={styles.uspsWrap}>
              {usps.map((line) => (
                <View key={line} style={styles.uspRow}>
                  <Ionicons name="sparkles-outline" size={13} color={KANKREG_PALETTE.gold} />
                  <Text style={[styles.uspText, { color: isDark ? c.textSecondary : KANKREG_PALETTE.inkSoft }]}>
                    {line}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {quantity > 0 && !isOutOfStock ? (
            <View style={styles.stepper}>
              <Pressable style={styles.stepBtn} onPress={onRemoveFromCart}>
                <Ionicons name="remove" size={icon.md} color="#fff" />
              </Pressable>
              <Text style={styles.stepCount}>
                {fillProductScreen(PRODUCT_SCREEN.inCartCount, { count: String(quantity) })}
              </Text>
              <Pressable style={styles.stepBtn} onPress={onAddToCart}>
                <Ionicons name="add" size={icon.md} color="#fff" />
              </Pressable>
            </View>
          ) : null}
        </View>

        {relatedProducts.length > 0 ? (
          <View style={styles.related}>
            <Text style={styles.relatedEyebrow}>Catalog</Text>
            <Text style={[styles.relatedTitle, { color: isDark ? c.textPrimary : KANKREG_PALETTE.ink }]}>
              You may also like
            </Text>
            <View style={styles.relatedGrid}>
              {relatedProducts.map((p, idx) => (
                <View key={p.id} style={styles.relatedCell}>
                  <NativeProductCard
                    product={p}
                    index={idx + 1}
                    onPress={() => onRelatedPress(p)}
                    onAddToCart={() => onAddRelated(p)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <NativeStickyBuyBar
        visible
        price={displayPrice}
        quantity={quantity}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        disabled={isOutOfStock}
        ctaLabel={isOutOfStock ? PRODUCT_SCREEN.outOfStock : PRODUCT_SCREEN.addToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    zIndex: 8,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  circleBtnDark: {
    backgroundColor: "rgba(40,36,32,0.72)",
  },
  heroStage: {
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "20%",
    zIndex: 3,
    marginTop: 4,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroShadow: {
    position: "absolute",
    left: "18%",
    right: "18%",
    bottom: 4,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(25,20,15,0.14)",
    transform: [{ scaleX: 1.1 }],
  },
  sheetScroll: {
    flex: 1,
    marginTop: -18,
    zIndex: 5,
  },
  sheetContent: {},
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: spacing.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  sheetAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleCol: { flex: 1, minWidth: 0 },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  tagGold: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(169,119,46,0.14)",
  },
  tagGoldText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.9,
    color: KANKREG_PALETTE.goldDeep,
  },
  tagOk: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(60,98,72,0.1)",
  },
  tagOkText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    color: KANKREG_PALETTE.green,
  },
  tagMuted: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(168,68,47,0.1)",
  },
  tagMutedText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    color: KANKREG_PALETTE.danger,
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    fontWeight: "500",
    lineHeight: 28,
    marginTop: 10,
    letterSpacing: -0.3,
  },
  ratingCol: { alignItems: "flex-end", paddingTop: 2 },
  stars: {
    color: KANKREG_PALETTE.goldBright,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  starsMuted: { opacity: 0.85 },
  ratingMeta: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: KANKREG_PALETTE.inkFaint,
    marginTop: 3,
  },
  priceBand: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 8,
    marginTop: 14,
  },
  price: {
    fontFamily: FONT_DISPLAY,
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: KANKREG_PALETTE.inkFaint,
    textDecorationLine: "line-through",
  },
  unit: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: KANKREG_PALETTE.inkFaint,
  },
  saveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(60,98,72,0.1)",
    marginLeft: 2,
  },
  saveChipText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: KANKREG_PALETTE.green,
  },
  trustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  trustPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(169,119,46,0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: KANKREG_PALETTE.line,
  },
  trustText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: KANKREG_PALETTE.inkSoft,
  },
  desc: {
    marginTop: 14,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 21,
  },
  variantBlock: { marginTop: spacing.sm },
  variantLabel: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.inkFaint,
    marginBottom: 8,
  },
  variantRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  variantPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  variantPillOn: {
    backgroundColor: KANKREG_PALETTE.ink,
    borderColor: KANKREG_PALETTE.ink,
  },
  variantPillOff: {
    backgroundColor: KANKREG_PALETTE.card,
    borderColor: KANKREG_PALETTE.line,
  },
  variantText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: KANKREG_PALETTE.inkSoft,
  },
  variantTextOn: {
    color: KANKREG_PALETTE.paper,
    fontFamily: fonts.semibold,
  },
  thumbRow: { marginTop: spacing.md, marginBottom: 4 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    backgroundColor: KANKREG_PALETTE.paper2,
  },
  thumbOn: { borderColor: KANKREG_PALETTE.gold },
  thumbImage: { width: "100%", height: "100%" },
  uspsWrap: {
    marginTop: spacing.md,
    gap: 8,
  },
  uspRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  uspText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: "rgba(25,20,15,0.04)",
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KANKREG_PALETTE.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCount: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: KANKREG_PALETTE.ink,
    minWidth: 88,
    textAlign: "center",
  },
  related: {
    paddingHorizontal: 18,
    marginTop: spacing.lg,
  },
  relatedEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: KANKREG_PALETTE.gold,
    marginBottom: 4,
  },
  relatedTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: spacing.md,
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  relatedCell: { width: "47%" },
});
