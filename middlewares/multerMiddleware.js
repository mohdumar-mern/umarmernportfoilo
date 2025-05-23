import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Allowed file formats
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "pdf", "docx"];

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const originalName = file.originalname
      .split(".")[0]
      .trim()
      .replace(/\s+/g, "_");
    const fileExtension = file.originalname.split(".").pop().toLowerCase();
    const isDocument = ["pdf", "docx"].includes(fileExtension);

    return {
      folder: "umar-portfolio/uploads",
      public_id: `${Date.now()}-${originalName}`, // Cleaned name with timestamp
      resource_type: isDocument ? "raw" : "image", // raw for non-images
      type: "upload",
      // Don't specify format, Cloudinary auto-detects it
      transformation: !isDocument
        ? [{ width: 1000, height: 1000, crop: "limit" }]
        : undefined,
    };
  },
});

// Setup multer middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (ALLOWED_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG, PDF, and DOCX files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
