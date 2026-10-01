import mongoose from "mongoose";

const franchiseStockSchema = new mongoose.Schema(
  {
    franchiseId: {
      type: String,
      required: true,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One franchise should have only one stock record per product
franchiseStockSchema.index(
  { franchiseId: 1, product: 1 },
  { unique: true }
);

const FranchiseStock = mongoose.model(
  "FranchiseStock",
  franchiseStockSchema
);

export default FranchiseStock;