import express from 'express';
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
    companyProfile,
    updateCompanyProfile,
    getCompanySubscription,
    updateCompanySubscription,
    cancelCompanySubscription,
    getCompanyBillingHistory,
    getInvoiceDetails
} from '../controllers/company.controller.js';

const router = express.Router();

router.get("/", protect, authorize("admin"), companyProfile);

router.put("/", protect, authorize("admin"), updateCompanyProfile);

router.get("/subscription", protect, authorize("admin"), getCompanySubscription);

router.patch("/subscription", protect, authorize("admin"), updateCompanySubscription);

router.post(
  "/subscription/cancel",
  protect,
  authorize("admin"),
  cancelCompanySubscription
);

// Billing - accessible to everyone
router.get("/billing-history", protect, getCompanyBillingHistory);

router.get("/billing-history/invoice/:id", protect, getInvoiceDetails);
export default router;  