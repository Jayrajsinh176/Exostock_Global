import Product from "../models/product.model.js";
import Franchise from "../models/franchise.model.js";
import LocationStock from "../models/locationStock.model.js";
import StockTransfer from "../models/stockTransfer.model.js";
import Company from "../models/company.model.js";
import {
  isStockTransferAllowed,
  isInterFranchiseTransferAllowed,
} from "../utils/subscription.js";

export const transferStock = async (req, res) => {
  try {
const { productId, toLocationId, quantity, notes } = req.body;

if (!productId || !toLocationId || !quantity) {
  return res.status(400).json({
    success: false,
    message: "Please fill all required fields.",
  });
}

if (Number(quantity) <= 0) {
  return res.status(400).json({
    success: false,
    message: "Quantity must be greater than 0.",
  });
}

const company = req.user.company;

const companyData = await Company.findById(company);

if (!companyData) {
  return res.status(404).json({
    success: false,
    message: "Company not found.",
  });
}

if (!isStockTransferAllowed(companyData.plan)) {
  return res.status(403).json({
    success: false,
    message: "Stock Transfer is available from the Standard plan onwards.",
  });
}

// Find Main Store
let fromLocation;

const locationId = req.user.locationId;

if (locationId) {
    fromLocation = locationId;
} else {
  const mainStore = await Franchise.findOne({
    company,
    isDefault: true,
  });

  if (!mainStore) {
    return res.status(404).json({
      success: false,
      message: "Main Store not found.",
    });
  }

  fromLocation = mainStore._id;
}

// Cannot transfer to Main Store
if (String(fromLocation) === String(toLocationId)) {
  return res.status(400).json({
    success: false,
    message: "Cannot transfer stock to the same location.",
  });
}

// Check Product
const product = await Product.findOne({
  _id: productId,
  company,
});

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found.",
  });
}

// Check Destination Location
const destination = await Franchise.findOne({
  _id: toLocationId,
  company,
});

if (!destination) {
  return res.status(404).json({
    success: false,
    message: "Destination location not found.",
  });
}

// Franchise -> franchise transfers (neither side is the Main Store) need Business+
if (!isInterFranchiseTransferAllowed(companyData.plan) && !destination.isDefault) {
  const source = await Franchise.findOne({ _id: fromLocation, company }).select(
    "isDefault"
  );

  if (!source?.isDefault) {
    return res.status(403).json({
      success: false,
      message:
        "Inter-franchise stock transfer is available from the Business plan onwards. On your plan, stock can move only between the Main Store and a franchise.",
    });
  }
}

// ===========================
// Get Main Store Stock
// ===========================

const mainStock = await LocationStock.findOne({
  company,
  locationId: fromLocation,
  product: productId,
});

if (!mainStock) {
  return res.status(404).json({
    success: false,
   message: "Source location stock not found.",
  });
}

if (mainStock.stock < Number(quantity)) {
  return res.status(400).json({
    success: false,
    message: "Insufficient stock in Source Location.",
  });
}

// ===========================
// Get Destination Stock
// ===========================

let destinationStock = await LocationStock.findOne({
  company,
  locationId: destination._id,
  product: productId,
});

if (!destinationStock) {
  destinationStock = await LocationStock.create({
    company,
    locationId: destination._id,
    product: productId,
    stock: 0,
  });
}

// ===========================
// Transfer Stock
// ===========================



mainStock.stock -= Number(quantity);

destinationStock.stock += Number(quantity);

// Keep Product.stock equal to Main Store stock
if (!locationId) {
    product.stock = mainStock.stock;
}

await mainStock.save();
await destinationStock.save();

await product.save();
// ===========================
// Save Transfer History
// ===========================

await StockTransfer.create({
  company,
  product: productId,
  fromLocation: fromLocation,
  toLocation: destination._id,
  quantity: Number(quantity),
  transferredBy: req.user._id,
  transferredByModel: req.user.role === "franchise" ? "Franchise" : "User",
  notes,
});

// ===========================
// Response
// ===========================

return res.status(200).json({
  success: true,
  message: "Stock transferred successfully.",
});

  } catch (error) {
    console.error("Transfer Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getStockTransferHistory = async (req, res) => {
  try {
    const company = req.user.company;

    const companyData = await Company.findById(company);

    if (!companyData) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (!isStockTransferAllowed(companyData.plan)) {
      return res.status(403).json({
        success: false,
        message: "Stock Transfer History is available from the Standard plan onwards.",
      });
    }

    const filter = { company };

    // Only franchise logins are scoped to their own location.
    // Company admins/managers/staff see every transfer for the company,
    // including inter-franchise transfers that never touch the Main Store.
    if (req.user.role === "franchise") {
      filter.$or = [
        { fromLocation: req.user.locationId },
        { toLocation: req.user.locationId },
      ];
    }

    const transfers = await StockTransfer.find(filter)
      .populate("product", "name sku")
      .populate("fromLocation", "locationName name isDefault")
      .populate("toLocation", "locationName name isDefault")
      .populate("transferredBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    console.error("Get Stock Transfer History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};