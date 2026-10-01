import express from "express";

import {
  createSupplyRequest,
  getSupplyRequests,
  getSupplyRequestById,
  updateSupplyRequestStatus,
  updatePaymentStatus,
  getPurchaseHistory,
} from "../controllers/supplyRequest.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * Purchase History
 */
router.get("/history", getPurchaseHistory);

/**
 * All Supply Requests
 */
router
  .route("/")
  .get(getSupplyRequests)
  .post(createSupplyRequest);

/**
 * Single Supply Request
 */
router.get("/:id", getSupplyRequestById);

/**
 * Update Request Status
 */
router.put("/:id/status", updateSupplyRequestStatus);

/**
 * Update Payment Status
 */
router.put("/:id/payment", updatePaymentStatus);

export default router;