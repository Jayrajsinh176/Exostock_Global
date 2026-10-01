import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please use a valid 10-digit phone number"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: 500,
    },
    parentCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    isFranchise: {
      type: Boolean,
      default: false,
    },
    gstNumber: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ["Trial", "Basic", "Standard", "Business", "Enterprise", "Custom"],
      default: "Trial",
    },

    subscription_start_date: {
      type: Date,
      default: Date.now,
    },
    subscription_end_date: {
      type: Date,
    },

    billingHistory: {
      type: [
        {
          transactionCode: { type: String, required: true },
          plan: { type: String, required: true },
          billingPeriod: {
            type: String,
            enum: ["monthly", "yearly"],
            default: "monthly",
          },
          subtotal: { type: Number, default: 0 },
          gstRate: { type: Number, default: 0 },
          gst: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
          currency: {
            type: String,
            enum: ["INR", "USD"],
            default: "USD",
          },
          status: {
            type: String,
            enum: ["paid", "pending", "failed"],
            default: "paid",
          },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

companySchema.pre("save", async function () {
  if (this.isNew && this.plan === "Trial") {
    const start = this.subscription_start_date || Date.now();
    this.subscription_end_date = new Date(
      new Date(start).getTime() + 14 * 24 * 60 * 60 * 1000,
    );
  }
});

const Company = mongoose.model("Company", companySchema);

export default Company;
