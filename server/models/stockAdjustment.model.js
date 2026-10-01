import mongoose from "mongoose";

// Log of manual stock changes made via "Add Stock", so they appear in the
// product's Stock Movement history.
const stockAdjustmentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // Location whose stock changed (null when the company has no Main Store)
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      default: null,
    },

    // Positive = stock in, negative = stock out
    quantity: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    stockAfter: {
      type: Number,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

stockAdjustmentSchema.index({ company: 1, product: 1, createdAt: 1 });

const StockAdjustment = mongoose.model(
  "StockAdjustment",
  stockAdjustmentSchema
);

export default StockAdjustment;
