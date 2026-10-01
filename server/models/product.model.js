import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  // NEW
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      default: null,
    },

    // NEW
    createdBy: {
      type: String,
      enum: ["company", "franchise"],
      required: true,
    },



    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      uppercase: true,
      trim: true,
    },

    // For barcode scanning
    barcode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Selling price
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Maximum Retail Price
    mrp: {
      type: Number,
      default: 0,
      min: [0, "MRP cannot be negative"],
    },

    // Distributor Price
    dp: {
      type: Number,
      default: 0,
      min: [0, "DP cannot be negative"],
    },

    // Business Volume (for MLM)
    bv: {
      type: Number,
      default: 0,
      min: [0, "BV cannot be negative"],
    },

    // Main inventory stock
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    action: {
      type: String,
      enum: ["add", "sold", "defective", "return"],
      default: "add",
      required: true,
    },

   vendor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vendor",
  default: null,
},

image: {
  type: String,
  default: "",
},

    lowStockThreshold: {
      type: Number,
      required: true,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1 });
productSchema.index({ company: 1, sku: 1 }, { unique: true });
// productSchema.index({ barcode: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;