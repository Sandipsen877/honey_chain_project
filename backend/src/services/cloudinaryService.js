import { v2 as cloudinary } from "cloudinary";

const configured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    "[cloudinaryService] CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET not set - image uploads will fail until configured."
  );
}

/**
 * Uploads an in-memory image buffer (from multer memoryStorage) to Cloudinary.
 * Returns { url, publicId }. Throws (503) if Cloudinary isn't configured.
 */
function uploadImageBuffer(buffer, { folder = "varroa-detections", publicIdPrefix = "" } = {}) {
  if (!configured) {
    const error = new Error(
      "Cloudinary is not configured (set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env)"
    );
    error.statusCode = 503;
    return Promise.reject(error);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicIdPrefix ? `${publicIdPrefix}-${Date.now()}` : undefined,
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export { uploadImageBuffer };
