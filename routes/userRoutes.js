import express from "express";
import { getUserProfile, updateProfile, uploadAvatar, searchUsers } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { uploadAvatar as multerUpload } from "../config/multer.js";

const router = express.Router();

router.use(protect);

router.get("/search", searchUsers);
router.get("/:id", getUserProfile);
router.put("/profile", updateProfile);
router.post("/avatar", (req, res, next) => {
  multerUpload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary error:", err);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
}, uploadAvatar);

export default router;