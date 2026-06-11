/** GSAP loader — sync in dev (Metro HMR), dynamic import in production web builds. */
let gsapPromise = null;
let scrollTriggerPromise = null;

export async function getGsap() {
  if (__DEV__) {
    // eslint-disable-next-line global-require
    return require("gsap").gsap;
  }
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((mod) => mod.gsap);
  }
  return gsapPromise;
}

export async function getScrollTrigger() {
  if (__DEV__) {
    // eslint-disable-next-line global-require
    const gsap = require("gsap").gsap;
    const stMod = require("gsap/ScrollTrigger");
    gsap.registerPlugin(stMod.ScrollTrigger);
    return stMod.ScrollTrigger;
  }
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = Promise.all([getGsap(), import("gsap/ScrollTrigger")]).then(([gsap, stMod]) => {
      gsap.registerPlugin(stMod.ScrollTrigger);
      return stMod.ScrollTrigger;
    });
  }
  return scrollTriggerPromise;
}
