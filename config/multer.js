import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  },
});

// File/image storage — all types, stored as-is
export const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: "chat-files",
      resource_type: isImage ? "image" : "raw", // "raw" for non-image files
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "pdf", "doc", "docx", "txt", "zip"],
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    };
  },
});

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadFile = multer({
  storage: fileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

export default uploadAvatar; 