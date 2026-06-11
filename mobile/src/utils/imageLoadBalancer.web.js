/** Web image load balancer — limits concurrent full-res downloads by network quality. */

export const ImageLoadPriority = {
  HIGH: 100,
  NORMAL: 0,
  LOW: -10,
};

function maxConcurrent() {
  if (typeof navigator === "undefined") return 4;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn?.saveData) return 1;
  const type = String(conn?.effectiveType || "");
  if (type === "slow-2g" || type === "2g") return 1;
  if (type === "3g") return 2;
  return 4;
}

let active = 0;
const queue = [];

function drain() {
  const limit = maxConcurrent();
  queue.sort((a, b) => b.priority - a.priority);
  while (active < limit && queue.length) {
    const job = queue.shift();
    active += 1;
    Promise.resolve()
      .then(job.run)
      .then(job.resolve)
      .catch(job.reject)
      .finally(() => {
        active -= 1;
        drain();
      });
  }
}

export function scheduleImageLoad(run, priority = ImageLoadPriority.NORMAL) {
  return new Promise((resolve, reject) => {
    queue.push({ run, priority, resolve, reject });
    drain();
  });
}

export function preloadImage(src, priority = ImageLoadPriority.NORMAL) {
  if (!src || typeof window === "undefined") return Promise.resolve("");
  return scheduleImageLoad(
    () =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.decoding = "async";
        if (priority >= ImageLoadPriority.HIGH && "fetchPriority" in img) {
          img.fetchPriority = "high";
        }
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      }),
    priority
  );
}

/** Preload video via hidden element — shares the same concurrency queue as images. */
export function preloadVideo(src, priority = ImageLoadPriority.NORMAL) {
  if (!src || typeof window === "undefined") return Promise.resolve("");
  return scheduleImageLoad(
    () =>
      new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        const cleanup = () => {
          video.removeAttribute("src");
          video.load();
        };
        video.oncanplaythrough = () => {
          resolve(src);
          cleanup();
        };
        video.onerror = () => {
          reject(new Error(`Failed to load ${src}`));
          cleanup();
        };
        video.src = src;
        video.load();
      }),
    priority
  );
}
