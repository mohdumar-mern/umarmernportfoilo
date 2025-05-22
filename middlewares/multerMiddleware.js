import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Allowed file formats
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "pdf", "docx"];

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    // Determine resource type (image or raw)
    const resourceType = ["pdf", "docx"].includes(fileExtension) ? "raw" : "image";

    return {
      folder: "umar-portfolio/uploads",
      allowed_formats: ALLOWED_FORMATS,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      transformation:
        resourceType === "image"
          ? [{ width: 1000, height: 1000, crop: "limit" }]
          : undefined,
    };
  },
});

// Setup multer middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
});

export default upload;
