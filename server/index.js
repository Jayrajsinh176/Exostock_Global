import express from "express";
import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
// Use a public DNS resolver for Atlas SRV records if local DNS is blocking querySrv
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDb from "./config/db.js";
import validateEnv from "./utils/validateEnv.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import usersRoutes from "./routes/users.routes.js";
import planRoutes from "./routes/plan.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import companyRoutes from "./routes/company.routes.js";
import orderRoutes from "./routes/order.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import vendorRoutes from "./routes/vendor.routes.js";
import franchiseStockRoutes from "./routes/franchiseStock.routes.js";
import startTrialExpiryWatcher from "./jobs/checkTrialExpiry.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import franchiseRoutes from "./routes/franchise.routes.js";
import stockTransferRoutes from "./routes/stockTransfer.routes.js";
import franchiseAuthRoutes from "./routes/franchiseAuth.routes.js";
import supplyRequestRoutes from "./routes/supplyRequest.routes.js";
import assistantRoutes from "./routes/assistant.routes.js";
// validate environment before starting server
// check .env file there are variable assign or not
validateEnv();

const app = express();
app.use(express.json());

// security middleware - every one can access
app.use(cors());

// only allowed origin can access or by default http://localhost:3000 can access it
// app.use(cors({
// origin : process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:3000'],
// credentials : true,
// }))

// body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Product image paths returned by the API are served from this public route.
app.use("/uploads", express.static("uploads"));

// Rate limit for auth routes - like users
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message:
      "Too many authentication requests, please try 15 mintues again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// api rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 200, // 200 requests per minute
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

const PORT = process.env.PORT || 5000;

console.log("MONGO_URI:", process.env.MONGO_URI);

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/franchise-stock", franchiseStockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/company/plan", planRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/franchises", franchiseRoutes);
app.use("/api/stock-transfers", stockTransferRoutes);
app.use("/api/franchise-auth", franchiseAuthRoutes);
app.use("/api/supply-requests", supplyRequestRoutes);
app.use("/api/assistant", assistantRoutes);

// Return useful JSON when an image is rejected by Multer (invalid type, too
// large, or wrong form field) instead of Express's default HTML error page.
app.use((error, req, res, next) => {
  if (error) {
    const isFileSizeError = error.code === "LIMIT_FILE_SIZE";
    return res.status(400).json({
      success: false,
      message: isFileSizeError
        ? "Product image must be 2 MB or smaller"
        : error.message || "Unable to upload product image",
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start trial expiry watcher (runs immediately and then daily)
  try {
    startTrialExpiryWatcher();
    console.log("Trial expiry watcher started");
  } catch (err) {
    console.log("Failed to start trial expiry watcher:", err.message);
  }
});
