import { Platform } from "react-native";
import { ALCHEMY } from "./customerAlchemy";
import { KANKREG_CHROME } from "./kankregWeb";
import { WEB_DISPLAY_FONT, WEB_DISPLAY_FONT_CDN } from "./webFonts";

/** Fixed top bar height on web (kankreg.html `.topbar` ≈ 76px). */
export const WEB_HEADER_HEIGHT = 76;
/** Slim in-flow header on native — bottom tab bar handles primary nav. */
export const NATIVE_HEADER_HEIGHT = 52;
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
let displayFontInjected = false;

/** Load CIENUR display face for web headings (dev + static export). */
export function injectWebDisplayFont() {
  if (Platform.OS !== "web" || typeof document === "undefined" || displayFontInjected) return;
  displayFontInjected = true;

  const head = document.head;
  if (!head) return;

  if (!document.querySelector('link[data-kankreg="cienur-font"]')) {
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://fonts.cdnfonts.com";
    preconnect.crossOrigin = "anonymous";
    head.appendChild(preconnect);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = WEB_DISPLAY_FONT_CDN;
    link.setAttribute("data-kankreg", "cienur-font");
    head.appendChild(link);
  }
}

/** Web-only: description, theme-color, lang, and CIENUR display font. */
export function injectWebDocumentMeta() {
  if (Platform.OS !== "web" || typeof document === "undefined") return;

  injectWebDisplayFont();

  const html = document.documentElement;
  if (!html.getAttribute("lang")) {
    html.setAttribute("lang", "en");
  }

  const ensureMeta = (name, content) => {
    if (!content || document.querySelector(`meta[name="${name}"]`)) return;
    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  };

  ensureMeta(
    "description",
    "KankreG — premium A2 ghee and artisan pantry goods, delivered fresh to your door."
  );
  ensureMeta("theme-color", KANKREG_CHROME.cream);
  ensureMeta("color-scheme", "light dark");
}

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
    const g = `radial-gradient(1100px 560px at 88% -8%, rgba(214, 173, 91, 0.12), transparent 60%), radial-gradient(900px 500px at -8% 108%, rgba(60, 98, 72, 0.06), transparent 55%), ${KANKREG_CHROME.cream}`;
    body.style.background = g;
    body.style.backgroundAttachment = "scroll";
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
      @media (max-width: 1080px) {
        html {
          scroll-behavior: auto;
        }
      }
      html, body {
        overflow-x: clip;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      #root, [data-expo-root] {
        min-height: 100dvh;
        width: 100%;
        max-width: 100%;
        overflow-x: clip;
      }
      body {
        overscroll-behavior-y: none;
        -webkit-tap-highlight-color: transparent;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      video {
        max-width: 100%;
      }
      video[data-kankreg-fill="true"],
      .kankreg-cinema-reel video,
      .kankreg-cinema-video {
        width: 100% !important;
        height: 100% !important;
        max-width: none;
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
      @media (max-width: 1080px) {
        [data-kankreg-scroll-panel] {
          max-width: 100%;
          overflow-x: clip;
        }
      }
      @media (max-width: 560px) {
        h1, h2, [role="heading"] {
          overflow-wrap: anywhere;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      @font-face {
        font-display: swap;
      }
      [data-kankreg-display="true"],
      h1, h2, h3 {
        font-family: '${WEB_DISPLAY_FONT}', Georgia, 'Times New Roman', serif;
      }
    `;
    document.head.appendChild(style);
  }
}
