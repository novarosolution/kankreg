import React from "react";
import { Platform, StyleSheet } from "react-native";
import MotionScrollView from "../motion/MotionScrollView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  adminInnerPageScrollContent,
  adminScrollPaddingBottom,
  authScrollContent,
  customerInnerPageScrollContent,
  customerPageScrollBase,
  customerScrollPaddingBottom,
  customerScrollPaddingTop,
} from "../../theme/screenLayout";
import { spacing } from "../../theme/tokens";
import { KankregPageFooter } from "./KankregPageScaffold";

/**
 * Standard customer scroll container: correct top inset under fixed header + optional site footer.
 * @param {"page"|"inner"|"admin"|"auth"} scrollVariant — page, inner, admin, auth (login/register)
 */
export default function KankregScrollPage({
  children,
  showFooter,
  scrollVariant = "page",
  contentContainerStyle,
  style,
  refreshControl,
  ...scrollProps
}) {
  const insets = useSafeAreaInsets();
  const showSiteFooter = showFooter ?? (scrollVariant !== "admin" && scrollVariant !== "auth");
  const baseStyle =
    scrollVariant === "auth"
      ? [
          authScrollContent,
          Platform.OS !== "web" ? { paddingBottom: adminScrollPaddingBottom(insets) } : null,
        ]
      : scrollVariant === "admin"
        ? adminInnerPageScrollContent(insets)
        : scrollVariant === "inner"
          ? customerInnerPageScrollContent(insets)
          : [
              customerPageScrollBase,
              {
                paddingTop: customerScrollPaddingTop(insets, { webMin: spacing.md }),
                paddingBottom: customerScrollPaddingBottom(insets),
              },
            ];

  return (
    <MotionScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={[baseStyle, contentContainerStyle]}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
      {showSiteFooter ? <KankregPageFooter /> : null}
    </MotionScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
    ...Platform.select({
      web: { minHeight: 0 },
      default: {},
    }),
  },
});
