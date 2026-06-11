import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { icon, radius, spacing } from "../../theme/tokens";
import { HOME_TIMELINE_VIDEO } from "../../constants/marketingAssets";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { useTheme } from "../../context/ThemeContext";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";
import { KANKREG_PALETTE } from "../../theme/kankregWeb";

const BANNER_VIDEO_CLASS = "kankreg-timeline-banner-video";
const BANNER_REEL_CLASS = "kankreg-timeline-banner-reel";

if (Platform.OS === "web") {
  injectWebCssOnce(
    "kankreg-timeline-banner-v1",
    `.${BANNER_REEL_CLASS} {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: #0a0908;
}
.${BANNER_REEL_CLASS} video,
.${BANNER_VIDEO_CLASS} {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  display: block;
}
@keyframes kankregBannerDrift {
  from { transform: scale(1.02); }
  to { transform: scale(1.06); }
}
.${BANNER_REEL_CLASS} video {
  animation: kankregBannerDrift 28s ease-in-out infinite alternate;
  transform-origin: center center;
}
@media (prefers-reduced-motion: reduce) {
  .${BANNER_REEL_CLASS} video { animation: none !important; transform: none !important; }
}`
  );
}

function clampMediaVolume(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * Timeline brand banner — always loops (never pauses). Audio is mute/unmute only.
 */
export default function HomePromoVideo({ fullBleed = false }) {
  const { isDark } = useTheme();
  const { width, isXs } = useKankregLayout();
  const [isMuted, setIsMuted] = useState(true);
  const wrapHostRef = useRef(null);
  const volumeRafRef = useRef(null);

  const bannerHeight = Platform.OS === "web"
    ? width >= 1080
      ? 420
      : width >= 720
        ? 360
        : Math.max(220, Math.min(300, Math.round(width * 0.52)))
    : isXs
      ? Math.max(200, Math.round(width * 0.54))
      : 280;

  const player = useVideoPlayer(HOME_TIMELINE_VIDEO, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    if (!player) return undefined;
    player.loop = true;
    player.play();
    return undefined;
  }, [player]);

  useEffect(() => {
    if (!player) return;
    const desiredMuted = isMuted;
    if (Platform.OS === "web" && wrapHostRef.current && typeof Element !== "undefined") {
      const node = wrapHostRef.current;
      const videoEl = node instanceof Element ? node.querySelector("video") : null;
      if (videoEl) {
        if (volumeRafRef.current && globalThis.cancelAnimationFrame) {
          globalThis.cancelAnimationFrame(volumeRafRef.current);
          volumeRafRef.current = null;
        }
        if (desiredMuted) {
          videoEl.volume = 0;
          player.muted = true;
        } else {
          player.muted = false;
          const t0 = globalThis.performance?.now?.() ?? Date.now();
          const step = (now) => {
            const elapsed = (now ?? Date.now()) - t0;
            const ratio = Math.min(1, elapsed / 200);
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
        }
        return;
      }
    }
    player.muted = desiredMuted;
  }, [player, isMuted]);

  useEffect(
    () => () => {
      if (volumeRafRef.current && globalThis.cancelAnimationFrame) {
        globalThis.cancelAnimationFrame(volumeRafRef.current);
        volumeRafRef.current = null;
      }
    },
    []
  );

  const setRef = useCallback((node) => {
    wrapHostRef.current = node;
  }, []);

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <View
      ref={setRef}
      style={[
        styles.bannerShell,
        fullBleed && styles.bannerShellBleed,
        isDark && styles.bannerShellDark,
      ]}
      accessibilityElementsHidden={false}
    >
      {!fullBleed ? <View style={styles.bannerFrameTop} pointerEvents="none" /> : null}
      <View
        className={Platform.OS === "web" ? BANNER_REEL_CLASS : undefined}
        style={[
          styles.reel,
          fullBleed && styles.reelBleed,
          { height: bannerHeight },
        ]}
      >
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          accessibilityLabel="KankreG journey banner video"
        />
        <LinearGradient
          colors={["rgba(8, 6, 4, 0.35)", "transparent", "transparent", "rgba(8, 6, 4, 0.55)"]}
          locations={[0, 0.22, 0.72, 1]}
          style={styles.vignette}
          pointerEvents="none"
        />
        <View style={styles.goldRuleTop} pointerEvents="none" />
        <View style={styles.goldRuleBottom} pointerEvents="none" />
        <View style={styles.filmBadge} pointerEvents="none">
          <View style={styles.filmBadgeDot} />
        </View>
        <Pressable
          onPress={toggleMute}
          style={({ pressed, hovered }) => [
            styles.muteChip,
            isMuted ? styles.muteChipOff : styles.muteChipOn,
            pressed && styles.muteChipPressed,
            hovered && Platform.OS === "web" ? styles.muteChipHover : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={isMuted ? "Unmute video" : "Mute video"}
          accessibilityState={{ selected: !isMuted }}
        >
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-high"}
            size={icon.sm}
            color="#FFF9EC"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerShell: {
    width: "100%",
    borderRadius: radius.xl + 6,
    padding: Platform.OS === "web" ? 8 : 6,
    backgroundColor: "#110B07",
    borderWidth: 1,
    borderColor: "rgba(169, 119, 46, 0.22)",
    borderTopWidth: 3,
    borderTopColor: "rgba(201, 162, 39, 0.78)",
    overflow: "hidden",
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 1px 0 rgba(255, 253, 248, 0.12), 0 24px 56px -28px rgba(80, 60, 25, 0.28)",
      },
      ios: {
        shadowColor: "#1a1208",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 22,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  bannerShellBleed: {
    padding: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    ...Platform.select({ web: { boxShadow: "none" }, default: { elevation: 0 } }),
  },
  bannerShellDark: {
    borderColor: "rgba(214, 173, 91, 0.18)",
    borderTopColor: "rgba(214, 173, 91, 0.55)",
  },
  reelBleed: {
    borderRadius: 0,
    borderWidth: 0,
  },
  bannerFrameTop: {
    position: "absolute",
    top: 3,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: "rgba(255, 253, 248, 0.2)",
    zIndex: 2,
  },
  reel: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#0a0908",
    position: "relative",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 252, 248, 0.14)",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0908",
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  goldRuleTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(214, 173, 91, 0.45)",
    zIndex: 2,
  },
  goldRuleBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(214, 173, 91, 0.35)",
    zIndex: 2,
  },
  filmBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    zIndex: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(28, 18, 8, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(214, 173, 91, 0.4)",
  },
  filmBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: KANKREG_PALETTE.gold,
  },
  muteChip: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "rgba(12, 9, 7, 0.62)",
    ...Platform.select({
      web: {
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
      },
      default: {},
    }),
  },
  muteChipOff: {
    borderColor: "rgba(255, 252, 248, 0.35)",
  },
  muteChipOn: {
    borderColor: "rgba(214, 173, 91, 0.65)",
    backgroundColor: "rgba(31, 77, 54, 0.55)",
  },
  muteChipPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  muteChipHover: {
    borderColor: "rgba(214, 173, 91, 0.8)",
  },
});
