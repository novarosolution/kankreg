import React, { useMemo } from "react";
import { Platform, StyleSheet } from "react-native";
import MotionScrollView from "../motion/MotionScrollView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  adminInnerPageScrollContent,
  adminScrollPaddingBottom,
  customerScrollPaddingBottomWithSticky,
  getAuthScrollContent,
  customerInnerPageScrollContent,
  customerPageScrollBase,
  customerScrollPaddingBottom,
  customerScrollPaddingTop,
  customerWebScrollBottomInset,
  mobileWebTabBarScrollPadding,
  CUSTOMER_INNER_PAGE_GAP,
} from "../../theme/screenLayout";
import { spacing } from "../../theme/tokens";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KankregPageFooter } from "./KankregPageScaffold";

/**
 * Standard customer scroll container: correct top inset under fixed header + optional site footer.
 * @param {"page"|"inner"|"admin"|"auth"} scrollVariant — page, inner, admin, auth (login/register)
 * @param {"scroll"|"external"} topInsetOwner — `external` when a sibling header owns safe-area (native home)
 * @param {boolean} flushNativeGutter — native figma screens: children use FIGMA.gutter (default true for page/inner)
 * @param {number} stickyFooterExtra — extra bottom pad for absolute sticky pay/buy bars
 */
export default function KankregScrollPage({
  children,
  showFooter,
  scrollVariant = "page",
  topInsetOwner = "scroll",
  flushNativeGutter = scrollVariant === "page" || scrollVariant === "inner",
  stickyFooterExtra = 0,
  contentContainerStyle,
  style,
  refreshControl,
  ...scrollProps
}) {
  const insets = useSafeAreaInsets();
  const { pageGutterClamp, isXs, showMobileWebTabBar } = useKankregLayout();
  const mobileWebBottomPad =
    Platform.OS === "web" && showMobileWebTabBar ? mobileWebTabBarScrollPadding(insets) : 0;
  const showSiteFooter =
    showFooter ??
    (scrollVariant !== "admin" && scrollVariant !== "auth" && Platform.OS === "web" && !showMobileWebTabBar);
  const pageGap = isXs ? spacing.md : CUSTOMER_INNER_PAGE_GAP;
  const baseStyle = useMemo(() => {
    const webGutterStyle = Platform.OS === "web" ? { paddingHorizontal: pageGutterClamp } : null;
    const nativeGutter = flushNativeGutter ? null : { paddingHorizontal: pageGutterClamp };
    const scrollInsets = {
      topInsetOwner,
      topInsetMin: spacing.xs,
      flushNativeGutter,
      stickyFooterExtra,
      compactWebGap: Platform.OS === "web" && isXs,
    };

    return scrollVariant === "auth"
      ? [
          getAuthScrollContent(pageGutterClamp),
          webGutterStyle,
          Platform.OS !== "web" ? { paddingBottom: adminScrollPaddingBottom(insets) } : null,
        ]
      : scrollVariant === "admin"
        ? [adminInnerPageScrollContent(insets), webGutterStyle, Platform.OS !== "web" ? nativeGutter : null]
        : scrollVariant === "inner"
          ? [
              customerInnerPageScrollContent(insets, scrollInsets),
              webGutterStyle,
              Platform.OS !== "web" ? { gap: pageGap } : isXs ? { gap: spacing.md } : null,
            ]
          : [
              customerPageScrollBase,
              webGutterStyle,
              Platform.OS !== "web" && flushNativeGutter ? { paddingHorizontal: 0 } : nativeGutter,
              {
                paddingTop: customerScrollPaddingTop(insets, {
                  webMin: spacing.md,
                  nativeMin: spacing.xs,
                  owner: topInsetOwner,
                }),
                paddingBottom:
                  stickyFooterExtra > 0
                    ? Platform.OS === "web"
                      ? customerWebScrollBottomInset(insets, {
                          stickyFooter: stickyFooterExtra,
                          mobileWebTabBar: showMobileWebTabBar,
                        })
                      : customerScrollPaddingBottomWithSticky(insets, stickyFooterExtra)
                    : customerScrollPaddingBottom(insets),
                ...(Platform.OS !== "web" ? { gap: pageGap } : isXs ? { gap: spacing.md } : null),
              },
            ];
  }, [
    flushNativeGutter,
    insets,
    isXs,
    pageGap,
    pageGutterClamp,
    scrollVariant,
    showMobileWebTabBar,
    stickyFooterExtra,
    topInsetOwner,
  ]);

  const resolvedContentStyle = useMemo(() => {
    const layers = [baseStyle, contentContainerStyle];
    if (Platform.OS !== "web") return layers;

    const merged = StyleSheet.flatten(layers) || {};
    let paddingBottom =
      typeof merged.paddingBottom === "number" ? merged.paddingBottom : spacing.xl;

    if (scrollVariant === "inner" && stickyFooterExtra > 0) {
      paddingBottom = Math.max(
        paddingBottom,
        customerWebScrollBottomInset(insets, {
          stickyFooter: stickyFooterExtra,
          mobileWebTabBar: showMobileWebTabBar,
        })
      );
    } else if (showMobileWebTabBar) {
      paddingBottom = Math.max(paddingBottom, mobileWebBottomPad);
    }

    if (paddingBottom === (typeof merged.paddingBottom === "number" ? merged.paddingBottom : spacing.xl)) {
      return layers;
    }
    return [...layers, { paddingBottom }];
  }, [
    baseStyle,
    contentContainerStyle,
    insets,
    mobileWebBottomPad,
    scrollVariant,
    showMobileWebTabBar,
    stickyFooterExtra,
  ]);

  return (
    <MotionScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={resolvedContentStyle}
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
