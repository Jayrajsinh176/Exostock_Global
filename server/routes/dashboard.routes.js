    import express from 'express';
    import { protect } from '../middleware/auth.middleware.js';
    import {
        dashboardStats,
        getLowStockAlerts
    }   from '../controllers/dashboard.controller.js';

    const router = express.Router();
    router.get('/', protect, dashboardStats);
    router.get('/low-stock-alerts', protect, getLowStockAlerts);

    export default router;