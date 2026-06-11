import { Platform } from "react-native";
import { FIGMA } from "../theme/figmaApp";

/**
 * Phone home section insets — matches category/grid gutters (FIGMA.gutter on native).
 * Mobile web: scroll is flush edge-to-edge; sections use `pageGutterClamp` via body padding (no negative breakout).
 */
export function getHomePhoneBleed({ isMobileWeb, pageGutterClamp, nativeFullWidth = false }) {
  const isNativePhone = Platform.OS !== "web" && nativeFullWidth;
  const isPhoneWeb = isMobileWeb;

  if (!isNativePhone && !isPhoneWeb) {
    return { outer: {}, inner: {}, railPad: {}, edgePad: 0 };
  }

  if (isPhoneWeb) {
    return {
      outer: {
        width: "100%",
        alignSelf: "stretch",
        maxWidth: "100%",
      },
      inner: {},
      railPad: {},
      edgePad: pageGutterClamp,
    };
  }

  const edgePad = FIGMA.gutter;
  return {
    outer: {
      marginHorizontal: edgePad,
      width: "auto",
      alignSelf: "stretch",
      maxWidth: "100%",
    },
    inner: {},
    railPad: { paddingLeft: edgePad, paddingRight: edgePad },
    edgePad,
  };
}
