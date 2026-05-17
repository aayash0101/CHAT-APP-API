import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import protect from "../middleware/authMiddleware.js";
import { uploadFile as multerUpload } from "../config/multer.js";

const router = express.Router();

router.use(protect);

router.post("/", (req, res, next) => {
  multerUpload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
}, uploadFile);

export default router;