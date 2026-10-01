import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  plan: {
    type: String,
    enum: ["Trial", "Basic", "Standard", "Business", "Enterprise", "Custom"],
    default: "Basic",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "trial", "expired"],
    default: "trial",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
});
const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
