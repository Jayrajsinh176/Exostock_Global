import jwt from "jsonwebtoken";
import Franchise from "../models/franchise.model.js";

export const protectFranchise = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "franchise") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    const franchise = await Franchise.findById(decoded.id).select("-password");

    if (!franchise) {
      return res.status(401).json({
        success: false,
        message: "Franchise not found.",
      });
    }

    if (franchise.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

req.user = {
  _id: franchise._id,
  id: franchise._id,
  company: franchise.company,
  companyId: franchise.company,

  franchise: franchise._id,
  locationId: franchise._id,

  name: franchise.name,
  email: franchise.email,
  phone: franchise.phone,
  role: "franchise",
  status: franchise.status,
};

req.franchise = franchise;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};