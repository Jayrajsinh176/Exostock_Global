import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null means broadcast to all company users
    },
    type: {
      type: String,
      required: true,
      enum: [
        "info",
        "success", 
        "warning",
        "error",
        "low_stock",
        "out_of_stock",
        "new_user",
        "subscription",
        "system"
      ],
      default: "info",
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    link: {
      type: String,
      default: null, // Optional link to related resource
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
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
  }
);

// Index for efficient notification queries
notificationSchema.index({ company: 1, user: 1, createdAt: -1 });
notificationSchema.index({ company: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
