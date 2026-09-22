/**
 * Generate web-optimized marketing assets (WebP heroes/process, compressed MP4).
 * Run: `npm run optimize:web`
 *
 * CI/Vercel often installs with NODE_ENV=production (no devDependencies).
 * When `sharp` is unavailable, we skip if committed *-web-* assets already exist.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

let sharp;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  sharp = require("sharp");
} catch {
  sharp = null;
}

const root = path.join(__dirname, "..");
const marketingDir = path.join(root, "assets", "marketing");

/** Minimum set of pre-generated web assets checked into the repo for CI skips. */
const COMMITTED_WEB_ASSET_MARKERS = [
  "hero-slide-kankreg-phone-hero-web-1200.webp",
  "hero-slide-kankreg-product-wide-web-2400.webp",
  "home-hero-video-poster.webp",
  "timeline-brand-film-poster.webp",
];

function hasCommittedWebAssets() {
  return COMMITTED_WEB_ASSET_MARKERS.every((name) => fs.existsSync(path.join(marketingDir, name)));
}

let ffmpegAvailable;
function hasFfmpeg() {
  if (ffmpegAvailable !== undefined) return ffmpegAvailable;
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    ffmpegAvailable = true;
  } catch {
    ffmpegAvailable = false;
  }
  return ffmpegAvailable;
}

/** Git/CI checkouts often reset mtimes — trust committed outputs on Vercel/CI. */
function isOutputFresh(inputPath, outputPath) {
  if (!fs.existsSync(outputPath)) return false;
  if (process.env.VERCEL || process.env.CI) return true;
  return fs.statSync(outputPath).mtimeMs - fs.statSync(inputPath).mtimeMs >= 0;
}

const PHONE_HERO_PNGS = [
  "hero-slide-kankreg-phone-hero.png",
  "hero-slide-kankreg-phone-02.png",
  "hero-slide-kankreg-phone-03.png",
  "hero-slide-kankreg-phone-04.png",
];

const DESKTOP_HERO_PNGS = [
  "hero-slide-kankreg-product-wide.png",
  "hero-slide-kankreg-web-02.png",
  "hero-slide-kankreg-hero-03.png",
  "hero-slide-kankreg-web-04.png",
];

const PROCESS_PNGS = [
  "ghee-process-step-01-pasture.png",
  "ghee-process-step-02-milk.png",
  "ghee-process-step-03-curd.png",
  "ghee-process-step-04-bilona.png",
  "ghee-process-step-05-woodfire.png",
  "ghee-process-step-06-bottled.png",
];

const COMMUNITY_WEBP_SOURCES = [
  "hero-slide-05-wa-web-504.webp",
  "hero-slide-04-wa-web-504.webp",
  "hero-slide-06-wa-web-504.webp",
  "hero-slide-1-web-504.webp",
  "hero-slide-2-web-504.webp",
];

async function toWebp(inputName, outputName, maxWidth, quality = 80) {
  const input = path.join(marketingDir, inputName);
  const output = path.join(marketingDir, outputName);
  if (!fs.existsSync(input)) {
    console.warn(`[skip] missing ${inputName}`);
    return;
  }
  await sharp(input)
    .rotate()
    .resize(maxWidth, null, { withoutEnlargement: true, fit: "inside" })
    .webp({ quality, effort: 4, smartSubsample: true })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(
    `[webp] ${outputName} — ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024).toFixed(0)} KB (${maxWidth}px)`
  );
}

function compressVideo(inputName, outputName, scale = "720:-2", crf = 30) {
  const input = path.join(marketingDir, inputName);
  const output = path.join(marketingDir, outputName);
  if (!fs.existsSync(input)) {
    console.warn(`[skip] missing ${inputName}`);
    return;
  }
  if (isOutputFresh(input, output)) {
    console.log(`[video] ${outputName} up to date`);
    return;
  }
  if (!hasFfmpeg()) {
    if (fs.existsSync(output)) {
      console.warn(`[video] ${outputName} present — ffmpeg unavailable, skipping re-encode`);
      return;
    }
    console.warn(`[video] ffmpeg unavailable — cannot create ${outputName} (run optimize:web locally)`);
    return;
  }
  console.log(`[video] compressing ${inputName} → ${outputName}…`);
  execSync(
    [
      "ffmpeg -y -hide_banner -loglevel error",
      `-i "${input}"`,
      `-vf "scale=${scale}"`,
      "-c:v libx264 -preset fast -crf",
      String(crf),
      "-movflags +faststart",
      "-an",
      `"${output}"`,
    ].join(" "),
    { stdio: "inherit" }
  );
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(
    `[video] ${outputName} — ${(before / 1024 / 1024).toFixed(1)} MB → ${(after / 1024 / 1024).toFixed(2)} MB`
  );
}

function compressVideoPreview(inputName, outputName) {
  compressVideo(inputName, outputName, "360:-2", 40);
}

async function extractVideoPoster(inputName, outputName) {
  const input = path.join(marketingDir, inputName);
  const framePng = path.join(marketingDir, `.tmp-${outputName.replace(".webp", ".png")}`);
  const output = path.join(marketingDir, outputName);
  if (!fs.existsSync(input)) {
    console.warn(`[skip] missing ${inputName}`);
    return;
  }
  if (fs.existsSync(output)) {
    console.log(`[poster] ${outputName} up to date`);
    return;
  }
  if (!hasFfmpeg()) {
    console.warn(`[poster] ffmpeg unavailable — skipping ${outputName}`);
    return;
  }
  if (!sharp) {
    console.warn(`[poster] sharp unavailable — skipping ${outputName}`);
    return;
  }
  execSync(
    [
      "ffmpeg -y -hide_banner -loglevel error",
      `-ss 0.5 -i "${input}"`,
      "-vframes 1",
      `"${framePng}"`,
    ].join(" "),
    { stdio: "inherit" }
  );
  if (!fs.existsSync(framePng)) return;
  await sharp(framePng)
    .rotate()
    .resize(48, null, { withoutEnlargement: true, fit: "inside" })
    .webp({ quality: 42, effort: 4 })
    .toFile(output);
  fs.unlinkSync(framePng);
  console.log(`[poster] ${outputName} — ${(fs.statSync(output).size / 1024).toFixed(0)} KB`);
}

async function main() {
  if (!fs.existsSync(marketingDir)) {
    console.error("Missing assets/marketing/");
    process.exit(1);
  }

  if (!sharp) {
    if (hasCommittedWebAssets()) {
      console.warn(
        "[optimize:web] sharp not installed (production install?) — using committed web assets."
      );
      console.log("Done. Skipped regeneration; committed *-web-*.webp assets already in repo.");
      return;
    }
    console.error(
      "[optimize:web] sharp is required to generate web assets. Run: npm install --include=dev"
    );
    process.exit(1);
  }

  for (const name of PHONE_HERO_PNGS) {
    const base = name.replace(/\.png$/, "");
    await toWebp(name, `${base}-web-840.webp`, 1080, 84);
    await toWebp(name, `${base}-web-1200.webp`, 1200, 84);
  }

  for (const name of DESKTOP_HERO_PNGS) {
    const base = name.replace(/\.png$/, "");
    await toWebp(name, `${base}-web-1200.webp`, 1920, 85);
    await toWebp(name, `${base}-web-2400.webp`, 2400, 84);
  }

  for (const name of PROCESS_PNGS) {
    const base = name.replace(/\.png$/, "");
    await toWebp(name, `${base}-web-720.webp`, 720, 78);
  }

  for (const name of COMMUNITY_WEBP_SOURCES) {
    const base = name.replace(/-web-504\.webp$/i, "");
    const previewName = `${base}-preview-48.webp`;
    if (!fs.existsSync(path.join(marketingDir, name))) {
      console.warn(`[skip] missing ${name}`);
      continue;
    }
    if (fs.existsSync(path.join(marketingDir, previewName))) {
      console.log(`[preview] ${previewName} up to date`);
      continue;
    }
    await sharp(path.join(marketingDir, name))
      .resize(48, null, { withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 42, effort: 4 })
      .toFile(path.join(marketingDir, previewName));
    console.log(`[preview] ${previewName}`);
  }

  // LQIP previews for hero + process web assets (tiny blur-up placeholders).
  const previewSources = [
    ...PHONE_HERO_PNGS,
    ...DESKTOP_HERO_PNGS,
    ...PROCESS_PNGS,
  ];
  for (const name of previewSources) {
    const base = name.replace(/\.png$/i, "");
    await toWebp(name, `${base}-preview-48.webp`, 48, 42);
  }

  console.log("\nDone. Web bundles should use *-web-*.webp via marketing constants.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
