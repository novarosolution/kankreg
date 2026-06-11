/** Native: load images immediately (no concurrency gate). */
export const ImageLoadPriority = {
  HIGH: 100,
  NORMAL: 0,
  LOW: -10,
};

export function scheduleImageLoad(run) {
  return Promise.resolve().then(run);
}

export function preloadImage(src) {
  return scheduleImageLoad(
    () =>
      new Promise((resolve, reject) => {
        const { Image: RNImage } = require("react-native");
        RNImage.prefetch(src).then(resolve).catch(reject);
      })
  );
}

export function preloadVideo(src) {
  return preloadImage(src);
}
