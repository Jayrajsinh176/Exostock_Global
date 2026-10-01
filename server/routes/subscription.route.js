import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    getSubscriptionPlans,
    subscribeToPlan,
    getCurrentSubscription,
    cancelSubscription,
    getSubscriptionAlert 
} from '../controllers/subscription.controller.js';

const router = express.Router();

router.get('/plans', protect, authorize("admin"), getSubscriptionPlans);

router.post('/subscribe', protect, authorize("admin"), subscribeToPlan);

router.get('/current', protect, authorize("admin"), getCurrentSubscription);

router.post('/cancel', protect, authorize("admin"), cancelSubscription);

router.get('/alert', protect, authorize("admin"), getSubscriptionAlert);
export default router;