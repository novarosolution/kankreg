import React from "react";
import { Platform } from "react-native";
import ScreenPageHeader from "../ScreenPageHeader";
import { KankregSectionHead } from "./KankregPageChrome";
import { useKankregLayout } from "../../theme/kankregBreakpoints";

/**
 * One page title per screen: editorial section head on web (≥900px), compact card header on native/narrow.
 */
export default function KankregUnifiedPageHeader({
  eyebrow,
  title,
  subtitle,
  navigation,
  showBack,
  onBack,
  right,
  index,
  showBrand = true,
  showLocation = true,
}) {
  const { isMd, isXs, compactHeader } = useKankregLayout();
  const useEditorialHead = Platform.OS === "web" && isMd;
  const isNative = Platform.OS !== "web";
  const mobileCompact = isNative || isXs || compactHeader;
  const resolvedShowBrand = showBrand ?? !mobileCompact;
  const resolvedShowLocation = showLocation ?? !mobileCompact;
  const resolvedSubtitle = subtitle ?? (!mobileCompact && eyebrow ? eyebrow : undefined);

  if (useEditorialHead) {
    return (
      <KankregSectionHead
        index={index}
        eyebrow={eyebrow}
        title={title}
        right={right}
      />
    );
  }

  return (
    <ScreenPageHeader
      eyebrow={mobileCompact ? eyebrow : undefined}
      title={title}
      subtitle={resolvedSubtitle}
      navigation={navigation}
      showBack={showBack}
      onBack={onBack}
      right={right}
      showBrand={resolvedShowBrand}
      showLocation={resolvedShowLocation}
      compact={mobileCompact}
    />
  );
}
