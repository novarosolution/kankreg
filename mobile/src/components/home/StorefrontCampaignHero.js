import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  HOME_HERO_MOBILE_SLIDER_SLIDES,
  HOME_HERO_WEB_SLIDER_SLIDES,
} from "../../constants/marketingAssets";
import { STOREFRONT_CATEGORIES, STOREFRONT_HERO_SLIDES } from "../../content/appContent";
import useReducedMotion from "../../hooks/useReducedMotion";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { fonts } from "../../theme/tokens";
import { WEB_DISPLAY_FONT_STACK } from "../../theme/webFonts";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";

const GREEN = KANKREG_CHROME.announceBg;
const GOLD = "#C4A24A";
const AUTO_MS = 6200;

const KEN_CLASS = "kankreg-campaign-ken";
injectWebCssOnce(
  "kankreg-campaign-hero-premium-v1",
  `@keyframes kankregCampaignKen {
  from { transform: scale(1.02); }
  to { transform: scale(1.08); }
}
.${KEN_CLASS} {
  animation: kankregCampaignKen ${AUTO_MS}ms ease-out forwards;
  transform-origin: center center;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .${KEN_CLASS} { animation: none !important; transform: scale(1.02) !important; }
}`
);

function resolveSlideMedia(slide, index, compact) {
  const webPool = HOME_HERO_WEB_SLIDER_SLIDES;
  const phonePool = HOME_HERO_MOBILE_SLIDER_SLIDES;
  const pool = compact ? phonePool : webPool;
  const keyIndex =
    slide.imageKey === "jar"
      ? 1
      : slide.imageKey === "meal"
        ? 2
        : slide.imageKey === "pure"
          ? 3
          : slide.imageKey === "product"
            ? 0
            : Math.min(index, pool.length - 1);
  const byKey = pool[Math.min(keyIndex, pool.length - 1)];
  return byKey?.image || phonePool[0]?.image || webPool[0]?.image;
}

function CategoryCircle({ item, selected, onPress, compact }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.catItem,
        hovered && styles.catItemHover,
        pressed && styles.catItemPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={item.label}
    >
      <View style={[styles.catOrb, compact && styles.catOrbCompact, selected && styles.catOrbSelected]}>
        {selected ? (
          <View
            style={[styles.catOrbRing, compact && styles.catOrbRingCompact]}
            pointerEvents="none"
          />
        ) : null}
        <Ionicons
          name={item.icon}
          size={compact ? 20 : 22}
          color={selected ? "#FFFFFF" : GREEN}
        />
      </View>
      <Text style={[styles.catLabel, compact && styles.catLabelCompact, selected && styles.catLabelSelected]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

function ProgressDots({ count, index, progress, onSelect, reducedMotion }) {
  if (count < 2) return null;
  return (
    <View style={styles.dots} accessibilityRole="tablist">
      {Array.from({ length: count }).map((_, i) => {
        const active = i === index;
        return (
          <Pressable
            key={`dot-${i}`}
            onPress={() => onSelect(i)}
            style={styles.dotHit}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Slide ${i + 1}`}
          >
            <View style={[styles.dotTrack, active && styles.dotTrackActive]}>
              {active && !reducedMotion ? (
                <View style={[styles.dotFill, { width: `${Math.round(progress * 100)}%` }]} />
              ) : active ? (
                <View style={[styles.dotFill, { width: "100%" }]} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function StorefrontCampaignHero({ navigation }) {
  const { isMobileWeb, pageGutterClamp, width } = useKankregLayout();
  const compact = isMobileWeb || Platform.OS !== "web" || width < 900;
  const reducedMotion = useReducedMotion();
  const slides = STOREFRONT_HERO_SLIDES;
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedCat, setSelectedCat] = useState(STOREFRONT_CATEGORIES[0]?.key || "Ghee");
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const pauseStartedRef = useRef(0);
  const pausedAccumRef = useRef(0);
  indexRef.current = index;

  const slide = slides[index] || slides[0];
  const count = slides.length;

  useEffect(() => {
    if (reducedMotion || count < 2) {
      setProgress(reducedMotion ? 1 : 0);
      return undefined;
    }
    setProgress(0);
    pausedAccumRef.current = 0;
    pauseStartedRef.current = 0;
    const started = Date.now();
    let rafId = 0;
    let intervalId = 0;

    const step = () => {
      const now = Date.now();
      if (pausedRef.current) {
        if (!pauseStartedRef.current) pauseStartedRef.current = now;
        return false;
      }
      if (pauseStartedRef.current) {
        pausedAccumRef.current += now - pauseStartedRef.current;
        pauseStartedRef.current = 0;
      }
      const ratio = Math.min(1, (now - started - pausedAccumRef.current) / AUTO_MS);
      setProgress(ratio);
      if (ratio >= 1) {
        setIndex((current) => (current + 1) % count);
        return true;
      }
      return false;
    };

    if (typeof requestAnimationFrame === "function") {
      const loop = () => {
        if (step()) return;
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    intervalId = setInterval(() => {
      step();
    }, 50);
    return () => clearInterval(intervalId);
  }, [count, index, reducedMotion]);

  const goTo = useCallback(
    (next) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
      setProgress(0);
    },
    [count]
  );

  const openShop = useCallback(
    (params) => {
      navigation.navigate({
        name: "Shop",
        params: params || { category: "Ghee" },
        merge: true,
      });
    },
    [navigation]
  );

  const onCategoryPress = useCallback(
    (item) => {
      setSelectedCat(item.key);
      if (item.route) {
        navigation.navigate(item.route, item.params);
        return;
      }
      if (item.params) {
        openShop(item.params);
        return;
      }
      openShop({ category: item.category || item.label });
    },
    [navigation, openShop]
  );

  const fullBleed = useMemo(() => {
    if (Platform.OS !== "web") return { width: "100%" };
    if (isMobileWeb) return { width: "100%", alignSelf: "stretch" };
    return {
      width: "100vw",
      maxWidth: "100vw",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
      alignSelf: "center",
    };
  }, [isMobileWeb]);

  const heroHeight = compact ? Math.min(520, Math.max(420, Math.round(width * 1.15))) : 560;

  if (!slide) return null;

  return (
    <View style={[styles.shell, fullBleed]}>
      <View
        style={[styles.banner, { height: heroHeight }]}
        accessibilityRole="region"
        accessibilityLabel="Home campaign"
        {...(Platform.OS === "web"
          ? {
              onMouseEnter: () => {
                pausedRef.current = true;
              },
              onMouseLeave: () => {
                pausedRef.current = false;
              },
            }
          : {})}
      >
        {slides.map((item, i) => {
          const active = i === index;
          const media = resolveSlideMedia(item, i, compact);
          return (
            <View
              key={item.id}
              pointerEvents={active ? "auto" : "none"}
              style={[
                styles.slideLayer,
                {
                  opacity: active ? 1 : 0,
                  zIndex: active ? 2 : 1,
                },
              ]}
            >
              {media ? (
                <Image
                  source={media}
                  style={styles.slideImage}
                  contentFit="cover"
                  contentPosition="center"
                  transition={reducedMotion ? 0 : 480}
                  className={
                    Platform.OS === "web" && active && !reducedMotion ? KEN_CLASS : undefined
                  }
                  recyclingKey={item.id}
                  priority={i === 0 ? "high" : "normal"}
                  accessibilityLabel={`${item.title} ${item.italic || ""}`.trim()}
                />
              ) : (
                <View style={[styles.slideImage, styles.slideFallback]} />
              )}
            </View>
          );
        })}

        <LinearGradient
          colors={
            compact
              ? ["rgba(8,18,14,0.15)", "rgba(8,18,14,0.28)", "rgba(8,18,14,0.78)"]
              : ["rgba(8,18,14,0.55)", "rgba(8,18,14,0.22)", "rgba(8,18,14,0.08)", "rgba(8,18,14,0.45)"]
          }
          locations={compact ? [0, 0.42, 1] : [0, 0.35, 0.65, 1]}
          start={compact ? { x: 0.5, y: 0 } : { x: 0, y: 0.5 }}
          end={compact ? { x: 0.5, y: 1 } : { x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", "rgba(8,18,14,0.55)"]}
          style={styles.bottomFade}
          pointerEvents="none"
        />

        <View style={[styles.bannerInner, { paddingHorizontal: pageGutterClamp }]}>
          <View style={[styles.copy, compact && styles.copyCompact]}>
            <Text style={styles.brandMark}>kankreg</Text>
            {slide.kicker ? (
              <Text style={[styles.kicker, compact && styles.kickerCompact]}>{slide.kicker}</Text>
            ) : null}
            <Text style={[styles.title, compact && styles.titleCompact]}>
              {slide.title}{" "}
              <Text style={[styles.titleItalic, compact && styles.titleItalicCompact]}>
                {slide.italic}
              </Text>
            </Text>
            {slide.subtitle ? (
              <Text style={[styles.subtitle, compact && styles.subtitleCompact]} numberOfLines={2}>
                {slide.subtitle}
              </Text>
            ) : null}
            <View style={styles.ctaRow}>
              <Pressable
                onPress={() => openShop(slide.shopParams || { category: "Ghee" })}
                style={({ hovered, pressed }) => [
                  styles.cta,
                  hovered && styles.ctaHover,
                  pressed && { opacity: 0.92 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={slide.cta}
              >
                <Text style={styles.ctaText}>{slide.cta}</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </Pressable>
              {slide.pill ? (
                <Text style={[styles.pillInline, compact && styles.pillInlineCompact]} numberOfLines={1}>
                  {slide.pill}
                </Text>
              ) : null}
            </View>
          </View>

          {!compact && count > 1 ? (
            <View style={styles.navRow}>
              <Pressable
                onPress={() => goTo(index - 1)}
                style={({ hovered }) => [styles.navBtn, hovered && styles.navBtnHover]}
                accessibilityRole="button"
                accessibilityLabel="Previous slide"
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={() => goTo(index + 1)}
                style={({ hovered }) => [styles.navBtn, hovered && styles.navBtnHover]}
                accessibilityRole="button"
                accessibilityLabel="Next slide"
              >
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : null}

          <ProgressDots
            count={count}
            index={index}
            progress={progress}
            onSelect={goTo}
            reducedMotion={reducedMotion}
          />
        </View>
      </View>

      <View style={[styles.catBar, compact && styles.catBarCompact, { paddingHorizontal: pageGutterClamp }]}>
        <Text style={[styles.catEyebrow, compact && styles.catEyebrowCompact]}>Shop by collection</Text>
        <View style={[styles.catRow, compact && styles.catRowCompact]}>
          {STOREFRONT_CATEGORIES.map((item) => (
            <CategoryCircle
              key={item.key}
              item={item}
              compact={compact}
              selected={selectedCat === item.key}
              onPress={() => onCategoryPress(item)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const serif = Platform.select({
  web: `Georgia, "Iowan Old Style", Palatino, ${WEB_DISPLAY_FONT_STACK}`,
  default: fonts.semibold,
});

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  banner: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#0F1A15",
  },
  slideLayer: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        transitionProperty: "opacity",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      default: {},
    }),
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  slideFallback: {
    backgroundColor: "#1A3D32",
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "38%",
  },
  bannerInner: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    justifyContent: "flex-end",
    paddingTop: 36,
    paddingBottom: 28,
    zIndex: 3,
  },
  copy: {
    maxWidth: 560,
    gap: 10,
    marginBottom: 28,
  },
  copyCompact: {
    maxWidth: "100%",
    marginBottom: 22,
    gap: 8,
  },
  brandMark: {
    fontFamily: serif,
    fontSize: 15,
    letterSpacing: 0.6,
    color: "rgba(255,255,255,0.88)",
    marginBottom: 2,
  },
  kicker: {
    fontFamily: fonts.medium,
    fontSize: 22,
    lineHeight: 28,
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 0.2,
  },
  kickerCompact: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 52,
    lineHeight: 56,
    color: "#FFFFFF",
    letterSpacing: -1.1,
  },
  titleCompact: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  titleItalic: {
    fontFamily: serif,
    fontStyle: "italic",
    fontWeight: "500",
    fontSize: 42,
    color: GOLD,
  },
  titleItalicCompact: {
    fontSize: 28,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.78)",
    maxWidth: 420,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 6,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 24,
    ...Platform.select({
      web: {
        cursor: "pointer",
        boxShadow: "0 14px 28px -14px rgba(8, 30, 22, 0.75)",
      },
      default: {},
    }),
  },
  ctaHover: {
    backgroundColor: "#154C3C",
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    letterSpacing: 0.3,
    color: "#FFFFFF",
  },
  pillInline: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 0.2,
  },
  pillInlineCompact: {
    fontSize: 12,
    maxWidth: "100%",
  },
  navRow: {
    position: "absolute",
    right: 24,
    top: "42%",
    flexDirection: "row",
    gap: 10,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.28)",
    ...Platform.select({
      web: {
        cursor: "pointer",
        backdropFilter: "blur(10px)",
      },
      default: {},
    }),
  },
  navBtnHover: {
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dotHit: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  dotTrack: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
    overflow: "hidden",
  },
  dotTrackActive: {
    width: 36,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  dotFill: {
    height: "100%",
    backgroundColor: GOLD,
    borderRadius: 2,
  },
  catBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: 28,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(26, 92, 72, 0.06)",
  },
  catBarCompact: {
    paddingTop: 20,
    paddingBottom: 4,
  },
  catEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(26, 92, 72, 0.55)",
    textAlign: "center",
    marginBottom: 16,
  },
  catEyebrowCompact: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  catRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  catRowCompact: {
    maxWidth: "100%",
    gap: 6,
  },
  catItem: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 8,
    ...Platform.select({ web: { cursor: "pointer" }, default: {} }),
  },
  catItemHover: {
    opacity: 0.9,
  },
  catItemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  catOrb: {
    width: 64,
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(26, 92, 72, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F8F4",
    position: "relative",
    overflow: "hidden",
  },
  catOrbCompact: {
    width: 56,
    height: 56,
    borderRadius: 18,
  },
  catOrbSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
    ...Platform.select({
      web: {
        boxShadow: "0 14px 28px -14px rgba(26, 92, 72, 0.55)",
      },
      default: {
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  catOrbRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(196, 162, 74, 0.7)",
    margin: 3,
  },
  catOrbRingCompact: {
    borderRadius: 14,
  },
  catLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12.5,
    letterSpacing: 0.2,
    color: "rgba(26, 92, 72, 0.72)",
    textAlign: "center",
  },
  catLabelCompact: {
    fontSize: 11.5,
  },
  catLabelSelected: {
    fontFamily: fonts.bold,
    color: GREEN,
  },
});
