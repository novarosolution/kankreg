import React from "react";
import { Platform, StyleSheet } from "react-native";
import MotionScrollView from "../motion/MotionScrollView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  adminInnerPageScrollContent,
  adminScrollPaddingBottom,
  getAuthScrollContent,
  customerInnerPageScrollContent,
  customerPageScrollBase,
  customerScrollPaddingBottom,
  customerScrollPaddingTop,
  CUSTOMER_INNER_PAGE_GAP,
} from "../../theme/screenLayout";
import { spacing } from "../../theme/tokens";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
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
  const { pageGutterClamp, isXs } = useKankregLayout();
  const showSiteFooter = showFooter ?? (scrollVariant !== "admin" && scrollVariant !== "auth");
  const nativeGutter = { paddingHorizontal: pageGutterClamp };
  const pageGap = isXs ? spacing.md : CUSTOMER_INNER_PAGE_GAP;
  const baseStyle =
    scrollVariant === "auth"
      ? [
          getAuthScrollContent(pageGutterClamp),
          Platform.OS !== "web" ? { paddingBottom: adminScrollPaddingBottom(insets) } : null,
        ]
      : scrollVariant === "admin"
        ? [adminInnerPageScrollContent(insets), Platform.OS !== "web" ? nativeGutter : null]
        : scrollVariant === "inner"
          ? [
              customerInnerPageScrollContent(insets, Platform.OS !== "web" ? nativeGutter : null),
              Platform.OS !== "web" ? { gap: pageGap } : null,
            ]
          : [
              customerPageScrollBase,
              Platform.OS !== "web" ? nativeGutter : null,
              {
                paddingTop: customerScrollPaddingTop(insets, { webMin: spacing.md }),
                paddingBottom: customerScrollPaddingBottom(insets),
                ...(Platform.OS !== "web" ? { gap: pageGap } : null),
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
