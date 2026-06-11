import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import useWhenVisible from "../../hooks/useWhenVisible";

/**
 * Mount children only when the placeholder enters (or nears) the viewport on web.
 */
export default function LazyWhenVisible({
  children,
  rootMargin = "320px",
  minHeight = 1,
  style,
  placeholder = null,
}) {
  const { ref, visible } = useWhenVisible({ rootMargin, once: true });

  return (
    <View
      ref={ref}
      style={[styles.wrap, minHeight ? { minHeight } : null, style]}
      collapsable={false}
    >
      {visible ? children : placeholder}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    ...Platform.select({
      web: { contentVisibility: "auto", containIntrinsicSize: "auto 480px" },
      default: {},
    }),
  },
});
