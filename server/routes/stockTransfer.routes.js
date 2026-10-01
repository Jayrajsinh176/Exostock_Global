import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  transferStock,
  getStockTransferHistory,
} from "../controllers/stockTransfer.controller.js";

const router = express.Router();

// Transfer stock
router.post("/", protect, transferStock);

// Transfer history
router.get("/", protect, getStockTransferHistory);

export default router;