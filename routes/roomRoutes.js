import express from "express";
import { getRooms, createRoom, getRoomMessages } from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); 

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:roomId/messages", getRoomMessages);

export default router;