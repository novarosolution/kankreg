import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { toVideoPlayerSource } from "../../utils/mediaSource";

/** Brand story / about video — expo-video on all platforms (reliable vs raw <video> in RN Web). */
export default function CinemaStoryPlayer({ source, muted = true, style }) {
  const videoSource = toVideoPlayerSource(source);
  const player = useVideoPlayer(videoSource, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    if (!player) return;
    player.muted = muted;
    if (Platform.OS === "web" && !muted) {
      player.volume = 1;
    }
    player.play();
  }, [player, muted]);

  if (!videoSource) {
    return <View style={[style, styles.fallback]} />;
  }

  return (
    <VideoView
      player={player}
      style={[styles.video, style]}
      contentFit="cover"
      nativeControls={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0908",
  },
  fallback: {
    backgroundColor: "#0a0908",
  },
});
