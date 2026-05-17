import { v2 as cloudinary } from "cloudinary";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isImage = req.file.mimetype.startsWith("image/");

    
    let fileType = "other";
    if (isImage) fileType = "image";
    else if (req.file.mimetype === "application/pdf") fileType = "pdf";
    else if (req.file.mimetype.includes("word") || req.file.originalname.endsWith(".doc") || req.file.originalname.endsWith(".docx")) fileType = "doc";

    res.json({
      fileUrl: req.file.path,           
      fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};