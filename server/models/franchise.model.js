import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const franchiseSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // Branch / Location Name
    locationName: {
      type: String,
      required: true,
      trim: true,
    },

    // Branch Manager
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
      default: "",
      trim: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

franchiseSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Franchise = mongoose.model("Franchise", franchiseSchema);

export default Franchise;
