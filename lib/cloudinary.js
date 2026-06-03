import { v2 as cloudinary } from "cloudinary";

/* ================================
   Cloudinary Configuration
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ================================
   Public ID Normalization
================================ */
export function normalizePublicId(publicId) {
  if (!publicId) return [];

  const id = String(publicId).trim();
  if (!id) return [];

  const candidates = [id];

  // Handle different storage patterns
  if (!id.includes("/") && !id.startsWith("aiv-films")) {
    candidates.push(`aiv-films-${id}`);
    candidates.push(`aiv-films/${id}`);
  }

  return [...new Set(candidates)];
}

/* ================================
   URL Builders
================================ */
export function cloudinaryImageCandidates(cloudName, publicId) {
  if (!cloudName || !publicId) return [];

  return normalizePublicId(publicId).map(
    (pid) => `https://res.cloudinary.com/${cloudName}/image/upload/${pid}`
  );
}

export function cloudinaryVideoCandidates(cloudName, publicId) {
  if (!cloudName || !publicId) return [];

  return normalizePublicId(publicId).map(
    (pid) => `https://res.cloudinary.com/${cloudName}/video/upload/${pid}`
  );
}

/* ================================
   Convenience Helpers
================================ */
export function cloudinaryImage(cloudName, publicId) {
  const urls = cloudinaryImageCandidates(cloudName, publicId);
  return urls[0] || null;
}

export function cloudinaryVideo(cloudName, publicId) {
  const urls = cloudinaryVideoCandidates(cloudName, publicId);
  return urls[0] || null;
}

/* ================================
   Upload Functions (NEW)
================================ */

/**
 * Upload large files (videos, big media)
 * Uses chunked upload automatically
 */
export async function uploadLargeToCloudinary(filePath, options = {}) {
  try {
    const result = await cloudinary.uploader.upload_large(filePath, {
      resource_type: "auto", // handles video + image
      chunk_size: 10000000,  // 10MB chunks
      folder: "aiv-films",
      async: false,
      ...options,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload_large error:", error);
    throw error;
  }
}

/**
 * Optional: standard upload (for small files)
 */
export async function uploadToCloudinary(filePath, options = {}) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "aiv-films",
      ...options,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}