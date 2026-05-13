// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "dwjvgaoxa", // Fallback for development
  UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || "teamup_uploads", // Fallback for development
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// API endpoint
export const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`;
