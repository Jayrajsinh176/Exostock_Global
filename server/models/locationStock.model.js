import mongoose from "mongoose";

const locationStockSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One stock record per Product per Location
locationStockSchema.index(
  {
    company: 1,
    locationId: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

const LocationStock = mongoose.model(
  "LocationStock",
  locationStockSchema
);

export default LocationStock;