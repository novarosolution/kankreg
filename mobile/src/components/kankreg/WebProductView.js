import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeCatalogGridCard } from "../home/HomeCatalogProductViews";
import CatalogGridReveal from "./CatalogGridReveal";
import SectionReveal from "../motion/SectionReveal";
import { SectionHeader } from "../home/editorial";
import PremiumButton from "../ui/PremiumButton";
import PremiumInput from "../ui/PremiumInput";
import PremiumErrorBanner from "../ui/PremiumErrorBanner";
import GoldHairline from "../ui/GoldHairline";
import ProgressiveProductImage from "../ui/ProgressiveProductImage";
import { useTheme } from "../../context/ThemeContext";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { ALCHEMY } from "../../theme/customerAlchemy";
import { FONT_BODY_SEMIBOLD, FONT_HEADING, FONT_PRICE } from "../../theme/typographyRoles";
import {
  GOLD_HAIRLINE_EDITORIAL,
  HOME_SPACE,
  HOME_TYPE,
  homeEditorialInk,
  homeEditorialMuted,
} from "../../theme/homeEditorial";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";
import { formatINRWhole } from "../../utils/currency";
import {
  getImageUriCandidates,
  getProductSectionImageUri,
  getProductThumbImageUri,
} from "../../utils/image";
import {
  PRODUCT_SCREEN,
  STOREFRONT_COUPON_CODE,
  STOREFRONT_COUPON_OFF,
} from "../../content/appContent";
import { getProductCardFlags } from "../../utils/productAvailability";
import { getComingSoonImageBlurStyle } from "../../utils/comingSoonImageStyle";
import ComingSoonProductOverlay from "../product/ComingSoonProductOverlay";
import ComingSoonPurchasePanel from "../product/ComingSoonPurchasePanel";
import { resolveProductPageContent } from "../../utils/resolveProductPageContent";
import { fonts, icon as sz, layout, radius, spacing, typography } from "../../theme/tokens";
import { platformShadow } from "../../theme/shadowPlatform";

const PRODUCT_THUMB_CLASS = "kankreg-pd-thumb";
const PRODUCT_SIZE_CLASS = "kankreg-pd-size";
const PRODUCT_FEAT_CLASS = "kankreg-pd-feat";
const PRODUCT_BTN_CART_CLASS = "kankreg-pd-btn-cart";
const PRODUCT_BTN_BUY_CLASS = "kankreg-pd-btn-buy";

if (Platform.OS === "web") {
  injectWebCssOnce(
    "kankreg-product-premium",
    `.${PRODUCT_THUMB_CLASS} {
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}
.${PRODUCT_THUMB_CLASS}:hover {
  transform: translateY(-2px);
}
.${PRODUCT_SIZE_CLASS} {
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}
.${PRODUCT_SIZE_CLASS}:hover {
  border-color: rgba(31, 77, 54, 0.45) !important;
  transform: translateY(-1px);
}
.${PRODUCT_FEAT_CLASS} {
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}
.${PRODUCT_FEAT_CLASS}:hover {
  border-color: rgba(214, 173, 91, 0.35) !important;
  box-shadow: 0 10px 28px -12px rgba(80, 60, 25, 0.12) !important;
}
.${PRODUCT_BTN_CART_CLASS}, .${PRODUCT_BTN_BUY_CLASS} {
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  cursor: pointer;
}
.${PRODUCT_BTN_CART_CLASS}:hover:not(:disabled) {
  background: #154C3C !important;
}
.${PRODUCT_BTN_BUY_CLASS}:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(0.97);
}
@media (prefers-reduced-motion: reduce) {
  .${PRODUCT_THUMB_CLASS}:hover,
  .${PRODUCT_SIZE_CLASS}:hover,
  .${PRODUCT_BTN_BUY_CLASS}:hover { transform: none !important; }
}`
  );
}

function parseVolumeLiters(label) {
  const s = String(label || "")
    .toLowerCase()
    .replace(/,/g, "");
  const ml = s.match(/([\d.]+)\s*ml/);
  if (ml) return Number(ml[1]) / 1000;
  const liters = s.match(/([\d.]+)\s*l(?:itre|iter|tr)?\b/);
  if (liters) return Number(liters[1]);
  return null;
}

function variantUnitPrice(label, price) {
  const liters = parseVolumeLiters(label);
  if (!liters || liters <= 0) return null;
  return Math.round(Number(price || 0) / liters);
}

function variantDiscount(variant) {
  const price = Number(variant?.price) || 0;
  const mrp = Number(variant?.mrp) || 0;
  if (!(mrp > price && mrp > 0)) return { mrp: null, pct: 0 };
  return { mrp, pct: Math.max(0, Math.round((1 - price / mrp) * 100)) };
}

function renderStarRow(rating, size = 13) {
  const filled = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <Text style={{ color: "#F5C451", fontSize: size, letterSpacing: 0.4 }}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </Text>
  );
}

function ProductSizeCard({ variant, active, onPress, styles }) {
  const lab = String(variant.label || "").trim();
  const price = Number(variant.price) || 0;
  const perLiter = variantUnitPrice(lab, price);
  const { mrp, pct } = variantDiscount(variant);
  return (
    <Pressable
      className={Platform.OS === "web" ? PRODUCT_SIZE_CLASS : undefined}
      style={[styles.sizeCard, active && styles.sizeCardActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.sizeLabel, active && styles.sizeLabelActive]} numberOfLines={2}>
        {lab}
      </Text>
      <View style={styles.sizePriceRow}>
        <Text style={[styles.sizePrice, active && styles.sizePriceActive]}>{formatINRWhole(price)}</Text>
        {pct > 0 ? <Text style={styles.sizeOff}>{pct}% off</Text> : null}
      </View>
      {mrp ? <Text style={styles.sizeWas}>{formatINRWhole(mrp)}</Text> : null}
      {perLiter ? <Text style={styles.sizeUnit}>{formatINRWhole(perLiter)}/L</Text> : null}
    </Pressable>
  );
}

function ProductFeatureCard({ icon, title, subtitle, styles, isDark, cardStyle }) {
  return (
    <View
      className={Platform.OS === "web" ? PRODUCT_FEAT_CLASS : undefined}
      style={[styles.featCard, cardStyle, isDark && styles.featCardDark]}
    >
      <View style={styles.featIcon}>
        <Ionicons name={icon} size={20} color={KANKREG_PALETTE.green} />
      </View>
      <Text style={[styles.featTitle, { color: isDark ? "#f5efe4" : KANKREG_PALETTE.ink }]}>{title}</Text>
      <Text style={styles.featSub}>{subtitle}</Text>
    </View>
  );
}

function ProductTrustChip({ icon, label, styles, isDark }) {
  return (
    <View style={[styles.tchip, isDark && styles.tchipDark]}>
      <Ionicons name={icon} size={14} color={KANKREG_PALETTE.green} />
      <Text style={[styles.tchipText, { color: isDark ? "#d8cdb8" : KANKREG_PALETTE.inkSoft }]}>{label}</Text>
    </View>
  );
}

function ProductPullQuote({ quote, isDark, styles }) {
  if (!quote) return null;
  const ink = homeEditorialInk(isDark);
  return (
    <View style={[styles.pullQuote, isDark && styles.pullQuoteDark]}>
      <Text style={[styles.pullQuoteGlyph, { color: KANKREG_PALETTE.gold }]}>{"“"}</Text>
      <Text style={[styles.pullQuoteText, { color: ink }]}>{quote}</Text>
      <GoldHairline {...GOLD_HAIRLINE_EDITORIAL.subtle} marginVertical={HOME_SPACE.sm} />
    </View>
  );
}

function ProductProcessStep({ step, index, isDark, styles }) {
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const label = String(step || "").trim();
  if (!label) return null;
  return (
    <View style={[styles.processCard, isDark && styles.processCardDark]}>
      <View style={styles.processBadge}>
        <Text style={styles.processBadgeText}>{String(index + 1).padStart(2, "0")}</Text>
      </View>
      <Text style={[styles.processCardText, { color: ink }]}>{label}</Text>
      <Text style={[styles.processCardMeta, { color: muted }]}>
        Step {index + 1}
      </Text>
    </View>
  );
}

function ThumbImage({ sourceUri, style, fallbackStyle, mutedColor, active = false }) {
  const candidates = useMemo(
    () => getImageUriCandidates(sourceUri, { width: 220, quality: "auto:good" }),
    [sourceUri]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sourceUri]);

  const uri = candidates[index] || getProductThumbImageUri(sourceUri) || "";
  if (!uri) {
    return (
      <View style={[style, fallbackStyle]}>
        <Ionicons name="image-outline" size={sz.micro} color={mutedColor} />
      </View>
    );
  }

  return (
    <ProgressiveProductImage
      uri={uri}
      style={style}
      contentFit="cover"
      priority={active ? "high" : "normal"}
      recyclingKey={uri}
      rounded={8}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

/** Premium web product detail — ghee PDP HTML layout */
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
  isComingSoon = false,
  comingSoonNote = "",
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
  const ink = homeEditorialInk(isDark);
  const muted = homeEditorialMuted(isDark);
  const pageContent = useMemo(
    () => resolveProductPageContent(product, { shelfMatch }),
    [product, shelfMatch]
  );
  const {
    eyebrow: eyebrowText,
    lead: leadText,
    trustChips,
    highlights,
    delivery: deliveryNote,
    story,
    showStoryLegend,
    featureCards,
    nutrition: nutritionSection,
    reviewsSection,
    showStorySection,
    showNutritionSection,
  } = pageContent;


  /** Hooks must precede the platform early-return below (rules-of-hooks). */
  const lifestyleImage = useMemo(() => {
    const raw = String(product?.lifestyleImage || "").trim();
    return raw ? getProductSectionImageUri(raw) : "";
  }, [product?.lifestyleImage]);
  const heroPreviewUri = useMemo(
    () => getProductThumbImageUri(selectedImage || product?.image),
    [selectedImage, product?.image]
  );

  if (Platform.OS !== "web") return null;

  const inCart = quantity > 0;
  const visibleReviews = (reviews || []).slice(0, isMd ? 6 : 3);

  const handleBack = () => {
    if (typeof navigation?.canGoBack === "function" && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("Shop");
  };
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const payload = { title: String(product?.name || "KankreG"), text: String(product?.name || ""), url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url || String(product?.name || ""));
      }
    } catch {
      /* user cancelled share */
    }
  };
  const usageRituals = Array.isArray(product?.usageRituals) ? product.usageRituals.filter(Boolean) : [];
  const couponPrice = Math.round(Number(displayPrice || 0) * (1 - STOREFRONT_COUPON_OFF));
  const coinsEarned = Math.max(1, Math.round(Number(displayPrice || 0) / 20));
  const qtyDisplay = Math.max(1, Number(quantity) || 0);
  const descriptionText = String(product?.description || leadText || "").trim();
  const kickerText = String(eyebrowText || "").trim();
  const currentGalleryIndex = Math.max(
    0,
    galleryImages.findIndex((img) => img === (selectedImage || product.image))
  );
  const stepGallery = (dir) => {
    if (galleryImages.length < 2) return;
    const next = (currentGalleryIndex + dir + galleryImages.length) % galleryImages.length;
    onSelectImage(galleryImages[next]);
  };

  const renderGallery = () => (
    <View style={styles.gallery}>
      <View style={[styles.heroStage, { height: Math.max(heroImageHeight, 420) }]}>
        <View style={styles.heroZoom} pointerEvents="none">
          <Ionicons name="search-outline" size={18} color={KANKREG_PALETTE.inkSoft} />
        </View>
        {heroImageUri && !imageFailed ? (
          <Animated.View style={[styles.heroAnim, heroFadeStyle]}>
            <View style={styles.heroImageFrame}>
              <ProgressiveProductImage
                uri={heroImageUri}
                previewUri={heroPreviewUri}
                style={[
                  styles.heroImageInner,
                  { height: Math.max(280, heroImageHeight - 24) },
                  isComingSoon && getComingSoonImageBlurStyle(),
                ]}
                contentFit="contain"
                priority="high"
                recyclingKey={heroImageUri}
                onError={onHeroImageError}
                rounded={0}
              />
            </View>
          </Animated.View>
        ) : (
          <View style={styles.heroFallback}>
            <Ionicons name="image-outline" size={sz.xxl} color={c.textMuted} />
            <Text style={styles.heroFallbackText}>{PRODUCT_SCREEN.heroImageUnavailable}</Text>
          </View>
        )}
        {isComingSoon ? (
          <ComingSoonProductOverlay note={comingSoonNote} isDark={isDark} variant="hero" />
        ) : null}
      </View>
      {galleryImages.length > 1 ? (
        <View style={styles.thumbsWrap}>
          <Pressable
            style={styles.thumbArrow}
            onPress={() => stepGallery(-1)}
            accessibilityLabel="Previous image"
          >
            <Ionicons name="chevron-back" size={18} color={KANKREG_PALETTE.inkSoft} />
          </Pressable>
          <View style={styles.thumbsRow}>
            {galleryImages.map((img) => {
              const active = (selectedImage || product.image) === img;
              return (
                <TouchableOpacity
                  key={img}
                  className={Platform.OS === "web" ? PRODUCT_THUMB_CLASS : undefined}
                  style={[styles.thumb, active && styles.thumbActive]}
                  onPress={() => onSelectImage(img)}
                >
                  <ThumbImage
                    sourceUri={img}
                    active={active}
                    style={styles.thumbImage}
                    fallbackStyle={styles.thumbFallback}
                    mutedColor={c.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <Pressable
            style={styles.thumbArrow}
            onPress={() => stepGallery(1)}
            accessibilityLabel="Next image"
          >
            <Ionicons name="chevron-forward" size={18} color={KANKREG_PALETTE.inkSoft} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const renderPurchaseBlock = () => (
    <>
      <View style={styles.titleRow}>
        <Text style={[styles.title, isXs && styles.titleMobile, { color: ink }]}>{product.name}</Text>
        <Pressable style={styles.shareBtn} onPress={handleShare} accessibilityLabel="Share product">
          <Ionicons name="share-social-outline" size={20} color={KANKREG_PALETTE.inkSoft} />
        </Pressable>
      </View>
      {kickerText ? (
        <Text style={styles.kicker} numberOfLines={2}>
          {kickerText}
        </Text>
      ) : null}

      <View style={styles.ratePriceRow}>
        <View style={styles.rateRow}>
          {liveRatingAvg > 0 ? (
            <>
              {renderStarRow(liveRatingAvg, 14)}
              <Text style={styles.rateBold}>{liveRatingAvg.toFixed(1)}</Text>
              <Text style={styles.rateMuted}>
                ({reviewCountDisplay} review{reviewCountDisplay === 1 ? "" : "s"})
              </Text>
            </>
          ) : (
            <Text style={styles.rateMuted}>{PRODUCT_SCREEN.metaNoRatings}</Text>
          )}
        </View>
        <View style={styles.priceStack}>
          <View style={styles.priceRowMain}>
            <Text style={[styles.priceNow, { color: ink }]}>{formatINRWhole(displayPrice)}</Text>
            {showMrp && mrp ? <Text style={styles.priceWas}>{formatINRWhole(mrp)}</Text> : null}
          </View>
          <Text style={styles.mrpNote}>MRP (Incl. of all taxes)</Text>
        </View>
      </View>

      {Number(displayPrice) > 0 ? (
        <View style={styles.coinsBanner}>
          <Text style={styles.coinsIcon}>🪙</Text>
          <Text style={styles.coinsText}>
            Buy now & earn <Text style={styles.coinsStrong}>{coinsEarned}</Text> coins instantly
          </Text>
        </View>
      ) : null}

      {Number(displayPrice) > 0 ? (
        <View style={styles.bestPriceRow}>
          <Ionicons name="checkmark-circle" size={18} color="#2F8F4E" />
          <Text style={styles.bestPriceText}>
            Best Price {formatINRWhole(couponPrice)}{" "}
            <Text style={styles.bestPriceCode}>with {STOREFRONT_COUPON_CODE}</Text>
          </Text>
        </View>
      ) : null}

      {variants.length > 0 ? (
        <View>
          <Text style={styles.optLabel}>Select Variant</Text>
          <View style={[styles.sizesRow, isXs && styles.sizesRowStack]}>
            {variants.map((v) => {
              const lab = String(v.label || "").trim();
              const active = lab === selectedVariantLabel;
              return (
                <ProductSizeCard
                  key={lab}
                  variant={v}
                  active={active}
                  onPress={() => onSelectVariant(lab)}
                  styles={styles}
                />
              );
            })}
          </View>
        </View>
      ) : null}

      {isComingSoon ? (
        <ComingSoonPurchasePanel note={comingSoonNote} isDark={isDark} ink={ink} muted={muted} />
      ) : (
        <View style={[styles.buyRow, isXs && styles.buyRowStack]}>
          {!isOutOfStock ? (
            <View style={styles.qtyBox}>
              <Pressable
                style={styles.qtyBtn}
                onPress={inCart ? onRemoveFromCart : undefined}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={[styles.qtyCount, { color: ink }]}>{qtyDisplay}</Text>
              <Pressable style={styles.qtyBtn} onPress={onAddToCart} accessibilityLabel="Increase quantity">
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          ) : null}
          {!isOutOfStock ? (
            <Pressable
              className={Platform.OS === "web" ? PRODUCT_BTN_CART_CLASS : undefined}
              style={[styles.btnCart, isXs && styles.btnFull]}
              onPress={onAddToCart}
            >
              <Text style={styles.btnCartText}>{PRODUCT_SCREEN.addToCart}</Text>
            </Pressable>
          ) : null}
          {!isOutOfStock ? (
            <Pressable
              className={Platform.OS === "web" ? PRODUCT_BTN_BUY_CLASS : undefined}
              style={[styles.btnBuy, isXs && styles.btnFull]}
              onPress={onBuyNow}
            >
              <Text style={styles.btnBuyText}>Buy Now</Text>
            </Pressable>
          ) : (
            <View style={[styles.btnBuy, styles.btnDisabled, isXs && styles.btnFull]}>
              <Text style={styles.btnOutOfStockText}>{PRODUCT_SCREEN.outOfStock}</Text>
            </View>
          )}
        </View>
      )}

      {descriptionText ? (
        <View style={styles.descBlock}>
          <Text style={styles.descTitle}>PRODUCT DESCRIPTION</Text>
          <Text style={[styles.descBody, { color: muted }]}>{descriptionText}</Text>
        </View>
      ) : null}

      {trustChips.length > 0 ? (
        <View style={styles.trustRow}>
          {trustChips.map((chip) => (
            <ProductTrustChip key={chip.label} icon={chip.icon} label={chip.label} styles={styles} isDark={isDark} />
          ))}
        </View>
      ) : null}

      {deliveryNote ? (
        <View style={[styles.delivBox, isDark && styles.delivBoxDark]}>
          <Ionicons name="car-outline" size={20} color={KANKREG_PALETTE.green} />
          <Text style={[styles.delivText, { color: isDark ? "#d8cdb8" : KANKREG_PALETTE.inkSoft }]}>
            {deliveryNote.title ? <Text style={styles.delivBold}>{deliveryNote.title} </Text> : null}
            {deliveryNote.body}
          </Text>
        </View>
      ) : null}

      {highlights.length > 0 ? (
        <View style={styles.hlList}>
          {highlights.map((line) => (
            <View key={line} style={styles.hlRow}>
              <Ionicons name="checkmark" size={16} color={KANKREG_PALETTE.green} />
              <Text style={[styles.hlText, { color: isDark ? "#d8cdb8" : KANKREG_PALETTE.inkSoft }]}>{line}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );

  return (
    <View style={styles.page}>
      {!useProductSplit ? (
        <TouchableOpacity
          style={[styles.backFab, { top: Math.max(insets.top, spacing.sm) }]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={sz.lg} color={isDark ? c.textPrimary : KANKREG_PALETTE.ink} />
        </TouchableOpacity>
      ) : null}

      <View style={styles.crumbRow}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={styles.crumbLink}>Home</Text>
        </Pressable>
        <Text style={styles.crumbSep}> / </Text>
        <Pressable onPress={() => navigation.navigate("Shop")}>
          <Text style={styles.crumbLink}>Shop</Text>
        </Pressable>
        <Text style={styles.crumbSep}> / </Text>
        <Text style={styles.crumbCurrent} numberOfLines={1}>
          {product.name}
        </Text>
      </View>

      <SectionReveal immediate delay={40} preset="scale-in">
      <View style={[styles.pdp, useProductSplit ? styles.pdpSplit : styles.pdpStack]}>
        <View style={useProductSplit ? styles.pdpColGallery : styles.pdpColGalleryStack}>
          {renderGallery()}
        </View>

        <SectionReveal
          immediate
          delay={useProductSplit ? 140 : 100}
          preset={useProductSplit ? "slide-right" : "fade-up"}
          style={useProductSplit ? styles.pdpColInfo : styles.pdpColInfoStack}
        >
          <View style={styles.infoPanel}>{renderPurchaseBlock()}</View>
        </SectionReveal>
      </View>
      </SectionReveal>

      {showStorySection ? (
        <SectionReveal immediate delay={260} preset="fade-up" style={styles.sectionBlock}>
          <View style={[styles.secBlock, isDark && styles.secBlockDark]}>
            {story.kick ? <Text style={[styles.secKick, { color: muted }]}>{story.kick}</Text> : null}
            {story.title ? <Text style={[styles.secTitle, { color: ink }]}>{story.title}</Text> : null}
            {showStoryLegend ? (
              <Text style={[styles.secLegend, { color: muted }]}>{story.legend}</Text>
            ) : null}
            {featureCards.length > 0 ? (
              <View
                style={[
                  styles.featGrid,
                  useProductSplit ? styles.featGridDesktop : isXs ? styles.featGridMobile : styles.featGridTablet,
                ]}
              >
                {featureCards.map((feat, idx) => (
                  <ProductFeatureCard
                    key={`${feat.title}-${idx}`}
                    {...feat}
                    styles={styles}
                    isDark={isDark}
                    cardStyle={
                      useProductSplit
                        ? styles.featCardDesktop
                        : isXs
                          ? styles.featCardMobile
                          : styles.featCardTablet
                    }
                  />
                ))}
              </View>
            ) : null}
          </View>
        </SectionReveal>
      ) : null}

      {product?.richProductPage && (product?.highlightQuote || product?.processSteps?.length || lifestyleImage || usageRituals.length > 0) ? (
        <SectionReveal immediate delay={320} preset="fade-up" style={styles.sectionBlock}>
          <View style={styles.richExtras}>
            <ProductPullQuote quote={product?.highlightQuote} isDark={isDark} styles={styles} />
            {product?.processSteps?.length ? (
              <View style={styles.processWrap}>
                {product.processTitle ? (
                  <Text style={[styles.processTitle, { color: muted }]}>{product.processTitle}</Text>
                ) : null}
                <View style={[styles.processGrid, isMd && styles.processGridDesktop]}>
                  {product.processSteps.map((step, stepIdx) => (
                    <ProductProcessStep
                      key={`${step}-${stepIdx}`}
                      step={step}
                      index={stepIdx}
                      isDark={isDark}
                      styles={styles}
                    />
                  ))}
                </View>
              </View>
            ) : null}
            {lifestyleImage ? (
              <View style={styles.lifestyleWrap}>
                <ProgressiveProductImage
                  uri={lifestyleImage}
                  previewUri={getProductThumbImageUri(product?.lifestyleImage)}
                  style={styles.lifestyleImage}
                  contentFit="cover"
                  rounded={16}
                />
              </View>
            ) : null}
            {usageRituals.length > 0 ? (
              <View style={styles.usageWrap}>
                <Text style={[styles.usageEyebrow, { color: muted }]}>Usage & rituals</Text>
                <View style={[styles.usageGrid, isMd && styles.usageGridDesktop]}>
                  {usageRituals.map((item, idx) => (
                    <View key={`${item.title}-${idx}`} style={[styles.usageCard, isDark && styles.usageCardDark]}>
                      <View style={styles.usageIcon}>
                        <Ionicons name={item.icon || "sunny-outline"} size={18} color={KANKREG_PALETTE.green} />
                      </View>
                      <Text style={[styles.usageTitle, { color: ink }]}>{item.title}</Text>
                      <Text style={[styles.usageBody, { color: muted }]}>{item.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </SectionReveal>
      ) : null}

      {showNutritionSection && nutritionSection ? (
        <SectionReveal immediate delay={380} preset="fade-up" style={styles.sectionBlock}>
          <View style={[styles.nutriGrid, useProductSplit ? null : styles.nutriGridStack]}>
            <View style={styles.nutriCol}>
              {nutritionSection.kick ? (
                <Text style={[styles.secKick, { color: muted }]}>{nutritionSection.kick}</Text>
              ) : null}
              {nutritionSection.title ? (
                <Text style={[styles.secTitle, styles.nutriTitle, { color: ink }]}>{nutritionSection.title}</Text>
              ) : null}
              {nutritionSection.rows?.length ? (
                <View style={[styles.ntable, isDark && styles.ntableDark]}>
                  <View style={styles.ntableHead}>
                    <Text style={styles.ntableHeadTitle}>{nutritionSection.tableHead}</Text>
                    {nutritionSection.tableSub ? (
                      <Text style={styles.ntableHeadSub}>{nutritionSection.tableSub}</Text>
                    ) : null}
                  </View>
                  {nutritionSection.rows.map((row) => (
                    <View key={row.label} style={[styles.ntableRow, isDark && styles.ntableRowDark]}>
                      <Text style={[styles.ntableLabel, { color: isDark ? "#d8cdb8" : KANKREG_PALETTE.inkSoft }]}>
                        {row.label}
                      </Text>
                      <Text style={[styles.ntableValue, { color: ink }]}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
            {nutritionSection.card?.title || nutritionSection.card?.body ? (
              <View style={[styles.qrcard, isDark && styles.qrcardDark]}>
                {nutritionSection.card.title ? (
                  <Text style={[styles.qrcardTitle, { color: ink }]}>{nutritionSection.card.title}</Text>
                ) : null}
                {nutritionSection.card.body ? (
                  <Text style={[styles.qrcardBody, { color: muted }]}>{nutritionSection.card.body}</Text>
                ) : null}
                {nutritionSection.card.tags?.length ? (
                  <View style={styles.miniTags}>
                    {nutritionSection.card.tags.map((tag) => (
                      <View key={tag} style={styles.miniTag}>
                        <Text style={styles.miniTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
                {nutritionSection.card.footer ? (
                  <Text style={[styles.qrcardFoot, { color: muted }]}>{nutritionSection.card.footer}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </SectionReveal>
      ) : null}

      <SectionReveal immediate delay={440} preset="fade-up" style={styles.sectionBlock}>
        <View style={[styles.reviewsPanel, isDark && styles.reviewsPanelDark]}>
          <Text style={[styles.secKick, { color: muted }]}>{reviewsSection.kick}</Text>
          <Text style={[styles.secTitle, { color: ink }]}>{reviewsSection.title}</Text>

          {liveRatingAvg > 0 ? (
            <View style={styles.revTop}>
              <Text style={[styles.revBig, { color: ink }]}>{liveRatingAvg.toFixed(1)}</Text>
              <View>
                {renderStarRow(liveRatingAvg, 18)}
                <Text style={[styles.revTopMeta, { color: muted }]}>
                  Based on {reviewCountDisplay} verified review{reviewCountDisplay === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.revTopMeta, { color: muted, marginTop: 8 }]}>{PRODUCT_SCREEN.reviewsEmptySubtitle}</Text>
          )}

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

          <View style={[styles.revCards, useProductSplit && styles.revCardsDesktop]}>
            {visibleReviews.map((r, idx) => {
              const name = String(r.userName || "Customer").trim() || "Customer";
              const comment = String(r.comment || "").trim();
              const rt = Number(r.rating || 0);
              return (
                <View key={`${r._id || idx}`} style={[styles.revCard, isDark && styles.revCardDark]}>
                  {renderStarRow(rt, 14)}
                  <Text style={[styles.revQuote, { color: isDark ? "#d8cdb8" : KANKREG_PALETTE.inkSoft }]}>
                    {`“${comment || PRODUCT_SCREEN.reviewNoWrittenNote}”`}
                  </Text>
                  <Text style={[styles.revWho, { color: muted }]}>{name}</Text>
                </View>
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
        <SectionReveal immediate delay={500} preset="fade-up" style={styles.sectionBlock}>
          <SectionHeader eyebrow="Catalog" title="You may also like" compact />
          <CatalogGridReveal>
            {relatedProducts.map((item, idx) => {
              const flags = getProductCardFlags(item, PRODUCT_SCREEN.comingSoonNoteFallback);
              return (
              <HomeCatalogGridCard
                key={item.id}
                idx={idx}
                item={item}
                variant="editorial"
                compact={isXs}
                navigation={navigation}
                quantity={getItemQuantity(item.id)}
                styles={relatedGridStyles}
                isOutOfStock={flags.isOutOfStock}
                isComingSoon={flags.isComingSoon}
                comingSoonNote={flags.comingSoonNote}
                onAddToCart={() => onAddRelated(item)}
                onRemoveFromCart={() => onRemoveRelated(item.id)}
              />
            );})}
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
      paddingBottom: HOME_SPACE.lg,
      backgroundColor: isDark ? c.background : "#FFFFFF",
    },
    crumbRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      paddingTop: 20,
      paddingBottom: 6,
      zIndex: 1,
    },
    crumbLink: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: KANKREG_PALETTE.inkFaint,
    },
    crumbSep: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: KANKREG_PALETTE.inkFaint,
    },
    crumbCurrent: {
      flex: 1,
      fontFamily: fonts.medium,
      fontSize: 13,
      color: KANKREG_PALETTE.inkSoft,
    },
    backFab: {
      position: "absolute",
      left: 0,
      zIndex: 6,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(28,25,23,0.88)" : "rgba(255,253,248,0.96)",
      borderWidth: 1,
      borderColor: isDark ? c.border : KANKREG_PALETTE.line,
      ...platformShadow({ web: { boxShadow: "0 8px 24px -8px rgba(25, 20, 15, 0.16)" } }),
    },
    pdp: {
      width: "100%",
      zIndex: 1,
    },
    pdpSplit: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: 48,
      paddingVertical: 14,
    },
    pdpStack: {
      flexDirection: "column",
      gap: 26,
      paddingVertical: 14,
    },
    pdpColGallery: {
      flex: 1.05,
      minWidth: 300,
      maxWidth: "52%",
    },
    pdpColGalleryStack: {
      width: "100%",
    },
    pdpColInfo: {
      flex: 0.95,
      minWidth: 300,
      maxWidth: "48%",
    },
    pdpColInfoStack: {
      width: "100%",
    },
    infoPanel: {
      width: "100%",
      paddingTop: 4,
    },
    gallery: {
      width: "100%",
      gap: 16,
    },
    thumbsWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      width: "100%",
    },
    thumbArrow: {
      width: 32,
      height: 72,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
    },
    thumbsRow: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "nowrap",
      gap: 10,
      overflow: "hidden",
    },
    thumb: {
      width: 76,
      height: 76,
      flexGrow: 0,
      flexShrink: 0,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "rgba(26, 40, 32, 0.12)",
      overflow: "hidden",
      backgroundColor: isDark ? c.surfaceMuted : "#FFFFFF",
      padding: 4,
      ...Platform.select({
        web: {
          transition: "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
          cursor: "pointer",
        },
        default: {},
      }),
    },
    thumbActive: {
      borderColor: KANKREG_PALETTE.green,
      ...platformShadow({ web: { boxShadow: "0 0 0 1px rgba(26, 92, 72, 0.35)" } }),
    },
    thumbImage: { width: "100%", height: "100%", borderRadius: 6 },
    thumbFallback: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.surfaceMuted,
    },
    heroStage: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#1a1410" : "#FFFFFF",
      borderRadius: 0,
      overflow: "hidden",
      position: "relative",
      minHeight: 420,
    },
    heroZoom: {
      position: "absolute",
      top: 12,
      left: 12,
      zIndex: 4,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.92)",
      borderWidth: 1,
      borderColor: "rgba(26, 40, 32, 0.1)",
      alignItems: "center",
      justifyContent: "center",
    },
    heroAnim: { width: "100%", height: "100%" },
    heroImageFrame: {
      width: "100%",
      height: "100%",
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    heroImageInner: {
      width: "100%",
      backgroundColor: "transparent",
    },
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
    heroBadgeBest: {
      position: "absolute",
      top: 18,
      left: 18,
      maxWidth: "60%",
      backgroundColor: KANKREG_PALETTE.green,
      paddingHorizontal: 13,
      paddingVertical: 7,
      borderRadius: 99,
      zIndex: 3,
    },
    heroBadgeBestText: {
      color: "#F4E9C9",
      fontSize: 11,
      fontFamily: fonts.bold,
      letterSpacing: 1,
    },
    richExtras: {
      gap: HOME_SPACE.md,
      borderTopWidth: 1,
      borderTopColor: isDark ? c.border : KANKREG_PALETTE.line,
      paddingTop: 28,
    },
    eyebrow: {
      fontFamily: fonts.bold,
      fontSize: 12,
      letterSpacing: 2.5,
      textTransform: "uppercase",
      color: KANKREG_PALETTE.green,
      marginBottom: 8,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },
    shareBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
    },
    title: {
      flex: 1,
      fontFamily: FONT_HEADING,
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "600",
      letterSpacing: -0.3,
      marginTop: 0,
      marginBottom: 8,
      maxWidth: 560,
    },
    titleMobile: {
      fontSize: 26,
      lineHeight: 32,
    },
    kicker: {
      fontFamily: fonts.medium,
      fontSize: 11,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: KANKREG_PALETTE.inkFaint,
      lineHeight: 16,
      marginBottom: 14,
      maxWidth: 520,
    },
    ratePriceRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
      marginBottom: 16,
    },
    rateRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 6,
      flex: 1,
      minWidth: 160,
      paddingTop: 8,
    },
    rateBold: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: isDark ? "#f5efe4" : KANKREG_PALETTE.ink,
    },
    rateMuted: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: KANKREG_PALETTE.inkFaint,
    },
    priceStack: {
      alignItems: "flex-end",
    },
    priceRowMain: {
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: 8,
    },
    priceNow: {
      fontFamily: FONT_PRICE,
      fontSize: 34,
      fontWeight: "700",
      letterSpacing: -0.6,
    },
    priceWas: {
      fontFamily: fonts.regular,
      fontSize: 16,
      color: KANKREG_PALETTE.inkFaint,
      textDecorationLine: "line-through",
    },
    mrpNote: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: KANKREG_PALETTE.inkFaint,
      marginTop: 2,
    },
    coinsBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: isDark ? "rgba(47, 143, 78, 0.16)" : "#EAF7D8",
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 12,
    },
    coinsIcon: {
      fontSize: 16,
    },
    coinsText: {
      flex: 1,
      fontFamily: fonts.medium,
      fontSize: 13,
      color: KANKREG_PALETTE.greenDeep,
    },
    coinsStrong: {
      fontFamily: fonts.bold,
    },
    bestPriceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    bestPriceText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: "#2F8F4E",
    },
    bestPriceCode: {
      fontFamily: fonts.medium,
      color: KANKREG_PALETTE.inkSoft,
    },
    lead: {
      fontSize: 15.5,
      lineHeight: 25,
      fontFamily: fonts.regular,
      marginTop: 16,
      marginBottom: 4,
      maxWidth: 460,
    },
    optLabel: {
      fontFamily: fonts.semibold,
      fontSize: 14,
      letterSpacing: 0,
      textTransform: "none",
      color: isDark ? "#f5efe4" : KANKREG_PALETTE.ink,
      marginTop: 18,
      marginBottom: 12,
    },
    sizesRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
      flexWrap: "wrap",
    },
    sizesRowStack: {
      flexDirection: "column",
    },
    sizeCard: {
      flexGrow: 1,
      flexBasis: 110,
      minWidth: 108,
      maxWidth: 160,
      borderWidth: 1,
      borderColor: "rgba(26, 40, 32, 0.16)",
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 10,
      alignItems: "flex-start",
      backgroundColor: isDark ? c.surface : "#FFFFFF",
      gap: 4,
    },
    sizeCardDark: {
      borderColor: c.border,
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    sizeCardActive: {
      borderColor: KANKREG_PALETTE.green,
      backgroundColor: "rgba(26, 92, 72, 0.04)",
    },
    sizeLabel: {
      fontFamily: FONT_BODY_SEMIBOLD,
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? "#f5efe4" : KANKREG_PALETTE.ink,
    },
    sizeLabelActive: {
      color: KANKREG_PALETTE.green,
    },
    sizePriceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: 6,
    },
    sizePrice: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: isDark ? "#f5efe4" : KANKREG_PALETTE.ink,
    },
    sizePriceActive: {
      color: KANKREG_PALETTE.green,
    },
    sizeOff: {
      fontFamily: fonts.bold,
      fontSize: 11,
      color: "#2F8F4E",
    },
    sizeWas: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: KANKREG_PALETTE.inkFaint,
      textDecorationLine: "line-through",
    },
    sizeUnit: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: KANKREG_PALETTE.inkFaint,
    },
    sizeTag: {
      fontFamily: fonts.bold,
      fontSize: 10,
      color: KANKREG_PALETTE.goldDeep,
      marginTop: 2,
    },
    buyRow: {
      flexDirection: "row",
      gap: 10,
      alignItems: "stretch",
      flexWrap: "wrap",
      marginTop: 6,
    },
    purchasePanel: {
      marginTop: 20,
      padding: 0,
    },
    purchasePanelDark: {},
    comingSoonPanel: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(199, 154, 58, 0.34)",
    },
    comingSoonPanelDark: {
      borderColor: "rgba(231, 200, 90, 0.28)",
    },
    comingSoonPanelGrad: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      padding: 16,
    },
    comingSoonPanelIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(199, 154, 58, 0.35)",
      backgroundColor: "rgba(255, 252, 246, 0.72)",
    },
    comingSoonPanelCopy: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    comingSoonPanelTitle: {
      fontFamily: FONT_HEADING,
      fontSize: 20,
      letterSpacing: -0.3,
    },
    comingSoonPanelBody: {
      fontFamily: fonts.semibold,
      fontSize: 13,
      lineHeight: 18,
    },
    comingSoonPanelHint: {
      fontFamily: fonts.regular,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 2,
    },
    buyRowStack: {
      flexDirection: "column",
    },
    qtyBox: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(26, 40, 32, 0.18)",
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: isDark ? c.surface : "#FFFFFF",
      height: 48,
    },
    qtyBoxDark: {
      borderColor: c.border,
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    qtyBtn: {
      width: 42,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    qtyBtnText: {
      fontSize: 20,
      color: KANKREG_PALETTE.inkSoft,
      fontFamily: fonts.regular,
    },
    qtyCount: {
      width: 28,
      textAlign: "center",
      fontFamily: FONT_BODY_SEMIBOLD,
      fontWeight: "700",
      fontSize: 15,
    },
    btnCart: {
      flex: 1,
      minWidth: 140,
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 0,
      borderRadius: 999,
      backgroundColor: KANKREG_PALETTE.green,
      paddingHorizontal: 18,
    },
    btnCartIcon: {
      marginTop: 1,
    },
    btnCartText: {
      fontFamily: fonts.bold,
      fontSize: 15,
      color: "#FFFFFF",
      letterSpacing: 0.15,
    },
    btnBuy: {
      flex: 1,
      minWidth: 132,
      minHeight: 48,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: "#F0C419",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    btnBuyInCart: {
      flex: 1,
    },
    btnBuyGrad: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    btnBuyText: {
      fontFamily: fonts.bold,
      fontSize: 15,
      color: "#1A2B22",
      letterSpacing: 0.15,
    },
    btnOutOfStockText: {
      fontFamily: fonts.semibold,
      fontSize: 14,
      color: KANKREG_PALETTE.inkFaint,
      textAlign: "center",
      paddingVertical: 16,
    },
    btnFull: {
      width: "100%",
      flex: undefined,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    descBlock: {
      marginTop: 28,
      paddingTop: 8,
      gap: 10,
    },
    descTitle: {
      fontFamily: fonts.bold,
      fontSize: 13,
      letterSpacing: 0.6,
      color: isDark ? "#f5efe4" : KANKREG_PALETTE.ink,
    },
    descBody: {
      fontFamily: fonts.regular,
      fontSize: 14.5,
      lineHeight: 24,
      maxWidth: 560,
    },
    trustRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 24,
    },
    tchip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: KANKREG_PALETTE.line,
      backgroundColor: isDark ? c.surface : "#FFFEFA",
    },
    tchipDark: {
      borderColor: c.border,
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    tchipText: {
      fontFamily: fonts.semibold,
      fontSize: 12.5,
    },
    delivBox: {
      flexDirection: "row",
      gap: 14,
      marginTop: 18,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: KANKREG_PALETTE.line,
      borderRadius: 14,
      backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#F3EBD8",
      alignItems: "flex-start",
    },
    delivBoxDark: {
      borderColor: c.border,
    },
    delivText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      fontFamily: fonts.regular,
    },
    delivBold: {
      fontFamily: fonts.bold,
    },
    hlList: {
      marginTop: 22,
      gap: 9,
    },
    hlRow: {
      flexDirection: "row",
      gap: 10,
      alignItems: "flex-start",
    },
    hlText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 21,
      fontFamily: fonts.regular,
    },
    secBlock: {
      borderTopWidth: 1,
      borderTopColor: isDark ? c.border : KANKREG_PALETTE.line,
      paddingTop: 46,
      paddingBottom: 10,
    },
    secBlockDark: {},
    secKick: {
      fontFamily: fonts.bold,
      fontSize: 12,
      letterSpacing: 2.5,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    secTitle: {
      fontFamily: FONT_HEADING,
      fontSize: 30,
      fontWeight: "600",
      letterSpacing: -0.4,
      lineHeight: 36,
      marginBottom: 14,
      maxWidth: 640,
    },
    secLegend: {
      fontSize: 15,
      lineHeight: 24,
      fontFamily: fonts.regular,
      maxWidth: 720,
      marginBottom: 8,
    },
    featGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      marginTop: 30,
    },
    featGridDesktop: {},
    featGridTablet: {},
    featGridMobile: {
      flexDirection: "column",
    },
    featCard: {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: isDark ? c.surface : "#FFFEFA",
      borderWidth: 1,
      borderColor: "#F0E8D7",
      borderRadius: 16,
      padding: 18,
      alignItems: "center",
    },
    featCardDark: {
      borderColor: c.border,
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    featCardDesktop: {
      width: "23%",
      minWidth: 140,
    },
    featCardTablet: {
      width: "48%",
      minWidth: 140,
    },
    featCardMobile: {
      width: "100%",
    },
    featIcon: {
      width: 46,
      height: 46,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(31,77,54,0.08)",
      marginBottom: 11,
    },
    featTitle: {
      fontFamily: FONT_HEADING,
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
    },
    featSub: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: KANKREG_PALETTE.inkFaint,
      textAlign: "center",
      marginTop: 3,
    },
    nutriGrid: {
      flexDirection: "row",
      gap: 40,
      alignItems: "flex-start",
      borderTopWidth: 1,
      borderTopColor: isDark ? c.border : KANKREG_PALETTE.line,
      paddingTop: 46,
      paddingBottom: 10,
    },
    nutriGridStack: {
      flexDirection: "column",
    },
    nutriCol: {
      flex: 1.1,
      minWidth: 280,
    },
    nutriTitle: {
      marginBottom: 18,
    },
    ntable: {
      borderWidth: 1,
      borderColor: KANKREG_PALETTE.line,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: isDark ? c.surface : "#FFFEFA",
    },
    ntableDark: {
      borderColor: c.border,
    },
    ntableHead: {
      backgroundColor: KANKREG_PALETTE.green,
      paddingVertical: 14,
      paddingHorizontal: 18,
    },
    ntableHeadTitle: {
      fontFamily: FONT_HEADING,
      fontWeight: "600",
      fontSize: 17,
      color: "#F4E9C9",
    },
    ntableHeadSub: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: "rgba(244,233,201,0.85)",
      marginTop: 2,
    },
    ntableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderBottomWidth: 1,
      borderBottomColor: "#F0E8D7",
    },
    ntableRowDark: {
      borderBottomColor: c.border,
    },
    ntableLabel: {
      fontSize: 14,
      fontFamily: fonts.regular,
    },
    ntableValue: {
      fontFamily: FONT_BODY_SEMIBOLD,
      fontWeight: "600",
      fontSize: 14,
    },
    qrcard: {
      flex: 0.9,
      minWidth: 260,
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F3EBD8",
      borderWidth: 1,
      borderColor: KANKREG_PALETTE.line,
      borderRadius: 18,
      padding: 22,
    },
    qrcardDark: {
      borderColor: c.border,
    },
    qrcardTitle: {
      fontFamily: FONT_HEADING,
      fontWeight: "600",
      fontSize: 19,
    },
    qrcardBody: {
      fontSize: 14,
      lineHeight: 22,
      marginTop: 8,
      fontFamily: fonts.regular,
    },
    miniTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 14,
    },
    miniTag: {
      backgroundColor: "rgba(44,107,74,0.1)",
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 99,
    },
    miniTagText: {
      fontFamily: fonts.bold,
      fontSize: 11.5,
      color: KANKREG_PALETTE.green,
    },
    qrcardFoot: {
      fontSize: 13,
      lineHeight: 20,
      marginTop: 14,
      fontFamily: fonts.regular,
    },
    pullQuote: {
      marginTop: HOME_SPACE.md,
      paddingLeft: HOME_SPACE.md,
      borderLeftWidth: 2,
      borderLeftColor: KANKREG_PALETTE.gold,
      maxWidth: 580,
    },
    pullQuoteDark: {
      borderLeftColor: ALCHEMY.goldBright,
    },
    pullQuoteGlyph: {
      fontFamily: FONT_HEADING,
      fontSize: 36,
      lineHeight: 32,
      marginBottom: -4,
    },
    pullQuoteText: {
      fontFamily: FONT_HEADING,
      fontSize: 20,
      lineHeight: 30,
      fontStyle: "italic",
    },
    pullQuoteLine: { width: "100%", opacity: 0.5 },
    processWrap: {
      marginTop: HOME_SPACE.md,
      gap: HOME_SPACE.sm,
      maxWidth: 640,
    },
    processTitle: {
      fontFamily: fonts.bold,
      fontSize: HOME_TYPE.eyebrow,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    processGrid: { gap: 10 },
    processGridDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    processCard: {
      flex: 1,
      minWidth: 180,
      padding: 14,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: KANKREG_PALETTE.line,
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : KANKREG_PALETTE.card,
      gap: 6,
    },
    processCardDark: {
      borderColor: c.border,
    },
    processBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.pill,
      backgroundColor: "rgba(214, 173, 91, 0.14)",
    },
    processBadgeText: {
      fontFamily: fonts.bold,
      fontSize: 10,
      letterSpacing: 0.8,
      color: KANKREG_PALETTE.goldDeep,
    },
    processCardText: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 21,
    },
    processCardMeta: {
      fontFamily: fonts.regular,
      fontSize: 11,
    },
    lifestyleWrap: {
      marginTop: HOME_SPACE.lg,
      borderRadius: radius.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: KANKREG_PALETTE.line,
    },
    lifestyleImage: {
      width: "100%",
      height: 220,
      maxHeight: 220,
      backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt,
    },
    usageWrap: {
      marginTop: HOME_SPACE.lg,
      gap: HOME_SPACE.sm,
    },
    usageEyebrow: {
      fontFamily: fonts.bold,
      fontSize: HOME_TYPE.eyebrow,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    usageGrid: { gap: 12 },
    usageGridDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    usageCard: {
      flex: 1,
      minWidth: 200,
      padding: 16,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: KANKREG_PALETTE.line,
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#FFFEFA",
      gap: 6,
    },
    usageCardDark: {
      borderColor: c.border,
    },
    usageIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(31,77,54,0.08)",
    },
    usageTitle: {
      fontFamily: FONT_HEADING,
      fontSize: 16,
      fontWeight: "600",
    },
    usageBody: {
      fontFamily: fonts.regular,
      fontSize: 13,
      lineHeight: 20,
    },
    sectionBlock: {
      marginTop: spacing.xl,
      width: "100%",
    },
    reviewsPanel: {
      borderTopWidth: 1,
      borderTopColor: isDark ? c.border : KANKREG_PALETTE.line,
      paddingTop: 36,
      paddingBottom: 8,
    },
    reviewsPanelDark: {},
    revTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 26,
      flexWrap: "wrap",
      marginTop: 8,
      marginBottom: 8,
    },
    revBig: {
      fontFamily: FONT_PRICE,
      fontWeight: "700",
      fontSize: 52,
      lineHeight: 52,
    },
    revTopMeta: {
      fontSize: 14,
      marginTop: 6,
      fontFamily: fonts.regular,
    },
    bannerWrap: { marginBottom: spacing.sm },
    revCards: { gap: 16, marginTop: 24, marginBottom: spacing.md },
    revCardsDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    revCard: {
      flex: 1,
      minWidth: 220,
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#F0E8D7",
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#FFFEFA",
      gap: 6,
    },
    revCardDark: {
      borderColor: c.border,
    },
    revQuote: {
      fontSize: 14,
      lineHeight: 22,
      fontFamily: fonts.regular,
      marginTop: 6,
    },
    revWho: {
      fontSize: 12.5,
      fontFamily: fonts.semibold,
      marginTop: 4,
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
