import express from "express";
import { chatWithAssistant } from "../controllers/assistant.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateAssistantMessage } from "../middleware/validateAssistant.js";

const router = express.Router();

router.post("/chat", protect, validateAssistantMessage, chatWithAssistant);

export default router;
