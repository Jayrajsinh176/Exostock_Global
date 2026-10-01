import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Invoice from "../models/invoice.model.js";
import Product from "../models/product.model.js";
import Company from "../models/company.model.js";
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";
import { isReportsAllowed } from "../utils/subscription.js";
import { generateUniqueCode } from "../utils/generateCode.js";

const getUserLocationId = (user) => user.locationId || null;

/** 
 * @description Create a new order
 * @route POST /api/orders
 * @access Protected
 */
export const createOrder = async (req, res) => {
    try {
        const {
            items,
            subtotal,
            tax,
            discount = 0,
            total,
            paymentMethod,
            paymentStatus,
            transactionId,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            notes
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item" });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required" });
        }

        const normalizedItems = items.map((item) => ({
            product: item.product || item.productId || item.id,
            productName: item.productName || item.name,
            productSku: item.productSku || item.sku,
            quantity: Number(item.quantity || 0),
            unitPrice: Number(item.unitPrice ?? item.price ?? 0),
            subtotal: Number(item.subtotal ?? (Number(item.quantity || 0) * Number(item.unitPrice ?? item.price ?? 0))),
        }));

        const hasInvalidItem = normalizedItems.some(
            (item) => !mongoose.Types.ObjectId.isValid(item.product) || item.quantity <= 0 || item.unitPrice < 0
        );

        if (hasInvalidItem) {
            return res.status(400).json({ message: "One or more order items are invalid" });
        }

        const resolvedPaymentStatus = paymentStatus || 'paid';
        const allowedPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!allowedPaymentStatuses.includes(resolvedPaymentStatus)) {
            return res.status(400).json({
                message: `Invalid payment status. Must be one of: ${allowedPaymentStatuses.join(', ')}`,
            });
        }

        const orderNumber = await generateUniqueCode(Order, "orderNumber", "ORD-", 6);
        const mainStore = await Franchise.findOne({
            company: req.user.company,
            isDefault: true,
        });

        for (const item of normalizedItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }


            const locationId =
                getUserLocationId(req.user) || mainStore?._id;

            const locationStock = await LocationStock.findOne({
                company: req.user.company,
                locationId,
                product: item.product,
            });

            if (!locationStock || locationStock.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${locationStock?.stock || 0
                        }, Requested: ${item.quantity}`,
                });
            }
        }
        const locationId = getUserLocationId(req.user);

        const isFranchise = !!locationId;

        const order = new Order({
            company: req.user.company,
            franchise: isFranchise ? req.user.franchise : null,
            createdBy: isFranchise ? "franchise" : "company",

            locationId: isFranchise ? req.user.locationId : mainStore?._id,

            user: req.user._id,
            orderNumber,
            items: normalizedItems,
            subtotal,
            tax,
            discount,
            total,
            paymentMethod,
            paymentStatus: resolvedPaymentStatus,
            transactionId,
            customerName: customerName || 'Walk-in Customer',
            customerEmail,
            customerPhone,
            customerAddress,
            notes,
            status: resolvedPaymentStatus === 'paid' ? 'completed' : 'pending'
        });

        order.statusHistory.push({
            status: order.status,
            changedAt: new Date(),
            reason: 'Order created'
        });
        await order.save();

        //         const mainStore = await Franchise.findOne({
        //     company: req.user.company,
        //     isDefault: true,
        // });

        for (const item of normalizedItems) {

            const product = await Product.findById(item.product);

            const locationId =
                getUserLocationId(req.user) || mainStore?._id;

            if (locationId) {

                const locationStock = await LocationStock.findOne({
                    company: req.user.company,
                    locationId,
                    product: item.product,
                });

                if (!locationStock || locationStock.stock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock for ${product.name}`,
                    });
                }

                locationStock.stock -= item.quantity;

                await locationStock.save();
                if (req.user.role !== "franchise") {
                    product.stock -= item.quantity;
                    await product.save();
                }
            }

            order.stockAdjustments.push({
                productId: item.product,
                quantity: item.quantity,
                adjustedAt: new Date(),
            });
        }

        let invoice = null;
        if (resolvedPaymentStatus === 'paid' || paymentMethod === 'online') {
            const invoiceCount = await Invoice.countDocuments({ company: req.user.company });
            const invoiceNumber = `INV-${Date.now()}-${invoiceCount + 1}`;

            invoice = new Invoice({
                company: req.user.company,
                franchise: isFranchise ? req.user.franchise : null,
                user: req.user._id,
                invoiceNumber,
                order: order._id,
                subtotal,
                tax,
                discount,
                amount: total,
                status: resolvedPaymentStatus === 'paid' ? 'paid' : 'unpaid',
                paymentMethod,
                transactionId,
                issueDate: new Date(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                paidDate: resolvedPaymentStatus === 'paid' ? new Date() : null,
            });

            await invoice.save();
            order.invoiceId = invoice._id;
            await order.save();
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: await order.populate([
                { path: 'company' },
                { path: 'user' },
                { path: 'items.product' },
                { path: 'invoiceId' }
            ]),
            invoice
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

/** 
 * @description Get all orders for a company
 * @route GET /api/orders
 * @access Protected
 */
export const getOrders = async (req, res) => {
    try {
        const { status, paymentStatus, search, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
        const filters = {
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            filters.locationId = locationId;
        }

        if (status) filters.status = status;
        if (search) {
            filters.$or = [
                {
                    orderNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    customerName: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        if (paymentStatus) filters.paymentStatus = paymentStatus;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(filters)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'items.product', select: 'name sku price' },
                { path: 'invoiceId' }
            ])
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filters);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayFilter = {
            company: req.user.company,
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
            paymentStatus: "paid",
        };


        if (locationId) {
            todayFilter.locationId = locationId;
        }

        const todayOrders = await Order.find(todayFilter);


        const todayRevenue = todayOrders.reduce(
            (sum, order) => sum + order.total,
            0
        );

        const todayItemsSold = todayOrders.reduce(
            (sum, order) =>
                sum +
                order.items.reduce(
                    (qty, item) => qty + item.quantity,
                    0
                ),
            0
        );

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
            pagination: {
                total: totalOrders,
                page: parseInt(page),
                pages: Math.ceil(totalOrders / parseInt(limit)),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).json({
            message: "Error retrieving orders",
            error: error.message
        });
    }
};

/**
 * @description Order report: every order (optionally within a date range) with item totals
 * @route GET /api/orders/report
 * @access Protected
 */
export const getOrderReport = async (req, res) => {
    try {
        const company = await Company.findById(req.user.company).select("plan");
        if (!isReportsAllowed(company?.plan)) {
            return res.status(403).json({
                success: false,
                message: "Reports are available from the Basic plan onwards.",
            });
        }

        const { from, to } = req.query;
        const filters = {
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            filters.locationId = locationId;
        }

        if (from || to) {
            filters.createdAt = {};
            if (from) {
                const fromDate = new Date(from);
                if (Number.isNaN(fromDate.getTime())) {
                    return res.status(400).json({ message: "Invalid from date" });
                }
                fromDate.setHours(0, 0, 0, 0);
                filters.createdAt.$gte = fromDate;
            }
            if (to) {
                const toDate = new Date(to);
                if (Number.isNaN(toDate.getTime())) {
                    return res.status(400).json({ message: "Invalid to date" });
                }
                toDate.setHours(23, 59, 59, 999);
                filters.createdAt.$lte = toDate;
            }
        }

        const orders = await Order.find(filters)
            .populate({ path: 'user', select: 'name' })
            .sort({ createdAt: -1 })
            .lean();

        const report = orders.map((order) => ({
            id: order._id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            customerName: order.customerName || "",
            customerPhone: order.customerPhone || "",
            billedBy: order.user?.name || "",
            itemCount: (order.items || []).length,
            totalQuantity: (order.items || []).reduce(
                (sum, item) => sum + (Number(item.quantity) || 0),
                0
            ),
            subtotal: order.subtotal || 0,
            tax: order.tax || 0,
            discount: order.discount || 0,
            total: order.total || 0,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            status: order.status,
        }));

        res.status(200).json({
            success: true,
            message: "Order report fetched successfully",
            count: report.length,
            orders: report,
        });
    } catch (error) {
        console.error("Error fetching order report:", error);
        res.status(500).json({
            message: "Error fetching order report",
            error: error.message
        });
    }
};

/**
 * @description Get order by ID
 * @route GET /api/orders/:id
 * @access Protected
 */
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const query = {
            _id: id,
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            query.locationId = locationId;
        }

        const order = await Order.findOne(query)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'items.product' },
                { path: 'invoiceId' }
            ]);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order retrieved successfully",
            order
        });

    } catch (error) {
        console.error("Error retrieving order:", error);
        res.status(500).json({
            message: "Error retrieving order",
            error: error.message
        });
    }
};

/** 
 * @description Update order status or payment status
 * @route PUT /api/orders/:id
 * @access Protected
 */
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, transactionId, notes } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }
        const query = {
            _id: id,
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            query.locationId = locationId;
        }

        const order = await Order.findOne(query);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (status) {
            const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'failed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            }

            order.status = status;
            order.statusHistory.push({
                status,
                changedAt: new Date(),
                reason: req.body.reason || 'Status updated'
            });
        }
        if (paymentStatus) {
            const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({ message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}` });
            }

            const previousPaymentStatus = order.paymentStatus;
            order.paymentStatus = paymentStatus;
            if (paymentStatus === 'paid' && previousPaymentStatus !== 'paid') {
                order.paidAt = new Date();
                if (order.invoiceId) {
                    await Invoice.findByIdAndUpdate(order.invoiceId, {
                        status: 'paid',
                        paidDate: new Date()
                    });
                }
            }
        }
        if (transactionId) {
            order.transactionId = transactionId;
        }

        if (notes) {
            order.notes = notes;
        }

        await order.save();

        const updatedOrder = await order.populate([
            { path: 'company' },
            { path: 'user' },
            { path: 'items.product' },
            { path: 'invoiceId' }
        ]);

        res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({
            message: "Error updating order",
            error: error.message
        });
    }
};

/** 
 * @description Delete order (soft delete by marking as cancelled)
 * @route DELETE /api/orders/:id
 * @access Protected
 */
export const deleteOrder = async (req, res) => {
    if (req.user.role === "franchise") {
        return res.status(403).json({
            success: false,
            message: "Only Company Admin can delete orders.",
        });
    }
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const query = {
            _id: id,
            company: req.user.company,
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            query.locationId = locationId;
        }

        const order = await Order.findOne(query);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({
                message: "Cannot delete order. Only pending or processing orders can be deleted."
            });
        }
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {


                const mainStore = await Franchise.findOne({
                    company: req.user.company,
                    isDefault: true,
                });

                const locationId =
                    getUserLocationId(req.user) || mainStore?._id;

                if (locationId) {

                    const locationStock = await LocationStock.findOne({
                        company: req.user.company,
                        locationId,
                        product: item.product,
                    });

                    if (locationStock) {
                        locationStock.stock += item.quantity;
                        await locationStock.save();

                        if (req.user.role !== "franchise") {
                            product.stock += item.quantity;
                            await product.save();
                        }
                    }
                }
            }
        }
        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            changedAt: new Date(),
            reason: 'Order deleted/cancelled'
        });

        await order.save();

        res.status(200).json({
            message: "Order cancelled and deleted successfully",
            order
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            message: "Error deleting order",
            error: error.message
        });
    }
};

/** 
 * @description Get order statistics
 * @route GET /api/orders/stats/overview
 * @access Protected
 */
export const getOrderStats = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;

        const filters = { company: req.user.company };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            filters.locationId = locationId;
        }


        const orders = await Order.find(filters);

        console.log("Orders Found:", orders.length);

        if (dateFrom || dateTo) {
            filters.createdAt = {};
            if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filters.createdAt.$lte = new Date(dateTo);
        }
        const matchStage = {
            company: new mongoose.Types.ObjectId(req.user.company),
        };

        if (locationId) {
            matchStage.locationId = new mongoose.Types.ObjectId(locationId);
        }
        const [
            totalOrders,
            totalRevenue,
            paidOrders,
            pendingOrders,
            completedOrders,
            cancelledOrders
        ] = await Promise.all([
            Order.countDocuments(filters),
            Order.aggregate([
                {
                    $match: matchStage
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$total"
                        }
                    }
                }
            ]),
            Order.countDocuments({ ...filters, paymentStatus: 'paid' }),
            Order.countDocuments({ ...filters, paymentStatus: 'pending' }),
            Order.countDocuments({ ...filters, status: 'completed' }),
            Order.countDocuments({ ...filters, status: 'cancelled' })
        ]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayFilter = {
            company: req.user.company,
            paymentStatus: "paid",
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
        };

        if (locationId) {
            todayFilter.locationId = locationId;
        }

        const todayOrders = await Order.find(todayFilter);

        const todayRevenue = todayOrders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
        );

        const todayItemsSold = todayOrders.reduce(
            (sum, order) =>
                sum +
                order.items.reduce(
                    (qty, item) => qty + item.quantity,
                    0
                ),
            0
        );
        res.status(200).json({
            message: "Order statistics retrieved successfully",
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                paidOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0,
                todayOrders: todayOrders.length,
                todayRevenue,
                todayItemsSold,
            }
        });

    } catch (error) {
        console.error("Error retrieving order stats:", error);
        res.status(500).json({
            message: "Error retrieving order stats",
            error: error.message
        });
    }
}

export const getDailySalesSummary = async (req, res) => {
    try {
        const company = await Company.findById(req.user.company);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        if (!isReportsAllowed(company.plan)) {
            return res.status(403).json({
                success: false,
                message:
                    "Daily Sales Summary is available from the Basic plan onwards.",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const filters = {
            company: req.user.company,
            paymentStatus: "paid",
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
        };

        const locationId = getUserLocationId(req.user);

        if (locationId) {
            filters.locationId = locationId;
        }
        const orders = await Order.find(filters);

        const totalOrders = orders.length;

        const totalRevenue = orders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
        );

        const productsSold = orders.reduce(
            (sum, order) =>
                sum +
                order.items.reduce(
                    (qty, item) => qty + item.quantity,
                    0
                ),
            0
        );

        const averageOrder =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;

        return res.status(200).json({
            success: true,
            summary: {
                totalOrders,
                totalRevenue,
                productsSold,
                averageOrder,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};