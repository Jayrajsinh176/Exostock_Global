import mongoose, { get } from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Company from "../models/company.model.js";
import Order from "../models/order.model.js";
import SupplyRequest from "../models/supplyRequest.model.js";
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";
import StockAdjustment from "../models/stockAdjustment.model.js";
import { logActivity } from "../utils/logActivity.js";
import { generateUniqueCode } from "../utils/generateCode.js";
import {
  canAddProductToPlan,
  formatPlanProductLimit,
  getSubscriptionPlan,
  isCsvImportAllowed,
  isLowStockAlertsAllowed,
  isReportsAllowed,
} from "../utils/subscription.js";
import fs from "fs";
import csv from "csv-parser";


const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// JSON requests carry numbers as numbers; multipart form fields are strings.
// Accept both forms while rejecting blank, invalid, and non-finite values.
const parseOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    const error = new Error(`${fieldName} must be a number`);
    error.status = 400;
    throw error;
  }
  return parsed;
};

const escapeRegex = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const buildCategoryPayload = (category) => {
  if (!category) {
    return null;
  }

  if (typeof category === "object") {
    return {
      id: category._id || category.id,
      name: category.name,
    };
  }

  return category;
};

const buildProductPayload = (product) => ({
  id: product._id,
  company: product.company,
  name: product.name,
  sku: product.sku,
  image: product.image,
  barcode: product.barcode,
  category: buildCategoryPayload(product.category),
  vendor: product.vendor || null,
  price: product.price,
  mrp: product.mrp,
  dp: product.dp,
  bv: product.bv,
  stock: product.stock,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const handleProductError = (res, error) => {
  if (error.status === 400) {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map((item) => item.message);
    return res.status(400).json({
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: "SKU already exists for this company",
    });
  }

  console.error("Product error:", error);
  return res.status(500).json({ message: "Internal server error" });
};

const getScopedCategory = async (categoryId, companyId) => {
  if (!isValidObjectId(categoryId)) {
    return null;
  }

  return Category.findOne({
    _id: categoryId,
    company: companyId,
  }).select("_id name");
};

const getUserLocationId = (user) => user.locationId || null;

/** 
 * @description get all products for company
 * @route GET /api/products
 * @access Protected
 */
export const getProducts = async (req, res) => {
  try {
    const query = {
      company: new mongoose.Types.ObjectId(req.user.company),
    };

    if (req.query.category) {
      if (!isValidObjectId(req.query.category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }

      query.category = new mongoose.Types.ObjectId(req.query.category);
    }

    if (req.query.search?.trim()) {
      const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), "i");
      query.$or = [{ name: searchRegex }, { sku: searchRegex }];
    }

    const parsedPage = Number.parseInt(req.query.page, 10);
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.max(parsedLimit, 1);

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("vendor", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Business Manager -> Show Location Stock
    // Franchise -> Show only its own stock
    const locationId = getUserLocationId(req.user);

    if (locationId) {
      const locationStocks = await LocationStock.find({
        company: req.user.company,
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
    const total = await Product.countDocuments(query);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      count: total,
      products: products.map(buildProductPayload),
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const query = {
      _id: req.params.id,
      company: req.user.company,
    };

    const locationId = getUserLocationId(req.user);

    if (locationId) {
      query.$or = [
        {
          createdBy: "company",
        },
        {
          createdBy: "franchise",
          franchise: locationId,
        },
      ];
    }

    const product = await Product.findOne(query)
      .populate("category", "name")
      .populate("vendor", "name")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: buildProductPayload(product),
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/**
 * @description create product for company
 * @route POST /api/products
 * @access Protected
 */
export const createProduct = async (req, res) => {
  try {
    let {
      name,
      sku,
      barcode,
      category,
      price,
      mrp,
      dp,
      bv,
      vendor,
      lowStockThreshold,
      addInitialStock,
      initialQuantity,
      purchasePrice,
      paymentStatus,
    } = req.body;

    name = name?.trim();
    sku = sku?.trim().toUpperCase();
    addInitialStock =
      addInitialStock === true ||
      addInitialStock === "true";

    if (
      !name ||
      !sku ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, SKU, Category and Price are required",
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id"
      });
    }

    if (vendor && !isValidObjectId(vendor)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor id"
      });
    }

    initialQuantity = parseOptionalNumber(
      initialQuantity,
      "Initial Quantity"
    );

    price = parseOptionalNumber(price, "Price");

    purchasePrice = parseOptionalNumber(
      purchasePrice,
      "Purchase Price"
    );

    lowStockThreshold = parseOptionalNumber(
      lowStockThreshold,
      "Low Stock Threshold"
    );
    if (price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number"
      });
    }
    if (addInitialStock) {
      if (!initialQuantity || initialQuantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Initial Quantity is required",
        });
        console.log("Initial Stock Enabled");
        console.log({
          initialQuantity,
          purchasePrice,
          paymentStatus,
        });
      }

      if (purchasePrice === undefined || purchasePrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Purchase Price is required",
        });
      }
    }

    const company = await Company.findById(req.user.company).select("plan");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    const productCount = await Product.countDocuments({ company: req.user.company });
    if (!canAddProductToPlan(company.plan, productCount)) {
      const plan = getSubscriptionPlan(company.plan);
      return res.status(403).json({
        success: false,
        message: `${plan.label} plan allows up to ${formatPlanProductLimit(company.plan)} products. Upgrade your plan to add more products.`,
      });
    }

    const existingCategory = await getScopedCategory(category, req.user.company);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found for this company"
      });
    }

    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : "";
    const isFranchise = req.user.role === "franchise";

    const product = await Product.create({
      company: req.user.company,

      franchise: isFranchise ? req.user.franchise : null,

      createdBy: isFranchise ? "franchise" : "company",

      name,
      sku,
      barcode: barcode?.trim() || `${req.user.company}-${sku}`,
      category,
      price,
      mrp: mrp ?? price,
      dp: dp ?? price,
      bv: bv ?? 0,
      stock: 0,
      vendor: vendor || null,
      image,
      lowStockThreshold: lowStockThreshold ?? 5,
    });

    // Create stock records for Main Store and the user's own location
    const mainStore = await Franchise.findOne({
      company: req.user.company,
      isDefault: true,
    });

    const userLocationId = req.user.locationId || null;
    const targetLocationId = userLocationId || mainStore?._id || null;
    // Without a Main Store, the user's location is the company's main inventory
    const isMainStoreTarget =
      !mainStore || String(targetLocationId) === String(mainStore._id);

    if (mainStore) {
      await LocationStock.create({
        company: req.user.company,
        locationId: mainStore._id,
        product: product._id,
        stock: 0,
      });
    }

    let locationStock = null;

    if (targetLocationId) {
      locationStock = await LocationStock.findOneAndUpdate(
        {
          company: req.user.company,
          locationId: targetLocationId,
          product: product._id,
        },
        { $setOnInsert: { stock: 0 } },
        { upsert: true, new: true }
      );
    }
    if (addInitialStock) {

      const requestNumber = await generateUniqueCode(
        SupplyRequest,
        "requestNumber",
        "REQ",
      );
      const purchaseNumber = `PUR${Date.now()}`;

      const totalAmount = purchasePrice * initialQuantity;

      await SupplyRequest.create({
        companyId: req.user.company,

        locationId: targetLocationId,

        vendorId: vendor,
        productId: product._id,

        requestNumber,
        purchaseNumber,

        quantity: initialQuantity,
        quotedPrice: purchasePrice,
        totalAmount,

        expectedDeliveryDate: new Date(),
        actualDeliveryDate: new Date(),

        status: "delivered",

        paymentStatus: paymentStatus || "unpaid",

        paidAt:
          paymentStatus === "paid"
            ? new Date()
            : null,

        receivedBy: req.user._id,
        createdBy: req.user._id,
      });

      // product.stock mirrors the Main Store's stock
      if (isMainStoreTarget) {
        product.stock = initialQuantity;
        await product.save();
      }

      if (locationStock) {
        locationStock.stock = initialQuantity;
        await locationStock.save();
      }
    }

    await product.populate("category", "name");

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "created_product",
      details: `Created product: ${name}`,
      metadata: {
        productId: product._id,
        sku: product.sku,
        category: product.category._id,
        price: product.price,
        stock: product.stock,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: buildProductPayload(product),
      subscription: {
        plan: company.plan,
        maxProducts: formatPlanProductLimit(company.plan),
      },
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/** 
 * @description update product 
 * @route PUT /api/products/:id
 * @access Protected 
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const query = {
      _id: id,
      company: req.user.company,
    };

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = [
      "name",
      "sku",
      "category",
      "price",
      "stock",
      "vendor",
      "lowStockThreshold",
    ];
    const updateFields = Object.keys(req.body).filter((field) =>
      allowedFields.includes(field)
    );

    if (!updateFields.length) {
      return res.status(400).json({
        message: "At least one valid field is required to update the product",
      });
    }

    const { name, sku, category, vendor } = req.body;
    const price = parseOptionalNumber(req.body.price, "Price");
    const stock = parseOptionalNumber(req.body.stock, "Stock");
    const lowStockThreshold = parseOptionalNumber(
      req.body.lowStockThreshold,
      "Low Stock Threshold"
    );
    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }

      const existingCategory = await getScopedCategory(
        category,
        req.user.company
      );

      if (!existingCategory) {
        return res
          .status(404)
          .json({ message: "Category not found for this company" });
      }

      product.category = category;
    }


    if (sku !== undefined) {
      const normalizedSku = sku?.trim().toUpperCase();

      if (!normalizedSku) {
        return res.status(400).json({ message: "SKU cannot be empty" });
      }
      product.sku = normalizedSku;
    }

    if (name !== undefined) {
      const trimmed = name?.trim();

      if (!trimmed) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }

      product.name = trimmed;
    }

    if (req.body.price !== undefined) {
      if (price === undefined) {
        return res.status(400).json({ message: "Price must be a number" });
      }

      product.price = price;
    }

    if (req.body.stock !== undefined) {
      if (stock === undefined) {
        return res.status(400).json({ message: "Stock must be a number" });
      }

      product.stock = stock;
    }

    if (req.body.lowStockThreshold !== undefined) {
      if (lowStockThreshold === undefined) {
        return res.status(400).json({
          message: "Low Stock Threshold must be a number",
        });
      }

      product.lowStockThreshold = lowStockThreshold;
    }

    if (vendor !== undefined) {
      if (vendor && !isValidObjectId(vendor)) {
        return res.status(400).json({ message: "Invalid vendor id" });
      }

      product.vendor = vendor || null;
    }

    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }

    await product.save();

    await product.populate("category", "name");

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "updated_product",
      details: `Updated product: ${product.name}`,
      metadata: {
        productId: product._id,
        sku: product.sku,
        updatedFields: Object.keys(req.body).filter(field =>
          ["name", "sku", "category", "price", "stock"].includes(field)
        ),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: buildProductPayload(product),
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/**
 * @description delete product
 * @route DELETE /api/products/:id
 * @access Protected
 */
export const deleteProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    // Only Company Admin can delete products
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the Company Admin can delete products.",
      });
    }

    const query = {
      _id: req.params.id,
      company: req.user.company,
    };

    const product = await Product.findOneAndDelete(query);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    await LocationStock.deleteMany({
      company: req.user.company,
      product: product._id,
    });

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "deleted_product",
      details: `Deleted product: ${product.name}`,
      metadata: {
        productId: product._id,
        sku: product.sku,
        name: product.name,
        price: product.price,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

function getInventoryValue(products) {
  return products.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    return total + (price * stock);
  }, 0);
}

function getLowStockProducts(products) {
  return products.filter((product) => {
    const stock = Number(product.stock) || 0;
    return stock <= (product.lowStockThreshold || 10);
  })
}

function getTotalProducts(products) {
  return products.length;
}

function getAveragePrice(products) {
  let productPrice = products.reduce((total, product) => {
    const price = Number(product.price) || 0;
    return total + (price);
  }, 0)
  let productStock = products.reduce((total, product) => {
    const stock = Number(product.stock) || 0;
    return total + (stock);
  }, 0)
  // Prevent division by zero
  return products.length > 0
    ? productPrice / products.length
    : 0;
}

function getOutOfStockCount(products) {
  return products.reduce((total, product) => {
    const stock = Number(product.stock) || 0;
    return total + (stock === 0 ? 1 : 0);
  }, 0);
}

/**
 * @description stock report: every product with available and used (sold) stock
 * @route GET /api/products/report
 * @access Protected
 */
export const getProductReport = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company).select("plan");
    if (!isReportsAllowed(company?.plan)) {
      return res.status(403).json({
        success: false,
        message: "Reports are available from the Basic plan onwards.",
      });
    }

    const companyId = new mongoose.Types.ObjectId(req.user.company);
    const locationId = getUserLocationId(req.user);

    const productQuery = { company: companyId };
    const soldMatch = { company: companyId, status: "completed" };

    if (locationId) {
      const locationObjectId = new mongoose.Types.ObjectId(locationId);
      productQuery.$or = [
        { createdBy: "company" },
        { createdBy: "franchise", franchise: locationObjectId },
      ];
      // Same scope as the product details page's "Total Units Sold"
      soldMatch.locationId = locationObjectId;
    }

    const [products, soldTotals, locationStocks] = await Promise.all([
      Product.find(productQuery)
        .populate("category", "name")
        .sort({ name: 1 })
        .lean(),
      Order.aggregate([
        { $match: soldMatch },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            usedStock: { $sum: { $ifNull: ["$items.quantity", 0] } },
          },
        },
      ]),
      locationId
        ? LocationStock.find({ company: companyId, locationId }).lean()
        : Promise.resolve([]),
    ]);

    const usedMap = {};
    soldTotals.forEach((item) => {
      if (item._id) usedMap[item._id.toString()] = item.usedStock;
    });

    const stockMap = {};
    locationStocks.forEach((item) => {
      stockMap[item.product.toString()] = item.stock;
    });

    const report = products.map((product) => {
      const id = product._id.toString();
      const availableStock = locationId
        ? Number(stockMap[id]) || 0
        : Number(product.stock) || 0;

      return {
        id: product._id,
        name: product.name,
        sku: product.sku,
        category: buildCategoryPayload(product.category),
        price: product.price,
        lowStockThreshold: product.lowStockThreshold,
        availableStock,
        usedStock: Number(usedMap[id]) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Product report fetched successfully",
      count: report.length,
      products: report,
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

/**
 * @description get product statistics
 * @route /api/products/stats
 * @access Protected
 */

export const getProductStats = async (req, res) => {
  try {
    let products;

    const locationId = getUserLocationId(req.user);

    if (locationId) {

      const stocks = await LocationStock.find({
        company: req.user.company,
        locationId,
      }).populate("product");

      products = stocks
        .filter((item) => item.product) // Skip deleted products
        .map((item) => ({
          ...item.product.toObject(),
          stock: item.stock,
        }));

    } else {

      products = await Product.find({
        company: req.user.company,
      }).lean();

    }
    // console.log(products);


    return res.status(200).json({
      success: true,
      stats: {
        "inventoryValue": getInventoryValue(products),
        "lowStocksAlerts": getLowStockProducts(products).length,
        "lowStockProduct": getLowStockProducts(products),
        "totalProducts": getTotalProducts(products),
        "averagePrice": getAveragePrice(products).toFixed(2),
        "outOfStockCount": getOutOfStockCount(products),

      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error this is from stats route",
    });

  }
};

/** 
 * @description get low stock products
 * @route /api/products/low-stock
 * @access Protected
 */

export const getLowStock = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company).select("plan");
    if (!isLowStockAlertsAllowed(company?.plan)) {
      return res.status(403).json({
        success: false,
        message: "Low stock alerts are available on the Standard plan and above",
      });
    }

    let query = { company: new mongoose.Types.ObjectId(req.user.company) };

    let products;

    const locationId = getUserLocationId(req.user);

    if (locationId) {

      const stocks = await LocationStock.find({
        company: req.user.company,
        locationId,
      }).populate({
        path: "product",
        populate: { path: "category", select: "name" },
      });

      products = stocks
        .filter((item) => item.product) // Skip deleted products
        .map((item) => ({
          ...item.product.toObject(),
          stock: item.stock,
        }));

    } else {

      products = await Product.find(query).populate("category", "name").lean();

    }
    return res.status(200).json({
      success: true,
      "low-stock-products": getLowStockProducts(products),
      "count": getLowStockProducts(products).length,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }

}

function getCategoryName(categoryId, companyId) {
  if (!isValidObjectId(categoryId)) {
    return null;
  }

  return Category.findOne({
    _id: categoryId,
    company: companyId,
  }).select("name").lean();

}

/**
 * @description get product by category
 * @route /api/products/by-category/:categoryId
 * @access Protected
 */


export const getProductsByCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.categoryId)) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid Category Id"
      });
    }
    let query = {
      company: new mongoose.Types.ObjectId(req.user.company),
      category: new mongoose.Types.ObjectId(req.params.categoryId)
    }

    let products = await Product.find(query).lean();
    return res.status(200).json({
      success: true,
      products: products,
      count: products.length,
      categoryName: await getCategoryName(query.category, query.company),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


/**
 * @description get products by vendor
 * @route GET /api/products/vendor/:vendorName
 * @access Protected
 */
export const getProductsByVendor = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.company);
    const vendorName = req.params.vendorName;

    const products = await Product.find({
      company: companyId,
      vendor: { $regex: vendorName, $options: "i" }
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Products by vendor fetched successfully",
      data: products
    });
  } catch (error) {
    console.error('Get Products by Vendor Error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV file.",
      });
    }

    const importCompany = await Company.findById(req.user.company).select("plan");

    if (!isCsvImportAllowed(importCompany?.plan)) {
      fs.unlink(req.file.path, () => {});
      return res.status(403).json({
        success: false,
        message: "CSV import is available from the Standard plan onwards.",
      });
    }

    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          const company = await Company.findById(req.user.company);

          const plan = getSubscriptionPlan(company.plan);

          const existingProducts = await Product.countDocuments({
            company: req.user.company,
          });

          const remainingSlots = Number.isFinite(plan.maxProducts)
            ? plan.maxProducts - existingProducts
            : Infinity;

          if (
            Number.isFinite(plan.maxProducts) &&
            rows.length > remainingSlots
          ) {
            fs.unlinkSync(req.file.path);

            return res.status(403).json({
              success: false,
              message: `Your ${company.plan} plan has only ${remainingSlots} product slots remaining, but your CSV contains ${rows.length} products.`,
            });
          }

          const importedProducts = [];
          const errors = [];

          for (const row of rows) {
            try {

              const category = await Category.findOne({
                company: req.user.company,
                name: new RegExp(`^${row.category}$`, "i"),
              });

              if (!category) {
                errors.push(
                  `Category '${row.category}' not found for '${row.name}'`
                );
                continue;
              }

              const existingSku = await Product.findOne({
                company: req.user.company,
                sku: row.sku,
              });

              if (existingSku) {
                errors.push(`SKU '${row.sku}' already exists`);
                continue;
              }

              const isFranchise = req.user.role === "franchise";
              const mainStore = await Franchise.findOne({
                company: req.user.company,
                isDefault: true,
              });

              const product = await Product.create({

                company: req.user.company,
                franchise: isFranchise ? req.user.franchise : null,
                createdBy: isFranchise ? "franchise" : "company",
                name: row.name,
                sku: row.sku.toUpperCase(),
                barcode: `${req.user.company}-${row.sku.toUpperCase()}`,
                category: category._id,
                price: Number(row.price),
                mrp: Number(row.mrp),
                dp: Number(row.dp),
                bv: Number(row.bv),
                stock: Number(row.stock),
                lowStockThreshold: Number(row.lowStockThreshold),
              });

              if (mainStore) {
                await LocationStock.create({
                  company: req.user.company,
                  locationId: mainStore._id,
                  product: product._id,
                  stock: Number(row.stock),
                });
              }


              importedProducts.push(product);

            } catch (err) {
              errors.push(err.message);
            }
          }

          fs.unlinkSync(req.file.path);

          return res.status(200).json({
            success: true,
            message: "Products imported successfully",
            imported: importedProducts.length,
            skipped: errors.length,
            errors,
          });



        } catch (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const companyId = new mongoose.Types.ObjectId(req.user.company);
    const productId = new mongoose.Types.ObjectId(req.params.id);
    const {
      search = "",
      date,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);
    const skip = (currentPage - 1) * pageLimit;

    const productQuery = {
      _id: productId,
      company: companyId,
    };
    const locationId = getUserLocationId(req.user);

    if (locationId) {
      productQuery.$or = [
        {
          createdBy: "company",
        },
        {
          createdBy: "franchise",
          franchise: locationId,
        },
      ];
    }



    const product = await Product.findOne(productQuery)
      .populate("category", "name")
      .populate("vendor", "name phone email address company status")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const completedProductSaleMatch = {
      company: companyId,
      status: "completed",
      "items.product": productId,
    };

    // Only sales billed at this user's location (same scope as Billing History)
    if (locationId) {
      completedProductSaleMatch.locationId = new mongoose.Types.ObjectId(locationId);
    }

    // --------------------------------------------
    // GET ACTUAL STOCK FOR CURRENT USER
    // --------------------------------------------
    let stock = Number(product.stock) || 0;

    if (locationId) {
      const locationStock = await LocationStock.findOne({
        company: companyId,
        locationId: new mongoose.Types.ObjectId(locationId),
        product: productId,
      }).lean();

      stock = Number(locationStock?.stock) || 0;
    }

    const [summaryResult, allSales, allPurchases] = await Promise.all([
      Order.aggregate([
        { $match: completedProductSaleMatch },
        { $unwind: "$items" },
        { $match: { "items.product": productId } },
        {
          $group: {
            _id: null,
            totalUnitsSold: { $sum: { $ifNull: ["$items.quantity", 0] } },
            totalRevenueGenerated: { $sum: { $ifNull: ["$items.subtotal", 0] } },
          },
        },
      ]),
      Order.aggregate([
        { $match: completedProductSaleMatch },
        {
          $addFields: {
            billingDate: { $ifNull: ["$paidAt", "$createdAt"] },
          },
        },
        { $unwind: "$items" },
        { $match: { "items.product": productId } },
        { $sort: { billingDate: 1, createdAt: 1 } },
        {
          $project: {
            _id: 0,
            date: "$billingDate",
            quantity: "$items.quantity",
          },
        },
      ]),
      SupplyRequest.aggregate([
        {
          $match: {
            companyId,
            productId,
            $or: [
              { status: "delivered" },
              { paymentStatus: "paid" },
            ],
            ...(locationId
              ? {
                locationId: new mongoose.Types.ObjectId(locationId),
              }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $ifNull: [
                "$actualDeliveryDate",
                { $ifNull: ["$paidAt", "$updatedAt"] },
              ],
            },
            quantity: "$quantity",
          },
        },
        { $sort: { date: 1 } },
      ]),
    ]);

    // Manual "Add Stock" entries for the location whose stock is shown
    let adjustmentLocationFilter;
    if (locationId) {
      adjustmentLocationFilter = new mongoose.Types.ObjectId(locationId);
    } else {
      const mainStore = await Franchise.findOne({
        company: companyId,
        isDefault: true,
      })
        .select("_id")
        .lean();
      adjustmentLocationFilter = { $in: [mainStore?._id || null, null] };
    }

    const allAdjustments = await StockAdjustment.find({
      company: companyId,
      product: productId,
      locationId: adjustmentLocationFilter,
    })
      .sort({ createdAt: 1 })
      .lean();

    const totalUnitsSold = summaryResult[0]?.totalUnitsSold || 0;
    const totalRevenueGenerated = summaryResult[0]?.totalRevenueGenerated || 0;
    const totalPurchased = allPurchases.reduce(
      (sum, purchase) => sum + (Number(purchase.quantity) || 0),
      0,
    );
    const totalAdjusted = allAdjustments.reduce(
      (sum, adjustment) => sum + (Number(adjustment.quantity) || 0),
      0,
    );
    const inferredOpeningStock = Math.max(
      0,
      stock + totalUnitsSold - totalPurchased - totalAdjusted,
    );
    let remainingStock = inferredOpeningStock;
    const stockMovement = [
      ...(inferredOpeningStock > 0
        ? [
          {
            date: product.createdAt,
            action: "Stock Added",
            quantity: inferredOpeningStock,
            remainingStock,
          },
        ]
        : []),
      ...[
        ...allPurchases.map((purchase) => ({
          date: purchase.date,
          action: "Purchase",
          quantity: Number(purchase.quantity) || 0,
        })),
        ...allSales.map((sale) => ({
          date: sale.date,
          action: "Sold",
          quantity: -(Number(sale.quantity) || 0),
        })),
        ...allAdjustments.map((adjustment) => ({
          date: adjustment.createdAt,
          action:
            adjustment.quantity < 0
              ? adjustment.reason || "Stock Removed"
              : adjustment.reason
                ? `Stock Added (${adjustment.reason})`
                : "Stock Added",
          quantity: Number(adjustment.quantity) || 0,
          notes: adjustment.notes || "",
        })),
      ]
        .sort((left, right) => new Date(left.date) - new Date(right.date))
        .map((movement) => {
          remainingStock += movement.quantity;
          return {
            ...movement,
            remainingStock,
          };
        }),
    ];

    const salesMatchStage = { ...completedProductSaleMatch };
    if (date) {
      const startDate = new Date(date);
      if (!Number.isNaN(startDate.getTime())) {
        const endDate = new Date(startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        salesMatchStage.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    const salesPipeline = [
      { $match: salesMatchStage },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "order",
          as: "invoice",
        },
      },
      {
        $addFields: {
          invoice: { $first: "$invoice" },
          // Match the number shown in Billing History and on printed invoices
          invoiceNumber: {
            $ifNull: ["$orderNumber", { $first: "$invoice.invoiceNumber" }],
          },
          billingDate: { $ifNull: ["$paidAt", "$createdAt"] },
          customerDisplayName: {
            $cond: [
              { $eq: [{ $trim: { input: { $ifNull: ["$customerName", ""] } } }, ""] },
              "Walk-in Customer",
              "$customerName",
            ],
          },
          fullItems: "$items",
        },
      },
      { $unwind: "$items" },
      { $match: { "items.product": productId } },
    ];

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      salesPipeline.push({
        $match: {
          $or: [
            { invoiceNumber: { $regex: trimmedSearch, $options: "i" } },
            { orderNumber: { $regex: trimmedSearch, $options: "i" } },
            { customerDisplayName: { $regex: trimmedSearch, $options: "i" } },
          ],
        },
      });
    }

    salesPipeline.push(
      { $sort: { billingDate: sort === "oldest" ? 1 : -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: pageLimit },
            {
              $project: {
                orderId: "$_id",
                orderNumber: 1,
                invoiceId: "$invoice._id",
                invoiceNumber: 1,
                customerName: "$customerDisplayName",
                quantitySold: "$items.quantity",
                unitPrice: "$items.unitPrice",
                totalAmount: "$items.subtotal",
                orderTotal: "$total",
                subtotal: 1,
                tax: 1,
                discount: 1,
                paymentMethod: 1,
                paymentStatus: 1,
                billingDate: 1,
                items: "$fullItems",
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    );

    const [salesResult] = await Order.aggregate(salesPipeline);
    const totalRecords = salesResult?.totalCount?.[0]?.count || 0;

    const price = Number(product.price) || 0;
    const costPrice = Number(product.costPrice) || 0;


    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      data: {
        product: {
          id: product._id,
          name: product.name,
          sku: product.sku,
          image: product.image,
          category: buildCategoryPayload(product.category),
          vendor: product.vendor || null,
          price,
          costPrice,
          stock,
          inventoryValue: Math.round(price * stock * 100) / 100,
          status: stock > (product.lowStockThreshold || 5)
            ? "In Stock"
            : stock > 0
              ? "Low Stock"
              : "Out of Stock",
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
        overview: {
          totalUnitsSold,
          totalRevenueGenerated: Math.round(totalRevenueGenerated * 100) / 100,
          profitPerUnit: Math.round((price - costPrice) * 100) / 100,
        },
        salesHistory: salesResult?.data || [],
        stockMovement,
        pagination: {
          total: totalRecords,
          page: currentPage,
          pages: Math.ceil(totalRecords / pageLimit),
          limit: pageLimit,
        },
      },
    });
  } catch (error) {
    return handleProductError(res, error);
  }
};

export const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid quantity.",
      });
    }

    const query = {
      _id: id,
      company: req.user.company,
    };


    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const qty = Number(quantity);
    const company = req.user.company;

    const mainStore = await Franchise.findOne({
      company,
      isDefault: true,
    });

    const requesterLocationId = req.user.locationId;
    // Without a Main Store, the user's location is the company's main inventory
    const isMainStoreRequest =
      !requesterLocationId ||
      !mainStore ||
      String(requesterLocationId) === String(mainStore._id);

    if (!isMainStoreRequest) {
      // Franchise / location-scoped user: pull stock from the Main Store
      // into their own location instead of inflating total company stock.
      const mainStock = await LocationStock.findOne({
        company,
        locationId: mainStore._id,
        product: product._id,
      });

      if (!mainStock || mainStock.stock < qty) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock in Main Store.",
        });
      }

      mainStock.stock -= qty;
      await mainStock.save();

      let locationStock = await LocationStock.findOne({
        company,
        locationId: requesterLocationId,
        product: product._id,
      });

      if (locationStock) {
        locationStock.stock += qty;
        await locationStock.save();
      } else {
        locationStock = await LocationStock.create({
          company,
          locationId: requesterLocationId,
          product: product._id,
          stock: qty,
        });
      }

      // product.stock mirrors the Main Store's stock (see assignStock/transferStock)
      product.stock = mainStock.stock;
      await product.save();

      await StockAdjustment.insertMany([
        {
          company,
          product: product._id,
          locationId: mainStore._id,
          quantity: -qty,
          reason: "Transferred to Franchise",
          notes: notes || "",
          stockAfter: mainStock.stock,
          createdBy: req.user._id,
        },
        {
          company,
          product: product._id,
          locationId: requesterLocationId,
          quantity: qty,
          reason: reason || "Stock Added",
          notes: notes || "",
          stockAfter: locationStock.stock,
          createdBy: req.user._id,
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Stock added successfully.",
        product,
      });
    }

    // Main Store / company admin: fresh stock entering the company (e.g. from a vendor)
    product.stock += qty;

    await product.save();

    const targetLocationId = mainStore?._id || requesterLocationId || null;
    let locationStock = null;

    if (targetLocationId) {
      locationStock = await LocationStock.findOneAndUpdate(
        {
          company,
          locationId: targetLocationId,
          product: product._id,
        },
        { $inc: { stock: qty } },
        { upsert: true, new: true }
      );
    }

    await StockAdjustment.create({
      company,
      product: product._id,
      locationId: targetLocationId,
      quantity: qty,
      reason: reason || "Stock Added",
      notes: notes || "",
      stockAfter: locationStock ? locationStock.stock : product.stock,
      createdBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Stock added successfully.",
      product,
    });

  } catch (error) {
    console.error("Add Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};