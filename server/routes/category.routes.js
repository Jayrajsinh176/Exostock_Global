import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory,
    searchProductsToAdd,
    addProductToCategory,
} from "../controllers/category.controller.js"

const router = express.Router();

router.get('/',protect,getCategory);
router.get('/:categoryId/products', protect, getProductsByCategory);
router.get('/:categoryId/search-products', protect, searchProductsToAdd);
router.put('/:categoryId/products/:productId', protect, addProductToCategory);
router.post('/',protect,createCategory);
router.put('/:id',protect,updateCategory);
router.delete('/:id',protect,deleteCategory);

export default router;