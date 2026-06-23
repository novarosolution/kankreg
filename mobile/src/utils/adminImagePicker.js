import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { uploadAdminImage } from "../services/adminService";

/** Client-side caps before upload — server applies matching Cloudinary presets. */
export const ADMIN_IMAGE_PURPOSES = {
  product: { maxWidth: 960, pickerQuality: 0.6 },
  hero: { maxWidth: 1200, pickerQuality: 0.65 },
  about: { maxWidth: 960, pickerQuality: 0.62 },
  community: { maxWidth: 640, pickerQuality: 0.58 },
  process: { maxWidth: 720, pickerQuality: 0.6 },
  compare: { maxWidth: 640, pickerQuality: 0.58 },
  marketing: { maxWidth: 960, pickerQuality: 0.62 },
  avatar: { maxWidth: 512, pickerQuality: 0.72 },
};

function getPreset(purpose) {
  return ADMIN_IMAGE_PURPOSES[purpose] || ADMIN_IMAGE_PURPOSES.product;
}

function resizeWebImage(uri, maxWidth, jpegQuality) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const longest = Math.max(img.width, img.height, 1);
      const scale = Math.min(1, maxWidth / longest);
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not prepare image."));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
      const base64 = dataUrl.split(",")[1] || "";
      if (!base64) {
        reject(new Error("Could not compress image."));
        return;
      }
      resolve({ base64, mimeType: "image/jpeg", width, height });
    };
    img.onerror = () => reject(new Error("Could not read image."));
    img.src = uri;
  });
}

/** Pick from library and compress before upload. */
export async function pickAdminImage({
  purpose = "product",
  allowsEditing = true,
  aspect,
} = {}) {
  const preset = getPreset(purpose);

  if (Platform.OS !== "web") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error("Media library permission is required.");
    }
  }

  const pickerOptions = {
    mediaTypes: ["images"],
    allowsEditing,
    quality: preset.pickerQuality,
    base64: true,
  };
  if (aspect) pickerOptions.aspect = aspect;

  const picked = await ImagePicker.launchImageLibraryAsync(pickerOptions);
  if (picked.canceled) return null;

  const asset = picked.assets?.[0];
  if (!asset) return null;

  if (Platform.OS === "web" && asset.uri) {
    try {
      return await resizeWebImage(asset.uri, preset.maxWidth, preset.pickerQuality);
    } catch {
      // Fall through to picker base64 when canvas resize fails.
    }
  }

  if (!asset.base64) {
    throw new Error("Could not read image.");
  }

  return {
    base64: asset.base64,
    mimeType: asset.mimeType || "image/jpeg",
  };
}

/** Pick, compress, upload — returns Cloudinary URL + size metadata. */
export async function pickAndUploadAdminImage(
  token,
  { purpose = "product", allowsEditing = true, aspect } = {}
) {
  const picked = await pickAdminImage({ purpose, allowsEditing, aspect });
  if (!picked) return null;

  return uploadAdminImage(token, {
    imageBase64: picked.base64,
    mimeType: picked.mimeType,
    purpose,
  });
}

export function formatUploadSize(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
