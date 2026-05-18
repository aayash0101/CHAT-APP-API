import express from "express";
import { markAsRead } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/:roomId/read", markAsRead);

export default router;