import express from "express";
import { getRooms, createRoom, getRoomMessages, joinRoom, leaveRoom } from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:roomId/messages", getRoomMessages);
router.post("/:roomId/join", joinRoom);
router.delete("/:roomId/leave", leaveRoom); 

export default router;