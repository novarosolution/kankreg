import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getKankregChromeTop } from "./KankregSiteHeader";
import KankregSiteFooter from "./KankregSiteFooter";

/**
 * Standard page tail: global HTML footer.
 * Header is mounted once in AppNavigator.
 */
export function KankregPageFooter() {
  return <KankregSiteFooter />;
}

/** Extra top padding below fixed header (web) or native chrome. */
export function useKankregContentPadding(extra = 0) {
  const insets = useSafeAreaInsets();
  const top = getKankregChromeTop(insets) + extra;
  const bottom = Platform.OS === "web" ? 24 : insets.bottom + 88;
  return { paddingTop: top, paddingBottom: bottom };
}

export function KankregScrollSpacer({ children, style }) {
  const { paddingTop } = useKankregContentPadding();
  return <View style={[{ paddingTop }, style]}>{children}</View>;
}
