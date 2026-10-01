import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
    getLowStockAlerts,
    getAlerts,
    markAlertAsRead,
    acknowledgeAlert,
    getAlertPreferences,
    updateAlertPreferences,
    markAllAlertsAsRead,
} from "../controllers/alert.controller.js";

const router = express.Router();

// Get all alerts with filtering
router.get('/', protect, getAlerts);

// Get low stock alerts specifically
router.get('/low-stock', protect, getLowStockAlerts);

// Alert preferences
router.get('/preferences', protect, getAlertPreferences);
router.put('/preferences', protect, updateAlertPreferences);

// Mark all as read
router.patch('/read-all', protect, markAllAlertsAsRead);

// Individual alert operations
router.patch('/:id/read', protect, markAlertAsRead);
router.patch('/:id/acknowledge', protect, acknowledgeAlert);

export default router;