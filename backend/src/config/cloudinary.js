const { v2: cloudinary } = require("cloudinary");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else if (cloudinaryUrl) {
  try {
    const parsed = new URL(cloudinaryUrl);
    cloudinary.config({
      cloud_name: parsed.hostname,
      api_key: decodeURIComponent(parsed.username || ""),
      api_secret: decodeURIComponent(parsed.password || ""),
    });
  } catch {
    console.warn(
      "[cloudinary] CLOUDINARY_URL is set but invalid. Image uploads will fail until it is a valid cloudinary:// URL."
    );
  }
} else {
  /** Missing config shouldn't crash the whole API — only image-upload routes need Cloudinary. */
  console.warn(
    "[cloudinary] Config missing. Product image uploads are disabled until CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET is set. Seeded /media/marketing images still work."
  );
}

function isCloudinaryConfigured() {
  const cfg = cloudinary.config() || {};
  return Boolean(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

cloudinary.isConfigured = isCloudinaryConfigured;

module.exports = cloudinary;
