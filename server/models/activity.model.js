import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "created_product",
        "updated_product",
        "deleted_product",
        "created_category",
        "updated_category",
        "deleted_category",
        "added_user",
        "updated_user",
        "deleted_user",
        "deactivated_user",
        "reactivated_user",
        "upgraded_subscription",
        "downgraded_subscription",
        "cancelled_subscription",
      ],
    },
    details: {
      type: String,
      default: "",
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

activitySchema.index({ user: 1, createdAt: -1 });


activitySchema.index({ company: 1, createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
