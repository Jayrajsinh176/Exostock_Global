import mongoose from "mongoose";
import Company from "../models/company.model.js";
import { isLowStockAlertsAllowed } from "../utils/subscription.js";
import Product from "../models/product.model.js";
import LocationStock from "../models/locationStock.model.js";

const getUserLocationId = (user) => user.locationId || null;
/** 
 * @description Get dashboard statistics for the user's company
 * @route GET /api/dashboard
 * @access Protected
 */
export const dashboardStats = async (req, res) => {
    try {
        // const userId = req.user._id;
        const companyId = req.user.company;

        const locationId = getUserLocationId(req.user);

        const totalCategories = await mongoose.connection
            .collection("categories")
            .countDocuments({ company: companyId });

        const totalUsers = await mongoose.connection
            .collection("users")
            .countDocuments({ company: companyId });

        let totalProducts = 0;
        let totalAlerts = 0;
        let totalInventoryValue = 0;

        if (locationId) {

            // Franchise Dashboard

            const stocks = await LocationStock.find({
                company: companyId,
                locationId,
            }).populate("product");

            totalProducts = stocks.filter(stock => stock.product).length;

            totalAlerts = stocks.filter(stock =>
                stock.product &&
                stock.stock <= stock.product.lowStockThreshold
            ).length;

            totalInventoryValue = stocks.reduce((sum, stock) => {
                if (!stock.product) return sum;

                return sum + (stock.stock * stock.product.dp);
            }, 0);

        } else {

            // Company Dashboard

            const products = await Product.find({
                company: companyId,
            });

            totalProducts = products.length;

            totalAlerts = products.filter(product =>
                product.stock <= product.lowStockThreshold
            ).length;

            totalInventoryValue = products.reduce((sum, product) => {
                return sum + (product.stock * product.dp);
            }, 0);

        }

        res.json({
            totalProducts,
            totalCategories,
            totalAlerts,
            totalUsers,
            totalInventoryValue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Get low stock alerts for products in the user's company
 * @route GET /api/dashboard/low-stock-alerts
 * @access Protected
 */
export const getLowStockAlerts = async (req, res) => {
    try {
        const companyPlan = await Company.findById(req.user.company).select("plan");
        if (!isLowStockAlertsAllowed(companyPlan?.plan)) {
            return res.status(403).json({
                success: false,
                message: "Low stock alerts are available on the Standard plan and above",
            });
        }

        const companyId = req.user.company;
        const locationId = getUserLocationId(req.user);

        if (locationId) {

            const stocks = await LocationStock.find({
                company: companyId,
                locationId,
            }).populate({
                path: "product",
                populate: [
                    { path: "category", select: "name" },
                    { path: "vendor", select: "name" },
                ],
            });

            const lowStockProducts = stocks
                .filter(stock =>
                    stock.product &&
                    stock.stock <= stock.product.lowStockThreshold
                )
                .map(stock => ({
                    ...stock.product.toObject(),
                    stock: stock.stock,
                }))
                .sort((a, b) => a.stock - b.stock);

            return res.json(lowStockProducts);
        } else {

            const products = await Product.find({
                company: companyId,
            })
                .select("name sku stock lowStockThreshold price vendor category dp")
                .populate("category", "name")
                .populate("vendor", "name");

            const lowStockProducts = products
                .filter(product =>
                    product.stock <= product.lowStockThreshold
                )
                .sort((a, b) => a.stock - b.stock);

            return res.json(lowStockProducts);

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};