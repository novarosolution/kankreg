import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { HtmlImg, toImageSrc } from "../home/compareWebDom";
import SkeletonBlock from "./SkeletonBlock";

/**
 * Product / catalog image with visible skeleton while loading.
 * Web uses native <img> for reliable bundled + Cloudinary URLs.
 */
export default function ProgressiveProductImage({
  uri,
  previewUri = "",
  style,
  className,
  contentFit = "cover",
  onError,
  priority = "normal",
  recyclingKey,
  rounded = 14,
  showSkeleton = true,
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [uri]);

  const markReady = () => setReady(true);

  if (!uri) return null;

  if (Platform.OS === "web") {
    const src = toImageSrc(uri, { width: 840, quality: "auto:good" });
    if (!src) return null;
    return (
      <View style={[styles.shell, style]} className={className}>
        {showSkeleton && !ready ? (
          <View style={styles.layer} pointerEvents="none">
            <SkeletonBlock width="100%" height="100%" rounded={rounded} />
          </View>
        ) : null}
        <HtmlImg
          src={src}
          loading={priority === "high" ? "eager" : "lazy"}
          fetchPriority={priority === "high" ? "high" : "auto"}
          decoding="async"
          style={{
            ...StyleSheet.absoluteFillObject,
            width: "100%",
            height: "100%",
            objectFit: contentFit,
            objectPosition: "center",
          }}
          onLoad={markReady}
          onError={onError}
        />
      </View>
    );
  }

  const placeholder = previewUri ? { uri: previewUri } : undefined;

  return (
    <View style={[styles.shell, style]}>
      {showSkeleton && !ready ? (
        <View style={styles.layer} pointerEvents="none">
          <SkeletonBlock width="100%" height="100%" rounded={rounded} />
        </View>
      ) : null}
      <Image
        source={{ uri }}
        style={styles.layer}
        contentFit={contentFit}
        placeholder={placeholder}
        placeholderContentFit={contentFit}
        transition={240}
        cachePolicy="memory-disk"
        priority={priority}
        recyclingKey={recyclingKey || uri}
        onLoad={markReady}
        onLoadEnd={markReady}
        onError={onError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F2E9D4",
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
});
