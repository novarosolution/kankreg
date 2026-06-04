import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";

import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import { getProductById, getProductReviews, submitProductReview } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  customerPanel,
  customerScrollFill,
  customerScrollPaddingTop} from "../theme/screenLayout";
import { fonts, icon as sz, layout, lineHeight, radius, semanticRadius, spacing, typography } from "../theme/tokens";
import { platformShadow } from "../theme/shadowPlatform";
import { formatINR } from "../utils/currency";
import { getImageUriCandidates, PRODUCT_HERO_BLURHASH } from "../utils/image";
import { matchesShelfProduct } from "../utils/shelfMatch";
import { productToCartLine } from "../utils/productCart";
import { ALCHEMY, FONT_DISPLAY, FONT_DISPLAY_SEMI } from "../theme/customerAlchemy";
import { PRODUCT_SCREEN, fillProductScreen } from "../content/appContent";
import PremiumLoader from "../components/ui/PremiumLoader";
import PremiumEmptyState from "../components/ui/PremiumEmptyState";
import PremiumInput from "../components/ui/PremiumInput";
import PremiumErrorBanner from "../components/ui/PremiumErrorBanner";
import PremiumButton from "../components/ui/PremiumButton";
import PremiumChip from "../components/ui/PremiumChip";
import KankregBuyBar from "../components/kankreg/KankregBuyBar";
import PremiumSectionHeader from "../components/ui/PremiumSectionHeader";
import PremiumCard from "../components/ui/PremiumCard";
import GoldHairline from "../components/ui/GoldHairline";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import HeroParallax from "../components/motion/HeroParallax";
import SectionReveal from "../components/motion/SectionReveal";
import { useKankregLayout } from "../theme/kankregBreakpoints";

export default function ProductScreen({ route, navigation }) {
  const { productId } = route.params ?? {};
  const { colors: c, shadowPremium, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createProductStyles(c, shadowPremium, isDark), [c, shadowPremium, isDark]);
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const { isAuthenticated, token } = useAuth();
  const { width, useProductSplit } = useKankregLayout();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageCandidateIndex, setImageCandidateIndex] = useState(0);
  const [selectedVariantLabel, setSelectedVariantLabel] = useState("");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const shellRef = useRef(null);
  const heroRef = useRef(null);
  const reviewRef = useRef(null);
  const stickyShownRef = useRef(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const item = await getProductById(productId);
        setProduct(item);
        if (Platform.OS === "web" && productId && typeof globalThis.sessionStorage !== "undefined") {
          globalThis.sessionStorage.setItem("kankreg:lastProductId", String(productId));
        }
        try {
          const reviewPayload = await getProductReviews(productId);
          setReviews(reviewPayload.reviews || []);
        } catch {
          setReviews([]);
        }
        setSelectedImage(item?.image || "");
        const vars = Array.isArray(item?.variants) ? item.variants : [];
        setSelectedVariantLabel(vars[0]?.label ? String(vars[0].label) : "");
      } catch (err) {
        setError(err.message || PRODUCT_SCREEN.loadErrorFallback);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  // Reveal motion now lives on `SectionReveal` blocks below; this effect was a bespoke
  // GSAP intro that is replaced by the unified motion primitives.

  /** Prefer `images[]`; always include primary `image` so gallery + hero URLs stay in sync. */
  const galleryImages = useMemo(() => {
    const imgs = Array.isArray(product?.images) ? product.images.map((u) => String(u || "").trim()).filter(Boolean) : [];
    const primary = product?.image ? String(product.image).trim() : "";
    if (primary && !imgs.includes(primary)) imgs.unshift(primary);
    return imgs;
  }, [product]);
  const selectedImageUris = useMemo(
    () => getImageUriCandidates(selectedImage || product?.image),
    [selectedImage, product?.image]
  );
  const selectedImageUri = selectedImageUris[imageCandidateIndex] || "";
  const imageFailed = selectedImageUris.length === 0 || imageCandidateIndex >= selectedImageUris.length;

  useEffect(() => {
    setImageCandidateIndex(0);
  }, [selectedImage, product?.image]);

  const shelfMatch = useMemo(
    () => (product ? matchesShelfProduct(product) : false),
    [product]
  );

  const cartLine = useMemo(
    () => (product ? productToCartLine(product, selectedVariantLabel) : null),
    [product, selectedVariantLabel]
  );


  if (loading) {
    return (
      <CustomerScreenShell style={styles.screen}>
        <LinearGradient
          colors={
            isDark
              ? ["rgba(28, 25, 23, 0.95)", "rgba(15, 23, 42, 0.92)", "rgba(20, 83, 45, 0.12)"]
              : [ALCHEMY.pearl, ALCHEMY.cream, "rgba(237, 228, 212, 0.55)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingSkeletonInner}>
            <SkeletonBlock width="100%" height={260} rounded="xl" />
            <View style={styles.loadingThumbRow}>
              <SkeletonBlock width={56} height={56} rounded="md" />
              <SkeletonBlock width={56} height={56} rounded="md" />
              <SkeletonBlock width={56} height={56} rounded="md" />
              <SkeletonBlock width={56} height={56} rounded="md" />
            </View>
            <View style={styles.loadingTextStack}>
              <SkeletonBlock width="38%" height={12} rounded="sm" />
              <SkeletonBlock width="76%" height={26} rounded="md" />
              <SkeletonBlock width="56%" height={20} rounded="md" />
              <SkeletonBlock width="100%" height={14} rounded="sm" />
              <SkeletonBlock width="92%" height={14} rounded="sm" />
              <SkeletonBlock width="80%" height={14} rounded="sm" />
            </View>
            <View style={styles.loadingChipRow}>
              <SkeletonBlock width={64} height={32} rounded="pill" />
              <SkeletonBlock width={64} height={32} rounded="pill" />
              <SkeletonBlock width={64} height={32} rounded="pill" />
            </View>
            <SkeletonBlock width="100%" height={50} rounded="pill" />
            <PremiumLoader size="sm" caption={PRODUCT_SCREEN.loadingCaption} />
          </View>
        </LinearGradient>
      </CustomerScreenShell>
    );
  }

  if (!product) {
    return (
      <CustomerScreenShell style={styles.screen}>
        <View style={styles.centered}>
          <PremiumEmptyState
            iconName="alert-circle-outline"
            title={PRODUCT_SCREEN.notFoundTitle}
            description={error || PRODUCT_SCREEN.notFoundDescriptionFallback}
            ctaLabel={PRODUCT_SCREEN.backToHomeCta}
            ctaIconLeft="arrow-back-outline"
            onCtaPress={() => navigation.navigate("Home")}
          />
        </View>
      </CustomerScreenShell>
    );
  }

  const handleAddToCart = () => {
    if (product.inStock === false || Number(product.stockQty || 0) <= 0) {
      return;
    }
    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }
    if (!cartLine) return;
    addToCart(cartLine);
  };

  const handleRemoveFromCart = () => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }
    removeFromCart(product.id, cartLine?.variantLabel ?? "");
  };

  const quantity = getItemQuantity(product.id, cartLine?.variantLabel ?? "");
  const heroImageHeight = Math.min(380, Math.max(260, Math.round(width * 0.72)));
  const storySubtitleOptional = String(PRODUCT_SCREEN.storySubtitle ?? "").trim() || undefined;
  const variantSubtitleOptional = String(PRODUCT_SCREEN.variantSubtitle ?? "").trim() || undefined;
  const isOutOfStock = product.inStock === false || Number(product.stockQty || 0) <= 0;
  const displayPrice = cartLine ? cartLine.price : product.price;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const ratingAvg = Number(product.ratingAverage) || 0;
  const reviewCt = Number(product.reviewCount) || 0;
  const liveReviewCount = reviews.length > 0 ? reviews.length : reviewCt;
  const liveRatingAvg =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / Math.max(1, reviews.length)
      : ratingAvg;
  const reviewCountDisplay = Math.max(liveReviewCount, (reviews || []).length);
  const mrp = product.mrp != null ? Number(product.mrp) : null;
  const showMrp = mrp != null && mrp > displayPrice;
  const offPct =
    showMrp && mrp > 0 ? Math.max(0, Math.round((1 - Number(displayPrice) / mrp) * 100)) : null;
  /** Hero pills already cover stock / ship; facts only add unit + eta. */
  const compactFacts = [
    {
      key: "unit",
      icon: "cube-outline",
      label: product.unit || PRODUCT_SCREEN.unitFallback,
      tone: "neutral"},
    ...(product.eta
      ? [
          {
            key: "note",
            icon: "information-circle-outline",
            label: String(product.eta),
            tone: "neutral"},
        ]
      : []),
  ];

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }
    if (!token) return;
    if (reviewRating < 1 || reviewRating > 5) {
      setError(PRODUCT_SCREEN.reviewRatingError);
      return;
    }
    try {
      setReviewBusy(true);
      setError("");
      setReviewSuccess("");
      const payload = await submitProductReview(token, product.id, {
        rating: reviewRating,
        comment: reviewComment});
      setReviews(payload.reviews || []);
      setReviewComment("");
      setReviewRating(0);
      setReviewSuccess(PRODUCT_SCREEN.reviewSubmitSuccess);
      setProduct((current) =>
        current
          ? {
              ...current,
              ratingAverage: payload.ratingAverage,
              reviewCount: payload.reviewCount}
          : current
      );
    } catch (err) {
      setError(err.message || PRODUCT_SCREEN.reviewSubmitErrorFallback);
    } finally {
      setReviewBusy(false);
    }
  };

  const onProductScrollJS = (y) => {
    const shouldShow = stickyShownRef.current ? y > 200 : y > 240;
    if (shouldShow === stickyShownRef.current) return;
    stickyShownRef.current = shouldShow;
    setShowStickyCta(shouldShow);
  };
  return (
    <CustomerScreenShell style={styles.screen}>
      <KankregScrollPage
        scrollVariant="inner"
        style={customerScrollFill}
        contentContainerStyle={{
          paddingTop: customerScrollPaddingTop(insets, { nativeMin: spacing.xs })}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollJS={onProductScrollJS}
      >
        {product?.name ? (
          <Text style={styles.breadcrumb} numberOfLines={2}>
            Shop · {String(product.category || "Catalog").trim()} · {product.name}
          </Text>
        ) : null}
        <View
          ref={shellRef}
          style={[
            styles.container,
            shelfMatch ? styles.containerShelfMatch : null,
            useProductSplit
              ? { flexDirection: "row", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }
              : null,
          ]}
        >
        <View style={useProductSplit ? styles.pdColLeft : null}>
        <HeroParallax
          strength="medium"
          maxScroll={400}
          dim={false}
          scale
          style={styles.heroWrap}
        >
          <View ref={heroRef}>
            <TouchableOpacity
              style={[styles.backFab, { top: Math.max(insets.top, spacing.sm) }]}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="chevron-back" size={sz.lg} color={isDark ? c.textPrimary : ALCHEMY.brown} />
            </TouchableOpacity>
            <View style={[styles.heroImageStage, { height: heroImageHeight }]}>
              {selectedImageUri && !imageFailed ? (
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.heroImage}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                  placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
                  onError={() => setImageCandidateIndex((index) => index + 1)}
                />
              ) : (
                <View style={styles.imageFallback}>
                  <Ionicons name="image-outline" size={sz.xxl} color={c.textMuted} />
                  <Text style={styles.imageFallbackText}>{PRODUCT_SCREEN.heroImageUnavailable}</Text>
                </View>
              )}
              <LinearGradient
                colors={
                  isDark
                    ? ["transparent", "rgba(12, 10, 8, 0.08)", "rgba(12, 10, 8, 0.72)"]
                    : ["transparent", "rgba(255, 253, 248, 0.2)", "rgba(255, 253, 248, 0.92)"]
                }
                locations={[0, 0.42, 1]}
                style={[styles.heroVignette, { pointerEvents: "none" }]}
              />
            </View>
            <View style={styles.heroTopRow}>
              <View style={styles.heroTopSpacer} />
              <View style={[styles.heroChip, isOutOfStock ? styles.stockChipDanger : styles.stockChipSuccess]}>
                <Ionicons
                  name={isOutOfStock ? "close-circle-outline" : "checkmark-circle-outline"}
                  size={sz.tiny}
                  color={isOutOfStock ? c.danger : c.success}
                />
                <Text style={[styles.heroChipText, isOutOfStock ? styles.stockTextDanger : styles.stockTextSuccess]}>
                  {isOutOfStock ? PRODUCT_SCREEN.heroOutOfStock : PRODUCT_SCREEN.heroInStock}
                </Text>
              </View>
            </View>
            {product.badgeText ? (
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText} numberOfLines={2}>
                  {String(product.badgeText).toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        </HeroParallax>
        {galleryImages.length > 1 ? (
          <View style={styles.galleryStrip}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryRow}
            >
              {galleryImages.map((img) => (
                <TouchableOpacity
                  key={img}
                  style={[
                    styles.thumbWrap,
                    (selectedImage || product.image) === img ? styles.thumbWrapActive : null,
                  ]}
                  onPress={() => {
                    setSelectedImage(img);
                  }}
                >
                  <RetryImage sourceUri={img} style={styles.thumbImage} styles={styles} c={c} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
        </View>
        <SectionReveal
          delay={120}
          preset="fade-up"
          style={[styles.contentSheet, useProductSplit && styles.pdColRight]}
        >
        <View style={[styles.contentSheetAccent, { backgroundColor: isDark ? "rgba(232, 200, 90, 0.65)" : ALCHEMY.gold }]} />
        <View style={styles.content}>
          <View style={styles.contentMax}>
          <View style={styles.titleBlock}>
            <Text style={styles.categoryText}>{product.category || PRODUCT_SCREEN.categoryFallback}</Text>
            <Text style={styles.name}>{product.name}</Text>
          </View>

          <View style={styles.heroMetaRow}>
            <View style={[styles.heroMetaPill, styles.heroMetaRatingPill]}>
              <Ionicons name="star" size={sz.tiny} color={ALCHEMY.gold} />
              <Text style={styles.heroMetaPillText}>
                {liveRatingAvg > 0
                  ? fillProductScreen(PRODUCT_SCREEN.metaRatingSummary, {
                      rating: liveRatingAvg.toFixed(1),
                      count: String(reviewCountDisplay)})
                  : PRODUCT_SCREEN.metaNoRatings}
              </Text>
            </View>
            <View style={[styles.heroMetaPill, isOutOfStock ? styles.heroMetaPillDanger : styles.heroMetaPillOk]}>
              <Ionicons
                name={isOutOfStock ? "close-circle-outline" : "checkmark-circle-outline"}
                size={sz.tiny}
                color={isOutOfStock ? c.danger : c.success}
              />
              <Text
                style={[
                  styles.heroMetaPillText,
                  isOutOfStock ? styles.heroMetaPillTextDanger : styles.heroMetaPillTextOk,
                ]}
              >
                {isOutOfStock ? PRODUCT_SCREEN.metaOutOfStockShort : PRODUCT_SCREEN.metaReadyToShip}
              </Text>
            </View>
          </View>

          <View style={[styles.priceBand, isDark ? styles.priceBandDark : styles.priceBandLight]}>
            <View style={styles.priceBlock}>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{formatINR(displayPrice)}</Text>
                {showMrp ? <Text style={styles.mrpStrike}>{formatINR(mrp)}</Text> : null}
                <Text style={styles.unitText}>/{product.unit || PRODUCT_SCREEN.unitFallback}</Text>
              </View>
              {offPct != null && offPct > 0 ? (
                <View style={[styles.saveChip, { borderColor: isDark ? c.secondary : ALCHEMY.pillInactive }]}>
                  <Ionicons name="pricetag" size={sz.tiny} color={c.secondaryDark} />
                  <Text style={[styles.saveChipText, { color: c.secondaryDark }]}>
                    {fillProductScreen(PRODUCT_SCREEN.savePctChip, { pct: String(offPct) })}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <GoldHairline marginVertical={spacing.sm} />

          <PremiumCard variant="muted" padding="md" style={styles.storyCard}>
            <PremiumSectionHeader
              compact
              overline={PRODUCT_SCREEN.storyOverline}
              title={PRODUCT_SCREEN.storyTitle}
              subtitle={storySubtitleOptional}
            />
            <Text style={[styles.description, styles.descriptionBelowHeader]}>
              {product.description || PRODUCT_SCREEN.defaultDescription}
            </Text>
          </PremiumCard>

          {variants.length > 0 ? (
            <View style={styles.variantBlock}>
              <PremiumSectionHeader
                compact
                overline={PRODUCT_SCREEN.variantOverline}
                title={PRODUCT_SCREEN.variantTitle}
                subtitle={variantSubtitleOptional}
              />
              <View style={[styles.variantPills, styles.variantPillsBelowHeader]}>
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
                      onPress={() => setSelectedVariantLabel(lab)}
                    />
                  );
                })}
              </View>
            </View>
          ) : null}

          {quantity > 0 && !isOutOfStock ? (
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepButton} activeOpacity={0.85} onPress={handleRemoveFromCart}>
                <Ionicons name="remove" size={sz.md} color={c.onPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepCount}>
                {fillProductScreen(PRODUCT_SCREEN.inCartCount, { count: String(quantity) })}
              </Text>
              <TouchableOpacity style={styles.stepButton} activeOpacity={0.85} onPress={handleAddToCart}>
                <Ionicons name="add" size={sz.md} color={c.onPrimary} />
              </TouchableOpacity>
            </View>
          ) : (
            <PremiumButton
              label={isOutOfStock ? PRODUCT_SCREEN.outOfStock : PRODUCT_SCREEN.addToCart}
              variant="primary"
              size="lg"
              fullWidth
              iconLeft={isOutOfStock ? "close-circle-outline" : "bag-add-outline"}
              disabled={isOutOfStock}
              onPress={handleAddToCart}
              accessibilityLabel={
                isOutOfStock ? PRODUCT_SCREEN.productOutOfStockA11y : PRODUCT_SCREEN.addToCartA11y
              }
            />
          )}

          {compactFacts.length > 0 ? (
            <View style={styles.quickFactsWrap}>
              {compactFacts.map((fact) => (
                <View key={fact.key} style={styles.quickFactPill}>
                  <Ionicons name={fact.icon} size={sz.xs} color={c.textSecondary} />
                  <Text style={styles.quickFactText} numberOfLines={1}>
                    {fact.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <GoldHairline marginVertical={spacing.md} />

          <View ref={reviewRef} style={styles.reviewCard}>
            <PremiumSectionHeader
              compact
              overline={PRODUCT_SCREEN.reviewsOverline}
              title={PRODUCT_SCREEN.reviewsTitle}
              subtitle={reviewCountDisplay === 0 ? PRODUCT_SCREEN.reviewsEmptySubtitle : undefined}
              count={reviewCountDisplay > 0 ? reviewCountDisplay : undefined}
            />

            {error ? (
              <View style={styles.reviewBannerWrap}>
                <PremiumErrorBanner severity="error" message={error} compact />
              </View>
            ) : null}
            {reviewSuccess ? (
              <View style={styles.reviewBannerWrap}>
                <PremiumErrorBanner severity="success" message={reviewSuccess} compact />
              </View>
            ) : null}

            <View style={[styles.reviewComposer, isDark ? styles.reviewComposerDark : styles.reviewComposerLight]}>
              <View style={styles.reviewStarsPickRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => setReviewRating(value)}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                    style={[
                      styles.reviewStarHit,
                      reviewRating === value ? styles.reviewStarHitActive : null,
                    ]}
                  >
                    <Ionicons
                      name={value <= reviewRating ? "star" : "star-outline"}
                      size={22}
                      color={value <= reviewRating ? ALCHEMY.gold : c.textMuted}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.reviewInputWrap}>
                <PremiumInput
                  label={PRODUCT_SCREEN.reviewComposerNoteLabel}
                  value={reviewComment}
                  onChangeText={setReviewComment}
                  placeholder={PRODUCT_SCREEN.reviewComposerPlaceholder}
                  accessibilityLabel={PRODUCT_SCREEN.reviewComposerA11y}
                  multiline
                  numberOfLines={3}
                  iconLeft="chatbubble-outline"
                />
              </View>
              <PremiumButton
                label={reviewBusy ? PRODUCT_SCREEN.reviewPosting : PRODUCT_SCREEN.reviewPost}
                variant="primary"
                size="sm"
                loading={reviewBusy}
                disabled={reviewBusy}
                onPress={handleSubmitReview}
                style={styles.reviewSubmitBtn}
              />
            </View>

            {(reviews || []).length > 0 ? (
              <>
                {String(PRODUCT_SCREEN.reviewListLatest ?? "").trim() ? (
                  <Text style={styles.reviewListLabel}>{PRODUCT_SCREEN.reviewListLatest}</Text>
                ) : null}
                <View style={styles.reviewList}>
                  {(reviews || []).slice(0, 5).map((r, idx) => {
                    const name = String(r.userName || "Customer").trim() || "Customer";
                    const initial = name.charAt(0).toUpperCase();
                    const comment = String(r.comment || "").trim();
                    const rt = Number(r.rating || 0);
                    return (
                      <View key={`${r._id || idx}`} style={styles.reviewItem}>
                        <View style={[styles.reviewAvatar, { backgroundColor: c.primarySoft, borderColor: c.primaryBorder }]}>
                          <Text style={[styles.reviewAvatarText, { color: c.primaryDark }]}>{initial}</Text>
                        </View>
                        <View style={styles.reviewItemBody}>
                          <View style={styles.reviewItemTop}>
                            <Text style={styles.reviewUser} numberOfLines={1}>
                              {name}
                            </Text>
                            <View style={styles.reviewRatingPill}>
                              <Ionicons name="star" size={11} color={ALCHEMY.gold} />
                              <Text style={styles.reviewRatingPillText}>{rt}</Text>
                            </View>
                          </View>
                          {comment ? (
                            <Text style={styles.reviewComment} numberOfLines={4}>
                              {comment}
                            </Text>
                          ) : (
                            <Text style={styles.reviewNoComment}>{PRODUCT_SCREEN.reviewNoWrittenNote}</Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : String(PRODUCT_SCREEN.reviewFirstHint ?? "").trim() ? (
              <Text style={styles.reviewEmptyHint}>{PRODUCT_SCREEN.reviewFirstHint}</Text>
            ) : null}
          </View>
          </View>

        </View>
        </SectionReveal>
        </View>
</KankregScrollPage>
      <KankregBuyBar
        visible={showStickyCta && !isOutOfStock}
        productName={product.name}
        price={displayPrice}
        onAddToCart={handleAddToCart}
        onBuyNow={() => {
          handleAddToCart();
          if (isAuthenticated) navigation.navigate("Checkout");
          else navigation.navigate("Login");
        }}
      />
      <BottomNavBar />
    </CustomerScreenShell>
  );
}

function createProductStyles(c, shadowPremium, isDark) {
  const panelLift = platformShadow({
    web: {
      boxShadow: isDark
        ? "0 14px 44px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05)"
        : "0 12px 36px rgba(61, 42, 18, 0.07), 0 4px 14px rgba(28, 25, 23, 0.04), inset 0 1px 0 rgba(255,253,251,0.92)"},
    ios: {
      shadowColor: "#3D2A12",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.28 : 0.08,
      shadowRadius: 22},
    android: { elevation: isDark ? 6 : 5 }});

  const moduleShadow = platformShadow({
    web: {
      boxShadow: isDark
        ? "0 10px 28px rgba(0,0,0,0.22)"
        : "0 6px 18px rgba(28, 25, 23, 0.06), 0 1px 4px rgba(28, 25, 23, 0.035)"},
    ios: {
      shadowColor: "#3D2A12",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.18 : 0.06,
      shadowRadius: 10},
    android: { elevation: isDark ? 2 : 1 }});

  return StyleSheet.create({
  breadcrumb: {
    fontSize: 13,
    color: c.textMuted,
    marginBottom: spacing.lg,
    fontFamily: fonts.medium},
  screen: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    maxWidth: Platform.select({ web: layout.maxContentWidth + 96, default: "100%" })},
  container: {
    ...customerPanel(c, shadowPremium, isDark),
    overflow: "hidden",
    padding: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: isDark ? "rgba(232, 200, 90, 0.35)" : "rgba(201, 162, 39, 0.42)",
    ...panelLift},
  /** Accent top edge when product matches home shelf (e.g. Ghee). */
  containerShelfMatch: {
    borderTopColor: c.secondary},
  heroImageStage: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDark ? "#1C1917" : ALCHEMY.creamAlt,
    position: "relative",
    ...Platform.select({
      web: {
        minHeight: 360},
      default: {}})},
  heroVignette: {
    ...StyleSheet.absoluteFillObject},
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent"},
  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDark ? "#1C1917" : ALCHEMY.creamAlt,
    alignItems: "center",
    justifyContent: "center",
    gap: 8},
  imageFallbackText: {
    color: c.textSecondary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold},
  pdColLeft: {
    flex: 1,
    minWidth: 280,
    maxWidth: Platform.OS === "web" ? "52%" : "100%",
  },
  pdColRight: {
    flex: 1,
    minWidth: 280,
    maxWidth: Platform.OS === "web" ? "48%" : "100%",
  },
  heroWrap: {
    position: "relative",
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    overflow: "hidden",
    ...Platform.select({
      web: {
        isolation: "isolate"},
      default: {}})},
  heroTopSpacer: {
    flex: 1},
  backFab: {
    position: "absolute",
    left: spacing.sm,
    zIndex: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isDark ? c.surfaceMuted : "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: c.border,
    ...platformShadow({
      web: { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    })},
  heroTopRow: {
    position: "absolute",
    top: spacing.sm,
    left: 52,
    right: spacing.sm,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.xs,
    zIndex: 3},
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: isDark ? "rgba(32, 28, 24, 0.88)" : "rgba(255,255,255,0.92)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.95)",
    ...Platform.select({
      web: {
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)"},
      default: {}})},
  heroChipText: {
    color: c.textPrimary,
    fontSize: typography.caption,
    fontFamily: fonts.bold},
  stockChipSuccess: {
    backgroundColor: isDark ? "rgba(22, 163, 74, 0.18)" : "rgba(236,253,245,0.94)",
    borderColor: isDark ? "rgba(74, 222, 128, 0.35)" : "rgba(187,247,208,0.95)"},
  stockChipDanger: {
    backgroundColor: isDark ? "rgba(220, 38, 38, 0.2)" : "rgba(254,242,242,0.94)",
    borderColor: isDark ? "rgba(252, 165, 165, 0.45)" : "rgba(254,202,202,0.95)"},
  stockTextSuccess: {
    color: c.success},
  stockTextDanger: {
    color: c.danger},
  galleryStrip: {
    marginTop: -8,
    marginHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    zIndex: 2,
    borderRadius: radius.xl,
    backgroundColor: isDark ? "rgba(28, 25, 23, 0.72)" : "rgba(255, 253, 248, 0.88)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(116, 79, 28, 0.12)",
    ...Platform.select({
      web: {
        maxWidth: "100%",
        alignSelf: "center",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"},
      default: {}})},
  galleryRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
    alignItems: "center"},
  thumbWrap: {
    width: 68,
    height: 68,
    borderRadius: radius.lg + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : "rgba(116, 79, 28, 0.22)",
    overflow: "hidden",
    backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt},
  thumbWrapActive: {
    borderColor: ALCHEMY.gold,
    borderWidth: 3,
    ...platformShadow({
      web: { boxShadow: "0 4px 12px rgba(201, 162, 39, 0.28)" },
      ios: {
        shadowColor: ALCHEMY.gold,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 5},
      android: { elevation: 3 }})},
  thumbImage: {
    width: "100%",
    height: "100%"},
  thumbImageFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.surfaceMuted},
  contentSheetAccent: {
    height: 3,
    width: "100%",
    opacity: 0.9},
  contentSheet: {
    marginTop: -20,
    paddingTop: 0,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: isDark ? c.surface : ALCHEMY.pearl,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    ...platformShadow({
      web: {
        boxShadow: isDark
          ? "0 -12px 40px rgba(0,0,0,0.35)"
          : "0 -10px 36px rgba(61, 42, 18, 0.06), 0 -2px 12px rgba(28, 25, 23, 0.04)"},
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0.35 : 0.06,
        shadowRadius: 14},
      android: { elevation: 0 }}),
    ...Platform.select({
      web: {
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl},
      default: {}})},
  content: {
    paddingHorizontal: spacing.md + 2,
    paddingTop: spacing.md + 4,
    paddingBottom: spacing.lg,
    ...Platform.select({
      web: {
        paddingHorizontal: spacing.lg + 6},
      default: {}})},
  contentMax: {
    width: "100%",
    ...Platform.select({
      web: {
        maxWidth: 960,
        alignSelf: "center"},
      default: {}})},
  titleBlock: {
    marginBottom: spacing.xs},
  heroMetaRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs},
  heroMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : ALCHEMY.pillInactive,
    backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt},
  heroMetaRatingPill: {
    borderColor: isDark ? c.primaryBorder : "rgba(201, 162, 39, 0.3)",
    backgroundColor: isDark ? "rgba(201, 162, 39, 0.12)" : ALCHEMY.goldSoft},
  heroMetaPillOk: {
    borderColor: isDark ? c.secondaryBorder : "rgba(16, 185, 129, 0.28)",
    backgroundColor: isDark ? c.secondarySoft : "rgba(236, 253, 245, 0.9)"},
  heroMetaPillDanger: {
    borderColor: isDark ? c.danger : "rgba(239, 68, 68, 0.35)",
    backgroundColor: isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(254, 242, 242, 0.92)"},
  heroMetaPillText: {
    fontSize: typography.caption,
    fontFamily: fonts.semibold,
    color: c.textSecondary},
  heroMetaPillTextOk: {
    color: c.success,
    fontFamily: fonts.bold},
  heroMetaPillTextDanger: {
    color: c.danger,
    fontFamily: fonts.bold},
  name: {
    fontSize: typography.h1,
    lineHeight: lineHeight.h1,
    fontFamily: FONT_DISPLAY,
    color: c.textPrimary,
    letterSpacing: Platform.OS === "web" ? -0.55 : -0.42,
    marginTop: 2},
  categoryText: {
    fontSize: typography.overline + 1,
    fontFamily: fonts.extrabold,
    color: isDark ? ALCHEMY.goldBright : ALCHEMY.brown,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1.4},
  priceBand: {
    marginTop: spacing.md,
    borderRadius: radius.xl + 2,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 2},
  priceBandLight: {
    backgroundColor: isDark ? c.surfaceMuted : "rgba(255, 253, 249, 0.96)",
    borderColor: isDark ? c.border : ALCHEMY.pillInactive,
    borderLeftWidth: 3,
    borderLeftColor: ALCHEMY.gold,
    borderTopColor: "rgba(201, 162, 39, 0.6)"},
  priceBandDark: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: c.border,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(232, 200, 90, 0.65)",
    borderTopColor: "rgba(232, 200, 90, 0.38)"},
  priceBlock: {
    marginTop: 0,
    gap: spacing.sm},
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 8},
  saveChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: isDark ? "rgba(22, 163, 74, 0.12)" : "rgba(236, 253, 245, 0.85)"},
  saveChipText: {
    fontSize: typography.caption,
    fontFamily: fonts.extrabold,
    letterSpacing: 0.25},
  price: {
    fontSize: typography.h2 + 2,
    fontFamily: fonts.extrabold,
    color: c.textPrimary,
    letterSpacing: -0.35},
  unitText: {
    fontSize: typography.bodySmall,
    fontFamily: fonts.regular,
    color: c.textSecondary,
    marginBottom: 3},
  storyCard: {
    marginTop: spacing.lg,
    borderRadius: semanticRadius.card},
  descriptionBelowHeader: {
    marginTop: spacing.sm},
  description: {
    marginBottom: 0,
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: c.textSecondary,
    lineHeight: 22},
  variantPillsBelowHeader: {
    marginTop: spacing.sm},
  quickFactsWrap: {
    marginTop: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs},
  quickFactPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "100%",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm - 1,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : ALCHEMY.pillInactive,
    backgroundColor: isDark ? c.surfaceMuted : ALCHEMY.creamAlt},
  quickFactText: {
    fontSize: typography.caption,
    fontFamily: fonts.semibold,
    color: c.textSecondary,
    flexShrink: 1},
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,252,248,0.25)",
    ...Platform.select({
      web: { boxShadow: "0 8px 20px rgba(45, 29, 11, 0.35)" },
      default: {}})},
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: fonts.extrabold,
    letterSpacing: 0.6},
  mrpStrike: {
    fontSize: typography.body,
    fontFamily: fonts.semibold,
    color: c.textMuted,
    textDecorationLine: "line-through",
    marginBottom: 3},
  variantBlock: {
    marginTop: spacing.lg},
  variantPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm},
  stickyCtaShell: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 20,
    ...Platform.select({
      web: {
        alignItems: "center"},
      default: {}})},
  stickyPriceCol: {
    flex: 1,
    minWidth: 0},
  stickyCtaCol: {
    flexShrink: 0,
    minWidth: 160},
  stickyPriceLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8},
  stickyPrice: {
    fontSize: typography.h2,
    fontFamily: fonts.bold,
    fontVariant: ["tabular-nums"]},
  stepper: {
    marginTop: spacing.md,
    backgroundColor: isDark ? c.primaryDark : ALCHEMY.brown,
    borderRadius: semanticRadius.full,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm + 2,
    ...Platform.select({
      web: {
        boxShadow: isDark
          ? "0 10px 24px rgba(0,0,0,0.35)"
          : "0 10px 22px rgba(61, 42, 18, 0.22)"},
      ios: {
        shadowColor: "#3D2A12",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 10},
      android: { elevation: 4 }})},
  stepButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center"},
  stepCount: {
    color: c.onPrimary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.bold,
    letterSpacing: 0.2},
  reviewCard: {
    marginTop: spacing.md + 2,
    borderRadius: radius.xl + 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : ALCHEMY.pillInactive,
    borderLeftWidth: 3,
    borderLeftColor: isDark ? "rgba(232, 200, 90, 0.55)" : ALCHEMY.gold,
    backgroundColor: isDark ? c.surfaceMuted : "rgba(255, 253, 249, 0.92)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    ...moduleShadow},
  reviewBannerWrap: {
    marginBottom: spacing.sm},
  reviewComposer: {
    borderRadius: radius.lg + 2,
    padding: spacing.md - 2,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm},
  reviewComposerLight: {
    backgroundColor: isDark ? c.surface : "#FFFFFF",
    borderColor: isDark ? c.border : "rgba(116, 79, 28, 0.1)"},
  reviewComposerDark: {
    backgroundColor: "rgba(0,0,0,0.12)",
    borderColor: c.border},
  reviewStarsPickRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs},
  reviewStarHit: {
    padding: 4,
    borderRadius: radius.md},
  reviewStarHitActive: {
    backgroundColor: isDark ? "rgba(201, 162, 39, 0.12)" : ALCHEMY.goldSoft},
  reviewInputWrap: {
    marginBottom: spacing.sm},
  reviewSubmitBtn: {
    alignSelf: "flex-end"},
  reviewListLabel: {
    fontSize: typography.overline,
    fontFamily: fonts.extrabold,
    letterSpacing: 1,
    color: c.textMuted,
    textTransform: "uppercase",
    marginTop: spacing.sm,
    marginBottom: spacing.sm},
  reviewList: {
    marginTop: spacing.sm,
    gap: spacing.sm},
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.border : "rgba(116, 79, 28, 0.08)"},
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"},
  reviewAvatarText: {
    fontSize: typography.bodySmall,
    fontFamily: FONT_DISPLAY_SEMI},
  reviewItemBody: {
    flex: 1,
    minWidth: 0},
  reviewItemTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: 4},
  reviewUser: {
    flex: 1,
    color: c.textPrimary,
    fontSize: typography.bodySmall,
    fontFamily: fonts.bold},
  reviewRatingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: isDark ? "rgba(201, 162, 39, 0.12)" : ALCHEMY.goldSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? c.primaryBorder : ALCHEMY.pillInactive},
  reviewRatingPillText: {
    fontSize: typography.overline + 1,
    fontFamily: fonts.extrabold,
    color: c.textPrimary},
  reviewComment: {
    color: c.textSecondary,
    fontSize: typography.caption,
    lineHeight: 19,
    fontFamily: fonts.regular},
  reviewNoComment: {
    fontSize: typography.overline + 1,
    fontFamily: fonts.medium,
    color: c.textMuted,
    fontStyle: "italic"},
  reviewEmptyHint: {
    marginTop: spacing.sm,
    fontSize: typography.caption,
    fontFamily: fonts.medium,
    color: c.textMuted,
    textAlign: "center"},
  loadingGradient: {
    flex: 1,
    width: "100%"},
  loadingSkeletonInner: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 720,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md},
  loadingThumbRow: {
    flexDirection: "row",
    gap: spacing.sm},
  loadingTextStack: {
    gap: spacing.xs},
  loadingChipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs},
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl},
  loadingHint: {
    marginTop: spacing.sm,
    fontSize: typography.bodySmall,
    fontFamily: fonts.semibold,
    color: c.textSecondary},
  missingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    fontFamily: fonts.semibold,
    color: c.textSecondary,
    textAlign: "center"}});
}

function RetryImage({ sourceUri, style, styles, c }) {
  const candidates = useMemo(() => getImageUriCandidates(sourceUri), [sourceUri]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sourceUri]);

  const currentUri = candidates[index] || "";
  if (!currentUri) {
    return (
      <View style={[style, styles.thumbImageFallback]}>
        <Ionicons name="image-outline" size={sz.micro} color={c.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: currentUri }}
      style={style}
      contentFit="contain"
      cachePolicy="memory-disk"
      transition={200}
      onError={() => setIndex((prev) => prev + 1)}
    />
  );
}
