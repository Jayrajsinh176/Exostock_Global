import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      default: null,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter valid Indian phone number"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    emailVerificationToken: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },

    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },

    // Wrong reset-code guesses; the code is discarded after too many
    passwordResetAttempts: {
      type: Number,
      select: false,
      default: 0,
    },

    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },
    status: {
      value: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
      },
      deactivatedAt: Date,
      deactivatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reactivatedAt: Date,
      reactivatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reason: String
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
