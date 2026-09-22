import React, { memo, useMemo } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import {
  STOREFRONT_COUPON_CODE,
  STOREFRONT_COUPON_OFF,
} from "../content/appContent";
import { KANKREG_CHROME } from "../theme/kankregWeb";
import { fonts } from "../theme/tokens";
import { formatINRWhole } from "../utils/currency";
import { getProductCardImageUri } from "../utils/image";
import ComingSoonProductOverlay from "./product/ComingSoonProductOverlay";

const GREEN = KANKREG_CHROME.announceBg;

function discountPercent(product) {
  const mrp = Number(product?.mrp);
  const price = Number(product?.price) || 0;
  if (!Number.isFinite(mrp) || mrp <= price || price <= 0) return 0;
  return Math.round((1 - price / mrp) * 100);
}

function storefrontBadges(product) {
  const rating = Number(product?.ratingAverage || product?.rating || 0);
  const reviews = Number(product?.reviewCount || 0);
  const special = Boolean(product?.isSpecial);
  return {
    discount: discountPercent(product),
    newLaunch: Boolean(product?.isNewLaunch),
    bestSeller: special || reviews >= 40 || rating >= 4.7,
    topRated: rating >= 4.5 && reviews >= 8,
    sellingFast: reviews >= 20 && rating < 4.5,
  };
}

function formatReviewCount(n) {
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

function StorefrontProductCardBase({
  product,
  onPress,
  onAddToCart,
  isOutOfStock = false,
  isComingSoon = false,
  comingSoonNote = "",
  width,
  compact = false,
}) {
  const imageUri = useMemo(
    () => getProductCardImageUri(product?.image || product?.images?.[0] || "", { isWeb: Platform.OS === "web" }),
    [product?.image, product?.images]
  );
  const badges = useMemo(() => storefrontBadges(product), [product]);
  const price = Number(product?.price) || 0;
  const mrp = Number(product?.mrp);
  const showMrp = Number.isFinite(mrp) && mrp > price;
  const couponPrice = Math.round(price * (1 - STOREFRONT_COUPON_OFF));
  const rating = Number(product?.ratingAverage || product?.rating || 0);
  const reviews = Number(product?.reviewCount || 0);
  const soldOut = isOutOfStock && !isComingSoon;
  const name = String(product?.name || "").trim();

  /** Phone: one status badge max so the jar stays readable. */
  const statusBadge = badges.newLaunch
    ? { key: "new", label: "New" }
    : badges.bestSeller
      ? { key: "best", label: compact ? "Bestseller" : "Best Seller" }
      : null;
  const showChoiceBadge = !compact && (badges.topRated || badges.sellingFast);

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }) => [
        styles.card,
        compact && styles.cardCompact,
        width ? { width } : styles.cardFlex,
        hovered && styles.cardHover,
      ]}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View style={[styles.media, compact && styles.mediaCompact]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, compact && styles.imageCompact]}
            contentFit="contain"
          />
        ) : (
          <View style={styles.imageFallback} />
        )}

        {badges.discount > 0 ? (
          <View style={[styles.offBadge, compact && styles.offBadgeCompact]}>
            <Text style={[styles.offText, compact && styles.offTextCompact]}>{badges.discount}%</Text>
            <Text style={[styles.offSub, compact && styles.offSubCompact]}>OFF</Text>
          </View>
        ) : null}

        {statusBadge ? (
          <View style={[styles.cornerBadge, compact && styles.cornerBadgeCompact, statusBadge.key === "new" && styles.cornerNew]}>
            {statusBadge.key === "best" ? (
              <Ionicons name="star" size={compact ? 9 : 10} color="#FFFFFF" />
            ) : null}
            <Text style={[styles.cornerText, compact && styles.cornerTextCompact]}>{statusBadge.label}</Text>
          </View>
        ) : null}

        {showChoiceBadge ? (
          badges.topRated ? (
            <View style={styles.choiceBadge}>
              <Ionicons name="star" size={11} color="#F5C451" />
              <Text style={styles.choiceText}>Top Rated Choice</Text>
            </View>
          ) : (
            <View style={[styles.choiceBadge, styles.choiceFast]}>
              <Ionicons name="flash" size={12} color="#3B82F6" />
              <Text style={[styles.choiceText, { color: "#1E3A5F" }]}>Selling Fast</Text>
            </View>
          )
        ) : null}

        {isComingSoon ? (
          <ComingSoonProductOverlay note={comingSoonNote} compact />
        ) : soldOut ? (
          <View style={[styles.soldBtn, compact && styles.soldBtnCompact]} pointerEvents="none">
            <Text style={[styles.soldText, compact && styles.soldTextCompact]}>Sold out</Text>
          </View>
        ) : (
          <Pressable
            onPress={(event) => {
              event?.preventDefault?.();
              event?.stopPropagation?.();
              onAddToCart?.();
            }}
            style={({ hovered, pressed }) => [
              styles.addBtn,
              compact && styles.addBtnCompact,
              hovered && styles.addBtnHover,
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Add ${name} to cart`}
          >
            {compact ? null : <Text style={styles.addText}>ADD</Text>}
            <Ionicons name="cart-outline" size={compact ? 16 : 13} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <View style={[styles.info, compact && styles.infoCompact]}>
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={2}>
          {name}
        </Text>
        {rating > 0 ? (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={compact ? 11 : 12} color="#F5C451" />
            <Text style={[styles.ratingValue, compact && styles.ratingValueCompact]}>
              {rating.toFixed(1)}
            </Text>
            {reviews > 0 ? (
              <Text style={[styles.reviews, compact && styles.reviewsCompact]}>
                ({formatReviewCount(reviews)})
              </Text>
            ) : null}
          </View>
        ) : null}
        <View style={styles.priceRow}>
          {showMrp ? (
            <Text style={[styles.mrp, compact && styles.mrpCompact]}>{formatINRWhole(mrp)}</Text>
          ) : null}
          <Text style={[styles.price, compact && styles.priceCompact]}>{formatINRWhole(price)}</Text>
        </View>
        {price > 0 ? (
          <Text style={[styles.coupon, compact && styles.couponCompact]} numberOfLines={1}>
            {compact
              ? `${formatINRWhole(couponPrice)} w/ ${STOREFRONT_COUPON_CODE}`
              : `Best Price ${formatINRWhole(couponPrice)} with ${STOREFRONT_COUPON_CODE}`}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const StorefrontProductCard = memo(StorefrontProductCardBase);
export default StorefrontProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(26, 92, 72, 0.1)",
    overflow: "hidden",
    ...Platform.select({
      web: {
        cursor: "pointer",
        boxShadow: "0 8px 22px -18px rgba(26, 40, 32, 0.28)",
      },
      default: {},
    }),
  },
  cardCompact: {
    borderRadius: 12,
  },
  cardHover: {
    ...Platform.select({
      web: {
        boxShadow: "0 18px 36px -20px rgba(26, 40, 32, 0.4)",
        transform: [{ translateY: -3 }],
        borderColor: "rgba(196, 162, 74, 0.45)",
      },
      default: {},
    }),
  },
  media: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F6FAF6",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaCompact: {
    backgroundColor: "#F3F7F3",
  },
  cardFlex: {
    width: "100%",
  },
  image: {
    width: "88%",
    height: "88%",
  },
  imageCompact: {
    width: "92%",
    height: "92%",
  },
  imageFallback: {
    width: "70%",
    height: "70%",
    borderRadius: 12,
    backgroundColor: "rgba(26, 92, 72, 0.06)",
  },
  offBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 44,
    height: 48,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  offBadgeCompact: {
    top: 6,
    left: 6,
    width: 36,
    height: 40,
    borderRadius: 18,
  },
  offText: {
    color: "#FFFFFF",
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 14,
  },
  offTextCompact: {
    fontSize: 10,
    lineHeight: 12,
  },
  offSub: {
    color: "#FFFFFF",
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  offSubCompact: {
    fontSize: 8,
  },
  cornerBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: GREEN,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 7,
  },
  cornerBadgeCompact: {
    top: 6,
    right: 6,
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
    maxWidth: "58%",
  },
  cornerNew: {
    backgroundColor: "#2F6B4F",
  },
  cornerText: {
    color: "#FFFFFF",
    fontFamily: fonts.semibold,
    fontSize: 10,
  },
  cornerTextCompact: {
    fontSize: 9,
  },
  choiceBadge: {
    position: "absolute",
    left: 8,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: GREEN,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  choiceFast: {
    backgroundColor: "#E8F1FF",
  },
  choiceText: {
    color: "#FFFFFF",
    fontFamily: fonts.semibold,
    fontSize: 10,
  },
  addBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 2,
    ...Platform.select({
      web: {
        cursor: "pointer",
        boxShadow: "0 8px 16px -10px rgba(26, 92, 72, 0.7)",
      },
      default: {},
    }),
  },
  addBtnCompact: {
    right: 7,
    bottom: 7,
    width: 34,
    height: 34,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: "center",
    gap: 0,
  },
  addBtnHover: {
    backgroundColor: "#154C3C",
  },
  addText: {
    color: "#FFFFFF",
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  soldBtn: {
    position: "absolute",
    right: 8,
    bottom: 10,
    backgroundColor: "#9CA3AF",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  soldBtnCompact: {
    right: 6,
    bottom: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  soldText: {
    color: "#FFFFFF",
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  soldTextCompact: {
    fontSize: 10,
  },
  info: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 5,
  },
  infoCompact: {
    paddingHorizontal: 9,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 3,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 14.5,
    lineHeight: 19,
    color: "#1A2B22",
    minHeight: 38,
  },
  nameCompact: {
    fontSize: 12.5,
    lineHeight: 16,
    minHeight: 32,
  },
  coupon: {
    fontFamily: fonts.semibold,
    fontSize: 11.5,
    color: GREEN,
  },
  couponCompact: {
    fontSize: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingValue: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: "#1F2A24",
  },
  ratingValueCompact: {
    fontSize: 11,
  },
  reviews: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: "#6B7A72",
  },
  reviewsCompact: {
    fontSize: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    flexWrap: "wrap",
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: "#9AA59E",
    textDecorationLine: "line-through",
  },
  mrpCompact: {
    fontSize: 11,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: "#111827",
  },
  priceCompact: {
    fontSize: 15,
  },
});
