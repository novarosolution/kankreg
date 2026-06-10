/**
 * Build light/dark launcher icons from reference sources.
 * Run: `npm run icons:generate`
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const assetsDir = path.join(root, "assets");
const refDir = path.join(root, "reference/logo");

const SOURCES = {
  light: path.join(refDir, "app-icon-light-source.png"),
  dark: path.join(refDir, "app-icon-dark-source.png"),
};

const BACKGROUNDS = {
  light: { r: 245, g: 239, b: 228, alpha: 1 },
  dark: { r: 26, g: 23, b: 20, alpha: 1 },
};

async function writeIcon(name, src, bg) {
  const out = path.join(assetsDir, name);
  await sharp(src).resize(1024, 1024, { fit: "contain", background: bg }).png().toFile(out);
  console.log("Wrote", name);
}

async function main() {
  for (const key of Object.keys(SOURCES)) {
    if (!fs.existsSync(SOURCES[key])) {
      console.error("Missing", SOURCES[key]);
      process.exit(1);
    }
  }

  await writeIcon("app-icon-light.png", SOURCES.light, BACKGROUNDS.light);
  await writeIcon("app-icon-dark.png", SOURCES.dark, BACKGROUNDS.dark);
  await writeIcon("icon.png", SOURCES.light, BACKGROUNDS.light);
  await writeIcon("adaptive-icon.png", SOURCES.light, BACKGROUNDS.light);
  await sharp(path.join(assetsDir, "app-icon-light.png"))
    .resize(192, 192, { fit: "contain", background: BACKGROUNDS.light })
    .png()
    .toFile(path.join(assetsDir, "favicon.png"));
  console.log("Wrote favicon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
