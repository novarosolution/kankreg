const cloudinary = require("../config/cloudinary");

/** Purpose-based folders + max widths — Cloudinary auto WebP/AVIF + quality. */
const IMAGE_UPLOAD_PRESETS = {
  product: { folder: "kankreg/products", width: 960 },
  hero: { folder: "kankreg/marketing/hero", width: 1200 },
  about: { folder: "kankreg/marketing/about", width: 960 },
  community: { folder: "kankreg/marketing/community", width: 640 },
  process: { folder: "kankreg/marketing/process", width: 720 },
  compare: { folder: "kankreg/marketing/compare", width: 640 },
  marketing: { folder: "kankreg/marketing", width: 960 },
  avatar: { folder: "kankreg/avatars", width: 512 },
};

function resolvePreset(purpose) {
  const key = String(purpose || "product").toLowerCase();
  return IMAGE_UPLOAD_PRESETS[key] || IMAGE_UPLOAD_PRESETS.product;
}

function toDataUri(imageBase64, mimeType) {
  const hasDataPrefix = imageBase64.startsWith("data:image/");
  const safeMime =
    typeof mimeType === "string" && mimeType.startsWith("image/") ? mimeType : "image/jpeg";
  return hasDataPrefix ? imageBase64 : `data:${safeMime};base64,${imageBase64}`;
}

/**
 * Upload admin/user image with automatic resize + modern format delivery.
 * @returns {{ url, publicId, width, height, bytes, purpose }}
 */
async function uploadOptimizedImage({ imageBase64, mimeType, purpose = "product" }) {
  if (!imageBase64 || typeof imageBase64 !== "string") {
    const err = new Error("imageBase64 is required.");
    err.statusCode = 400;
    throw err;
  }

  const preset = resolvePreset(purpose);
  const uploadSource = toDataUri(imageBase64, mimeType);

  const uploaded = await cloudinary.uploader.upload(uploadSource, {
    folder: preset.folder,
    resource_type: "image",
    transformation: [
      {
        width: preset.width,
        crop: "limit",
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
  });

  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    width: uploaded.width,
    height: uploaded.height,
    bytes: uploaded.bytes,
    purpose: String(purpose || "product").toLowerCase(),
  };
}

function isPayloadTooLarge(error) {
  return (
    error?.http_code === 413 ||
    String(error?.message || "")
      .toLowerCase()
      .includes("file size")
  );
}

module.exports = {
  IMAGE_UPLOAD_PRESETS,
  uploadOptimizedImage,
  isPayloadTooLarge,
};
