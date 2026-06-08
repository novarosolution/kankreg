import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { fonts, icon, layout, radius, spacing, typography } from "../../theme/tokens";
import { HOME_BRAND_PROMO_VIDEO } from "../../constants/marketingAssets";
import useInViewport from "../../hooks/useInViewport";
import { useTheme } from "../../context/ThemeContext";

function clampMediaVolume(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * Promo video card with viewport-aware play/pause + multi-source mute behavior:
 * - Mutes when caller passes `silenceFromScroll` (parent-driven scroll mute).
 * - Pauses when offscreen (IntersectionObserver on web, optimistic on native).
 * - Pauses when the web tab is hidden.
 * - Pauses when the screen loses navigation focus.
 *
 * On web, when the user toggles to "Sound on" we ramp the underlying <video>
 * volume across ~180ms to avoid abrupt audio pop. Skipped on native because
 * `expo-video` doesn't expose a per-frame volume hook on those platforms.
 */
export default function HomePromoVideo({ disabled, isScreenFocused, silenceFromScroll }) {
  const { colors: c, isDark } = useTheme();
  const [isPromoMuted, setIsPromoMuted] = useState(true);
  const [isWebTabHidden, setIsWebTabHidden] = useState(false);
  const { ref: viewportRef, inView } = useInViewport({ threshold: 0.25, once: false });
  const wrapHostRef = useRef(null);
  const videoRef = useRef(null);
  const volumeRafRef = useRef(null);

  const player = useVideoPlayer(HOME_BRAND_PROMO_VIDEO, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  const offscreen = !inView;
  const shouldSilence =
    Boolean(disabled) ||
    !isScreenFocused ||
    isWebTabHidden ||
    Boolean(silenceFromScroll) ||
    offscreen;

  useEffect(() => {
    if (!isScreenFocused) {
      setIsPromoMuted(true);
    }
  }, [isScreenFocused]);

  useEffect(() => {
    if (Platform.OS !== "web") return undefined;
    if (typeof globalThis === "undefined" || typeof globalThis.document === "undefined") {
      return undefined;
    }
    const onVisibilityChange = () => {
      setIsWebTabHidden(Boolean(globalThis.document.hidden));
    };
    onVisibilityChange();
    globalThis.document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      globalThis.document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!player) return;
    const desiredMuted = isPromoMuted || shouldSilence;
    if (Platform.OS === "web" && wrapHostRef.current && typeof Element !== "undefined") {
      const node = wrapHostRef.current;
      const videoEl = node instanceof Element ? node.querySelector("video") : null;
      if (videoEl) {
        if (volumeRafRef.current && globalThis.cancelAnimationFrame) {
          globalThis.cancelAnimationFrame(volumeRafRef.current);
          volumeRafRef.current = null;
        }
        if (desiredMuted) {
          if (typeof videoEl.volume === "number" && videoEl.volume > 0) {
            const start = clampMediaVolume(videoEl.volume);
            const t0 = globalThis.performance?.now?.() ?? Date.now();
            const step = (now) => {
              const elapsed = (now ?? Date.now()) - t0;
              const ratio = Math.max(0, 1 - elapsed / 180);
              videoEl.volume = clampMediaVolume(start * ratio);
              if (ratio > 0 && globalThis.requestAnimationFrame) {
                volumeRafRef.current = globalThis.requestAnimationFrame(step);
              } else {
                videoEl.volume = 0;
                player.muted = true;
                volumeRafRef.current = null;
              }
            };
            if (globalThis.requestAnimationFrame) {
              volumeRafRef.current = globalThis.requestAnimationFrame(step);
            } else {
              videoEl.volume = 0;
              player.muted = true;
            }
            return;
          }
          videoEl.volume = 0;
          player.muted = true;
        } else {
          player.muted = false;
          const t0 = globalThis.performance?.now?.() ?? Date.now();
          const step = (now) => {
            const elapsed = (now ?? Date.now()) - t0;
            const ratio = Math.min(1, elapsed / 180);
            videoEl.volume = clampMediaVolume(ratio);
            if (ratio < 1 && globalThis.requestAnimationFrame) {
              volumeRafRef.current = globalThis.requestAnimationFrame(step);
            } else {
              videoEl.volume = 1;
              volumeRafRef.current = null;
            }
          };
          if (globalThis.requestAnimationFrame) {
            volumeRafRef.current = globalThis.requestAnimationFrame(step);
          } else {
            videoEl.volume = 1;
          }
          return;
        }
      }
    }
    player.muted = desiredMuted;
  }, [player, isPromoMuted, shouldSilence]);

  useEffect(
    () => () => {
      if (volumeRafRef.current && globalThis.cancelAnimationFrame) {
        globalThis.cancelAnimationFrame(volumeRafRef.current);
        volumeRafRef.current = null;
      }
    },
    []
  );

  useEffect(() => {
    if (!player) return;
    if (shouldSilence) {
      player.pause();
      return;
    }
    player.play();
  }, [player, shouldSilence]);

  const setRefs = useCallback(
    (node) => {
      wrapHostRef.current = node;
      if (typeof viewportRef === "function") viewportRef(node);
    },
    [viewportRef]
  );

  const muteLabel = silenceFromScroll
    ? "Muted while scrolling"
    : isPromoMuted || shouldSilence
      ? "Tap to unmute"
      : "Sound on";

  return (
    <View
      ref={setRefs}
      style={[
        styles.wrap,
        {
          borderColor: isDark ? c.primaryBorder : "rgba(100, 116, 139, 0.14)",
          borderTopColor: isDark ? c.primaryBright : "rgba(201, 162, 39, 0.75)",
          backgroundColor: isDark ? c.surfaceElevated || "#110B07" : "#110B07",
        },
      ]}
      accessibilityElementsHidden={false}
    >
      <View style={[styles.frame, { borderColor: isDark ? c.border : "rgba(255, 252, 248, 0.24)" }]} ref={videoRef}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          accessibilityLabel="KankreG brand video"
        />
        <LinearGradient
          colors={["rgba(255, 252, 248, 0.18)", "transparent", "rgba(255, 252, 248, 0.1)"]}
          locations={[0, 0.3, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.sheen, styles.peNone]}
        />
        <LinearGradient
          colors={["rgba(8, 6, 4, 0.22)", "transparent", "rgba(8, 6, 4, 0.9)"]}
          locations={[0, 0.46, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFillObject, styles.peNone]}
        />
      </View>
      <Pressable
        onPress={() => setIsPromoMuted((prev) => !prev)}
        style={({ pressed }) => [
          styles.muteBtn,
          (isPromoMuted || shouldSilence) ? styles.muteBtnAttention : null,
          pressed ? { opacity: 0.82 } : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={isPromoMuted || shouldSilence ? "Unmute video" : "Mute video"}
        accessibilityState={{ selected: !(isPromoMuted || shouldSilence) }}
      >
        <Ionicons
          name={isPromoMuted || shouldSilence ? "volume-mute-outline" : "volume-high-outline"}
          size={icon.md}
          color={c.onPrimary}
        />
        <Text style={[styles.muteText, { color: c.onPrimary }]}>{muteLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
    marginBottom: spacing.xl + 8,
    borderRadius: radius.xxl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.14)",
    borderTopWidth: 3,
    borderTopColor: "rgba(201, 162, 39, 0.75)",
    backgroundColor: "#110B07",
    padding: Platform.OS === "web" ? 10 : 8,
    minHeight: Platform.OS === "web" ? 420 : 280,
    ...Platform.select({
      web: {
        boxShadow:
          "0 20px 48px rgba(15, 23, 42, 0.14), 0 7px 18px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.76)",
      },
      ios: {
        shadowColor: "#1a1208",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  frame: {
    borderRadius: radius.xl + 2,
    overflow: "hidden",
    backgroundColor: "#0A0705",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 252, 248, 0.24)",
  },
  video: {
    width: "100%",
    height: Platform.OS === "web" ? 400 : 260,
    backgroundColor: "#120D08",
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
  },
  muteBtn: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    zIndex: 3,
    minHeight: 44,
    paddingHorizontal: spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 252, 248, 0.48)",
    backgroundColor: "rgba(12, 9, 7, 0.66)",
    ...Platform.select({
      web: {
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(8, 6, 4, 0.5), inset 0 1px 0 rgba(255, 252, 248, 0.28)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
      },
      default: {},
    }),
  },
  muteBtnAttention: {
    borderColor: "rgba(255, 252, 248, 0.76)",
    backgroundColor: "rgba(12, 9, 7, 0.78)",
    ...Platform.select({
      web: {
        boxShadow: "0 10px 24px rgba(8, 6, 4, 0.56), inset 0 1px 0 rgba(255, 252, 248, 0.4)",
      },
      default: {},
    }),
  },
  muteText: {
    color: "#FFFCF8",
    fontSize: typography.overline + 1,
    fontFamily: fonts.extrabold,
    letterSpacing: 0.35,
    textTransform: "uppercase",
  },
  peNone: {
    pointerEvents: "none",
  },
});
