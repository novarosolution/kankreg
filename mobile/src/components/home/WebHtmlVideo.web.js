import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { resolveVideoUri } from "../../utils/mediaSource";
import { fonts, icon } from "../../theme/tokens";

/**
 * Web-only HTML5 video — JSX <video> inside a RN View so Metro mounts a real DOM element.
 * Used in hero carousels where multiple expo-video players would be heavy.
 */
export default function WebHtmlVideo({
  source,
  active = true,
  muted = true,
  loop = true,
  style,
  controls = false,
  autoPlay,
  fit = "cover",
  cinematic = false,
}) {
  const videoRef = useRef(null);
  const uri = resolveVideoUri(source);
  const shouldAutoPlay = autoPlay ?? (active && !controls);
  const [needsTap, setNeedsTap] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(uri));

  const syncPlayback = useCallback(() => {
    const el = videoRef.current;
    if (!el || !uri) return;
    if (!controls) {
      el.muted = muted;
      el.loop = loop;
    }
    if (shouldAutoPlay && active) {
      const playPromise = el.play();
      if (playPromise?.catch) {
        playPromise.catch(() => setNeedsTap(true));
      }
    } else if (!active) {
      el.pause();
    }
  }, [active, controls, loop, muted, shouldAutoPlay, uri]);

  const handleTapPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
    el.play()
      .then(() => setNeedsTap(false))
      .catch(() => setNeedsTap(true));
  }, [muted]);

  useEffect(() => {
    syncPlayback();
  }, [syncPlayback]);

  if (!uri) {
    return (
      <View style={[style, styles.fallback]}>
        <Text style={styles.fallbackText}>Video unavailable</Text>
      </View>
    );
  }

  const flatStyle = StyleSheet.flatten(style) || {};

  return (
    <View style={[styles.host, controls ? null : styles.hostFill, flatStyle]}>
      <video
        ref={videoRef}
        className={cinematic && !controls ? "kankreg-cinema-video" : undefined}
        data-kankreg-fill="true"
        src={uri}
        controls={controls || undefined}
        muted={controls ? undefined : muted}
        loop={controls ? undefined : loop}
        playsInline
        autoPlay={shouldAutoPlay || undefined}
        preload={controls ? "metadata" : "auto"}
        onLoadStart={() => setIsLoading(true)}
        onLoadedData={() => {
          setLoadError(false);
          setIsLoading(false);
          setNeedsTap(false);
          syncPlayback();
        }}
        onCanPlay={() => {
          setIsLoading(false);
          syncPlayback();
        }}
        onPlaying={() => {
          setIsLoading(false);
          setNeedsTap(false);
        }}
        onError={() => {
          setLoadError(true);
          setIsLoading(false);
        }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: cinematic ? "cover" : fit,
          objectPosition: "center center",
          backgroundColor: fit === "contain" && !cinematic ? "transparent" : "#0a0908",
          ...(controls
            ? {}
            : {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }),
        }}
      />
      {isLoading && !loadError ? (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.fallbackText}>Loading film…</Text>
        </View>
      ) : null}
      {loadError ? (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.fallbackText}>Could not load video</Text>
        </View>
      ) : needsTap && !controls && !isLoading ? (
        <Pressable style={styles.overlay} onPress={handleTapPlay} accessibilityRole="button" accessibilityLabel="Play video">
          <View style={styles.playChip}>
            <Ionicons name="play" size={icon.md} color="#fff" />
            <Text style={styles.playLabel}>Tap to play</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    overflow: "hidden",
    backgroundColor: "#0a0908",
  },
  hostFill: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0908",
    minHeight: 220,
  },
  fallbackText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: "rgba(255, 253, 248, 0.55)",
    letterSpacing: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 6, 4, 0.42)",
    zIndex: 6,
  },
  playChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "rgba(28, 18, 8, 0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 253, 248, 0.2)",
  },
  playLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(255, 253, 248, 0.92)",
  },
});
