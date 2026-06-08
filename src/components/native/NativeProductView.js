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
import {
  FIGMA,
  figmaBody,
  figmaCardShell,
  figmaDisplayTitle,
  figmaPrice,
} from "../../theme/figmaApp";
import { useTheme } from "../../context/ThemeContext";
import { formatINR } from "../../utils/currency";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { customerScrollPaddingBottomWithSticky, FIGMA_STICKY_FOOTER_HEIGHT } from "../../theme/screenLayout";
import { fonts, spacing } from "../../theme/tokens";
import NativeTag from "./NativeTag";
import NativeStickyBuyBar from "./NativeStickyBuyBar";
import NativeProductCard from "./NativeProductCard";
import NativeSectionHeader from "./NativeSectionHeader";

/** figmaforkankreg.html screen 08 — product detail */
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
  liveRatingAvg,
  reviewCountDisplay,
  isOutOfStock,
  onAddToCart,
  relatedProducts,
  onRelatedPress,
  onAddRelated,
}) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  if (Platform.OS === "web") return null;

  const grad = FIGMA.productTileGradients[0];
  const ratingStars = liveRatingAvg > 0 ? "★".repeat(Math.min(5, Math.round(liveRatingAvg))) : "";

  return (
    <View style={styles.root}>
      <LinearGradient colors={grad} style={styles.heroBg} />
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 8) }]}>
        <Pressable style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={FIGMA.ink} />
        </Pressable>
        <Pressable style={styles.circleBtn}>
          <Ionicons name="heart-outline" size={17} color={FIGMA.ink} />
        </Pressable>
      </View>

      <View style={styles.heroImageWrap}>
        {heroImageUri && !imageFailed ? (
          <Image
            source={{ uri: heroImageUri }}
            style={styles.heroImage}
            contentFit="contain"
            placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
          />
        ) : (
          <Ionicons name="cube-outline" size={80} color="#5a4326" />
        )}
      </View>

      <ScrollView
        style={styles.sheetScroll}
        contentContainerStyle={[
          styles.sheetContent,
          { paddingBottom: customerScrollPaddingBottomWithSticky(insets, FIGMA_STICKY_FOOTER_HEIGHT) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sheet, figmaCardShell(isDark)]}>
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              {product?.homeSection || product?.category ? (
                <NativeTag label={product.homeSection || product.category || "Bestseller"} />
              ) : (
                <NativeTag label="Essentials" />
              )}
              <Text style={[figmaDisplayTitle(21, isDark), styles.title]}>{product?.name}</Text>
            </View>
            {ratingStars ? (
              <View style={styles.ratingCol}>
                <Text style={styles.stars}>{ratingStars}</Text>
                <Text style={styles.ratingMeta}>
                  {liveRatingAvg.toFixed(1)} · {reviewCountDisplay}
                </Text>
              </View>
            ) : null}
          </View>

          {product?.description ? (
            <Text style={[figmaBody(11.5, isDark), styles.desc]}>{product.description}</Text>
          ) : null}

          {variants.length > 0 ? (
            <>
              <Text style={styles.variantLabel}>Finish</Text>
              <View style={styles.variantRow}>
                {variants.map((v) => {
                  const label = String(v.label || v.name || "");
                  const active = selectedVariantLabel === label;
                  return (
                    <Pressable
                      key={label}
                      onPress={() => onSelectVariant(label)}
                      style={[styles.variantPill, active && styles.variantPillOn]}
                    >
                      <Text style={[styles.variantText, active && styles.variantTextOn]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
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

          <View style={styles.priceRow}>
            <Text style={figmaPrice(isDark)}>{formatINR(displayPrice)}</Text>
            {showMrp && mrp ? (
              <Text style={styles.mrp}>{formatINR(mrp)}</Text>
            ) : null}
            {isOutOfStock ? <NativeTag label="Out of stock" tone="green" /> : null}
          </View>
        </View>

        {relatedProducts.length > 0 ? (
          <View style={styles.related}>
            <NativeSectionHeader title="You may also like" />
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
        onAddToCart={onAddToCart}
        disabled={isOutOfStock}
        ctaLabel={isOutOfStock ? "Out of stock" : "Add to cart"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: FIGMA.paper,
  },
  heroBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "46%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    zIndex: 6,
  },
  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImageWrap: {
    height: "28%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "22%",
    zIndex: 2,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  sheetScroll: {
    flex: 1,
    marginTop: -20,
  },
  sheetContent: {},
  sheet: {
    backgroundColor: FIGMA.paper,
    borderTopLeftRadius: FIGMA.radiusSheet,
    borderTopRightRadius: FIGMA.radiusSheet,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: spacing.md,
    borderWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    marginTop: 8,
    fontWeight: "500",
    lineHeight: 24,
  },
  ratingCol: {
    alignItems: "flex-end",
  },
  stars: {
    color: FIGMA.goldBright,
    fontSize: 11,
    letterSpacing: 1,
  },
  ratingMeta: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: FIGMA.inkFaint,
    marginTop: 2,
  },
  desc: {
    marginTop: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  variantLabel: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: FIGMA.inkFaint,
    marginBottom: 8,
  },
  variantRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  variantPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIGMA.line,
  },
  variantPillOn: {
    backgroundColor: FIGMA.ink,
    borderColor: FIGMA.ink,
  },
  variantText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: FIGMA.inkSoft,
  },
  variantTextOn: {
    color: FIGMA.paper,
  },
  thumbRow: {
    marginBottom: 12,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbOn: {
    borderColor: FIGMA.gold,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: FIGMA.inkFaint,
    textDecorationLine: "line-through",
  },
  related: {
    paddingHorizontal: FIGMA.gutter,
    marginTop: spacing.md,
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
  },
  relatedCell: {
    width: "47%",
  },
});
