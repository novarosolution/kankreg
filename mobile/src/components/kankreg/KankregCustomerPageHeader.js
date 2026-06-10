import React from "react";
import { Platform, View } from "react-native";
import KankregUnifiedPageHeader from "./KankregUnifiedPageHeader";
import KankregPageTitle from "./KankregPageTitle";
import GoldHairline from "../ui/GoldHairline";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { spacing } from "../../theme/tokens";
import { webEyebrow, webSubtitle } from "../../theme/webLean";

/**
 * Shared customer page header — native Figma title, wide web editorial head,
 * narrow web Figma `KankregPageTitle` (matches Cart / Orders).
 */
export default function KankregCustomerPageHeader({
  eyebrow,
  title,
  subtitle,
  navigation,
  showBack = true,
  onBack,
  right,
  index,
  showBrand,
  showLocation,
  showHairline = false,
  compactNative = false,
  /** Force Figma title on all web widths (e.g. Orders-style screens). */
  figmaOnWeb = false,
}) {
  const { isMd } = useKankregLayout();
  const isNative = Platform.OS !== "web";

  const header = isNative ? (
    <KankregPageTitle eyebrow={eyebrow} title={title} right={right} compact={compactNative} />
  ) : figmaOnWeb || !isMd ? (
    <KankregPageTitle eyebrow={webEyebrow(eyebrow)} title={title} right={right} />
  ) : (
    <KankregUnifiedPageHeader
      eyebrow={webEyebrow(eyebrow)}
      title={title}
      subtitle={webSubtitle(subtitle)}
      navigation={navigation}
      showBack={showBack}
      onBack={onBack}
      right={right}
      index={index}
      showBrand={showBrand}
      showLocation={showLocation}
    />
  );

  if (!showHairline || isNative) {
    return header;
  }

  return (
    <View>
      {header}
      <GoldHairline marginVertical={spacing.sm} />
    </View>
  );
}
