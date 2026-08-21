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
  const parsed = new URL(cloudinaryUrl);
  cloudinary.config({
    cloud_name: parsed.hostname,
    api_key: decodeURIComponent(parsed.username || ""),
    api_secret: decodeURIComponent(parsed.password || ""),
  });
} else {
  /** Missing config shouldn't crash the whole API — only image-upload routes need Cloudinary. */
  console.warn(
    "[cloudinary] Config missing (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET or CLOUDINARY_URL). Image uploads will fail until set."
  );
}

module.exports = cloudinary;
