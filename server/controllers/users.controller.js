import mongoose from "mongoose";
import User from "../models/users.model.js";
import Company from "../models/company.model.js";
import Activity from "../models/activity.model.js";
import Franchise from "../models/franchise.model.js";
// import subscription from "../utils/subscription.js";

import {
  canAddUsersToPlan,
  formatPlanUsersLimit,
  isRoleManagementAllowed,
} from "../utils/subscription.js";
import { logActivity } from "../utils/logActivity.js";

const handleStaffError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map(
      (item) => item.message,
    );
    return res.status(400).json({
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      message: "User already exists for this company",
    });
  }

  console.error("Staff error:", error);
  return res.status(500).json({ message: "Internal server error" });
};

/**
 * @description get all user details
 * @route GET /api/user
 * @access Protected
 */
export const getUsersDetails = async (req, res) => {
  try {
    console.log("Logged User:", req.user);
    console.log("Role:", req.user.role);

    let query = {
      company: req.user.company,
    };

    console.log("Query:", query);
    const users = await User.find(query)
      .populate("locationId", "company_name isDefault")
      .populate("company", "company_name")
      .select("-password")
      .lean();

    // Only the company Admin can add users, so users without a location
    // belong to the Main Store.
    const mainStore = await Franchise.findOne({
      company: req.user.company,
      isDefault: true,
    })
      .select("company_name isDefault")
      .lean();

    users.forEach((user) => {
      if (!user.locationId) {
        user.locationId = mainStore ? { ...mainStore } : { isDefault: true };
      }

      user.locationId.displayName = user.locationId.isDefault
        ? `${user.company.company_name} - Main Store`
        : `${user.company.company_name} - ${user.locationId.company_name}`;
    });

    users.forEach((u) => {
      console.log({
        name: u.name,
        role: u.role,
        locationId: u.locationId?._id || u.locationId,
        locationName: u.locationId?.name || null,
      });
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @description get single user by ID
 * @route GET /api/user/:id
 * @access Protected
 */
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    let query = {
      _id: userId,
      company: req.user.company,
    };

    const user = await User.findOne(query)
      .populate("locationId", "company_name")
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @description add user
 * @route POST /api/user
 * @access Protected
 */
export const addUsers = async (req, res) => {
  try {
    const companyPlanDetails = await Company.findById(req.user.company).select(
      "plan",
    );
    if (!companyPlanDetails) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }
    let query = {
      company: req.user.company,
    };

    const users = await User.find(query)
      .populate("locationId", "company_name")
      .select("-password")
      .lean();

    // Admin (company owner) doesn't count against the plan's staff limit
    const staffCount = users.filter((user) => user.role !== "admin").length;

    if (canAddUsersToPlan(companyPlanDetails.plan, staffCount)) {
      let { name, email, phone, role, password } = req.body;

      name = name?.trim();
      email = email?.trim().toLowerCase();
      phone = phone?.trim();
      role = role?.trim().toLowerCase();
      password = password?.trim();

      if (!password || password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters.",
        });
      }

      if (!email && !phone) {
        return res.status(400).json({
          success: false,
          message: "Email or Phone is required.",
        });
      }

      if (!name || (!email && !phone) || !role) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      if (!["admin", "manager", "staff"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role.",
        });
      }

      // Only one Admin is allowed per company
      if (role === "admin") {
        const existingAdmin = await User.findOne({
          company: req.user.company,
          role: "admin",
        });

        if (existingAdmin) {
          return res.status(400).json({
            success: false,
            message: "Only one Admin is allowed per company.",
          });
        }
      }

      if (!isRoleManagementAllowed(companyPlanDetails.plan) && role === "manager") {
        return res.status(403).json({
          success: false,
          message: "Manager role is available from the Standard plan onwards.",
        });
      }

      const existingEmail = users.find((user) => user.email === email);
      const existingPhone = users.find((user) => user.phone === phone);

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists.",
        });
      }

      const user = await User.create({
        company: req.user.company,
        name,
        email,
        phone,
        password,
        role,
        mustChangePassword: true,
      });
      const safeUser = await User.findById(user._id).select("-password").lean();

      await logActivity({
        userId: req.user._id,
        companyId: req.user.company,
        action: "added_user",
        details: `Added user: ${name}`,
        metadata: {
          newUserId: user._id,
          name,
          email,
          phone,
          role,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Staff added successfully.",
        data: safeUser,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `You have reached the limit of ${formatPlanUsersLimit(companyPlanDetails.plan)} staff member(s) for your plan.`,
      });
    }
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description update user details
 * @route PUT /api/user/:id
 * @access Protected
 */
export const updateUsersDetails = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }

    let { name, email, phone, role } = req.body;
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    role = role?.trim().toLowerCase();

    const companyPlanDetails = await Company.findById(req.user.company).select("plan");

    if (!companyPlanDetails) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (!name && !email && !phone && !role) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update.",
      });
    }
    if (role) {
      if (!["admin", "manager", "staff"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role.",
        });
      }

      if (!isRoleManagementAllowed(companyPlanDetails.plan) && role === "manager") {
        return res.status(403).json({
          success: false,
          message: "Manager role is available from the Standard plan onwards.",
        });
      }
    }

    // Only one Admin is allowed per company
    if (role === "admin") {
      const existingAdmin = await User.findOne({
        company: req.user.company,
        role: "admin",
        _id: { $ne: id }, // Ignore current user
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Only one Admin is allowed per company.",
        });
      }
    }

    let updateQuery = {
      _id: id,
      company: req.user.company,
    };

    const existingUser = await User.findOne(updateQuery);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    const user = await User.findOneAndUpdate(

      updateQuery,
      {
        $set: {
          name,
          email,
          phone,
          role,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );



    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    const changedFields = {};
    if (name) changedFields.name = name;
    if (email) changedFields.email = email;
    if (phone) changedFields.phone = phone;
    if (role) changedFields.role = role;

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "updated_user",
      details: `Updated user: ${user.name}`,
      metadata: {
        targetUserId: id,
        updatedFields: changedFields,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Staff details updated successfully.",
      data: user,
    });
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description deactivate user
 * @route PATCH /api/user/:id/deactivate
 * @access Protected
 */

export const deactivateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    let query = {
      _id: id,
      company: req.user.company,
    };

    const user = await User.findOne(query)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    if (user.status.value === "active") {
      await User.findByIdAndUpdate(id, {
        $set: {
          "status.value": "inactive",
          "status.deactivatedAt": new Date(),
          "status.deactivatedBy": req.user._id,
        },
      });

      // Log activity
      await logActivity({
        userId: req.user._id,
        companyId: req.user.company,
        action: "deactivated_user",
        details: `Deactivated user: ${user.name}`,
        metadata: {
          targetUserId: id,
          targetUserName: user.name,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Staff deactivated successfully.",
      });
    }
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description activate user
 * @route PATCH /api/user/:id/activate
 * @access Protected
 */

export const activateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    let query = {
      _id: id,
      company: req.user.company,
    };

    const user = await User.findOne(query)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    if (user.status.value === "inactive") {
      await User.findByIdAndUpdate(id, {
        $set: {
          "status.value": "active",
          "status.reactivatedAt": new Date(),
          "status.reactivatedBy": req.user._id,
        },
      });

      // Log activity
      await logActivity({
        userId: req.user._id,
        companyId: req.user.company,
        action: "reactivated_user",
        details: `Reactivated user: ${user.name}`,
        metadata: {
          targetUserId: id,
          targetUserName: user.name,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Staff activated successfully.",
      });
    }
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description delete user
 * @route DELETE /api/user/:id
 * @access Protected
 */
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    let query = {
      _id: id,
      company: req.user.company,
    };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.deleteOne();



    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "deleted_user",
      details: `Deleted user: ${user.name}`,
      metadata: {
        deletedUserId: id,
        deletedUserName: user.name,
        deletedUserEmail: user.email,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Staff deleted successfully.",
    });
  } catch (error) {
    return handleStaffError(res, error);
  }
};

/**
 * @description get user activity log with pagination
 * @route GET /api/users/:id/activity
 * @access Protected
 */
export const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }

    const user = await User.findOne({
      _id: id,
      company: req.user.company,
    }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      user: id,
      company: req.user.company,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const count = await Activity.countDocuments({
      user: id,
      company: req.user.company,
    });

    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      action: activity.action,
      details: activity.details,
      timestamp: activity.createdAt,
      metadata: activity.metadata,
    }));

    return res.status(200).json({
      success: true,
      activities: formattedActivities,
      pagination: {
        count: formattedActivities.length,
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get user activity error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
