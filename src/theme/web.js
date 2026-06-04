import { Platform } from "react-native";
import { ALCHEMY } from "./customerAlchemy";

/** Fixed top bar height on web (kankreg.html `.topbar` ≈ 76px). */
export const WEB_HEADER_HEIGHT = 76;
/** kankreg.html `.announce` strip */
export const WEB_ANNOUNCE_HEIGHT = 34;
/** Announce + sticky topbar — use for page scroll padding. */
export const WEB_CHROME_TOP = WEB_HEADER_HEIGHT + WEB_ANNOUNCE_HEIGHT;
/** Shared top offset for sticky page chrome below fixed header. */
export const WEB_STICKY_TOP_OFFSET = WEB_CHROME_TOP + 12;
/** Shared z-index ladder to prevent header/dropdown overlap bugs. */
export const WEB_Z_INDEX = {
  header: 1000,
  dropdown: 1200,
  overlay: 1100,
};

/** Root shell: full viewport height on web so the layout feels like a real page. */
export const webRootStyle = Platform.select({
  web: {
    flex: 1,
    width: "100%",
    maxWidth: "100%",
    // Match Expo’s html/body/#root chain so flex children get a real height (avoids blank web).
    minHeight: "100dvh",
    height: "100%",
  },
  default: {
    flex: 1,
  },
});

let premiumChromeInjected = false;

/**
 * Web-only: fixed gradient page backdrop, font smoothing, selection & focus rings.
 * Call when theme (light/dark) changes.
 */
export function applyWebPremiumChrome(isDark, backgroundSolid) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;
  body.style.margin = "0";
  body.style.minHeight = "100%";
  html.style.minHeight = "100%";

  if (isDark) {
    body.style.background = backgroundSolid || "#0A0908";
    body.style.backgroundAttachment = "scroll";
    html.style.background = backgroundSolid || "#0A0908";
    html.style.colorScheme = "dark";
  } else {
    const g = `radial-gradient(1100px 560px at 88% -8%, rgba(214, 173, 91, 0.12), transparent 60%), radial-gradient(900px 500px at -8% 108%, rgba(60, 98, 72, 0.06), transparent 55%), ${ALCHEMY.cream}`;
    body.style.background = g;
    body.style.backgroundAttachment = "fixed";
    html.style.background = g;
    html.style.colorScheme = "light";
  }

  body.style.webkitFontSmoothing = "antialiased";
  // @ts-ignore
  body.style.MozOsxFontSmoothing = "grayscale";
  body.style.textRendering = "geometricPrecision";
  body.style.letterSpacing = "0.01em";
  body.style.fontFeatureSettings = '"cv11","ss01","ss03"';

  if (!premiumChromeInjected) {
    premiumChromeInjected = true;
    const style = document.createElement("style");
    style.setAttribute("data-kankreg", "premium-chrome");
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      html, body {
        overflow-x: hidden;
        max-width: 100vw;
      }
      #root, [data-expo-root] {
        min-height: 100dvh;
        width: 100%;
        max-width: 100vw;
        overflow-x: clip;
      }
      body {
        overscroll-behavior-y: none;
        -webkit-tap-highlight-color: transparent;
      }
      img, video {
        max-width: 100%;
        height: auto;
      }
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background: rgba(100, 116, 139, 0.08);
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(138, 90, 18, 0.35);
        border-radius: 999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(138, 90, 18, 0.5);
      }
      ::selection {
        background: #d6ad5b;
        color: #fff;
      }
      *:focus-visible {
        outline: 2px solid rgba(138, 90, 18, 0.48);
        outline-offset: 3px;
      }
      a, button, [role="button"], [role="tab"] {
        transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease, background-color 180ms ease, border-color 180ms ease;
      }
      a:hover, button:hover, [role="button"]:hover, [role="tab"]:hover {
        transform: translateY(-1px);
      }
      a:active, button:active, [role="button"]:active, [role="tab"]:active {
        transform: translateY(0);
      }
      @media (max-width: 760px) {
        ::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
