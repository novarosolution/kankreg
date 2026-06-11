/** GSAP — sync require on web (dynamic import() breaks Metro static export chunks). */
let scrollTriggerRegistered = false;

export async function getGsap() {
  // eslint-disable-next-line global-require
  return require("gsap").gsap;
}

export async function getScrollTrigger() {
  // eslint-disable-next-line global-require
  const gsap = require("gsap").gsap;
  // eslint-disable-next-line global-require
  const stMod = require("gsap/ScrollTrigger");
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(stMod.ScrollTrigger);
    scrollTriggerRegistered = true;
  }
  return stMod.ScrollTrigger;
}
