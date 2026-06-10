import { Platform } from "react-native";

const injected = new Set();

/** Inject a `<style>` block once on web (CSS animations, etc.). */
export function injectWebCssOnce(id, cssText) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  if (injected.has(id) || document.getElementById(id)) {
    injected.add(id);
    return;
  }
  const node = document.createElement("style");
  node.id = id;
  node.textContent = cssText;
  document.head.appendChild(node);
  injected.add(id);
}
