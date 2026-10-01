import Company from "../models/company.model.js";
import Product from "../models/product.model.js";
import LocationStock from "../models/locationStock.model.js";
// import User from "../models/users.model.js";
// import Subscription from "../models/subscription.model.js";
// import Product from "../models/product.model.js";
// import Order from "../models/order.model.js";

import Franchise from "../models/franchise.model.js";
import {
  canAddLocationToPlan,
  formatPlanLocationLimit,
  getSubscriptionPlan,
} from "../utils/subscription.js";


export const createFranchise = async (req, res) => {
  try {
    const {
      locationName,
      name,
      email,
      password,
      phone,
      address,
      gstNumber,
    } = req.body;

    // ===========================
    // Validation
    // ===========================

if (!locationName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Manager name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location address is required",
      });
    }

    // ===========================
    // Company Check
    // ===========================

    const company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ===========================
    // Plan Franchise Support Check
    // ===========================

    if (getSubscriptionPlan(company.plan).maxLocations <= 0) {
      return res.status(403).json({
        success: false,
        message: `Your ${company.plan} plan does not support franchises. Please upgrade your plan.`,
      });
    }

    // ===========================
    // Location Limit
    // ===========================

    // The auto-created Main Store doesn't count against the franchise limit
    const currentLocations = await Franchise.countDocuments({
      company: req.user.company,
      isDefault: { $ne: true },
    });

    if (!canAddLocationToPlan(company.plan, currentLocations)) {
      return res.status(400).json({
        success: false,
        message: `Your ${company.plan} plan allows up to ${formatPlanLocationLimit(
          company.plan
        )} locations.`,
      });
    }

    // ===========================
    // Duplicate Email
    // ===========================

    const emailExists = await Franchise.findOne({
      company: req.user.company,
      email: email.toLowerCase(),
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // ===========================
    // Duplicate Phone
    // ===========================

    const phoneExists = await Franchise.findOne({
      company: req.user.company,
      phone,
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // ===========================
    // Create Location
    // ===========================
    // Password is hashed once by the Franchise schema's pre("save") hook —
    // hashing it here too would double-hash it and break login.
    const location = await Franchise.create({
      company: req.user.company,
     locationName: locationName.trim(),
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      mustChangePassword: true,
      phone,
      address: address.trim(),
      gstNumber: gstNumber?.trim() || "",
      // isDefault is reserved for the "Main Store" auto-created at company
      // registration (auth.controller.js) — a manually-added franchise here
      // is never the head office, no matter how many locations exist.
    });

    const products = await Product.find({
      company: req.user.company,
    }).select("_id");

    if (products.length > 0) {
      const stocks = products.map((product) => ({
        company: req.user.company,
        locationId: location._id,
        product: product._id,
        stock: 0,
      }));

      await LocationStock.insertMany(stocks);
    }

    // ===========================
    // Response
    // ===========================

    return res.status(201).json({
      success: true,
      message: "Location created successfully",
      location,
    });

  } catch (error) {
    console.error("Create Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFranchises = async (req, res) => {
  try {
    // Main Store (isDefault) is the admin's own head office, not a franchise.
    // Stock-transfer dropdowns still get it via getFranchiseLocations.
    const franchises = await Franchise.find({
      company: req.user.company,
      isDefault: { $ne: true },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: franchises,
    });
  } catch (error) {
    console.error("Get Locations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFranchiseById = async (req, res) => {
  try {
    const location = await Franchise.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      location,
    });

  } catch (error) {
    console.error("Get Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateFranchise = async (req, res) => {
  try {
    const {
      locationName,
      name,
      email,
      phone,
      address,
      gstNumber,
    } = req.body;

    // ===========================
    // Validation
    // ===========================

    if (!locationName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Manager name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location address is required",
      });
    }

    // ===========================
    // Find Location
    // ===========================

    const location = await Franchise.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // ===========================
    // Duplicate Email
    // ===========================

    const emailExists = await Franchise.findOne({
      company: req.user.company,
      email: email.toLowerCase(),
      _id: { $ne: location._id },
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // ===========================
    // Duplicate Phone
    // ===========================

    const phoneExists = await Franchise.findOne({
      company: req.user.company,
      phone,
      _id: { $ne: location._id },
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // ===========================
    // Update Location
    // ===========================

    location.locationName = locationName.trim();
    location.name = name.trim();
    location.email = email.toLowerCase();
    location.phone = phone;
    location.address = address.trim();
    location.gstNumber = gstNumber?.trim() || "";

    await location.save();

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location,
    });

  } catch (error) {
    console.error("Update Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const toggleFranchiseStatus = async (req, res) => {
  try {
    // ===========================
    // Find Location
    // ===========================

    const location = await Franchise.findOne({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // ===========================
    // Toggle Status
    // ===========================

    location.status =
      location.status === "active"
        ? "inactive"
        : "active";

    await location.save();

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message:
        location.status === "active"
          ? "Location activated successfully."
          : "Location deactivated successfully.",
      status: location.status,
    });

  } catch (error) {
    console.error("Toggle Location Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getFranchiseLocations = async (req, res) => {
  try {
    const locations = await Franchise.find({
      company: req.user.company,
    })
      .select("locationName name email phone isDefault")
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      locations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFranchiseProfile = async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.user.locationId).select(
      "-password"
    );

    if (!franchise) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    return res.status(200).json({
      success: true,
      franchise,
    });
  } catch (error) {
    console.error("Get Franchise Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateFranchiseProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const franchise = await Franchise.findById(req.user.locationId);

    if (!franchise) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const phoneExists = await Franchise.findOne({
      company: req.user.company,
      phone,
      _id: { $ne: franchise._id },
    });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    franchise.name = name.trim();
    franchise.phone = phone.trim();

    await franchise.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      franchise,
    });
  } catch (error) {
    console.error("Update Franchise Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};