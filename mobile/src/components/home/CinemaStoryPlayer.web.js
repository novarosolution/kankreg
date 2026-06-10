import React from "react";
import { StyleSheet } from "react-native";
import WebHtmlVideo from "./WebHtmlVideo";

/** Web brand film — native HTML5 video (expo-video is unreliable inside cinema layout). */
export default function CinemaStoryPlayer({ source, muted = true, style }) {
  return (
    <WebHtmlVideo
      source={source}
      active
      autoPlay
      muted={muted}
      loop
      fit="cover"
      cinematic
      style={[styles.fill, style]}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    width: "100%",
    height: "100%",
    minHeight: 220,
  },
});
