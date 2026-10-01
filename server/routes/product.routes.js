import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  getProductById,
  getProducts,
  updateProduct,
  getProductsByVendor,
  getProductStats,
  getLowStock,
  getProductsByCategory,
   importProducts,
     addStock,
  getProductReport,
} from "../controllers/product.controller.js";
import {
  uploadProductImage,
  uploadProductCSV,
} from "../middleware/upload.middleware.js";


const router = express.Router();

router.get("/", protect, getProducts);
router.post(
  "/",
  protect,
  uploadProductImage.single("image"),
  createProduct
);
router.get("/stats", protect, getProductStats);
router.get("/report", protect, getProductReport);

router.get("/low-stock", protect, getLowStock);
router.get("/by-category/:categoryId", protect, getProductsByCategory);
router.get("/:id/details", protect, getProductDetails);
router.get("/:id", protect, getProductById);
router.put(
  "/:id",
  protect,
  uploadProductImage.single("image"),
  updateProduct
);

router.patch(
  "/:id/add-stock",
  protect,
  addStock
);

router.delete("/:id", protect, deleteProduct);
router.get("/vendor/:vendorName", protect, getProductsByVendor);
router.post(
  "/import",
  protect,
  uploadProductCSV.single("file"),
  importProducts
);

export default router;
