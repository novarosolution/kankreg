import React from "react";
import ProgressiveImage from "./ProgressiveImage";

/**
 * Product / catalog image — blurred LQIP first, full quality via load balancer.
 */
export default function ProgressiveProductImage({
  uri,
  previewUri = "",
  style,
  className,
  contentFit = "cover",
  onError,
  priority = "normal",
  recyclingKey,
  rounded = 14,
  showSkeleton = true,
}) {
  if (!uri) return null;

  return (
    <ProgressiveImage
      uri={uri}
      previewSource={previewUri || undefined}
      style={style}
      className={className}
      contentFit={contentFit}
      onError={onError}
      priority={priority}
      recyclingKey={recyclingKey || uri}
      rounded={rounded}
      showSkeleton={showSkeleton}
      width={840}
      quality="auto:good"
    />
  );
}
