import express from 'express';

const router = express.Router();
import {
    createVendor,
    getVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    getVendorProducts,
    assignProductToVendor,
    removeProductFromVendor,
    getVendorOrders,
    getVendorInvoices,
    getVendorAlerts,
    createSupplyRequest,
    getSupplyRequests,
    getSupplyRequestById,
    updateSupplyRequestStatus,
    paySupplyRequest,
    getPurchaseHistory
} from '../controllers/vendor.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Basic CRUD operations
router.post('/', protect, createVendor);
router.get('/purchase-history', protect, getPurchaseHistory);
router.get('/', protect, getVendors);
router.get('/:id', protect, getVendorById);
router.put('/:id', protect, updateVendor);
router.delete('/:id', protect, deleteVendor);

// Vendor-Product associations
router.get('/:id/products', protect, getVendorProducts);
router.post('/:id/products', protect, assignProductToVendor);
router.delete('/:id/products/:productId', protect, removeProductFromVendor);

// Vendor Orders, Invoices, Alerts
router.get('/:id/orders', protect, getVendorOrders);
router.get('/:id/invoices', protect, getVendorInvoices);
router.get('/:id/alerts', protect, getVendorAlerts);

// Supply Request endpoints
router.post('/:id/supply-requests', protect, createSupplyRequest);
router.get('/:id/supply-requests', protect, getSupplyRequests);
router.get('/:id/supply-requests/:requestId', protect, getSupplyRequestById);
router.put('/:id/supply-requests/:requestId', protect, updateSupplyRequestStatus);
router.post('/:id/supply-requests/:requestId/pay', protect, paySupplyRequest);


export default router;