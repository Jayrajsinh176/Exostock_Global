import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    franchise: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Franchise",
  default: null,
  index: true,
},

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "low_stock",
        "out_of_stock",
        "reorder_reminder",
        "price_change",
        "vendor_order_request",
        "vendor_order_ready",
        "vendor_payment_completed",
        "subscription",
      ],
      default: "low_stock",
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isAcknowledged: {
      type: Boolean,
      default: false,
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient company-wide alert queries
alertSchema.index({ company: 1, createdAt: -1 });
alertSchema.index({ company: 1, type: 1, isRead: 1 });
alertSchema.index({
  company: 1,
  franchise: 1,
  createdAt: -1,
});

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
