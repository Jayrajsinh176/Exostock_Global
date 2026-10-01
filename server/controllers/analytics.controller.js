import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Company from "../models/company.model.js";
import Franchise from "../models/franchise.model.js";
import LocationStock from "../models/locationStock.model.js";
import User from "../models/users.model.js";
import {
  isAnalyticsAllowed,
  isReorderPatternsAllowed,
  isAnalyticsDashboardAllowed,
} from "../utils/subscription.js";


// Only franchise logins should be scoped to a single location. Admins also
// carry a locationId (a leftover pointing at their default location from
// registration), but must always see company-wide data, not just that
// one location's.
const getUserLocationId = (user) =>
  user.role === "franchise" ? user.locationId || null : null;

export const getStockMovementAnalysis = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(
      req.user.company
    );

    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isAnalyticsAllowed(company.plan)) {
      return res.status(403).json({
        success: false,
        message:
          "Analytics is available only on the Business plan and above. Please upgrade your subscription.",
      });
    }

    const orderFilter = {
      company: companyId,
      paymentStatus: "paid",
    };

    const locationId = getUserLocationId(req.user);

    if (locationId) {
      orderFilter.franchise = req.user.franchise;
    }

    const orders = await Order.find(orderFilter).lean();

    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlySales = {};

    months.forEach((month) => {
      monthlySales[month] = 0;
    });

    orders.forEach((order) => {
      const month =
        months[new Date(order.createdAt).getMonth()];

      const quantity = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      monthlySales[month] += quantity;
    });

    const currentMonth = new Date().getMonth();

    const data = [];

    for (let i = 5; i >= 0; i--) {
      const index = (currentMonth - i + 12) % 12;

      data.push({
        month: months[index],
        actualUnits: monthlySales[months[index]],
      });
    }

    let totalInventoryValue = 0;
    let totalProductsAnalyzed = 0;

    if (locationId) {

      const stocks = await LocationStock.find({
        company: companyId,
        locationId,
      }).populate("product");

      totalProductsAnalyzed = stocks.length;

      totalInventoryValue = stocks.reduce((sum, stock) => {
        if (!stock.product) return sum;

        return (
          sum +
          (Number(stock.product.price) || 0) *
          (Number(stock.stock) || 0)
        );
      }, 0);

    } else {

      const products = await Product.find({
        company: companyId,
      }).lean();

      totalProductsAnalyzed = products.length;

      // See getCategoryPerformanceAnalysis: product.stock drifts out of sync
      // with the real, per-location stock once items are distributed, so
      // total from LocationStock and only fall back to product.stock for
      // products never assigned to a location.
      const locationStocks = await LocationStock.find({
        company: companyId,
      }).lean();

      const stockByProduct = {};

      locationStocks.forEach((stock) => {
        const key = stock.product.toString();

        stockByProduct[key] =
          (stockByProduct[key] || 0) + (Number(stock.stock) || 0);
      });

      totalInventoryValue = products.reduce((sum, product) => {
        const key = product._id.toString();

        const effectiveStock =
          key in stockByProduct
            ? stockByProduct[key]
            : Number(product.stock) || 0;

        return sum + (Number(product.price) || 0) * effectiveStock;
      }, 0);

    }

    res.json({
      success: true,
      data,
      totalProductsAnalyzed,
      totalInventoryValue,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryPerformanceAnalysis = async (req, res) => {



  try {
    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isAnalyticsAllowed(company.plan)) {
      return res.status(403).json({
        success: false,
        message:
          "Analytics is available only on the Business plan and above. Please upgrade your subscription.",
      });
    }

    const locationId = getUserLocationId(req.user);

    let categoryMap = {};

    if (locationId) {

      const stocks = await LocationStock.find({
        company: req.user.company,
        locationId,
      }).populate({
        path: "product",
        populate: {
          path: "category",
        },
      });

      stocks.forEach((stock) => {
        const product = stock.product;

        if (!product) return;

        const categoryName =
          product.category?.name || "Uncategorized";

        const value =
          (Number(product.price) || 0) *
          (Number(stock.stock) || 0);

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }

        categoryMap[categoryName] += value;
      });

    } else {

      const products = await Product.find({
        company: req.user.company,
      }).populate("category");

      // product.stock is a central counter that's supposed to mirror the
      // main store's LocationStock entry, but drifts out of sync once stock
      // has been distributed to locations (e.g. companies without a
      // franchise marked isDefault never get it re-synced). LocationStock
      // is what the rest of the app treats as the real stock, so total it
      // per product across every location and only fall back to the stale
      // product.stock for products that were never assigned to a location.
      const locationStocks = await LocationStock.find({
        company: req.user.company,
      });

      const stockByProduct = {};

      locationStocks.forEach((stock) => {
        const key = stock.product.toString();

        stockByProduct[key] =
          (stockByProduct[key] || 0) + (Number(stock.stock) || 0);
      });

      products.forEach((product) => {
        const categoryName =
          product.category?.name || "Uncategorized";

        const key = product._id.toString();

        const effectiveStock =
          key in stockByProduct
            ? stockByProduct[key]
            : Number(product.stock) || 0;

        const value = (Number(product.price) || 0) * effectiveStock;

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }

        categoryMap[categoryName] += value;
      });

    }

    const data = Object.keys(categoryMap).map((category) => ({
      category,
      actualValue: categoryMap[category],
    }));

    const totalInventoryValue = data.reduce(
      (sum, item) => sum + item.actualValue,
      0
    );

    res.json({
      success: true,
      totalCategoriesAnalyzed: data.length,
      totalInventoryValue,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReorderPatternsAnalysis = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isReorderPatternsAllowed(company.plan)) {
      return res.status(403).json({
        success: false,
        message:
          "Reorder pattern analytics is available only on the Business plan and above. Please upgrade your subscription.",
      });
    }
    const locationId = getUserLocationId(req.user);

    let lowStock = [];

    if (locationId) {

      const stocks = await LocationStock.find({
        company: req.user.company,
        locationId,
      }).populate("product");

      lowStock = stocks.filter(
        (stock) =>
          stock.product &&
          Number(stock.stock) <= Number(stock.product.lowStockThreshold)
      );

    } else {

      const products = await Product.find({
        company: req.user.company,
      });

      lowStock = products.filter(
        (product) =>
          Number(product.stock) <= Number(product.lowStockThreshold)
      );

    }

    const data = [
      {
        month: "Low Stock",
        value: lowStock.length,
      },
    ];

    res.json({
      success: true,
      avgReorderFrequency: lowStock.length,
      currentLowStockItems: lowStock.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBusinessOverview = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isAnalyticsDashboardAllowed(company.plan)) {
      return res.status(403).json({
        success: false,
        message:
          "Business Dashboard is available from the Business plan onwards. Please upgrade your subscription.",
      });
    }

    const companyId = new mongoose.Types.ObjectId(req.user.company);

    const orderFilter = {
      company: companyId,
      paymentStatus: "paid",
    };

    const locationId = getUserLocationId(req.user);

    if (locationId) {
      orderFilter.franchise = req.user.franchise;
    }
    // The Main Store (isDefault) is the admin's own head office, auto-created
    // at registration — it's not a franchise, so leave it out of the count
    // (same rule the plan location limit uses).
    const totalFranchises =
      locationId
        ? 1
        : await Franchise.countDocuments({
          company: companyId,
          isDefault: { $ne: true },
        });

    const orders = await Order.find(orderFilter).lean();

    const totalOrders = orders.length;

    // The company admin is the account owner, not staff.
    const totalStaff = locationId
      ? await User.countDocuments({
        company: companyId,
        locationId,
        role: { $ne: "admin" },
      })
      : await User.countDocuments({
        company: companyId,
        role: { $ne: "admin" },
      });

    const totalProductsSold = orders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + item.quantity,
          0
        ),
      0
    );

    return res.json({
      success: true,
      stats: {
        totalFranchises,
        totalStaff,
        totalOrders,
        totalProductsSold,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};