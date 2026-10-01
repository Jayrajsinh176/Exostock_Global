import mongoose from "mongoose";
import SupplyRequest from "../models/supplyRequest.model.js";
import Product from "../models/product.model.js";
import Vendor from "../models/vendor.model.js";
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";
import { logActivity } from "../utils/logActivity.js";
import { generateUniqueCode } from "../utils/generateCode.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @description Create Supply Request
 * @route POST /api/supply-requests
 * @access Protected
 */
export const createSupplyRequest = async (req, res) => {
    try {
        const {
            vendorId,
            productId,
            quantity,
            quotedPrice,
            expectedDeliveryDate,
            notes,
        } = req.body;

        if (
            !vendorId ||
            !productId ||
            !quantity ||
            quotedPrice === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Vendor, Product, Quantity and Purchase Price are required.",
            });
        }

        if (
            !isValidObjectId(vendorId) ||
            !isValidObjectId(productId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Vendor or Product.",
            });
        }

        const vendor = await Vendor.findOne({
            _id: vendorId,
            companyId: req.user.company,
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found.",
            });
        }

        const product = await Product.findOne({
            _id: productId,
            company: req.user.company,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const requestNumber = await generateUniqueCode(
            SupplyRequest,
            "requestNumber",
            "REQ",
        );

        const supplyRequest = await SupplyRequest.create({
            companyId: req.user.company,
            vendorId,
            productId,

            requestNumber,

            quantity: Number(quantity),

            quotedPrice: Number(quotedPrice),

            totalAmount:
                Number(quantity) * Number(quotedPrice),

            expectedDeliveryDate:
                expectedDeliveryDate || new Date(),

            notes,

            status: "pending",

            paymentStatus: "unpaid",

            createdBy: req.user._id,
        });

        await logActivity({
            userId: req.user._id,
            companyId: req.user.company,
            action: "created_supply_request",
            details: `Created Supply Request ${requestNumber}`,
            metadata: {
                supplyRequestId: supplyRequest._id,
                vendorId,
                productId,
                quantity,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Supply Request created successfully.",
            supplyRequest,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

/**
 * @description Get All Supply Requests
 * @route GET /api/supply-requests
 * @access Protected
 */
export const getSupplyRequests = async (req, res) => {
    try {
        const { status, paymentStatus, vendorId } = req.query;

        const filter = {
            companyId: req.user.company,
        };

        if (status) {
            filter.status = status;
        }

        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }

        if (vendorId && isValidObjectId(vendorId)) {
            filter.vendorId = vendorId;
        }

        const supplyRequests = await SupplyRequest.find(filter)
            .populate("vendorId", "name companyName phone")
            .populate("productId", "name sku price")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: supplyRequests.length,
            supplyRequests,
        });
    } catch (error) {
        console.error("Get Supply Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch supply requests.",
        });
    }
};

/**
 * @description Get Supply Request By ID
 * @route GET /api/supply-requests/:id
 * @access Protected
 */
export const getSupplyRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Supply Request ID.",
            });
        }

        const supplyRequest = await SupplyRequest.findOne({
            _id: id,
            companyId: req.user.company,
        })
            .populate("vendorId")
            .populate("productId")
            .populate("createdBy", "name email")
            .populate("receivedBy", "name email");

        if (!supplyRequest) {
            return res.status(404).json({
                success: false,
                message: "Supply Request not found.",
            });
        }

        return res.status(200).json({
            success: true,
            supplyRequest,
        });

    } catch (error) {
        console.error("Get Supply Request Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Supply Request.",
        });
    }
};

/**
 * @description Update Supply Request Status
 * @route PUT /api/supply-requests/:id/status
 * @access Protected
 */
export const updateSupplyRequestStatus = async (req, res) => {
    const session = await mongoose.startSession();
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Params:", req.params);
    try {
        session.startTransaction();

        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: "Invalid Supply Request ID.",
            });
        }

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            await session.abortTransaction();
            session.endSession();

            console.log("Received Status:", status);
            console.log("Type:", typeof status);
            return res.status(400).json({
                success: false,
                message: "Invalid status.",
            });
        }

        const supplyRequest = await SupplyRequest.findOne({
            _id: id,
            companyId: req.user.company,
        }).session(session);

        if (!supplyRequest) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success: false,
                message: "Supply Request not found.",
            });
        }

        // Prevent duplicate stock update
        if (
            supplyRequest.status === "delivered" &&
            status === "delivered"
        ) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: "Supply Request already delivered.",
            });
        }

        supplyRequest.status = status;
if (status === "delivered") {
    supplyRequest.actualDeliveryDate = new Date();
    supplyRequest.receivedBy = req.user._id;

    // Change payment status to paid
    supplyRequest.paymentStatus = "paid";
    supplyRequest.paidAt = new Date();
    if (!supplyRequest.invoiceNumber) {
        supplyRequest.invoiceNumber = await generateUniqueCode(
            SupplyRequest,
            "invoiceNumber",
            "INV",
        );
    }

    // Update product stock
    const product = await Product.findById(supplyRequest.productId).session(session);

    if (!product) {
        throw new Error("Product not found.");
    }

    product.stock += Number(supplyRequest.quantity);

    await product.save({ session });

    // Update location stock for whoever is receiving the delivery
    // (their own location, falling back to the default franchise)
    let targetLocationId = req.user.locationId;

    if (!targetLocationId) {
        const mainStore = await Franchise.findOne({
            company: req.user.company,
            isDefault: true,
        }).session(session);

        targetLocationId = mainStore?._id;
    }

    if (targetLocationId) {
        const locationStock = await LocationStock.findOne({
            company: req.user.company,
            locationId: targetLocationId,
            product: supplyRequest.productId,
        }).session(session);

        if (locationStock) {
            locationStock.stock += Number(supplyRequest.quantity);
            await locationStock.save({ session });
        } else {
            await LocationStock.create(
                [
                    {
                        company: req.user.company,
                        locationId: targetLocationId,
                        product: supplyRequest.productId,
                        stock: Number(supplyRequest.quantity),
                    },
                ],
                { session },
            );
        }
    }
}

        await supplyRequest.save({ session });

        await session.commitTransaction();
        session.endSession();

        await logActivity({
            userId: req.user._id,
            companyId: req.user.company,
            action: "updated_supply_request_status",
            details: `Supply Request ${supplyRequest.requestNumber} marked as ${status}`,
            metadata: {
                supplyRequestId: supplyRequest._id,
                status,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Supply Request updated successfully.",
            supplyRequest,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Update Supply Request Status:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update Supply Request.",
        });
    }
};

/**
 * @description Update Payment Status
 * @route PUT /api/supply-requests/:id/payment
 * @access Protected
 */
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            paymentStatus,
            paymentMethod,
            paymentReference,
            invoiceNumber,
        } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Supply Request ID.",
            });
        }

        const supplyRequest = await SupplyRequest.findOne({
            _id: id,
            companyId: req.user.company,
        });

        if (!supplyRequest) {
            return res.status(404).json({
                success: false,
                message: "Supply Request not found.",
            });
        }

        if (!["paid", "unpaid"].includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status.",
            });
        }

        supplyRequest.paymentStatus = paymentStatus;
        // Only overwrite optional fields when provided — an empty string
        // fails the paymentMethod enum and aborts the save.
        if (paymentMethod) supplyRequest.paymentMethod = paymentMethod;
        if (paymentReference !== undefined) supplyRequest.paymentReference = paymentReference;
        if (invoiceNumber !== undefined) supplyRequest.invoiceNumber = invoiceNumber;

        if (paymentStatus === "paid") {
            supplyRequest.paidAt = new Date();
        } else {
            supplyRequest.paidAt = null;
        }

        await supplyRequest.save();

        await logActivity({
            userId: req.user._id,
            companyId: req.user.company,
            action: "updated_supply_payment",
            details: `Payment marked as ${paymentStatus} for ${supplyRequest.requestNumber}`,
            metadata: {
                supplyRequestId: supplyRequest._id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully.",
            supplyRequest,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update payment status.",
        });
    }
};

/**
 * @description Get Purchase History
 * @route GET /api/supply-requests/history
 * @access Protected
 */
export const getPurchaseHistory = async (req, res) => {
    try {

        const { vendorId, startDate, endDate } = req.query;

        const filter = {
            companyId: req.user.company,
            status: "delivered",
        };

        if (vendorId && isValidObjectId(vendorId)) {
            filter.vendorId = vendorId;
        }

        if (startDate || endDate) {
            filter.actualDeliveryDate = {};

            if (startDate) {
                filter.actualDeliveryDate.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.actualDeliveryDate.$lte = new Date(endDate);
            }
        }

        const purchases = await SupplyRequest.find(filter)
            .populate("vendorId", "name companyName")
            .populate("productId", "name sku")
            .sort({ actualDeliveryDate: -1 });

        return res.status(200).json({
            success: true,
            count: purchases.length,
            purchases,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch purchase history.",
        });

    }
};