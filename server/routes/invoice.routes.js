import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    getInvoices,
    getInvoiceById,
    getInvoiceByOrderId,
    updateInvoiceStatus,
    getInvoiceStats,
    downloadInvoice,
    getPendingInvoices
} from '../controllers/invoice.controller.js';

const router = express.Router();

// Invoice routes
router.get('/', protect, getInvoices);
router.get('/stats/overview', protect, getInvoiceStats);
router.get('/pending/list', protect, getPendingInvoices);
router.get('/order/:orderId', protect, getInvoiceByOrderId);
router.get('/:id/download', protect, downloadInvoice);
router.get('/:id', protect, getInvoiceById);
router.put('/:id', protect, updateInvoiceStatus);

export default router;
