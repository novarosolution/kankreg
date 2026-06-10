import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeCatalogGridCard } from "../home/HomeCatalogProductViews";
import CatalogGridReveal from "./CatalogGridReveal";
import HeroParallax from "../motion/HeroParallax";
import SectionReveal from "../motion/SectionReveal";
import useStaggeredReveal from "../../hooks/useStaggeredReveal";
import PremiumSectionHeader from "../ui/PremiumSectionHeader";
import PremiumButton from "../ui/PremiumButton";
import PremiumChip from "../ui/PremiumChip";
import PremiumInput from "../ui/PremiumInput";
import PremiumErrorBanner from "../ui/PremiumErrorBanner";
import GoldHairline from "../ui/GoldHairline";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { ALCHEMY, FONT_DISPLAY } from "../../theme/customerAlchemy";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";
import { formatINR } from "../../utils/currency";
import { getImageUriCandidates, PRODUCT_HERO_BLURHASH } from "../../utils/image";
import { PRODUCT_SCREEN, fillProductScreen } from "../../content/appContent";
import { fonts, icon as sz, layout, radius, semanticRadius, spacing, typography } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

function formatUspLine(usp) {
  if (!usp) return "";
  if (typeof usp === "string") return usp.trim();
  const title = String(usp.title || "").trim();
  const desc = String(usp.description || "").trim();
  return [title, desc].filter(Boolean).join(" — ");
}

function ThumbImage({ sourceUri, style, fallbackStyle, mutedColor }) {
  const candidates = useMemo(() => getImageUriCandidates(sourceUri), [sourceUri]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sourceUri]);

  const uri = candidates[index] || "";
  if (!uri) {
    return (
      <View style={[style, fallbackStyle]}>
        <Ionicons name="image-outline" size={sz.micro} color={mutedColor} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit="cover"
      cachePolicy="memory-disk"
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

function TrustFeature({ icon, title, subtitle, isDark, c, styles, wide, revealDelay = 0 }) {
  return (
    <SectionReveal immediate delay={revealDelay} preset="fade-up" style={wide ? styles.trustRevealWide : null}>
      <View
        style={[
          styles.trustCard,
          wide && styles.trustCardWide,
          {
            backgroundColor: isDark ? c.surfaceMuted : KANKREG_PALETTE.card,
            borderColor: isDark ? c.border : KANKREG_PALETTE.line,
          },
        ]}
      >
        <View style={styles.trustIcon}>
          <Ionicons name={icon} size={18} color={KANKREG_PALETTE.goldDeep} />
        </View>
        <Text style={[styles.trustTitle, { color: isDark ? c.textPrimary : KANKREG_PALETTE.ink }]}>{title}</Text>
        <Text style={styles.trustSub}>{subtitle}</Text>
      </View>
    </SectionReveal>
  );
}

/** Premium web product detail — kankreg.html `.pd` layout */
export default function WebProductView({
  product,
  navigation,
  heroImageUri,
  imageFailed,
  onHeroImageError,
  galleryImages,
  selectedImage,
  onSelectImage,
  heroFadeStyle,
  heroImageHeight,
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
  quantity,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
  stickyBarVisible,
  relatedProducts,
  getItemQuantity,
  onAddRelated,
  onRemoveRelated,
  reviews = [],
  reviewRating,
  onReviewRatingChange,
  reviewComment,
  onReviewCommentChange,
  reviewBusy,
  reviewSuccess,
  reviewError,
  onSubmitReview,
  isAuthenticated,
  shelfMatch,
}) {
  const insets = useSafeAreaInsets();
  const { colors: c, isDark } = useTheme();
  const { useProductSplit, isXs, isMd } = useKankregLayout();
  const styles = useMemo(() => createStyles(c, isDark), [c, isDark]);
  const rewardsPts = Math.max(10, Math.round((displayPrice || 0) / 10));

  const trustFeatures = useMemo(() => {
    const items = [];
    if (product?.eta) {
      items.push({ icon: "time-outline", title: "Delivery", subtitle: String(product.eta) });
    }
    if (rewardsPts > 0) {
      items.push({ icon: "gift-outline", title: "Rewards", subtitle: `~${rewardsPts} pts on purchase` });
    }
    if (liveRatingAvg > 0 && reviewCountDisplay > 0) {
      items.push({
        icon: "star-outline",
        title: "Reviews",
        subtitle: `${liveRatingAvg.toFixed(1)} · ${reviewCountDisplay} review${reviewCountDisplay === 1 ? "" : "s"}`,
      });
    } else if (product?.inStock !== false) {
      items.push({ icon: "checkmark-circle-outline", title: "Availability", subtitle: "In stock" });
    }
    return items;
  }, [product?.eta, product?.inStock, rewardsPts, liveRatingAvg, reviewCountDisplay]);

  const usps = Array.isArray(product?.usps) ? product.usps.filter(Boolean).slice(0, 4) : [];
  const thumbDelays = useStaggeredReveal(galleryImages.length, { gap: 36, initialDelay: 120 });
  const trustDelays = useStaggeredReveal(trustFeatures.length, { gap: 50, initialDelay: 280 });
  const reviewDelays = useStaggeredReveal(Math.min((reviews || []).length, isMd ? 6 : 3), {
    gap: 40,
    initialDelay: 80,
  });
  const uspDelays = useStaggeredReveal(usps.length, { gap: 36, initialDelay: 160 });

  if (Platform.OS !== "web") return null;

  const categoryLabel =
    product?.badgeText || product?.homeSection || product?.category || PRODUCT_SCREEN.categoryFallback;
  const unit = product?.unit || PRODUCT_SCREEN.unitFallback;
  const description = String(product?.description || "").trim();
  const stockQty = Number(product?.stockQty);
  const showStock = Number.isFinite(stockQty) && stockQty > 0 && !isOutOfStock;

  const ratingSummary =
    liveRatingAvg > 0
      ? fillProductScreen(PRODUCT_SCREEN.metaRatingSummary, {
          rating: liveRatingAvg.toFixed(1),
          count: String(reviewCountDisplay),
        })
      : PRODUCT_SCREEN.metaNoRatings;

  const showInlineCta = !stickyBarVisible;
  const visibleReviews = (reviews || []).slice(0, isMd ? 6 : 3);

  const renderGallery = () => (
    <View style={[styles.galleryWrap, useProductSplit && styles.galleryWrapSplit]}>
      {galleryImages.length > 1 ? (
        <View style={[styles.thumbRail, useProductSplit && styles.thumbRailVertical]}>
          {galleryImages.map((img, idx) => {
            const active = (selectedImage || product.image) === img;
            return (
              <SectionReveal key={img} immediate delay={thumbDelays[idx]} preset="scale-in">
                <TouchableOpacity
                  style={[styles.thumb, active && styles.thumbActive]}
                  onPress={() => onSelectImage(img)}
                >
                  <ThumbImage
                    sourceUri={img}
                    style={styles.thumbImage}
                    fallbackStyle={styles.thumbFallback}
                    mutedColor={c.textMuted}
                  />
                </TouchableOpacity>
              </SectionReveal>
            );
          })}
        </View>
      ) : null}
      <HeroParallax strength="subtle" maxScroll={360} dim={false} scale style={styles.heroParallax}>
        <View style={[styles.heroStage, { minHeight: heroImageHeight }]}>
          {heroImageUri && !imageFailed ? (
            <Animated.View style={[styles.heroAnim, heroFadeStyle]}>
              <Image
                source={{ uri: heroImageUri }}
                style={styles.heroImage}
                contentFit="contain"
                transition={280}
                cachePolicy="memory-disk"
                placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
                onError={onHeroImageError}
              />
            </Animated.View>
          ) : (
            <View style={styles.heroFallback}>
              <Ionicons name="image-outline" size={sz.xxl} color={c.textMuted} />
              <Text style={styles.heroFallbackText}>{PRODUCT_SCREEN.heroImageUnavailable}</Text>
            </View>
          )}
          <LinearGradient
            colors={
              isDark
                ? ["transparent", "rgba(12, 10, 8, 0.06)", "rgba(12, 10, 8, 0.35)"]
                : ["transparent", "rgba(255, 253, 248, 0.15)", "rgba(255, 253, 248, 0.75)"]
            }
            style={styles.heroVignette}
            pointerEvents="none"
          />
          {product.badgeText ? (
            <SectionReveal immediate delay={200} preset="fade-in">
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText} numberOfLines={2}>
                  {String(product.badgeText).toUpperCase()}
                </Text>
              </View>
            </SectionReveal>
          ) : null}
        </View>
      </HeroParallax>
    </View>
  );

  const renderPurchaseBlock = () => (
    <>
      <SectionReveal immediate delay={60} preset="fade-up">
      <View style={styles.tagRow}>
        <View style={styles.tagGold}>
          <Text style={styles.tagGoldText}>{String(categoryLabel).toUpperCase()}</Text>
        </View>
        <View style={[styles.tagStock, isOutOfStock ? styles.tagDanger : styles.tagOk]}>
          <Ionicons
            name={isOutOfStock ? "close-circle-outline" : "checkmark-circle-outline"}
            size={12}
            color={isOutOfStock ? KANKREG_PALETTE.danger : KANKREG_PALETTE.green}
          />
          <Text style={[styles.tagStockText, isOutOfStock && styles.tagDangerText]}>
            {isOutOfStock ? PRODUCT_SCREEN.heroOutOfStock : PRODUCT_SCREEN.metaReadyToShip}
          </Text>
        </View>
        {showStock ? (
          <View style={styles.tagMuted}>
            <Text style={styles.tagMutedText}>
              {fillProductScreen(PRODUCT_SCREEN.stockCountLabel, { count: String(stockQty) })}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{product.name}</Text>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={14} color={ALCHEMY.gold} />
        <Text style={styles.ratingText}>{ratingSummary}</Text>
      </View>
      </SectionReveal>

      <SectionReveal immediate delay={120} preset="scale-in">
      <View style={[styles.pricePanel, isDark ? styles.pricePanelDark : styles.pricePanelLight]}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatINR(displayPrice)}</Text>
          {showMrp && mrp ? <Text style={styles.mrp}>{formatINR(mrp)}</Text> : null}
          <Text style={styles.unit}>/{unit}</Text>
        </View>
        {offPct != null && offPct > 0 ? (
          <View style={styles.saveChip}>
            <Ionicons name="pricetag" size={12} color={KANKREG_PALETTE.green} />
            <Text style={styles.saveChipText}>
              {fillProductScreen(PRODUCT_SCREEN.savePctChip, { pct: String(offPct) })}
            </Text>
          </View>
        ) : null}
      </View>
      </SectionReveal>

      {variants.length > 0 ? (
        <SectionReveal immediate delay={180} preset="fade-up">
        <View style={styles.variantBlock}>
          <Text style={styles.variantLabel}>{PRODUCT_SCREEN.variantOverline}</Text>
          <Text style={styles.variantTitle}>{PRODUCT_SCREEN.variantTitle}</Text>
          <View style={styles.variantPills}>
            {variants.map((v) => {
              const lab = String(v.label || "").trim();
              const active = lab === selectedVariantLabel;
              return (
                <PremiumChip
                  key={lab}
                  label={lab}
                  tone={active ? "gold" : "neutral"}
                  selected={active}
                  size="lg"
                  onPress={() => onSelectVariant(lab)}
                />
              );
            })}
          </View>
        </View>
        </SectionReveal>
      ) : null}

      {showInlineCta ? (
        <SectionReveal immediate delay={220} preset="fade-up">
        {quantity > 0 && !isOutOfStock ? (
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={onRemoveFromCart}>
              <Ionicons name="remove" size={sz.md} color={c.onPrimary} />
            </TouchableOpacity>
            <Text style={styles.stepCount}>
              {fillProductScreen(PRODUCT_SCREEN.inCartCount, { count: String(quantity) })}
            </Text>
            <TouchableOpacity style={styles.stepBtn} onPress={onAddToCart}>
              <Ionicons name="add" size={sz.md} color={c.onPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <PremiumButton
              label={isOutOfStock ? PRODUCT_SCREEN.outOfStock : PRODUCT_SCREEN.addToCart}
              variant="primary"
              size="lg"
              iconLeft={isOutOfStock ? "close-circle-outline" : "bag-add-outline"}
              disabled={isOutOfStock}
              onPress={onAddToCart}
              style={styles.actionPrimary}
            />
            {!isOutOfStock ? (
              <PremiumButton label="Buy now" variant="gold" size="lg" onPress={onBuyNow} style={styles.actionGold} />
            ) : null}
          </View>
        )}
        </SectionReveal>
      ) : null}

      {trustFeatures.length > 0 ? (
        <View style={[styles.trustGrid, isMd && styles.trustGridDesktop]}>
          {trustFeatures.map((feat, idx) => (
            <TrustFeature
              key={feat.title}
              {...feat}
              isDark={isDark}
              c={c}
              styles={styles}
              wide={isMd}
              revealDelay={trustDelays[idx]}
            />
          ))}
        </View>
      ) : null}
    </>
  );

  return (
    <View style={styles.page}>
      <TouchableOpacity
        style={[styles.backFab, { top: Math.max(insets.top, spacing.sm) }]}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={sz.lg} color={isDark ? c.textPrimary : ALCHEMY.brown} />
      </TouchableOpacity>

      {product?.name ? (
        <SectionReveal immediate preset="fade-in" delay={0}>
          <Text style={styles.breadcrumb} numberOfLines={2}>
            Shop · {String(product.category || "Catalog").trim()} · {product.name}
          </Text>
        </SectionReveal>
      ) : null}

      <SectionReveal immediate delay={40} preset="scale-in">
      <View
        style={[
          styles.pdShell,
          shelfMatch && styles.pdShellShelf,
          useProductSplit ? styles.pdSplit : styles.pdStack,
        ]}
      >
        <View style={useProductSplit ? styles.pdColGallery : null}>{renderGallery()}</View>

        <SectionReveal
          immediate
          delay={useProductSplit ? 140 : 100}
          preset={useProductSplit ? "slide-right" : "fade-up"}
          style={useProductSplit ? styles.pdColInfo : null}
        >
          <View style={[styles.infoSheet, isDark && styles.infoSheetDark]}>
            <View style={[styles.sheetAccent, { backgroundColor: isDark ? ALCHEMY.goldBright : ALCHEMY.gold }]} />
            {renderPurchaseBlock()}

            <GoldHairline marginVertical={spacing.md} />

            <SectionReveal immediate delay={300} preset="fade-up">
              {description ? (
                <>
                  <PremiumSectionHeader compact title={PRODUCT_SCREEN.storyTitle} />
                  <Text style={styles.description}>{description}</Text>
                </>
              ) : null}
              {product?.highlightQuote ? (
                <Text style={styles.highlightQuote}>{product.highlightQuote}</Text>
              ) : null}
              {product?.richProductPage && product?.processSteps?.length ? (
                <View style={styles.processWrap}>
                  {product.processTitle ? (
                    <Text style={styles.processTitle}>{product.processTitle}</Text>
                  ) : null}
                  {product.processSteps.map((step, stepIdx) => (
                    <Text key={`${step}-${stepIdx}`} style={styles.processStep}>
                      {step}
                    </Text>
                  ))}
                </View>
              ) : null}
            </SectionReveal>

            {usps.length > 0 ? (
              <View style={styles.uspsWrap}>
                {usps.map((usp, idx) => {
                  const line = formatUspLine(usp);
                  if (!line) return null;
                  const iconName =
                    typeof usp === "object" && usp?.icon ? String(usp.icon) : "sparkles";
                  return (
                    <SectionReveal key={`${line}-${idx}`} immediate delay={uspDelays[idx]} preset="fade-up">
                      <View style={styles.uspRow}>
                        <Ionicons name={iconName} size={13} color={KANKREG_PALETTE.gold} />
                        <Text style={styles.uspText}>{line}</Text>
                      </View>
                    </SectionReveal>
                  );
                })}
              </View>
            ) : null}
          </View>
        </SectionReveal>
      </View>
      </SectionReveal>

      <SectionReveal index={1} preset="fade-up" style={styles.sectionBlock}>
        <View style={[styles.reviewsPanel, isDark && styles.reviewsPanelDark]}>
          <PremiumSectionHeader
            compact
            overline={PRODUCT_SCREEN.reviewsOverline}
            title={
              reviewCountDisplay > 0
                ? `${PRODUCT_SCREEN.reviewsTitle} · ${liveRatingAvg.toFixed(1)}`
                : PRODUCT_SCREEN.reviewsTitle
            }
            subtitle={reviewCountDisplay === 0 ? PRODUCT_SCREEN.reviewsEmptySubtitle : undefined}
            count={reviewCountDisplay > 0 ? reviewCountDisplay : undefined}
          />

          {reviewError ? (
            <View style={styles.bannerWrap}>
              <PremiumErrorBanner severity="error" message={reviewError} compact />
            </View>
          ) : null}
          {reviewSuccess ? (
            <View style={styles.bannerWrap}>
              <PremiumErrorBanner severity="success" message={reviewSuccess} compact />
            </View>
          ) : null}

          <View style={[styles.reviewGrid, isMd && styles.reviewGridDesktop]}>
            {visibleReviews.map((r, idx) => {
              const name = String(r.userName || "Customer").trim() || "Customer";
              const initial = name.charAt(0).toUpperCase();
              const comment = String(r.comment || "").trim();
              const rt = Number(r.rating || 0);
              return (
                <SectionReveal key={`${r._id || idx}`} delay={reviewDelays[idx]} preset="fade-up">
                  <View style={[styles.reviewCard, isDark && styles.reviewCardDark]}>
                    <View style={styles.reviewCardTop}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>{initial}</Text>
                      </View>
                      <View style={styles.reviewCardMeta}>
                        <Text style={styles.reviewUser} numberOfLines={1}>
                          {name}
                        </Text>
                        <View style={styles.reviewPill}>
                          <Ionicons name="star" size={11} color={ALCHEMY.gold} />
                          <Text style={styles.reviewPillText}>{rt}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewBody} numberOfLines={5}>
                      {comment || PRODUCT_SCREEN.reviewNoWrittenNote}
                    </Text>
                  </View>
                </SectionReveal>
              );
            })}
          </View>

          <SectionReveal delay={120} preset="fade-up">
          <View style={styles.composer}>
            <View style={styles.starPick}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => onReviewRatingChange?.(value)} hitSlop={8}>
                  <Ionicons
                    name={value <= reviewRating ? "star" : "star-outline"}
                    size={24}
                    color={value <= reviewRating ? ALCHEMY.gold : c.textMuted}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <PremiumInput
              label={PRODUCT_SCREEN.reviewComposerNoteLabel}
              value={reviewComment}
              onChangeText={onReviewCommentChange}
              placeholder={PRODUCT_SCREEN.reviewComposerPlaceholder}
              multiline
              numberOfLines={3}
              iconLeft="chatbubble-outline"
            />
            <PremiumButton
              label={reviewBusy ? PRODUCT_SCREEN.reviewPosting : PRODUCT_SCREEN.reviewPost}
              variant="primary"
              size="sm"
              loading={reviewBusy}
              disabled={reviewBusy}
              onPress={() => {
                if (!isAuthenticated) {
                  navigation.navigate("Login");
                  return;
                }
                onSubmitReview?.();
              }}
              style={styles.reviewSubmit}
            />
          </View>
          </SectionReveal>
        </View>
      </SectionReveal>

      {relatedProducts.length > 0 ? (
        <SectionReveal index={2} preset="fade-up" style={styles.sectionBlock}>
          <PremiumSectionHeader compact overline="Catalog" title="You may also like" />
          <CatalogGridReveal>
            {relatedProducts.map((item, idx) => (
              <HomeCatalogGridCard
                key={item.id}
                idx={idx}
                item={item}
                compact={isXs}
                navigation={navigation}
                quantity={getItemQuantity(item.id)}
                styles={relatedGridStyles}
                isOutOfStock={item.inStock === false}
                onAddToCart={() => onAddRelated(item)}
                onRemoveFromCart={() => onRemoveRelated(item.id)}
              />
            ))}
          </CatalogGridReveal>
        </SectionReveal>
      ) : null}
    </View>
  );
}

const relatedGridStyles = StyleSheet.create({
  productGridWrap: {},
  productGridCell: {},
  productListRow: {},
});

function createStyles(c, isDark) {
  const cardShadow = platformShadow({
    web: {
      boxShadow: isDark
        ? "0 12px 40px rgba(0,0,0,0.32)"
        : "0 12px 36px rgba(61, 42, 18, 0.07), 0 4px 14px rgba(28, 25, 23, 0.04)",
    },
  });

  return StyleSheet.create({
    page: {
      width: "100%",
      maxWidth: layout.maxContentWidth + 96,
      alignSelf: "center",
      position: "relative",
    },
    backFab: {
      position: "absolute",
      left: 0,
      zIndex: 6,
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? c.surfaceMuted : "rgba(255,255,255,0.94)",
      borderWidth: 1,
      borderColor: c.border,
      ...platformShadow({ web: { boxShadow: "0 4px 14px rgba(0,0,0,0.08)" } }),
    },
    breadcrumb: {
      fontSize: 13,
      color: c.textMuted,
      marginBottom: spacing.lg,
      marginTop: spacing.xl + 8,
      fontFamily: fonts.medium,
    },
    pdShell: {
      borderRadius: radius.xxl,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? c.border : KANKREG_PALETTE.line,
      backgroundColor: isDark ? c.surface : KANKREG_PALETTE.card,
      ...cardShadow,
    },
    pdShellShelf: {
      borderTopColor: c.secondary,
      borderTopWidth: 2,
    },
    pdSplit: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "stretch",
      gap: 0,
    },
    pdStack: {
      flexDirection: "column",
    },
    pdColGallery: {
      flex: 1,
      minWidth: 300,
      maxWidth: "52%",
    },
    pdColInfo: {
      flex: 1,
      minWidth: 300,
      maxWidth: "48%",
    },
    galleryWrap: {
      width: "100%",
      padding: spacing.md,
      gap: 12,
    },
    galleryWrapSplit: {
      flexDirection: "row",
      gap: 14,
      padding: spacing.lg,
    },
    thumbRail: {
      flexDirection: "row",
      gap: 10,
      flexWrap: "wrap",
    },
    thumbRailVertical: {
      flexDirection: "column",
      width: 72,
      flexShrink: 0,
      paddingBottom: 0,
    },
    heroParallax: {
      flex: 1,
      width: "100%",
    },
    thumb: {
      width: 68,
      height: 68,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: "transparent",
      overflow: "hidden",
      backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt,
      ...Platform.select({
        web: {
          transition: "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
          cursor: "pointer",
        },
        default: {},
      }),
    },
    thumbActive: {
      borderColor: ALCHEMY.gold,
      ...platformShadow({ web: { boxShadow: "0 4px 12px rgba(201, 162, 39, 0.28)" } }),
      ...Platform.select({
        web: { transform: [{ scale: 1.03 }] },
        default: {},
      }),
    },
    thumbImage: { width: "100%", height: "100%" },
    thumbFallback: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.surfaceMuted,
    },
    heroStage: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#1C1917" : ALCHEMY.creamAlt,
      borderRadius: radius.xl + 2,
      overflow: "hidden",
      position: "relative",
      minHeight: 360,
    },
    heroAnim: { width: "100%", height: "100%" },
    heroImage: { width: "100%", height: "100%", backgroundColor: "transparent" },
    heroVignette: { ...StyleSheet.absoluteFillObject },
    heroFallback: {
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: spacing.xl,
    },
    heroFallbackText: {
      color: c.textSecondary,
      fontSize: typography.bodySmall,
      fontFamily: fonts.semibold,
    },
    heroBadge: {
      position: "absolute",
      right: spacing.sm,
      bottom: spacing.sm,
      maxWidth: "46%",
      backgroundColor: ALCHEMY.brownMuted,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.md,
      zIndex: 3,
    },
    heroBadgeText: {
      color: "#fff",
      fontSize: 10,
      fontFamily: fonts.extrabold,
      letterSpacing: 0.6,
    },
    infoSheet: {
      padding: spacing.lg + 4,
      backgroundColor: isDark ? c.surface : KANKREG_PALETTE.card,
      position: "relative",
      overflow: "hidden",
    },
    infoSheetDark: {
      backgroundColor: c.surface,
    },
    sheetAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
    },
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
      marginBottom: 10,
    },
    tagGold: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: "rgba(169,119,46,0.14)",
    },
    tagGoldText: {
      fontFamily: fonts.bold,
      fontSize: 10,
      letterSpacing: 0.9,
      color: KANKREG_PALETTE.goldDeep,
    },
    tagOk: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: "rgba(60,98,72,0.1)",
    },
    tagDanger: {
      backgroundColor: "rgba(168,68,47,0.1)",
    },
    tagStock: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    tagStockText: {
      fontFamily: fonts.semibold,
      fontSize: 10,
      color: KANKREG_PALETTE.green,
    },
    tagDangerText: { color: KANKREG_PALETTE.danger },
    tagMuted: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: "rgba(25,20,15,0.05)",
    },
    tagMutedText: {
      fontFamily: fonts.medium,
      fontSize: 10,
      color: KANKREG_PALETTE.inkSoft,
    },
    title: {
      fontFamily: FONT_DISPLAY,
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "400",
      color: c.textPrimary,
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: spacing.md,
    },
    ratingText: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: c.textMuted,
    },
    pricePanel: {
      borderRadius: radius.xl,
      padding: spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      marginBottom: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
    },
    pricePanelLight: {
      backgroundColor: "rgba(169,119,46,0.06)",
      borderColor: "rgba(169,119,46,0.2)",
      borderLeftWidth: 3,
      borderLeftColor: ALCHEMY.gold,
    },
    pricePanelDark: {
      backgroundColor: "rgba(255,255,255,0.04)",
      borderColor: c.border,
      borderLeftWidth: 3,
      borderLeftColor: ALCHEMY.goldBright,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: 8,
    },
    price: {
      fontFamily: FONT_DISPLAY,
      fontSize: 30,
      fontWeight: "600",
      color: c.textPrimary,
      letterSpacing: -0.4,
    },
    mrp: {
      fontFamily: fonts.regular,
      fontSize: 15,
      color: c.textMuted,
      textDecorationLine: "line-through",
    },
    unit: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: c.textSecondary,
    },
    saveChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      backgroundColor: "rgba(60,98,72,0.12)",
    },
    saveChipText: {
      fontFamily: fonts.semibold,
      fontSize: 11,
      color: KANKREG_PALETTE.green,
    },
    variantBlock: { marginBottom: spacing.md },
    variantLabel: {
      fontFamily: fonts.bold,
      fontSize: 10,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: KANKREG_PALETTE.inkFaint,
    },
    variantTitle: {
      fontFamily: FONT_DISPLAY,
      fontSize: 18,
      color: c.textPrimary,
      marginTop: 4,
      marginBottom: 10,
    },
    variantPills: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: spacing.md,
      flexWrap: "wrap",
    },
    actionPrimary: { flex: 1, minWidth: 160 },
    actionGold: { flex: 1, minWidth: 140 },
    stepper: {
      marginBottom: spacing.md,
      backgroundColor: isDark ? c.primaryDark : ALCHEMY.brown,
      borderRadius: semanticRadius.full,
      minHeight: 54,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      ...platformShadow({
        web: { boxShadow: "0 10px 22px rgba(61, 42, 18, 0.18)" },
      }),
    },
    stepBtn: { width: 40, alignItems: "center", justifyContent: "center" },
    stepCount: {
      color: c.onPrimary,
      fontSize: typography.bodySmall,
      fontFamily: fonts.bold,
    },
    trustGrid: {
      gap: 10,
      marginTop: spacing.sm,
    },
    trustGridDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    trustRevealWide: {
      flex: 1,
      minWidth: "30%",
    },
    trustCard: {
      padding: 14,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 4,
    },
    trustCardWide: {
      flex: 1,
      minWidth: "30%",
    },
    trustIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "rgba(169,119,46,0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    trustTitle: {
      fontFamily: fonts.semibold,
      fontSize: 13,
    },
    trustSub: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: KANKREG_PALETTE.inkFaint,
      lineHeight: 15,
    },
    description: {
      fontSize: 15,
      lineHeight: 24,
      fontFamily: fonts.regular,
      color: c.textSecondary,
      marginTop: spacing.sm,
      maxWidth: 560,
    },
    highlightQuote: {
      fontFamily: FONT_DISPLAY,
      fontSize: 17,
      lineHeight: 26,
      color: c.textPrimary,
      marginTop: spacing.md,
      fontStyle: "italic",
      maxWidth: 560,
    },
    processWrap: {
      marginTop: spacing.md,
      gap: spacing.xs,
      maxWidth: 560,
    },
    processTitle: {
      fontFamily: fonts.semibold,
      fontSize: 13,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: KANKREG_PALETTE.inkFaint,
    },
    processStep: {
      fontFamily: fonts.regular,
      fontSize: 14,
      lineHeight: 21,
      color: c.textSecondary,
    },
    uspsWrap: { marginTop: spacing.md, gap: 10 },
    uspRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    uspText: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 14,
      lineHeight: 21,
      color: c.textSecondary,
    },
    sectionBlock: {
      marginTop: spacing.xl,
      width: "100%",
    },
    reviewsPanel: {
      borderRadius: radius.xl + 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: KANKREG_PALETTE.line,
      backgroundColor: isDark ? c.surfaceMuted : "rgba(255,253,249,0.96)",
      padding: spacing.lg,
      borderLeftWidth: 3,
      borderLeftColor: ALCHEMY.gold,
      ...cardShadow,
    },
    reviewsPanelDark: {
      borderColor: c.border,
      backgroundColor: c.surfaceMuted,
    },
    bannerWrap: { marginBottom: spacing.sm },
    reviewGrid: { gap: 12, marginTop: spacing.sm, marginBottom: spacing.md },
    reviewGridDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    reviewCard: {
      flex: 1,
      minWidth: 220,
      padding: 14,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: KANKREG_PALETTE.line,
      backgroundColor: KANKREG_PALETTE.card,
      gap: 8,
    },
    reviewCardDark: {
      backgroundColor: "rgba(255,255,255,0.04)",
      borderColor: c.border,
    },
    reviewCardTop: { flexDirection: "row", gap: 10, alignItems: "center" },
    reviewAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(169,119,46,0.12)",
      alignItems: "center",
      justifyContent: "center",
    },
    reviewAvatarText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: KANKREG_PALETTE.goldDeep,
    },
    reviewCardMeta: { flex: 1, minWidth: 0 },
    reviewUser: {
      fontFamily: fonts.bold,
      fontSize: 13,
      color: c.textPrimary,
    },
    reviewPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      alignSelf: "flex-start",
      marginTop: 2,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: radius.pill,
      backgroundColor: "rgba(169,119,46,0.1)",
    },
    reviewPillText: {
      fontFamily: fonts.bold,
      fontSize: 11,
      color: KANKREG_PALETTE.goldDeep,
    },
    reviewBody: {
      fontFamily: fonts.regular,
      fontSize: 13,
      lineHeight: 20,
      color: c.textSecondary,
    },
    composer: {
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? c.border : KANKREG_PALETTE.line,
      backgroundColor: isDark ? c.surface : "#fff",
      gap: spacing.sm,
    },
    starPick: {
      flexDirection: "row",
      gap: 8,
      marginBottom: spacing.xs,
    },
    reviewSubmit: { alignSelf: "flex-end" },
  });
}
