import mongoose from "mongoose";
import Invoice from "../models/invoice.model.js";
import Order from "../models/order.model.js";


const getUserLocationId = (user) => user.locationId || null;

/** 
 * @description Get all invoices for a company
 * @route GET /api/invoices
 * @access Protected
 */
export const getInvoices = async (req, res) => {
    try {
        const { status, sortBy = '-issueDate', page = 1, limit = 10 } = req.query;

        const filters = {
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            filters.franchise = req.user.franchise;
        };

        if (status) filters.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const invoices = await Invoice.find(filters)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'order', select: 'orderNumber items total' }
            ])
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        const totalInvoices = await Invoice.countDocuments(filters);

        res.status(200).json({
            message: "Invoices retrieved successfully",
            invoices,
            pagination: {
                total: totalInvoices,
                page: parseInt(page),
                pages: Math.ceil(totalInvoices / parseInt(limit)),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error retrieving invoices:", error);
        res.status(500).json({
            message: "Error retrieving invoices",
            error: error.message
        });
    }
};

/** 
 * @description Get invoice by ID
 * @route GET /api/invoices/:id
 * @access Protected
 */
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid invoice ID" });
        }

   const query = {
    _id: id,
    company: req.user.company,
};

const locationId = getUserLocationId(req.user);

if (locationId) {
    query.franchise = req.user.franchise;
}

        const invoice = await Invoice.findOne(query)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'order' }
            ]);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json({
            message: "Invoice retrieved successfully",
            invoice
        });

    } catch (error) {
        console.error("Error retrieving invoice:", error);
        res.status(500).json({
            message: "Error retrieving invoice",
            error: error.message
        });
    }
};

/** 
 * @description Get invoice by order ID
 * @route GET /api/invoices/order/:orderId
 * @access Protected
 */
export const getInvoiceByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const query = {
            order: orderId,
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            query.franchise = req.user.franchise;
        }

        const invoice = await Invoice.findOne(query)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'order' }
            ]);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found for this order" });
        }


        res.status(200).json({
            message: "Invoice retrieved successfully",
            invoice
        });

    } catch (error) {
        console.error("Error retrieving invoice:", error);
        res.status(500).json({
            message: "Error retrieving invoice",
            error: error.message
        });
    }
};

/** 
 * @description Update invoice status (mark as paid)
 * @route PUT /api/invoices/:id
 * @access Protected
 */
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentMethod, transactionId, notes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid invoice ID" });
        }

        const query = {
            _id: id,
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            query.franchise = req.user.franchise;
        }

        const invoice = await Invoice.findOne(query);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        // Update status
        if (status) {
            const validStatuses = ['paid', 'unpaid'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            }

            const previousStatus = invoice.status;

            invoice.status = status;

            if (status === "paid" && previousStatus !== "paid") {
                invoice.paidDate = new Date();
            }
        }

        // Update payment method
        if (paymentMethod) {
            invoice.paymentMethod = paymentMethod;
        }

        // Update transaction ID
        if (transactionId) {
            invoice.transactionId = transactionId;
        }

        // Update notes
        if (notes) {
            invoice.notes = notes;
        }

        await invoice.save();

        // Update related order payment status
        if (status === 'paid') {
            await Order.findByIdAndUpdate(invoice.order, {
                paymentStatus: 'paid',
                paidAt: new Date(),
                transactionId: transactionId || invoice.transactionId
            });
        }

        const updatedInvoice = await invoice.populate([
            { path: 'company', select: 'name' },
            { path: 'user', select: 'name email' },
            { path: 'order' }
        ]);

        res.status(200).json({
            message: "Invoice updated successfully",
            invoice: updatedInvoice
        });

    } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({
            message: "Error updating invoice",
            error: error.message
        });
    }
};

/** 
 * @description Get invoice statistics
 * @route GET /api/invoices/stats/overview
 * @access Protected
 */
export const getInvoiceStats = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;

        const filters = { company: req.user.company };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            filters.franchise = req.user.franchise;
        }

        if (dateFrom || dateTo) {
            filters.issueDate = {};
            if (dateFrom) filters.issueDate.$gte = new Date(dateFrom);
            if (dateTo) filters.issueDate.$lte = new Date(dateTo);
        }

        const [
            totalInvoices,
            totalAmount,
            paidInvoices,
            unpaidInvoices,
            totalPaid,
            totalUnpaid
        ] = await Promise.all([
            Invoice.countDocuments(filters),
            Invoice.aggregate([
                { $match: filters },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Invoice.countDocuments({ ...filters, status: 'paid' }),
            Invoice.countDocuments({ ...filters, status: 'unpaid' }),
            Invoice.aggregate([
                { $match: { ...filters, status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Invoice.aggregate([
                { $match: { ...filters, status: 'unpaid' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        res.status(200).json({
            message: "Invoice statistics retrieved successfully",
            stats: {
                totalInvoices,
                totalAmount: totalAmount[0]?.total || 0,
                paidInvoices,
                unpaidInvoices,
                totalPaid: totalPaid[0]?.total || 0,
                totalUnpaid: totalUnpaid[0]?.total || 0
            }
        });

    } catch (error) {
        console.error("Error retrieving invoice stats:", error);
        res.status(500).json({
            message: "Error retrieving invoice stats",
            error: error.message
        });
    }
};

/** 
 * @description Generate invoice PDF (mock implementation)
 * @route GET /api/invoices/:id/download
 * @access Protected
 */
export const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid invoice ID" });
        }

        const query = {
    _id: id,
    company: req.user.company,
};

const locationId = getUserLocationId(req.user);

if (locationId) {
    query.franchise = req.user.franchise;
}

        const invoice = await Invoice.findOne(query)
            .populate([
                { path: 'company' },
                { path: 'user', select: 'name email phone' },
                { path: 'order', populate: { path: 'items.product' } }
            ]);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }


        res.status(200).json({
            message: "Invoice ready for download",
            invoice,
            downloadUrl: `/api/invoices/${id}/pdf`
        });

    } catch (error) {
        console.error("Error downloading invoice:", error);
        res.status(500).json({
            message: "Error downloading invoice",
            error: error.message
        });
    }
};

/** 
 * @description Get pending invoices (not yet paid)
 * @route GET /api/invoices/pending
 * @access Protected
 */
export const getPendingInvoices = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Filters
    const filters = {
    company: req.user.company,
    status: "unpaid",
};

const locationId = getUserLocationId(req.user);

if (locationId) {
    filters.franchise = req.user.franchise;
}

        const invoices = await Invoice.find(filters)
            .populate([
                { path: "company", select: "name" },
                { path: "user", select: "name email" },
                { path: "order", select: "orderNumber items" },
            ])
            .sort("-dueDate")
            .skip(skip)
            .limit(parseInt(limit));

        const totalPending = await Invoice.countDocuments(filters);

  const matchStage = {
    company: new mongoose.Types.ObjectId(req.user.company),
    status: "unpaid",
};

if (locationId) {
    matchStage.franchise = new mongoose.Types.ObjectId(req.user.franchise);
};

        const totalPendingAmount = await Invoice.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        res.status(200).json({
            message: "Pending invoices retrieved successfully",
            invoices,
            totalPending,
            totalPendingAmount: totalPendingAmount[0]?.total || 0,
            pagination: {
                total: totalPending,
                page: parseInt(page),
                pages: Math.ceil(totalPending / parseInt(limit)),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Error retrieving pending invoices:", error);

        res.status(500).json({
            message: "Error retrieving pending invoices",
            error: error.message,
        });
    }
};