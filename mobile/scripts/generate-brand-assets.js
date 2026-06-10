/**
 * Build transparent brand PNGs from `assets/kankreg-brand-source.png`.
 * Run: `npm run brand:generate`
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "assets", "kankreg-brand-source.png");
const assetsDir = path.join(root, "assets");

async function makeTransparent(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = data.length / 4;
  for (let i = 0; i < pixels; i++) {
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (r < 28 && g < 28 && b < 28) {
      data[o + 3] = 0;
    } else if (r < 45 && g < 45 && b < 45) {
      const t = Math.max(r, g, b) / 45;
      data[o + 3] = Math.round(data[o + 3] * t);
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png();
}

async function writePng(name, size) {
  const out = path.join(assetsDir, name);
  await sharp(path.join(assetsDir, "kankreg-brand.png"))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log("Wrote", name);
}

async function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error("Missing assets/kankreg-brand-source.png");
    process.exit(1);
  }

  const trimmed = await sharp(sourcePath).trim({ threshold: 15 }).toBuffer();
  await (await makeTransparent(trimmed)).toFile(path.join(assetsDir, "kankreg-brand.png"));

  await writePng("splash-icon.png", 420);
  await writePng("icon.png", 1024);
  await writePng("adaptive-icon.png", 1024);
  await writePng("favicon.png", 192);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
