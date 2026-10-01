import mongoose from "mongoose";

const stockTransferSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    fromLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      required: true,
    },

    toLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    transferredByModel: {
      type: String,
      enum: ["User", "Franchise"],
      required: true,
      default: "User",
    },

    transferredBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "transferredByModel",
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "StockTransfer",
  stockTransferSchema
);