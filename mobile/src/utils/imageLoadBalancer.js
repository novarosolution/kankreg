/** Native: load images immediately (no concurrency gate). */
export const ImageLoadPriority = {
  HIGH: 100,
  NORMAL: 0,
  LOW: -10,
};

export function scheduleImageLoad(run) {
  return Promise.resolve().then(run);
}

/** Native: prefetch via expo-image disk cache when available. */
export function preloadImage(src) {
  return scheduleImageLoad(() => {
    if (!src) return Promise.resolve();
    try {
      const { Image } = require("expo-image");
      return Image.prefetch(src).catch(() => {
        const { Image: RNImage } = require("react-native");
        return RNImage.prefetch(src);
      });
    } catch {
      const { Image: RNImage } = require("react-native");
      return RNImage.prefetch(src);
    }
  });
}
