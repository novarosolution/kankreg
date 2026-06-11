import { Platform } from "react-native";

/** Break out of `webHomeBody` gutters so editorial sections span the phone viewport. */
export function getHomePhoneBleed({ isMobileWeb, pageGutterClamp, width, nativeFullWidth = false }) {
  const phoneEdge =
    isMobileWeb || (Platform.OS !== "web" && nativeFullWidth);

  if (!phoneEdge) {
    return { outer: {}, inner: {}, railPad: {} };
  }

  const gutter = isMobileWeb ? pageGutterClamp : 0;
  const edgePad = 16;

  return {
    outer: isMobileWeb
      ? {
          marginHorizontal: -gutter,
          width,
          alignSelf: "center",
          borderRadius: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }
      : { width: "100%" },
    inner: { paddingHorizontal: edgePad },
    railPad: { paddingLeft: edgePad, paddingRight: edgePad },
    edgePad,
  };
}
