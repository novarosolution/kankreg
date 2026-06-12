/**
 * @expo/vector-icons ships glyphmaps under build/vendor. Incomplete npm installs
 * (e.g. NODE_ENV=production without devDeps, interrupted ci) leave Metro unable
 * to resolve Zocial.json and other icon maps.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const mobileRoot = path.join(__dirname, "..");
const iconsPkg = path.join(mobileRoot, "node_modules", "@expo/vector-icons");
const glyphDir = path.join(
  iconsPkg,
  "build",
  "vendor",
  "react-native-vector-icons",
  "glyphmaps"
);
const marker = path.join(glyphDir, "Zocial.json");

function glyphmapsOk() {
  if (!fs.existsSync(marker)) return false;
  const required = ["Ionicons.json", "MaterialCommunityIcons.json", "MaterialIcons.json"];
  return required.every((name) => fs.existsSync(path.join(glyphDir, name)));
}

if (glyphmapsOk()) {
  process.exit(0);
}

console.warn("[postinstall] @expo/vector-icons vendor glyphmaps missing — repairing…");

try {
  execSync("npm install @expo/vector-icons@14.1.0 --no-save --ignore-scripts", {
    cwd: mobileRoot,
    stdio: "inherit",
  });
} catch (err) {
  console.error("[postinstall] Failed to reinstall @expo/vector-icons:", err.message);
  process.exit(1);
}

if (!glyphmapsOk()) {
  console.error(
    "[postinstall] @expo/vector-icons still broken. Run: cd mobile && rm -rf node_modules && npm install"
  );
  process.exit(1);
}

console.log("[postinstall] @expo/vector-icons vendor repaired.");
