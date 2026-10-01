import express from "express";
import {
  createFranchise,
  getFranchises,
  getFranchiseById,
  updateFranchise,
  toggleFranchiseStatus,
  getFranchiseLocations,
  getFranchiseProfile,
  updateFranchiseProfile,
} from "../controllers/franchise.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";// Use your existing auth middleware

const router = express.Router();

router.post("/", protect, authorize("admin"), createFranchise);
router.get("/", protect, authorize("admin"), getFranchises);
router.get("/locations", protect, getFranchiseLocations);
router.get("/profile", protect, getFranchiseProfile);
router.put("/profile", protect, updateFranchiseProfile);
router.get("/:id", protect, authorize("admin"), getFranchiseById);
router.put("/:id", protect, authorize("admin"), updateFranchise);
router.patch("/:id/status", protect, authorize("admin"), toggleFranchiseStatus);

export default router;