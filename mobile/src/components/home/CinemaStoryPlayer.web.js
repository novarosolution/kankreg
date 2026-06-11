import React from "react";
import { StyleSheet } from "react-native";
import WebHtmlVideo from "./WebHtmlVideo";

/** Web brand film — progressive HTML5 video (preview → full via load balancer). */
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
      progressive
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
