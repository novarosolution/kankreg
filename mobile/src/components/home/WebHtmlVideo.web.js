import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPreviewVideoUri, getVideoPosterUri, getWebVideoUri } from "../../utils/video";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { ImageLoadPriority, preloadVideo } from "../../utils/imageLoadBalancer";
import { injectWebCssOnce } from "../../utils/injectWebCssOnce";
import { fonts, icon } from "../../theme/tokens";

const POSTER_CLASS = "kankreg-progressive-video-poster";
const PREVIEW_CLASS = "kankreg-progressive-video-preview";
const FULL_CLASS = "kankreg-progressive-video-full";

injectWebCssOnce(
  "kankreg-progressive-video",
  `.${POSTER_CLASS}{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;
  filter:blur(12px);transform:scale(1.05);pointer-events:none;z-index:0;
}
.${PREVIEW_CLASS}{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:1;}
.${FULL_CLASS}{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:2;opacity:0;transition:opacity .4s ease;}
.${FULL_CLASS}.kankreg-video-ready{opacity:1;}
@media (prefers-reduced-motion:reduce){.${FULL_CLASS}{transition:none!important;}}`
);

function resolveLoadPriority(active, controls) {
  if (controls) return ImageLoadPriority.NORMAL;
  return active ? ImageLoadPriority.HIGH : ImageLoadPriority.LOW;
}

function mergeVideoClass(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Web HTML5 video — poster blur → preview MP4 → full quality via load balancer.
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
  preload,
  progressive = true,
  layoutWidth,
  isMobileWeb,
}) {
  const { width: layoutFromHook, isMobileWeb: isMobileWebFromHook } = useKankregLayout();
  const resolvedLayoutWidth = layoutWidth ?? layoutFromHook;
  const resolvedMobileWeb = isMobileWeb ?? isMobileWebFromHook;

  const videoOptions = {
    layoutWidth: resolvedLayoutWidth,
    isMobileWeb: resolvedMobileWeb,
  };

  const previewRef = useRef(null);
  const fullRef = useRef(null);
  const fullUri = getWebVideoUri(source, videoOptions);
  const previewUri = progressive ? getPreviewVideoUri(source, videoOptions) : "";
  const posterUri = progressive ? getVideoPosterUri(source) : "";
  const hasPreview = Boolean(progressive && previewUri && previewUri !== fullUri);
  const shouldAutoPlay = autoPlay ?? (active && !controls);
  const videoPreload = preload ?? (controls ? "metadata" : active ? "auto" : "none");

  const [needsTap, setNeedsTap] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [fullReady, setFullReady] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(fullUri));

  const objectFit = cinematic ? "cover" : fit;

  const syncPlayback = useCallback(
    (el) => {
      if (!el) return;
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
    },
    [active, controls, loop, muted, shouldAutoPlay]
  );

  useEffect(() => {
    if (fullReady && fullRef.current) {
      previewRef.current?.pause?.();
      syncPlayback(fullRef.current);
      return;
    }
    if (previewReady && previewRef.current) {
      syncPlayback(previewRef.current);
    }
  }, [fullReady, previewReady, syncPlayback, muted, active]);

  useEffect(() => {
    if (!fullUri) return undefined;
    let cancelled = false;

    if (hasPreview) {
      preloadVideo(fullUri, resolveLoadPriority(active, controls))
        .then(() => {
          if (!cancelled) setFullReady(true);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }

    setFullReady(false);
    return undefined;
  }, [active, controls, fullUri, hasPreview]);

  const handleTapPlay = useCallback(() => {
    const el = fullReady ? fullRef.current : previewRef.current;
    if (!el) return;
    el.muted = muted;
    el
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => setNeedsTap(true));
  }, [fullReady, muted]);

  if (!fullUri) {
    return (
      <View style={[style, styles.fallback]}>
        <Text style={styles.fallbackText}>Video unavailable</Text>
      </View>
    );
  }

  const flatStyle = StyleSheet.flatten(style) || {};
  const showPoster = Boolean(posterUri && !previewReady && !fullReady);
  const showPreviewLayer = hasPreview && !fullReady;
  const fullClass = mergeVideoClass(
    FULL_CLASS,
    fullReady ? "kankreg-video-ready" : "",
    cinematic && !controls ? "kankreg-cinema-video" : ""
  );

  return (
    <View style={[styles.host, controls ? null : styles.hostFill, flatStyle]}>
      {showPoster ? (
        <img
          src={posterUri}
          alt=""
          aria-hidden
          className={POSTER_CLASS}
          decoding="async"
          style={{ objectFit, objectPosition: "center center" }}
        />
      ) : null}

      {showPreviewLayer ? (
        <video
          ref={previewRef}
          className={PREVIEW_CLASS}
          data-kankreg-fill="true"
          src={previewUri}
          muted={controls ? undefined : muted}
          loop={controls ? undefined : loop}
          playsInline
          autoPlay={shouldAutoPlay && active ? true : undefined}
          preload="auto"
          onLoadedData={() => {
            setPreviewReady(true);
            setIsLoading(false);
          }}
          onPlaying={() => {
            setIsLoading(false);
            setNeedsTap(false);
          }}
          onError={() => setLoadError(true)}
          style={{
            display: "block",
            objectFit,
            objectPosition: "center center",
            backgroundColor: "#0a0908",
          }}
        />
      ) : null}

      {fullReady || !hasPreview ? (
        <video
          ref={fullRef}
          className={hasPreview ? fullClass : cinematic && !controls ? "kankreg-cinema-video" : undefined}
          data-kankreg-fill="true"
          src={fullUri}
          controls={controls || undefined}
          muted={controls ? undefined : muted}
          loop={controls ? undefined : loop}
          playsInline
          autoPlay={shouldAutoPlay && active && !hasPreview ? true : undefined}
          preload={hasPreview ? "auto" : videoPreload}
          onLoadStart={() => setIsLoading(!hasPreview)}
          onLoadedData={() => {
            setLoadError(false);
            setIsLoading(false);
            if (!hasPreview) setFullReady(true);
          }}
          onCanPlay={() => {
            setIsLoading(false);
            if (!hasPreview) syncPlayback(fullRef.current);
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
            objectFit,
            objectPosition: "center center",
            backgroundColor: fit === "contain" && !cinematic ? "transparent" : "#0a0908",
            ...(hasPreview
              ? {}
              : controls
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
      ) : null}

      {isLoading && !loadError && !previewReady && !fullReady ? (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.fallbackText}>Loading film…</Text>
        </View>
      ) : null}
      {loadError ? (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.fallbackText}>Could not load video</Text>
        </View>
      ) : null}
      {needsTap && !controls && !isLoading ? (
        <Pressable
          style={styles.overlay}
          onPress={handleTapPlay}
          accessibilityRole="button"
          accessibilityLabel="Play video"
        >
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
