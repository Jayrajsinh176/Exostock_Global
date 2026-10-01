import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Company from "../models/company.model.js";
import { logActivity } from "../utils/logActivity.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const handleCategoryError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map(
      (item) => item.message
    );
    return res.status(400).json({
      success: false,
      message: errors[0] || "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Category already exists for this company",
    });
  }

  console.error("Category error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

/**
 * @description Get all categories for a company
 * @route GET /api/category
 * @access Protected
 */

export const getCategory = async (req, res) => {
  try {
    const companyId = req.user.company;

    const categories = await Category.aggregate([
      {
        $match: { company: new mongoose.Types.ObjectId(companyId) }
      },
      {
        $lookup: {
          from: "products", // collection name (IMPORTANT)
          localField: "_id",
          foreignField: "category",
          as: "products"
        }
      },
      {
        $addFields: {
          productCount: { $size: "$products" }
        }
      },
      {
        $project: {
          products: 0 // remove full product array (important for performance)
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map((c) => ({
        id: c._id,
        name: c.name,
        company: c.company,
        productCount: c.productCount,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });

  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Create category
 * @route POST /api/category
 * @access Protected
 */
export const createCategory = async (req, res) => {
  try {

    if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can create categories.",
  });
}

    let { name } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    name = name.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    const category = await Category.create({
      company: req.user.company,
      name,
    });

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "created_category",
      details: `Created category: ${name}`,
      metadata: {
        categoryId: category._id,
        categoryName: name,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Update category
 * @route PUT /api/category/:id
 * @access Protected
 */
export const updateCategory = async (req, res) => {
  try {

    if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can update categories.",
  });
}

    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    let { name } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    name = name.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      {
        _id: id,
        company: req.user.company,
      },
      { $set: { name } },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "updated_category",
      details: `Updated category: ${name}`,
      metadata: {
        categoryId: id,
        newName: name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Delete category
 * @route DELETE /api/category/:id
 * @access Protected
 */
export const deleteCategory = async (req, res) => {
  try {

if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can delete categories.",
  });
}

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    const productCount = await Product.countDocuments({
  company: req.user.company,
  category: id,
});

if (productCount > 0) {
  return res.status(400).json({
    success: false,
    message: `Cannot delete category because ${productCount} product(s) are assigned to it. Move or remove those products first.`,
  });
}

    const deleted = await Category.findOneAndDelete({
      _id: id,
      company: req.user.company,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "deleted_category",
      details: `Deleted category: ${deleted.name}`,
      metadata: {
        categoryId: id,
        categoryName: deleted.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};


/**
 * @description get all products by category
 * @routes GET /api/category/:categoryId/products
 * @access Protected
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }
    const products = await Product.find({
      company: req.user.company,
      category: categoryId,
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Search for products not in category (to add them)
 * @route GET /api/category/:categoryId/search-products
 * @access Protected
 */
export const searchProductsToAdd = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { query, limit = 5 } = req.query;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query cannot be empty",
      });
    }

    const searchRegex = new RegExp(query, 'i');
    
    // Find products NOT in this category
    const products = await Product.find({
      company: req.user.company,
      category: { $ne: new mongoose.Types.ObjectId(categoryId) },
      $or: [
        { name: searchRegex },
        { sku: searchRegex }
      ]
    })
      .select('name sku price stock category vendor')
      .populate('category', 'name')
      .populate('vendor', 'name')
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};

/**
 * @description Add product to category
 * @route PUT /api/category/:categoryId/products/:productId
 * @access Protected
 */
export const addProductToCategory = async (req, res) => {
  try {

    if (req.user.role === "franchise") {
  return res.status(403).json({
    success: false,
    message: "Only Company Admin can modify categories.",
  });
}

    const { categoryId, productId } = req.params;

    if (!isValidObjectId(categoryId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID or Product ID",
      });
    }

    // Check if category exists
    const category = await Category.findOne({
      _id: categoryId,
      company: req.user.company,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if product exists and belongs to company
    const product = await Product.findOne({
      _id: productId,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product's category
    product.category = categoryId;
    await product.save();

    await logActivity({
      userId: req.user._id,
      companyId: req.user.company,
      action: "added_product_to_category",
      details: `Added product ${product.name} to category ${category.name}`,
      metadata: {
        categoryId,
        productId,
        productName: product.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product added to category successfully",
      data: product,
    });
  } catch (error) {
    return handleCategoryError(res, error);
  }
};
