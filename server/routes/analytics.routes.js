import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

import {
  getStockMovementAnalysis,
  getCategoryPerformanceAnalysis,
  getReorderPatternsAnalysis,
  getBusinessOverview,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(
  "/stock-movement",
  protect,
  authorize("admin", "franchise"),
  getStockMovementAnalysis
);

router.get(
  "/category-performance",
  protect,
  authorize("admin", "franchise"),
  getCategoryPerformanceAnalysis
);

router.get(
  "/reorder-patterns",
  protect,
  authorize("admin", "franchise"),
  getReorderPatternsAnalysis
);

router.get(
  "/business-overview",
  protect,
  authorize("admin", "franchise"),
  getBusinessOverview
);



export default router;