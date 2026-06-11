/** Static LCP hero shell injected into exported `index.html` by post-export-web.js. */

export function hasLcpShell() {
  return typeof document !== "undefined" && Boolean(document.getElementById("kankreg-lcp-shell"));
}

export function setLcpShellVisible(visible) {
  if (typeof document === "undefined") return;
  const shell = document.getElementById("kankreg-lcp-shell");
  if (!shell) return;
  shell.style.display = visible ? "block" : "none";
}
