import express from "express";
import { getOrCreateDM, getMyDMs, getDMMessages } from "../controllers/dmController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyDMs);
router.post("/", getOrCreateDM);
router.get("/:dmId/messages", getDMMessages);

export default router;