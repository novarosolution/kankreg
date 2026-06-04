import React, { memo, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fonts, getSemanticColors, icon, radius, spacing, typography } from "../theme/tokens";
import { ALCHEMY, FONT_DISPLAY } from "../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../theme/kankregWeb";
import { useTheme } from "../context/ThemeContext";
import { formatINRWhole } from "../utils/currency";
import { getImageUriCandidates } from "../utils/image";
import useReducedMotion from "../hooks/useReducedMotion";
import useGsapReveal from "../hooks/useGsapReveal";
import { platformShadow } from "../theme/shadowPlatform";

/**
 * Premium product tile used on Home grid sections.
 *
 * Drop-in for the `variant="grid"` usage of `ProductCard` — same prop names,
 * same callbacks. Theme-aware (matte black + gold in dark, ivory + gold in
 * light), with a layered image well, gradient frame, gold gradient CTA, and
 * a quantity stepper that slots into the same footprint.
 */
function PremiumProductCardBase({
  product,
  onPress,
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
  isOutOfStock = false,
  index,
  loading = false,
  imagePriority = "normal",
}) {
  const { colors: c, isDark } = useTheme();
  const semantic = getSemanticColors(c);
  const reducedMotion = useReducedMotion();
  const styles = useMemo(() => createStyles(c, isDark), [c, isDark]);

  const primaryImage = useMemo(() => {
    if (String(product?.image || "").trim()) return product.image;
    if (Array.isArray(product?.images) && product.images.length) {
      return String(product.images[0] || "");
    }
    return "";
  }, [product?.image, product?.images]);
  const imageUris = useMemo(() => getImageUriCandidates(primaryImage), [primaryImage]);
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
  const imageUri = imageUris[imageCandidateIndex] || "";
  const imageFailed = imageUris.length === 0 || imageCandidateIndex >= imageUris.length;

  useEffect(() => {
    setImageCandidateIndex(0);
  }, [primaryImage]);

  const handleImageError = () => setImageCandidateIndex((idx) => idx + 1);

  const safePrice = useMemo(() => {
    const n = Number(product?.price);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [product?.price]);
  const listMrp = useMemo(() => {
    const n = product?.mrp != null ? Number(product.mrp) : NaN;
    return Number.isFinite(n) && n > safePrice ? n : null;
  }, [product?.mrp, safePrice]);
  const offPct = useMemo(() => {
    if (!listMrp) return null;
    return Math.round((1 - safePrice / listMrp) * 100);
  }, [safePrice, listMrp]);
  const ratingAvg = Number(product?.ratingAverage || 0);

  const cardScale = useSharedValue(1);
  const imageScale = useSharedValue(1);
  const cardLift = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }, { translateY: cardLift.value }],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const handlePressIn = () => {
    if (reducedMotion) return;
    cardScale.value = withSpring(0.985, { damping: 18, stiffness: 280 });
    imageScale.value = withSpring(1.02, { damping: 18, stiffness: 280 });
  };
  const handlePressOut = () => {
    if (reducedMotion) return;
    cardScale.value = withSpring(1, { damping: 18, stiffness: 280 });
    imageScale.value = withSpring(1, { damping: 18, stiffness: 280 });
  };
  const handleHoverIn = () => {
    if (Platform.OS !== "web" || reducedMotion) return;
    cardLift.value = withSpring(-3, { damping: 22, stiffness: 220 });
    imageScale.value = withSpring(1.02, { damping: 22, stiffness: 220 });
  };
  const handleHoverOut = () => {
    if (Platform.OS !== "web" || reducedMotion) return;
    cardLift.value = withSpring(0, { damping: 22, stiffness: 220 });
    imageScale.value = withSpring(1, { damping: 22, stiffness: 220 });
  };

  const { ref: revealRef } = useGsapReveal({
    preset: "scale-in",
    start: "top 92%",
    reducedMotion,
  });

  const Root = Platform.OS === "web" || index == null ? View : Animated.View;
  const rootEntering =
    Platform.OS !== "web" && index != null && !reducedMotion
      ? FadeInDown.delay(Math.min(index * 48, 480)).duration(380)
      : undefined;

  const accessibilityLabel = `Open ${product?.name || "product"}`;
  const addAccessibilityLabel = isOutOfStock
    ? `${product?.name || "Product"} sold out`
    : `Add ${product?.name || "product"} to cart`;

  return (
    <Root
      style={styles.outer}
      ref={revealRef}
      {...(rootEntering ? { entering: rootEntering } : {})}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <LinearGradient
          colors={
            isDark
              ? ["rgba(232, 200, 90, 0.16)", "rgba(28, 25, 23, 0)", "rgba(28, 25, 23, 0)"]
              : ["rgba(255, 255, 255, 0.92)", "rgba(255, 252, 246, 0.6)", "rgba(255, 248, 234, 0.92)"]
          }
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFillObject, styles.peNone]}
        />
        <LinearGradient
          colors={[ALCHEMY.goldBright, ALCHEMY.gold, ALCHEMY.goldDeep, ALCHEMY.brown]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.topAccent, styles.peNone]}
        />
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={({ pressed }) => [styles.press, pressed ? { opacity: 0.985 } : null]}
        >
          <View style={styles.imageBlock}>
            <View
              style={[
                styles.imageGlow,
                {
                  backgroundColor: isDark
                    ? semantic.accent.heroGlow
                    : "rgba(231, 200, 90, 0.32)",
                },
                styles.peNone,
              ]}
            />
            <LinearGradient
              colors={[ALCHEMY.gold, "rgba(212, 175, 55, 0.42)", "rgba(116, 79, 28, 0.18)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.imageRing, styles.peNone]}
            />
            <View
              style={[
                styles.imageInner,
                {
                  backgroundColor: isDark ? "rgba(28, 25, 23, 0.96)" : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(232, 200, 90, 0.18)"
                    : "rgba(116, 79, 28, 0.1)",
                },
              ]}
            >
              {offPct != null && offPct > 0 ? (
                <View style={styles.discountWrap}>
                  <LinearGradient
                    colors={[ALCHEMY.goldBright, ALCHEMY.gold, ALCHEMY.brown]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.discountPill}
                  >
                    <Text style={styles.discountText}>{offPct}% OFF</Text>
                  </LinearGradient>
                </View>
              ) : null}
              <Animated.View style={[styles.imageWrap, imageStyle]}>
                {imageUri && !imageFailed ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    contentFit="contain"
                    transition={260}
                    recyclingKey={`${product?.id || "p"}:${imageUri}`}
                    onError={handleImageError}
                    priority={imagePriority}
                    accessible={false}
                  />
                ) : (
                  <View style={styles.imageFallback}>
                    <View
                      style={[
                        styles.imageFallbackIconWrap,
                        { backgroundColor: isDark ? "rgba(255,255,255,0.04)" : ALCHEMY.goldSoft },
                      ]}
                    >
                      <Ionicons name="image-outline" size={icon.md} color={c.textMuted} />
                    </View>
                    <Text style={[styles.imageFallbackText, { color: c.textMuted }]}>
                      {imageUris.length > 0 ? "Image unavailable" : "No image"}
                    </Text>
                  </View>
                )}
              </Animated.View>
              {isOutOfStock ? (
                <View style={styles.outOfStockOverlay}>
                  <Text style={styles.outOfStockText}>Sold out</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.body}>
            {product?.category ? (
              <Text style={[styles.categoryLine, { color: isDark ? ALCHEMY.goldBright : KANKREG_PALETTE.gold }]} numberOfLines={1}>
                {String(product.category).toUpperCase()}
              </Text>
            ) : null}
            <Text style={[styles.title, { color: c.textPrimary }]} numberOfLines={2}>
              {product?.name || ""}
            </Text>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.metaPill,
                  {
                    borderColor: isDark
                      ? "rgba(232, 200, 90, 0.22)"
                      : "rgba(116, 79, 28, 0.14)",
                    backgroundColor: isDark
                      ? "rgba(201, 162, 39, 0.1)"
                      : "rgba(255, 252, 248, 0.92)",
                  },
                ]}
              >
                <Ionicons
                  name="cube-outline"
                  size={icon.tiny}
                  color={isDark ? ALCHEMY.goldBright : ALCHEMY.brown}
                />
                <Text style={[styles.metaText, { color: c.textSecondary }]} numberOfLines={1}>
                  {product?.unit || "1 pc"}
                </Text>
              </View>
              {ratingAvg > 0 ? (
                <View
                  style={[
                    styles.metaPill,
                    {
                      borderColor: isDark
                        ? "rgba(232, 200, 90, 0.32)"
                        : "rgba(201, 162, 39, 0.28)",
                      backgroundColor: isDark
                        ? "rgba(201, 162, 39, 0.16)"
                        : ALCHEMY.goldSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name="star"
                    size={icon.tiny}
                    color={isDark ? ALCHEMY.goldBright : ALCHEMY.gold}
                  />
                  <Text
                    style={[styles.metaText, { color: isDark ? ALCHEMY.goldBright : ALCHEMY.brown }]}
                    numberOfLines={1}
                  >
                    {ratingAvg.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceCol}>
                <Text
                  style={[
                    styles.price,
                    { color: isDark ? "#F2D679" : c.textPrimary },
                  ]}
                  numberOfLines={1}
                >
                  {formatINRWhole(safePrice)}
                </Text>
                {listMrp ? (
                  <View style={styles.priceSubRow}>
                    <Text
                      style={[styles.mrp, { color: c.textMuted }]}
                      numberOfLines={1}
                    >
                      {formatINRWhole(listMrp)}
                    </Text>
                    <View
                      style={[
                        styles.savePill,
                        {
                          backgroundColor: isDark
                            ? "rgba(52, 211, 153, 0.16)"
                            : "rgba(22, 163, 74, 0.1)",
                          borderColor: isDark
                            ? "rgba(52, 211, 153, 0.3)"
                            : "rgba(22, 163, 74, 0.22)",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.saveText,
                          { color: isDark ? "#86EFAC" : c.secondaryDark },
                        ]}
                        numberOfLines={1}
                      >
                        Save {formatINRWhole(listMrp - safePrice)}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <View style={styles.ctaWrap}>
          {quantity > 0 ? (
            <View
              style={[
                styles.stepper,
                {
                  borderColor: isDark ? ALCHEMY.goldBright : ALCHEMY.gold,
                  backgroundColor: isDark
                    ? "rgba(201, 162, 39, 0.14)"
                    : "rgba(255, 252, 248, 0.96)",
                },
              ]}
              accessibilityRole="adjustable"
              accessibilityLabel={`Quantity ${quantity}`}
              accessibilityValue={{ text: String(quantity) }}
            >
              <TouchableOpacity
                onPress={onRemoveFromCart}
                style={styles.stepBtn}
                activeOpacity={0.78}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                hitSlop={8}
              >
                <Ionicons
                  name="remove"
                  size={icon.sm}
                  color={isDark ? ALCHEMY.goldBright : ALCHEMY.brown}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.stepQty,
                  { color: isDark ? "#FFFCF8" : ALCHEMY.brownInk },
                ]}
              >
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={onAddToCart}
                style={styles.stepBtn}
                activeOpacity={0.78}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                hitSlop={8}
              >
                <Ionicons
                  name="add"
                  size={icon.sm}
                  color={isDark ? ALCHEMY.goldBright : ALCHEMY.brown}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Pressable
              onPress={onAddToCart}
              disabled={isOutOfStock || loading}
              accessibilityRole="button"
              accessibilityLabel={addAccessibilityLabel}
              accessibilityState={{ disabled: isOutOfStock || loading, busy: loading }}
              style={({ pressed, hovered }) => [
                styles.addBtnShell,
                hovered && Platform.OS === "web" ? styles.addBtnShellHover : null,
                pressed ? styles.addBtnShellPressed : null,
                isOutOfStock || loading ? styles.addBtnShellDisabled : null,
              ]}
            >
              <View
                style={[
                  styles.addCircle,
                  {
                    backgroundColor: isOutOfStock || loading ? "#9CA3AF" : KANKREG_PALETTE.ink,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={KANKREG_PALETTE.paper} />
                ) : (
                  <Ionicons
                    name={isOutOfStock ? "close" : "add"}
                    size={icon.md}
                    color={KANKREG_PALETTE.paper}
                  />
                )}
              </View>
            </Pressable>
          )}
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Root>
  );
}

function createStyles(c, isDark) {
  const cardShadow = platformShadow({
    ios: {
      shadowColor: isDark ? "#000000" : "#3D2A12",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: isDark ? 0.32 : 0.1,
      shadowRadius: 24,
    },
    android: { elevation: isDark ? 10 : 6 },
    web: {
      boxShadow: isDark
        ? "0 28px 64px rgba(0,0,0,0.55), 0 8px 22px rgba(0,0,0,0.32), inset 0 1px 0 rgba(232,200,90,0.16)"
        : "0 24px 56px rgba(61, 42, 18, 0.13), 0 6px 18px rgba(28, 25, 23, 0.06), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(199, 154, 58, 0.08)",
      transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
    },
  });
  const discountShadow = platformShadow({
    web: { boxShadow: "0 8px 18px rgba(98, 64, 20, 0.35)" },
    ios: {
      shadowColor: "#3D2A12",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
  });
  const addBtnShadow = platformShadow({
    ios: {
      shadowColor: "#1a1208",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 14,
    },
    android: { elevation: 5 },
    web: {
      boxShadow: "0 14px 28px rgba(98, 64, 20, 0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
      cursor: "pointer",
    },
  });

  return StyleSheet.create({
    outer: {
      width: "100%",
    },
    card: {
      width: "100%",
      borderRadius: 20,
      backgroundColor: isDark ? c.surfaceElevated || c.surface : KANKREG_PALETTE.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "#3f3933" : KANKREG_PALETTE.line,
      overflow: "hidden",
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      ...cardShadow,
    },
    topAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      opacity: 0.95,
    },
    press: {
      width: "100%",
      ...Platform.select({
        web: { cursor: "pointer" },
        default: {},
      }),
    },
    imageBlock: {
      position: "relative",
      width: "100%",
      aspectRatio: 1,
      borderRadius: radius.xl + 2,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    imageGlow: {
      position: "absolute",
      width: "82%",
      height: "62%",
      top: "10%",
      left: "9%",
      borderRadius: 999,
      opacity: 0.85,
      ...Platform.select({
        web: { filter: "blur(28px)" },
        default: {},
      }),
    },
    imageRing: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.xl + 2,
      opacity: 0.55,
    },
    imageInner: {
      position: "absolute",
      top: 1.5,
      left: 1.5,
      right: 1.5,
      bottom: 1.5,
      borderRadius: radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },
    imageWrap: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "92%",
      height: "92%",
    },
    imageFallback: {
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    imageFallbackIconWrap: {
      width: 38,
      height: 38,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    imageFallbackText: {
      fontSize: typography.caption,
      fontFamily: fonts.semibold,
      textAlign: "center",
    },
    discountWrap: {
      position: "absolute",
      top: spacing.sm,
      left: spacing.sm,
      zIndex: 4,
    },
    discountPill: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: "rgba(255, 252, 248, 0.45)",
      ...discountShadow,
    },
    discountText: {
      color: "#FFFCF8",
      fontFamily: fonts.extrabold,
      fontSize: 10,
      letterSpacing: 0.6,
    },
    outOfStockOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? "rgba(8, 6, 4, 0.62)" : "rgba(255, 252, 248, 0.78)",
      alignItems: "center",
      justifyContent: "center",
    },
    outOfStockText: {
      color: isDark ? "#FFFCF8" : ALCHEMY.brownInk,
      fontFamily: FONT_DISPLAY,
      fontSize: typography.h3,
      letterSpacing: -0.3,
    },
    body: {
      paddingHorizontal: 2,
      gap: 8,
      marginBottom: spacing.md,
    },
    categoryLine: {
      fontFamily: fonts.semibold,
      fontSize: 10.5,
      letterSpacing: 1.6,
      marginBottom: 2,
    },
    title: {
      fontFamily: FONT_DISPLAY,
      fontSize: 18,
      lineHeight: 21,
      fontWeight: "500",
      letterSpacing: -0.2,
      minHeight: 40,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
    },
    metaPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
    },
    metaText: {
      fontFamily: fonts.bold,
      fontSize: 11,
      letterSpacing: 0.15,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginTop: 2,
    },
    priceCol: {
      flex: 1,
      minWidth: 0,
    },
    price: {
      fontFamily: FONT_DISPLAY,
      fontSize: 24,
      lineHeight: 28,
      letterSpacing: -0.5,
      ...Platform.select({
        web: { fontSize: 26, lineHeight: 30 },
        default: {},
      }),
    },
    priceSubRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    mrp: {
      fontFamily: fonts.medium,
      fontSize: 12,
      textDecorationLine: "line-through",
    },
    savePill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
    },
    saveText: {
      fontFamily: fonts.extrabold,
      fontSize: 10,
      letterSpacing: 0.2,
    },
    ctaWrap: {
      flexShrink: 0,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    addCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        web: { transition: "background-color 0.25s ease, transform 0.25s ease" },
        default: {},
      }),
    },
    addBtnShell: {
      borderRadius: radius.pill,
      overflow: "hidden",
      ...addBtnShadow,
    },
    addBtnShellHover: {
      ...Platform.select({
        web: {
          transform: [{ translateY: -1 }],
          boxShadow: "0 18px 34px rgba(98, 64, 20, 0.42), inset 0 1px 0 rgba(255,255,255,0.22)",
        },
        default: {},
      }),
    },
    addBtnShellPressed: {
      opacity: 0.94,
      transform: [{ scale: 0.985 }],
    },
    addBtnShellDisabled: {
      opacity: 0.7,
    },
    addBtnGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: Platform.OS === "web" ? 13 : 12,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: "rgba(255, 252, 248, 0.32)",
    },
    addBtnText: {
      color: "#FFFCF8",
      fontFamily: fonts.extrabold,
      fontSize: typography.bodySmall,
      letterSpacing: 0.4,
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: radius.pill,
      borderWidth: 1.25,
      paddingHorizontal: 6,
      height: 44,
    },
    stepBtn: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.pill,
    },
    stepQty: {
      fontFamily: fonts.extrabold,
      fontSize: typography.bodySmall + 1,
      minWidth: 20,
      textAlign: "center",
      letterSpacing: 0.3,
    },
    peNone: {
      pointerEvents: "none",
    },
  });
}

function arePropsEqual(prev, next) {
  return (
    prev.product?.id === next.product?.id &&
    prev.product?.image === next.product?.image &&
    prev.product?.name === next.product?.name &&
    prev.product?.price === next.product?.price &&
    prev.product?.mrp === next.product?.mrp &&
    prev.product?.unit === next.product?.unit &&
    prev.product?.stockQty === next.product?.stockQty &&
    prev.product?.inStock === next.product?.inStock &&
    prev.product?.ratingAverage === next.product?.ratingAverage &&
    prev.quantity === next.quantity &&
    prev.isOutOfStock === next.isOutOfStock &&
    prev.loading === next.loading &&
    prev.index === next.index &&
    prev.imagePriority === next.imagePriority
  );
}

const PremiumProductCard = memo(PremiumProductCardBase, arePropsEqual);

export default PremiumProductCard;
