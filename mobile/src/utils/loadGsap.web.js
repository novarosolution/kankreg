/** GSAP — sync require on web (dynamic import() breaks Metro static export chunks). */
let scrollTriggerRegistered = false;

export async function getGsap() {
  return require("gsap").gsap;
}

export async function getScrollTrigger() {
  const gsap = require("gsap").gsap;
  const stMod = require("gsap/ScrollTrigger");
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(stMod.ScrollTrigger);
    scrollTriggerRegistered = true;
  }
  return stMod.ScrollTrigger;
}
