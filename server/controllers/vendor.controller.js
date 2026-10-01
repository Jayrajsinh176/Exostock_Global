import mongoose from 'mongoose';
import Vendor from '../models/vendor.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import Alert from '../models/alert.model.js';
import SupplyRequest from '../models/supplyRequest.model.js';
import { sendEmail } from '../utils/email.js';
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";
import { generateUniqueCode } from "../utils/generateCode.js";


const buildSupplyRequestPaymentRoute = (vendorId, requestId) => `/vendors/${vendorId}/supply-requests/${requestId}/payment`;

/**
 * @description Create a new vendor
 * @route POST /api/vendor
 * @access Private
 */
export const createVendor = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can create vendors.",
  });
}
        
        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name and phone are required'
            });
        }

        const existingVendor = await Vendor.findOne({ email, phone, companyId });
        if (existingVendor) {
            return res.status(400).json({
                success: false,
                message: 'Vendor with this email or phone number already exists'
            });
        }

        const newVendor = new Vendor({
            companyId,
            name,
            email,
            phone,
            address,
        });

        await newVendor.save();
        res.status(201).json({
            success: true,
            message: 'Vendor created successfully',
            data: newVendor
        });
    } catch (error) {
        console.log("Create Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to create vendor'
        });
    }
};

/**
 * @description Get all vendors
 * @route GET /api/vendor
 * @access Private
 */
export const getVendors = async (req, res) => {
    try {
        const companyId = new mongoose.Types.ObjectId(req.user.company);
        const vendors = await Vendor.find({ companyId }).populate('products');
        res.status(200).json({
            success: true,
            message: 'Vendors fetched successfully',
            data: vendors,
            count: vendors.length
        });
    } catch (error) {
        console.log("Get Vendors Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendors'
        });
    }
};

/**
 * @description Get vendor by ID
 * @route GET /api/vendor/:id
 * @access Private
 */
export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId }).populate('products');
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vendor fetched successfully.',
            data: vendor
        });
    } catch (error) {
        console.log("Get Vendor By ID Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor details'
        });
    }
};

/**
 * @description Update vendor details
 * @route PUT /api/vendor/:id
 * @access Private
 */
export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);
if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can update vendors.",
  });
}

        const { name, email, phone, address, status } = req.body;

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        vendor.name = name || vendor.name;
        vendor.email = email || vendor.email;
        vendor.phone = phone || vendor.phone;
        vendor.address = address || vendor.address;
        if (status) vendor.status = status;
        vendor.updatedAt = new Date();

        await vendor.save();
        res.status(200).json({
            success: true,
            message: 'Vendor updated successfully',
            data: vendor
        });
    } catch (error) {
        console.log("Update Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor details'
        });
    }
};

/**
 * @description Delete a vendor
 * @route DELETE /api/vendor/:id
 * @access Private
 */
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can delete vendors.",
  });
}

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Delete all supply requests associated with this vendor
        await SupplyRequest.deleteMany({ vendorId: id, companyId });

        // Remove vendor reference from products
        await Product.updateMany(
            { vendor: vendor._id, company: companyId },
            { vendor: null }
        );

        // Delete the vendor
        await Vendor.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Vendor deleted successfully'
        });
    } catch (error) {
        console.log("Delete Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete vendor'
        });
    }
};

/**
 * @description Get products supplied by a vendor
 * @route GET /api/vendor/:id/products
 * @access Private
 */
export const getVendorProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const products = await Product.find({
            vendor: vendor._id,
            company: companyId
        }).populate('category').lean();

        // Show the same location-scoped stock as the main Products page,
        // instead of the raw (and possibly stale) global product.stock field.
        const locationId = req.user.locationId || null;

        if (locationId) {
            const locationStocks = await LocationStock.find({
                company: companyId,
                locationId,
            }).lean();

            const stockMap = {};
            locationStocks.forEach((item) => {
                stockMap[item.product.toString()] = item.stock;
            });

            products.forEach((product) => {
                product.stock = stockMap[product._id.toString()] || 0;
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vendor products fetched successfully.',
            data: products,
            count: products.length
        });
    } catch (error) {
        console.log("Get Vendor Products Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor products'
        });
    }
};

/**
 * @description Assign a product to a vendor
 * @route POST /api/vendor/:id/products
 * @access Private
 */
export const assignProductToVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can assign products to vendors.",
  });
}

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const product = await Product.findOne({ _id: productId, company: companyId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update product with vendor
        product.vendor = vendor._id;
        await product.save();

        // Add product to vendor's product list if not already there
        if (!vendor.products.includes(productId)) {
            vendor.products.push(productId);
            await vendor.save();
        }

        res.status(200).json({
            success: true,
            message: 'Product assigned to vendor successfully',
            data: product
        });
    } catch (error) {
        console.log("Assign Product to Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign product to vendor'
        });
    }
};

/**
 * @description Remove a product from a vendor
 * @route DELETE /api/vendor/:id/products/:productId
 * @access Private
 */
export const removeProductFromVendor = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can remove products from vendors.",
  });
}

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const product = await Product.findOne({ _id: productId, company: companyId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update product to remove vendor
        product.vendor = null;
        await product.save();

        // Remove product from vendor's product list
        vendor.products = vendor.products.filter(p => p.toString() !== productId);
        await vendor.save();

        res.status(200).json({
            success: true,
            message: 'Product removed from vendor successfully',
            data: product
        });
    } catch (error) {
        console.log("Remove Product from Vendor Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove product from vendor'
        });
    }
};

/**
 * @description Get orders associated with a vendor
 * @route GET /api/vendor/:id/orders
 * @access Private
 */
export const getVendorOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const orders = await Order.find({ company: companyId }).populate({
            path: 'items.product',
            match: { vendor: vendor._id }
        });

        // Filter orders that actually contain vendor's products
        const vendorOrders = orders.filter(order =>
            order.items.some(item => item.product && item.product.vendor?.toString() === vendor._id.toString())
        );

        res.status(200).json({
            success: true,
            message: 'Vendor orders fetched successfully.',
            data: vendorOrders,
            count: vendorOrders.length
        });
    } catch (error) {
        console.log("Get Vendor Orders Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor orders'
        });
    }
};

/**
 * @description Get invoices associated with a vendor
 * @route GET /api/vendor/:id/invoices
 * @access Private
 */
export const getVendorInvoices = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const invoices = await Invoice.find({ company: companyId }).populate({
            path: 'order',
            populate: {
                path: 'items.product'
            }
        });

        // Filter invoices that contain vendor's products
        const vendorInvoices = invoices.filter(invoice =>
            invoice.order && invoice.order.items.some(item => item.product && item.product.vendor?.toString() === vendor._id.toString())
        );

        res.status(200).json({
            success: true,
            message: 'Vendor invoices fetched successfully.',
            data: vendorInvoices,
            count: vendorInvoices.length
        });
    } catch (error) {
        console.log("Get Vendor Invoices Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor invoices'
        });
    }
};

/**
 * @description Get alerts associated with a vendor
 * @route GET /api/vendor/:id/alerts
 * @access Private
 */
export const getVendorAlerts = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const alerts = await Alert.find({
    company: companyId,
}).populate("product");

        // Filter alerts for vendor's products
        const vendorAlerts = alerts.filter(alert =>
            alert.product && alert.product.vendor?.toString() === vendor._id.toString()
        );

        res.status(200).json({
            success: true,
            message: 'Vendor alerts fetched successfully.',
            data: vendorAlerts,
            count: vendorAlerts.length
        });
    } catch (error) {
        console.log("Get Vendor Alerts Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor alerts'
        });
    }
};

/**
 * @description Create a supply request from a vendor
 * @route POST /api/vendor/:id/supply-requests
 * @access Private
 */
export const createSupplyRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            productId,
            quantity,
            expectedDeliveryDate,
            quotedPrice,
            notes,
            shopName,
            ownerName,
            ownerEmail,
            ownerPhone,
        } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);
        const userId = req.user._id;

        if (!productId || !quantity || !expectedDeliveryDate || !quotedPrice) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, quantity, expected delivery date, and quoted price are required'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const product = await Product.findOne({ _id: productId, company: companyId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Generate unique request number
        const requestNumber = await generateUniqueCode(
            SupplyRequest,
            "requestNumber",
            "REQ",
        );
        const totalAmount = Number(quotedPrice) * Number(quantity);

        const supplyRequest = new SupplyRequest({
            companyId,
            vendorId: id,
            productId,
            requestNumber,
            quantity,
            expectedDeliveryDate: new Date(expectedDeliveryDate),
            quotedPrice,
            totalAmount,
            notes,
            shopName: shopName || '',
            ownerName: ownerName || req.user.name || '',
            ownerEmail: ownerEmail || req.user.email || '',
            ownerPhone: ownerPhone || req.user.phone || '',
            createdBy: userId,
        });

        await supplyRequest.save();

        

        // Update vendor's total supply requests
        vendor.totalSupplyRequests = (vendor.totalSupplyRequests || 0) + 1;
        await vendor.save();

        // Send vendor notification (email for now until vendor panel is available)
        if (vendor.email) {
            await sendEmail({
                to: vendor.email,
                subject: `New Stock Request ${requestNumber}`,
                text: `Hello ${vendor.name},\n\nYou have a new stock request from ${supplyRequest.shopName || 'a shop'} (${supplyRequest.ownerName || 'Owner'}).\n\nProduct: ${product.name} (${product.sku})\nQuantity: ${quantity}\nExpected Delivery: ${new Date(expectedDeliveryDate).toLocaleDateString()}\nAmount: $${totalAmount.toFixed(2)}\n\nPlease prepare and confirm dispatch.\n`,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Supply request created successfully',
            data: supplyRequest
        });
    } catch (error) {
        console.log("Create Supply Request Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to create supply request'
        });
    }
};

/**
 * @description Get all supply requests for a vendor
 * @route GET /api/vendor/:id/supply-requests
 * @access Private
 */
export const getSupplyRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const query = { vendorId: id, companyId };
        if (status) {
            query.status = status;
        }

        const supplyRequests = await SupplyRequest.find(query)
            .populate('productId')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Supply requests fetched successfully',
            data: supplyRequests,
            count: supplyRequests.length
        });
    } catch (error) {
        console.log("Get Supply Requests Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch supply requests'
        });
    }
};

/**
 * @description Update supply request status
 * @route PUT /api/vendor/:id/supply-requests/:requestId
 * @access Private
 */
export const updateSupplyRequestStatus = async (req, res) => {
    try {
        const { id, requestId } = req.params;
        const { status, actualDeliveryDate, vendorResponseNotes } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const supplyRequest = await SupplyRequest.findOne({ _id: requestId, vendorId: id, companyId });
        if (!supplyRequest) {
            return res.status(404).json({
                success: false,
                message: 'Supply request not found'
            });
        }

        supplyRequest.status = status;
        if (vendorResponseNotes) {
            supplyRequest.vendorResponseNotes = vendorResponseNotes;
        }

        // If delivered, update the delivery date
        if (status === 'delivered' && actualDeliveryDate) {
            supplyRequest.actualDeliveryDate = new Date(actualDeliveryDate);
            supplyRequest.isOnTime = new Date(actualDeliveryDate) <= supplyRequest.expectedDeliveryDate;
        }

        await supplyRequest.save();

        // Notify admin when vendor marks request as ready/shipped
        if (status === 'confirmed' || status === 'shipped') {
            const product = await Product.findById(supplyRequest.productId).select('name sku');

          await Alert.create({
    company: companyId,
    franchise: null,   // ADD THIS
    type: "vendor_order_ready",
    severity: "high",
    message: `Vendor ${vendor.name} marked request ${supplyRequest.requestNumber} as ${status}. Payment is pending.`,
    metadata: {
        vendorId: vendor._id,
        vendorName: vendor.name,
        requestId: supplyRequest._id,
        requestNumber: supplyRequest.requestNumber,
        productId: product?._id || null,
        productName: product?.name || "N/A",
        productSku: product?.sku || "N/A",
        quantity: supplyRequest.quantity,
        totalAmount:
            supplyRequest.totalAmount ||
            supplyRequest.quotedPrice * supplyRequest.quantity,
        shopName: supplyRequest.shopName,
        ownerName: supplyRequest.ownerName,
        paymentRoute: buildSupplyRequestPaymentRoute(
            vendor._id,
            supplyRequest._id
        ),
    },
});
        }

        res.status(200).json({
            success: true,
            message: 'Supply request status updated successfully',
            data: supplyRequest
        });
    } catch (error) {
        console.log("Update Supply Request Status Error : ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update supply request status'
        });
    }
};

/**
 * @description Get single supply request details
 * @route GET /api/vendor/:id/supply-requests/:requestId
 * @access Private
 */
export const getSupplyRequestById = async (req, res) => {
    try {
        const { id, requestId } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const supplyRequest = await SupplyRequest.findOne({ _id: requestId, vendorId: id, companyId })
            .populate('productId')
            .populate('createdBy', 'name email');

        if (!supplyRequest) {
            return res.status(404).json({
                success: false,
                message: 'Supply request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Supply request fetched successfully',
            data: supplyRequest
        });
    } catch (error) {
        console.log('Get Supply Request By ID Error : ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch supply request details'
        });
    }
};

/**
 * @description Mark supply request as paid and notify vendor/admin
 * @route POST /api/vendor/:id/supply-requests/:requestId/pay
 * @access Private
 */
export const paySupplyRequest = async (req, res) => {
    try {
        const { id, requestId } = req.params;
        const { paymentMethod = 'online', paymentReference = '' } = req.body;
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const vendor = await Vendor.findOne({ _id: id, companyId });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const supplyRequest = await SupplyRequest.findOne({ _id: requestId, vendorId: id, companyId })
            .populate('productId');

        if (!supplyRequest) {
            return res.status(404).json({
                success: false,
                message: 'Supply request not found'
            });
        }

        if (supplyRequest.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Supply request is already paid'
            });
        }

        const invoiceNumber = await generateUniqueCode(
            SupplyRequest,
            "invoiceNumber",
            "INV",
        );

        supplyRequest.paymentStatus = 'paid';
        supplyRequest.paymentMethod = paymentMethod;
        supplyRequest.paymentReference = paymentReference;
        supplyRequest.paidAt = new Date();
        supplyRequest.invoiceNumber = invoiceNumber;
        if (supplyRequest.status !== 'delivered') {
            supplyRequest.status = 'delivered';
        }

        await supplyRequest.save();

       await Alert.create({
    company: companyId,
    franchise: null,    // ADD THIS
    type: "vendor_payment_completed",
    severity: "low",
    message: `Payment completed for vendor request ${supplyRequest.requestNumber}.`,
    metadata: {
        vendorId: vendor._id,
        vendorName: vendor.name,
        requestId: supplyRequest._id,
        requestNumber: supplyRequest.requestNumber,
        invoiceNumber,
        totalAmount: supplyRequest.totalAmount,
        paymentMethod,
        paidAt: supplyRequest.paidAt,
    },
});

        if (vendor.email) {
            await sendEmail({
                to: vendor.email,
                subject: `Payment Confirmation - ${supplyRequest.requestNumber}`,
                text: `Hello ${vendor.name},\n\nPayment has been completed for your request ${supplyRequest.requestNumber}.\nInvoice: ${invoiceNumber}\nAmount: $${Number(supplyRequest.totalAmount || 0).toFixed(2)}\nMethod: ${paymentMethod}\n\nThank you.`,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Supply request payment completed successfully',
            data: {
                supplyRequest,
                invoiceNumber,
            }
        });
    } catch (error) {
        console.log('Pay Supply Request Error : ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete payment for supply request'
        });
    }
};

/**
 * @description Get Purchase History
 * @route GET /api/vendor/purchase-history
 * @access Private
 */
export const getPurchaseHistory = async (req, res) => {
    try {
        const companyId = new mongoose.Types.ObjectId(req.user.company);

        const purchases = await SupplyRequest.find({
            companyId,
            status: "delivered",
            paymentStatus: "paid",
        })
            .populate("vendorId", "name email phone")
            .populate("productId", "name sku barcode")
            .populate("createdBy", "name email")
            .sort({ paidAt: -1 });

        res.status(200).json({
            success: true,
            message: "Purchase history fetched successfully.",
            data: purchases,
            count: purchases.length,
        });
    } catch (error) {
        console.log("Get Purchase History Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch purchase history.",
        });
    }
};