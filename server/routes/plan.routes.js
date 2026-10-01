import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { planDetails } from "../controllers/plan.controller.js";

const router = express.Router();

router.get('/',planDetails);
export default router;
