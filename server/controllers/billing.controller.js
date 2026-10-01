import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";
import { logActivity } from '../utils/logActivity.js';
import { generateUniqueCode } from '../utils/generateCode.js';

/**
 * @description Search products for billing
 * @route GET /api/billing/products/search
 * @access Private
 */
export const searchProducts = async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    const companyId = req.user.company;


    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query cannot be empty'
      });
    }

    const searchRegex = new RegExp(query, 'i');
    let products = await Product.find({
      company: companyId,
      $or: [
        { name: searchRegex },
        { sku: searchRegex },
      ],
    })
      .select("name sku price stock category vendor")
      .populate("category", "name")
      .populate("vendor", "name")
      .limit(parseInt(limit));

    if (req.user.role === "franchise") {
      const locationStocks = await LocationStock.find({
        company: companyId,
        locationId: req.user.locationId,
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
      message: 'Products fetched successfully',
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log('Search Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    });
  }
};

/**
 * @description Get all products for billing (with stock available)
 * @route GET /api/billing/products
 * @access Private
 */
export const getProducts = async (req, res) => {
  try {
    const companyId = req.user.company;
    let products = await Product.find({
      company: companyId,
    })
      .select("name sku price stock category vendor")
      .populate("category", "name")
      .populate("vendor", "name");

    if (req.user.role === "franchise") {
      const locationStocks = await LocationStock.find({
        company: companyId,
        locationId: req.user.locationId,
      }).lean();

      const stockMap = {};

      locationStocks.forEach((item) => {
        stockMap[item.product.toString()] = item.stock;
      });

      products.forEach((product) => {
        product.stock = stockMap[product._id.toString()] || 0;
      });
    } else {
      products = products.filter((product) => product.stock > 0);
    }

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      count: products.length
    });
  } catch (error) {
    console.log('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

/**
 * @description Create order/billing and reduce stock
 * @route POST /api/billing/complete
 * @access Private
 */
export const completeBilling = async (req, res) => {
  try {
    const {
      items,
      customerData,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      notes,
      paymentMethod,
      subtotal,
      tax,
      discount,
      total
    } = req.body;

    const resolvedCustomer = {
      name: customerName ?? customerData?.name,
      email: customerEmail ?? customerData?.email,
      phone: customerPhone ?? customerData?.phone,
      address: customerAddress ?? customerData?.address,
      notes: notes ?? customerData?.notes
    };
    const companyId = req.user.company;
    const userId = req.user._id;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    if (!paymentMethod || !['online', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount'
      });
    }

    // Verify stock availability for all items
    const stockCheck = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (req.user.role === "franchise") {
       const locationStock = await LocationStock.findOne({
    company: companyId,
    locationId: req.user.locationId,
    product: product._id,
});

          if (!locationStock || locationStock.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          return {
            product,
            locationStock,
            item,
          };
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        return {
          product,
          item,
        };
      })
    );

    // Start transaction-like operation
    // 1. Reduce stock for all products
    if (req.user.role === "franchise") {
      await Promise.all(
        stockCheck.map(async ({ locationStock, item }) => {
          locationStock.stock -= item.quantity;
          await locationStock.save();
        })
      );
    } else {
      const stockUpdatePromises = stockCheck.map(({ product, item }) =>
        Product.findByIdAndUpdate(
          product._id,
          {
            $inc: { stock: -item.quantity },
          },
          {
            new: true,
          }
        )
      );

      await Promise.all(stockUpdatePromises);
      const mainStore = await Franchise.findOne({
        company: companyId,
        isDefault: true,
      });

      if (mainStore) {
        await Promise.all(
          stockCheck.map(async ({ product, item }) => {
            await LocationStock.findOneAndUpdate(
              {
                company: companyId,
                locationId: mainStore._id,
                product: product._id,
              },
              {
                $inc: {
                  stock: -item.quantity,
                },
              }
            );
          })
        );
      }
    }

    // 2. Create order number
    const orderCount = await Order.countDocuments({ company: companyId });
    const orderNumber = await generateUniqueCode(Order, 'orderNumber', 'ORD-', 6);
    const calculatedSubtotal = items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0) * Number(item.price || 0),
      0
    );

    // 3. Create Order
   const orderData = {
  company: companyId,
  user: userId,

  franchise:
    req.user.role === "franchise"
      ? req.user.locationId
      : null,

  locationId:
    req.user.role === "franchise"
      ? req.user.locationId
      : null,
      orderNumber,
      items: items.map(item => ({
        product: item.productId,
        productName: item.name,
        productSku: item.sku,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity
      })),
      subtotal: calculatedSubtotal,
      tax: tax || 0,
      discount: discount || 0,
      total: total || calculatedSubtotal,
      totalAmount: calculatedSubtotal,
      paymentMethod,
      paymentStatus:
        paymentMethod === "online"
          ? "paid"
          : "pending",
      status: "completed",
      customerName: resolvedCustomer.name?.trim() || 'Walk-in Customer',
      customerEmail: resolvedCustomer.email || '',
      customerPhone: resolvedCustomer.phone || '',
      customerAddress: resolvedCustomer.address || '',
      notes: resolvedCustomer.notes || ''
    };

    const order = await Order.create(orderData);

    // 4. Create Invoice
    const invoiceNumber = `INV-${Date.now()}-${orderCount + 1}`;
    const invoiceData = {
      company: companyId,
      order: order._id,
      invoiceNumber,
      amount: total || calculatedSubtotal,
      tax: tax || 0,
      subtotal: calculatedSubtotal,
      status: 'issued',
      paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const invoice = await Invoice.create(invoiceData);

    // 5. Log activity
    await logActivity({
      userId,
      companyId,
      action: 'created_order',
      details: `Created order ${orderNumber} with total $${order.total}`,
      metadata: {
        orderId: order._id,
        invoiceId: invoice._id,
        itemCount: items.length
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order completed successfully',
      data: {
        order,
        invoice,
        orderNumber,
        invoiceNumber
      }
    });
  } catch (error) {
    console.log('Complete Billing Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete billing'
    });
  }
};

/**
 * @description Get billing summary (revenue, orders count, etc.)
 * @route GET /api/billing/summary
 * @access Private
 */
export const getBillingSummary = async (req, res) => {
  try {
    const companyId = req.user.company;

    // Total revenue from completed orders
    const matchStage = {
      company: new mongoose.Types.ObjectId(companyId),
      status: "completed",
    };

if (req.user.locationId) {
  matchStage.locationId = new mongoose.Types.ObjectId(req.user.locationId);
}

    const revenue = await Order.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]);

    // Total orders
    const orderFilter = {
      company: companyId,
      status: "completed",
    };

if (req.user.locationId) {
  orderFilter.locationId = req.user.locationId;
}

    const totalOrders = await Order.countDocuments(orderFilter);

    // Average order value
    const avgOrder = revenue[0]?.totalRevenue / totalOrders || 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenue[0]?.totalRevenue || 0,
        totalOrders,
        averageOrderValue: avgOrder
      }
    });
  } catch (error) {
    console.log('Get Billing Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch billing summary'
    });
  }
};

/**
 * @description Get billing history
 * @route GET /api/billing/history
 * @access Private
 */
export const getBillingHistory = async (req, res) => {
  try {
    const companyId = req.user.company;
    const {
      page = 1,
      limit = 10,
      search,
      paymentMethod,
      paymentStatus, date,
      sort = "newest"
    } = req.query;

    const filter = {
      company: companyId,
      status: "completed",
    };

if (req.user.locationId) {
  filter.locationId = req.user.locationId;
}

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } }
      ];
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      filter.createdAt = {
        $gte: start,
        $lt: end
      };
    }

    const orders = await Order.find(filter)
      .populate("items.product", "name sku")
      .sort({
        createdAt: sort === "oldest" ? 1 : -1
      })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.log("Get Billing History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch billing history"
    });
  }
};