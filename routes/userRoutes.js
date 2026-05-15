import express from "express";
import { getUserProfile, updateProfile, uploadAvatar } from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.use(protect); 

router.get("/:id", getUserProfile);
router.put("/profile", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);

export default router;