import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { assignStock } from "../controllers/franchiseStock.controller.js";

const router = express.Router();

router.post("/assign", protect, assignStock);

export default router;
