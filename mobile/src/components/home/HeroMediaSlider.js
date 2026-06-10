import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import WebHtmlVideo from "./WebHtmlVideo";
import { HOME_HERO_BANNER } from "../../content/appContent";
import { FONT_DISPLAY } from "../../theme/customerAlchemy";
import {
  HOME_EYEBROW_LETTER_SPACING,
  HOME_SPACE,
  HOME_TYPE,
  homeHeroScrimMuted,
  homeHeroTitleSize,
} from "../../theme/homeEditorial";
import { createKankregEyebrowStyle } from "../../theme/kankregScreenStyles";
import { KANKREG_CHROME, KANKREG_PALETTE } from "../../theme/kankregWeb";
import { platformShadow } from "../../theme/shadowPlatform";
import { useTheme } from "../../context/ThemeContext";
import { fonts, icon, radius, spacing, typography } from "../../theme/tokens";
import { resolveImageSource } from "../../utils/mediaSource";
import { PRODUCT_HERO_BLURHASH } from "../../utils/image";
import useReducedMotion from "../../hooks/useReducedMotion";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import {
  HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH,
  HOME_HERO_PRODUCT_PHONE_SLIDE_HEIGHT_PER_WIDTH,
  HOME_HERO_PRODUCT_SLIDE_HEIGHT_PER_WIDTH,
  HOME_HERO_WEB_LANDSCAPE_HEIGHT_PER_WIDTH,
} from "../../constants/marketingAssets";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";

const SLIDE_INTERVAL_MS = 7000;
const KEN_BURNS_CLASS = "kankreg-hero-kenburns";
const KEN_BURNS_PRODUCT_CLASS = "kankreg-hero-kenburns-product";
const HERO_PRODUCT_FRAME_CLASS = "kankreg-hero-product-frame";

injectWebCssOnce(
  "kankreg-hero-kenburns-keyframes-v2",
  `@keyframes kankregHeroKenBurns {
    from { transform: scale(1); }
    to { transform: scale(1.04); }
  }
@keyframes kankregHeroKenBurnsProduct {
    from { transform: scale(1.02); }
    to { transform: scale(1.06); }
  }
.${KEN_BURNS_CLASS} {
  animation: kankregHeroKenBurns 14s ease-in-out forwards;
  transform-origin: center center;
}
.${KEN_BURNS_PRODUCT_CLASS} {
  animation: kankregHeroKenBurnsProduct 18s ease-in-out infinite alternate;
  transform-origin: center center;
}
.${HERO_PRODUCT_FRAME_CLASS}::before,
.${HERO_PRODUCT_FRAME_CLASS}::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 4;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(214, 173, 91, 0.55), transparent);
}
.${HERO_PRODUCT_FRAME_CLASS}::before { top: 0; }
.${HERO_PRODUCT_FRAME_CLASS}::after { bottom: 0; }
@media (prefers-reduced-motion: reduce) {
  .${KEN_BURNS_PRODUCT_CLASS} { animation: none !important; transform: none !important; }
}`
);

const cardShadow = platformShadow({
  web: {
    boxShadow:
      "0 50px 90px -40px rgba(25,20,15,.42), 0 18px 36px -24px rgba(25,20,15,.18), inset 0 1px 0 rgba(255,255,255,.08)",
  },
  ios: {
    shadowColor: "#19140f",
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
  },
  android: { elevation: 10 },
});

function resolveHeroSlideHeightRatio(slide, { isNative, isMobileWeb }) {
  if (slide?.heightRatio > 0) return slide.heightRatio;
  if (slide?.variant === "product") {
    return isNative || isMobileWeb
      ? HOME_HERO_PRODUCT_PHONE_SLIDE_HEIGHT_PER_WIDTH
      : HOME_HERO_PRODUCT_SLIDE_HEIGHT_PER_WIDTH;
  }
  if (isNative || isMobileWeb) {
    if (slide?.layout === "landscape") return HOME_HERO_WEB_LANDSCAPE_HEIGHT_PER_WIDTH;
    return HOME_HERO_PHONE_SLIDE_HEIGHT_PER_WIDTH;
  }
  return HOME_HERO_WEB_LANDSCAPE_HEIGHT_PER_WIDTH;
}

function resolveHeroImageFit(slide, { isTop, isMobileWebTop }) {
  if (slide?.imageFit === "contain" || slide?.imageFit === "cover") return slide.imageFit;
  if (isTop && !isMobileWebTop) return "contain";
  return "cover";
}

function HeroNavButton({ direction, onPress, style, quiet = false }) {
  const name = direction === "prev" ? "chevron-back" : "chevron-forward";
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, focused }) => [
        quiet ? styles.navBtnQuiet : styles.navBtn,
        hovered && Platform.OS === "web" ? (quiet ? styles.navBtnQuietHover : styles.navBtnHover) : null,
        focused && Platform.OS === "web" ? styles.navBtnFocus : null,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={direction === "prev" ? "Previous slide" : "Next slide"}
    >
      <Ionicons name={name} size={quiet ? icon.sm : icon.md} color="rgba(255,255,255,0.92)" />
    </Pressable>
  );
}

function HeroProductScrim() {
  return (
    <>
      <LinearGradient
        colors={["rgba(8,6,4,0.38)", "transparent", "transparent", "rgba(8,6,4,0.2)"]}
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", "transparent", "rgba(8,6,4,0.28)", "rgba(8,6,4,0.72)"]}
        locations={[0, 0.45, 0.72, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    </>
  );
}

function HeroBottomScrim({ editorial, isBanner, isNative, isProduct }) {
  if (isProduct) {
    return <HeroProductScrim />;
  }
  if (isNative) {
    return (
      <>
        <LinearGradient
          colors={["rgba(8,6,4,0.14)", "transparent", "transparent"]}
          locations={[0, 0.28, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", "rgba(8,6,4,0.18)", "rgba(8,6,4,0.62)", "rgba(8,6,4,0.82)"]}
          locations={[0.38, 0.62, 0.82, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      </>
    );
  }
  if (editorial) {
    return (
      <LinearGradient
        colors={["transparent", "transparent", "rgba(8,6,4,0.22)", "rgba(8,6,4,0.68)"]}
        locations={[0, 0.5, 0.78, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    );
  }
  if (!isBanner) {
    return (
      <LinearGradient
        colors={["transparent", "rgba(8,6,4,0.55)", "rgba(8,6,4,0.88)"]}
        locations={[0.35, 0.72, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    );
  }
  return (
    <LinearGradient
      colors={["rgba(8,6,4,0.12)", "rgba(8,6,4,0.38)", "rgba(8,6,4,0.78)"]}
      locations={[0, 0.5, 1]}
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
    />
  );
}

function HeroSlideCard({
  slide,
  active,
  isDark,
  isBanner,
  isTop,
  showCta,
  onCta,
  reducedMotion,
  editorialEyebrow,
  layoutWidth,
  isNative = false,
  isMobileWebTop = false,
}) {
  const imageSource = resolveImageSource(slide.url);
  const hasImage = Boolean(imageSource);
  const isProduct = slide.variant === "product";
  const scrimMuted = homeHeroScrimMuted();
  const heroTitleSize = isMobileWebTop
    ? Math.min(28, homeHeroTitleSize(layoutWidth))
    : isProduct && isTop
      ? Math.min(52, homeHeroTitleSize(layoutWidth) + 4)
      : homeHeroTitleSize(layoutWidth);
  const imageFit = resolveHeroImageFit(slide, { isTop, isMobileWebTop });
  const kenBurns =
    imageFit === "cover" && isTop && active && Platform.OS === "web" && !reducedMotion && !isMobileWebTop;
  const kenClass = isProduct && kenBurns ? KEN_BURNS_PRODUCT_CLASS : kenBurns ? KEN_BURNS_CLASS : undefined;
  const contentPosition = slide.contentPosition || "center";
  const captionLeft = isTop && !isMobileWebTop && slide.captionAlign !== "center";
  const eyebrowLabel =
    isNative && editorialEyebrow
      ? editorialEyebrow
      : editorialEyebrow || (isBanner && !isTop ? HOME_HERO_BANNER.kicker : "");
  const useGoldCta = isTop || isNative;

  return (
    <View
      className={isProduct && Platform.OS === "web" ? HERO_PRODUCT_FRAME_CLASS : undefined}
      style={[styles.slideInner, isBanner && styles.slideInnerBanner, isProduct && styles.slideInnerProduct]}
    >
      {hasImage ? null : (
        <LinearGradient
          colors={isDark ? ["#3a3228", "#d9c096", "#2c2620"] : ["#f1e4c6", "#d9c096", "#2c2620"]}
          locations={[0, 0.48, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {slide.mediaType === "video" && Platform.OS === "web" ? (
        active ? (
          <WebHtmlVideo
            source={slide.url}
            active
            muted
            loop
            fit={isTop && layoutWidth >= 1080 ? "contain" : "cover"}
            style={styles.mediaFill}
          />
        ) : (
          <View style={[styles.mediaFill, styles.videoPoster]} />
        )
      ) : imageSource ? (
        <Image
          source={imageSource}
          className={kenClass}
          style={styles.mediaFill}
          contentFit={imageFit}
          contentPosition={contentPosition}
          transition={320}
          placeholder={{ blurhash: PRODUCT_HERO_BLURHASH }}
        />
      ) : null}

      {isProduct && slide.badge ? (
        <View style={styles.productBadge} pointerEvents="none">
          <View style={styles.productBadgeDot} />
          <Text style={styles.productBadgeText}>{slide.badge}</Text>
        </View>
      ) : null}

      <HeroBottomScrim
        editorial={isTop && !isMobileWebTop && !isProduct && slide.layout !== "landscape"}
        isBanner={isBanner}
        isNative={isNative || isMobileWebTop}
        isProduct={isProduct || (isTop && !isMobileWebTop && slide.layout === "landscape")}
      />

      {slide.title || slide.subtitle || (showCta && slide.cta) ? (
        <View
          style={[
            styles.slideCaption,
            isBanner && !isTop && !isNative && styles.slideCaptionBanner,
            isNative && styles.slideCaptionNative,
            isMobileWebTop && styles.slideCaptionMobileWeb,
            isTop && !isMobileWebTop && styles.slideCaptionTop,
            captionLeft && styles.slideCaptionTopLeft,
          ]}
          pointerEvents="box-none"
        >
          {(isTop || isNative) && eyebrowLabel && !isMobileWebTop ? (
            <Text
              style={[
                isNative ? styles.heroEyebrowNative : styles.heroEyebrow,
                captionLeft && styles.heroEyebrowLeft,
                { color: scrimMuted },
              ]}
              numberOfLines={1}
            >
              {String(eyebrowLabel).toUpperCase()}
            </Text>
          ) : null}
          {isMobileWebTop && eyebrowLabel ? (
            <Text style={[styles.heroEyebrowMobileWeb, { color: scrimMuted }]} numberOfLines={1}>
              {String(eyebrowLabel).toUpperCase()}
            </Text>
          ) : null}
          {!isTop && isBanner && !isNative && eyebrowLabel ? (
            <Text style={[createKankregEyebrowStyle(isDark), styles.captionEyebrowCenter]}>
              {eyebrowLabel}
            </Text>
          ) : null}
          {slide.title ? (
            <Text
              style={[
                styles.slideTitle,
                isTop &&
                  !isMobileWebTop && {
                    fontSize: heroTitleSize,
                    lineHeight: Math.round(heroTitleSize * HOME_TYPE.hero.lineHeightRatio),
                  },
                isMobileWebTop && styles.slideTitleMobileWeb,
                isProduct && isTop && styles.slideTitleProduct,
                isBanner && !isTop && !isNative && styles.slideTitleBanner,
                isNative && styles.slideTitleNative,
                (isBanner || isTop) && !captionLeft && styles.captionTextCenter,
                captionLeft && styles.captionTextLeft,
              ]}
              numberOfLines={isMobileWebTop ? 2 : isTop ? 3 : 2}
            >
              {slide.title}
            </Text>
          ) : null}
          {slide.subtitle ? (
            <Text
              style={[
                styles.slideSubtitle,
                isTop && !isMobileWebTop && styles.slideSubtitleTop,
                isBanner && !isTop && !isNative && styles.slideSubtitleBanner,
                isNative && styles.slideSubtitleNative,
                isMobileWebTop && styles.slideSubtitleMobileWeb,
                (isBanner || isTop) && !captionLeft && styles.captionTextCenter,
                captionLeft && styles.captionTextLeft,
              ]}
              numberOfLines={isMobileWebTop ? 2 : isTop ? 2 : isBanner ? 3 : 2}
            >
              {slide.subtitle}
            </Text>
          ) : null}
          {showCta && slide.cta ? (
            <Pressable
              onPress={onCta}
              style={({ hovered, focused, pressed }) => [
                useGoldCta ? styles.ctaPillGold : styles.ctaPill,
                (isBanner || isTop) && !captionLeft && styles.ctaPillCenter,
                captionLeft && styles.ctaPillStart,
                isNative && styles.ctaPillNative,
                useGoldCta && !captionLeft && styles.ctaPillGoldCenter,
                useGoldCta && captionLeft && styles.ctaPillGoldStart,
                pressed && Platform.OS !== "web" ? styles.ctaPillPressed : null,
                hovered && Platform.OS === "web" ? (useGoldCta ? styles.ctaPillGoldHover : styles.ctaPillHover) : null,
                focused && Platform.OS === "web" ? styles.ctaFocus : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel={slide.cta}
            >
              <Text style={useGoldCta ? styles.ctaTextGold : styles.ctaText}>{slide.cta}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Premium hero carousel — `top` web banner, `native` phone band, `card` sidebar. */
export default function HeroMediaSlider({
  slides = [],
  variant = "card",
  onPress,
  editorialEyebrow = "",
}) {
  const { isDark } = useTheme();
  const { isXs, isSm, isMd, isLg, isXl, isMobileWeb, width: layoutWidth, height: layoutHeight } =
    useKankregLayout();
  const reducedMotion = useReducedMotion();
  const isTop = variant === "top";
  const isNative = variant === "native";
  const isMobileWebTop = isTop && isMobileWeb;
  const isBanner = isTop || isNative;

  const scrollRef = useRef(null);
  const indexRef = useRef(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  indexRef.current = index;
  const slideWidth = pageWidth > 0 ? pageWidth : Math.floor(layoutWidth);

  const activeSlide = slides[index] || slides[0];

  const bannerHeight = useMemo(() => {
    const w = slideWidth;
    if (!w) return undefined;
    const ratio = resolveHeroSlideHeightRatio(activeSlide, { isNative, isMobileWeb });
    const natural = Math.round(w * ratio);
    const viewportCap = Math.round((layoutHeight || 800) * (isMobileWeb ? 0.68 : 0.78));

    if (isNative) {
      return Math.min(520, Math.max(300, Math.min(natural, viewportCap)));
    }
    if (isTop) {
      const maxH = isMobileWeb ? Math.min(580, viewportCap) : Math.min(860, viewportCap);
      const minH = isMobileWeb ? 340 : isXs ? 320 : 380;
      return Math.min(maxH, Math.max(minH, natural));
    }
    return undefined;
  }, [
    activeSlide,
    isMobileWeb,
    isNative,
    isTop,
    isXs,
    layoutHeight,
    slideWidth,
  ]);

  const goTo = useCallback(
    (next) => {
      if (!count || slideWidth <= 0) return;
      const clamped = ((next % count) + count) % count;
      setIndex(clamped);
      scrollRef.current?.scrollTo?.({ x: clamped * slideWidth, y: 0, animated: !reducedMotion });
    },
    [count, reducedMotion, slideWidth]
  );

  useEffect(() => {
    if (pageWidth <= 0) return;
    scrollRef.current?.scrollTo?.({ x: indexRef.current * pageWidth, y: 0, animated: false });
  }, [pageWidth]);

  useEffect(() => {
    if (reducedMotion || count <= 1 || slideWidth <= 0) return undefined;
    const timer = setInterval(() => goTo(indexRef.current + 1), SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, goTo, reducedMotion, slideWidth]);

  if (!count) return null;

  const showArrows = count > 1 && slideWidth > 0 && (isBanner || Platform.OS === "web");
  const progress = ((index + 1) / count) * 100;
  const shellStyle = isTop ? styles.shellTop : isNative ? styles.shellNative : [styles.shellCard, cardShadow];
  const chromeBottom = isNative || isMobileWebTop ? 12 : isTop ? 20 : 12;
  const useQuietNav = isTop || isNative;

  return (
    <View
      onLayout={(e) => {
        const w = Math.floor(e.nativeEvent.layout.width);
        if (w > 0 && w !== pageWidth) setPageWidth(w);
      }}
      style={[
        shellStyle,
        isMobileWebTop && styles.shellMobileWeb,
        isBanner && bannerHeight ? { height: bannerHeight } : null,
        isBanner && styles.shellBannerBase,
      ]}
    >
      {isNative || isMobileWebTop ? <View style={styles.nativeGoldRail} pointerEvents="none" /> : null}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={slideWidth > 0}
        snapToInterval={isNative && slideWidth > 0 ? slideWidth : undefined}
        snapToAlignment="start"
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
        disableIntervalMomentum
        overScrollMode={Platform.OS === "android" ? "never" : undefined}
        bounces={count > 1}
        onMomentumScrollEnd={(e) => {
          const pageW = Math.floor(e.nativeEvent.layoutMeasurement.width) || slideWidth || 1;
          const current = Math.round(e.nativeEvent.contentOffset.x / pageW);
          setIndex(Math.max(0, Math.min(current, count - 1)));
        }}
        onScrollEndDrag={(e) => {
          const pageW = Math.floor(e.nativeEvent.layoutMeasurement.width) || slideWidth || 1;
          const current = Math.round(e.nativeEvent.contentOffset.x / pageW);
          setIndex(Math.max(0, Math.min(current, count - 1)));
        }}
        style={styles.scroller}
        contentContainerStyle={slideWidth > 0 ? { width: slideWidth * count } : undefined}
      >
        {slides.map((slide, slideIndex) => {
          const PageWrap = isTop ? View : Pressable;
          const pageWrapProps = isTop
            ? { style: styles.pagePress }
            : { onPress, style: styles.pagePress, accessibilityRole: "button" };

          return (
            <View
              key={slide.id}
              style={[styles.page, slideWidth > 0 ? { width: slideWidth } : styles.pageFlex]}
            >
              <PageWrap {...pageWrapProps}>
                <HeroSlideCard
                  slide={slide}
                  active={slideIndex === index}
                  isDark={isDark}
                  isBanner={isBanner}
                  isTop={isTop}
                  isNative={isNative}
                  isMobileWebTop={isMobileWebTop}
                  showCta={isBanner}
                  onCta={onPress}
                  reducedMotion={reducedMotion}
                  editorialEyebrow={editorialEyebrow}
                  layoutWidth={layoutWidth}
                />
              </PageWrap>
            </View>
          );
        })}
      </ScrollView>

      {showArrows ? (
        <>
          <HeroNavButton
            direction="prev"
            onPress={() => goTo(index - 1)}
            style={[styles.navPrev, (isNative || isMobileWebTop) && styles.navPrevNative]}
            quiet={useQuietNav}
          />
          <HeroNavButton
            direction="next"
            onPress={() => goTo(index + 1)}
            style={[styles.navNext, (isNative || isMobileWebTop) && styles.navNextNative]}
            quiet={useQuietNav}
          />
        </>
      ) : null}

      {count > 1 ? (
        <>
          {isNative || isMobileWebTop ? (
            <LinearGradient
              colors={["transparent", "rgba(8,6,4,0.5)"]}
              style={styles.chromeScrimNative}
              pointerEvents="none"
            />
          ) : null}
          <View
            style={[
              styles.chrome,
              isTop && !isMobileWebTop && styles.chromeTop,
              (isNative || isMobileWebTop) && styles.chromeNative,
              { paddingBottom: chromeBottom },
            ]}
            pointerEvents="box-none"
          >
            <View
              style={[
                styles.progressTrack,
                isTop && !isMobileWebTop && styles.progressTrackTop,
                (isNative || isMobileWebTop) && styles.progressTrackNative,
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  isTop && !isMobileWebTop && styles.progressFillTop,
                  (isNative || isMobileWebTop) && styles.progressFillNative,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <View style={styles.chromeRow}>
              <Text
                style={[
                  styles.counter,
                  isTop && !isMobileWebTop && styles.counterTop,
                  (isNative || isMobileWebTop) && styles.counterNative,
                ]}
              >
                {String(index + 1).padStart(2, "0")}
                <Text style={styles.counterSep}> / </Text>
                {String(count).padStart(2, "0")}
              </Text>
              <View style={[styles.dots, (isNative || isMobileWebTop) && styles.dotsNative]}>
                {slides.map((slide, dotIndex) => (
                  <Pressable
                    key={slide.id}
                    onPress={() => goTo(dotIndex)}
                    style={[
                      isNative || isMobileWebTop ? styles.dotNative : isTop ? styles.dotTop : styles.dot,
                      dotIndex === index &&
                        (isNative || isMobileWebTop
                          ? styles.dotNativeActive
                          : isTop
                            ? styles.dotTopActive
                            : styles.dotActive),
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </View>
              <Text style={styles.counterSpacer} accessibilityElementsHidden>
                {String(index + 1).padStart(2, "0")}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shellBannerBase: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  shellCard: {
    width: "100%",
    maxWidth: 480,
    aspectRatio: 5 / 6,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.14)",
    alignSelf: "center",
  },
  shellTop: {
    aspectRatio: undefined,
    borderRadius: 0,
    borderWidth: 0,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      web: {
        boxShadow: "0 28px 64px -36px rgba(25,20,15,.32)",
      },
      default: {},
    }),
  },
  shellMobileWeb: {
    borderRadius: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169, 119, 46, 0.2)",
    ...Platform.select({
      web: {
        boxShadow: "0 18px 40px -28px rgba(25, 20, 15, 0.22)",
      },
      default: {},
    }),
  },
  shellNative: {
    aspectRatio: undefined,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(169, 119, 46, 0.32)",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#14110e",
    ...Platform.select({
      ios: {
        shadowColor: "#19140f",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.2,
        shadowRadius: 28,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  nativeGoldRail: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(214, 173, 91, 0.45)",
    zIndex: 6,
  },
  scroller: {
    flex: 1,
    width: "100%",
  },
  page: {
    height: "100%",
    overflow: "hidden",
  },
  pageFlex: {
    width: "100%",
  },
  pagePress: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  slideInner: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#2c2620",
    width: "100%",
  },
  slideInnerBanner: {
    minHeight: "100%",
  },
  slideInnerProduct: {
    backgroundColor: "#1a1410",
  },
  productBadge: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: "rgba(28, 18, 8, 0.58)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 253, 248, 0.16)",
    ...Platform.select({
      web: { backdropFilter: "blur(8px)" },
      default: {},
    }),
  },
  productBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: KANKREG_PALETTE.gold,
  },
  productBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: "rgba(255, 253, 248, 0.88)",
  },
  mediaFill: {
    ...StyleSheet.absoluteFillObject,
  },
  videoPoster: {
    backgroundColor: "rgba(28,25,23,0.35)",
  },
  slideCaption: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 56,
  },
  slideCaptionBanner: {
    left: 0,
    right: 0,
    bottom: 64,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    maxWidth: 640,
    alignSelf: "center",
    width: "100%",
  },
  slideCaptionNative: {
    left: 0,
    right: 0,
    bottom: 82,
    paddingHorizontal: spacing.lg + 4,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    gap: spacing.xs,
  },
  slideCaptionTop: {
    left: 0,
    right: 0,
    bottom: 96,
    paddingHorizontal: HOME_SPACE.lg,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 720,
    gap: HOME_SPACE.sm,
    ...Platform.select({
      web: { paddingHorizontal: "max(24px, 4vw)" },
      default: {},
    }),
  },
  slideCaptionTopLeft: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    maxWidth: "52%",
    ...Platform.select({
      web: {
        paddingLeft: "max(32px, 5vw)",
        paddingRight: 24,
        maxWidth: "min(560px, 48vw)",
      },
      default: { maxWidth: "58%" },
    }),
  },
  slideCaptionMobileWeb: {
    left: 0,
    right: 0,
    bottom: 68,
    paddingHorizontal: 18,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    gap: 6,
    maxWidth: 360,
  },
  heroEyebrowMobileWeb: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.3,
    textAlign: "center",
    textTransform: "uppercase",
  },
  slideTitleMobileWeb: {
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.45,
    textAlign: "center",
  },
  slideSubtitleMobileWeb: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
    maxWidth: 300,
    textAlign: "center",
    color: "rgba(245,239,228,0.9)",
  },
  heroEyebrow: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.eyebrow,
    lineHeight: HOME_TYPE.eyebrow + 4,
    letterSpacing: HOME_EYEBROW_LETTER_SPACING,
    textAlign: "center",
    textTransform: "uppercase",
  },
  heroEyebrowLeft: {
    textAlign: "left",
    alignSelf: "flex-start",
  },
  heroEyebrowNative: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.4,
    textAlign: "center",
    textTransform: "uppercase",
    opacity: 0.92,
  },
  captionEyebrowCenter: {
    textAlign: "center",
  },
  captionTextCenter: {
    textAlign: "center",
  },
  captionTextLeft: {
    textAlign: "left",
    alignSelf: "flex-start",
  },
  slideTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.5,
    color: KANKREG_PALETTE.paper,
  },
  slideTitleProduct: {
    letterSpacing: -0.6,
    ...Platform.select({
      web: { textShadow: "0 2px 18px rgba(0, 0, 0, 0.45)" },
      default: {},
    }),
  },
  slideTitleBanner: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
    marginTop: spacing.xs,
  },
  slideTitleNative: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.65,
    marginTop: 2,
  },
  slideSubtitle: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall,
    lineHeight: 20,
    color: "rgba(245,239,228,0.86)",
  },
  slideSubtitleTop: {
    marginTop: HOME_SPACE.xs,
    fontSize: HOME_TYPE.kicker,
    lineHeight: HOME_TYPE.body.lineHeight,
    color: homeHeroScrimMuted(),
    maxWidth: 480,
  },
  slideSubtitleBanner: {
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 480,
  },
  slideSubtitleNative: {
    fontSize: typography.bodySmall,
    lineHeight: 21,
    marginTop: 6,
    maxWidth: 300,
    color: "rgba(245,239,228,0.9)",
  },
  ctaPill: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,253,248,0.94)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    ...Platform.select({
      web: { cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
      default: {},
    }),
  },
  ctaPillCenter: {
    alignSelf: "center",
  },
  ctaPillStart: {
    alignSelf: "flex-start",
  },
  ctaPillGold: {
    marginTop: HOME_SPACE.md,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    backgroundColor: KANKREG_CHROME.buttonAccent,
    borderWidth: 0,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease",
        boxShadow: "0 10px 28px -12px rgba(25,20,15,.45)",
      },
      default: {},
    }),
  },
  ctaPillGoldCenter: {
    alignSelf: "center",
  },
  ctaPillGoldStart: {
    alignSelf: "flex-start",
  },
  ctaPillNative: {
    marginTop: spacing.sm + 2,
    paddingVertical: 11,
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#19140f",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  ctaPillPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  ctaPillHover: {
    transform: [{ translateY: -1 }],
  },
  ctaPillGoldHover: {
    transform: [{ translateY: -1 }],
    backgroundColor: KANKREG_CHROME.buttonAccentHover,
  },
  ctaFocus: {
    ...Platform.select({
      web: { outlineStyle: "solid", outlineWidth: 2, outlineColor: KANKREG_PALETTE.goldBright, outlineOffset: 2 },
      default: {},
    }),
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall,
    color: KANKREG_PALETTE.ink,
    letterSpacing: 0.2,
  },
  ctaTextGold: {
    fontFamily: fonts.semibold,
    fontSize: HOME_TYPE.kicker,
    color: KANKREG_CHROME.onAccent,
    letterSpacing: 0.3,
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8,6,4,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    zIndex: 4,
    ...Platform.select({
      web: { cursor: "pointer", backdropFilter: "blur(8px)" },
      default: {},
    }),
  },
  navBtnQuiet: {
    position: "absolute",
    top: "50%",
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8,6,4,0.26)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.14)",
    zIndex: 4,
    ...Platform.select({
      web: { cursor: "pointer", backdropFilter: "blur(6px)" },
      default: {},
    }),
  },
  navBtnHover: {
    backgroundColor: "rgba(8,6,4,0.58)",
  },
  navBtnQuietHover: {
    backgroundColor: "rgba(8,6,4,0.38)",
  },
  navBtnFocus: {
    ...Platform.select({
      web: { outlineStyle: "solid", outlineWidth: 2, outlineColor: "rgba(255,255,255,0.65)", outlineOffset: 2 },
      default: {},
    }),
  },
  navPrev: {
    left: 12,
  },
  navNext: {
    right: 12,
  },
  navPrevNative: {
    left: 8,
    marginTop: -20,
  },
  navNextNative: {
    right: 8,
    marginTop: -20,
  },
  chromeScrimNative: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    zIndex: 3,
  },
  chromeNative: {
    zIndex: 4,
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 9,
  },
  progressTrackNative: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  progressFillNative: {
    backgroundColor: KANKREG_PALETTE.goldBright,
  },
  counterNative: {
    left: 18,
    fontSize: 10,
    letterSpacing: 1.1,
    color: "rgba(255,255,255,0.78)",
  },
  dotsNative: {
    gap: 7,
  },
  dotNative: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.34)",
  },
  dotNativeActive: {
    width: 30,
    height: 7,
    borderRadius: 4,
    backgroundColor: KANKREG_PALETTE.goldBright,
  },
  chrome: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  chromeTop: {
    paddingHorizontal: HOME_SPACE.lg,
    gap: 6,
  },
  progressTrack: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.22)",
    overflow: "hidden",
  },
  progressTrackTop: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: KANKREG_PALETTE.goldBright,
    borderRadius: 1,
  },
  progressFillTop: {
    backgroundColor: KANKREG_CHROME.buttonAccent,
    opacity: 0.85,
  },
  chromeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    position: "absolute",
    left: 16,
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.8,
  },
  counterTop: {
    left: HOME_SPACE.lg,
    fontSize: 10,
    color: "rgba(255,255,255,0.62)",
    letterSpacing: 1.2,
  },
  counterSpacer: {
    position: "absolute",
    right: 16,
    opacity: 0,
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
  counterSep: {
    color: "rgba(255,255,255,0.38)",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.32)",
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  dotActive: {
    width: 24,
    backgroundColor: KANKREG_PALETTE.goldBright,
  },
  dotTop: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.28)",
    ...Platform.select({ web: { cursor: "pointer", transition: "width 0.2s ease, background-color 0.2s ease" } }),
  },
  dotTopActive: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: KANKREG_CHROME.buttonAccent,
  },
});
