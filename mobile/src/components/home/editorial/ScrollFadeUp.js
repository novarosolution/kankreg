import React from "react";
import { Platform, View } from "react-native";
import SectionReveal from "../../motion/SectionReveal";
import { motionDuration } from "../../../theme/motion";

/**
 * Web home section reveal — soft fade-up on scroll (GSAP via `SectionReveal`).
 * Respects `prefers-reduced-motion` through `SectionReveal` / `useGsapReveal`.
 *
 * For staggered product grids, use `CatalogGridReveal` instead.
 */
export default function ScrollFadeUp({
  children,
  index,
  delay,
  immediate = false,
  style,
  start = "top 88%",
  preset = "fade-up",
}) {
  if (Platform.OS !== "web") {
    return <View style={style}>{children}</View>;
  }

  return (
    <SectionReveal
      index={index}
      delay={delay}
      immediate={immediate}
      preset={preset}
      start={start}
      duration={motionDuration.slow}
      style={style}
    >
      {children}
    </SectionReveal>
  );
}
