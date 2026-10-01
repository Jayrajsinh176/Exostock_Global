import mongoose from 'mongoose';
import Company from '../models/company.model.js';
import { isLowStockAlertsAllowed } from '../utils/subscription.js';
import Product from '../models/product.model.js';
import Alert from '../models/alert.model.js';

/**
 * @description Get low stock alerts for products with stock less than or equal to threshold
 * @route GET /api/alerts/low-stock
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
   const productQuery = {
  company: companyId,
};

if (req.user.role === "franchise") {
  productQuery.franchise = req.user.locationId;
}

const products = await Product.find(productQuery).select('name stock lowStockThreshold');
        const lowStockProducts = products.filter(product => product.stock <= product.lowStockThreshold);
        res.status(200).json({
            success: true,
            data: lowStockProducts
        });
    } catch (error) {
        console.error('Error fetching low stock alerts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};  

/**
 * @description Get all alerts for company
 * @route GET /api/alerts
 * @access Protected
 */
export const getAlerts = async (req, res) => {
    try {
        const companyId = req.user.company;
        const { type, isRead, page = 1, limit = 20 } = req.query;
        
      const query = {
  company: companyId,
};

if (req.user.role === "franchise") {
  query.franchise = req.user.locationId;
}
        if (type) query.type = type;
        if (isRead !== undefined) query.isRead = isRead === 'true';
        
        const alerts = await Alert.find(query)
            .populate('product', 'name sku')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();
            
        const total = await Alert.countDocuments(query);
      const unreadQuery = {
  company: companyId,
  isRead: false,
};

if (req.user.role === "franchise") {
  unreadQuery.franchise = req.user.locationId;
}

const unreadCount = await Alert.countDocuments(unreadQuery);
        
        res.status(200).json({
            success: true,
            data: alerts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @description Mark an alert as read
 * @route PATCH /api/alerts/:id/read
 * @access Protected
 */
export const markAlertAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid alert ID' });
        }
        
      const filter = {
  _id: id,
  company: companyId,
};

if (req.user.role === "franchise") {
  filter.franchise = req.user.locationId;
}

const alert = await Alert.findOneAndUpdate(
    filter,
            { isRead: true },
            { new: true }
        );
        
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Alert marked as read',
            data: alert
        });
    } catch (error) {
        console.error('Error marking alert as read:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @description Acknowledge an alert
 * @route PATCH /api/alerts/:id/acknowledge
 * @access Protected
 */
export const acknowledgeAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company;
        const userId = req.user._id;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid alert ID' });
        }
        
     const filter = {
  _id: id,
  company: companyId,
};

if (req.user.role === "franchise") {
  filter.franchise = req.user.locationId;
}

const alert = await Alert.findOneAndUpdate(
    filter,
            { 
                isAcknowledged: true,
                acknowledgedBy: userId,
                acknowledgedAt: new Date(),
                isRead: true
            },
            { new: true }
        ).populate('acknowledgedBy', 'name email');
        
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Alert acknowledged',
            data: alert
        });
    } catch (error) {
        console.error('Error acknowledging alert:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @description Get alert preferences
 * @route GET /api/alerts/preferences
 * @access Protected
 */
export const getAlertPreferences = async (req, res) => {
    try {
        // Default preferences - can be stored in User model later
        const preferences = {
            lowStockEnabled: true,
            outOfStockEnabled: true,
            reorderReminderEnabled: true,
            emailNotifications: false,
            lowStockThreshold: 10
        };
        
        res.status(200).json({
            success: true,
            data: preferences
        });
    } catch (error) {
        console.error('Error fetching alert preferences:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @description Update alert preferences
 * @route PUT /api/alerts/preferences
 * @access Protected
 */
export const updateAlertPreferences = async (req, res) => {
    try {
        const { 
            lowStockEnabled, 
            outOfStockEnabled, 
            reorderReminderEnabled,
            emailNotifications,
            lowStockThreshold 
        } = req.body;
        
        // For now, return the updated preferences
        // In production, save to User model or separate Preferences collection
        const preferences = {
            lowStockEnabled: lowStockEnabled ?? true,
            outOfStockEnabled: outOfStockEnabled ?? true,
            reorderReminderEnabled: reorderReminderEnabled ?? true,
            emailNotifications: emailNotifications ?? false,
            lowStockThreshold: lowStockThreshold ?? 10
        };
        
        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            data: preferences
        });
    } catch (error) {
        console.error('Error updating alert preferences:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @description Mark all alerts as read
 * @route PATCH /api/alerts/read-all
 * @access Protected
 */
export const markAllAlertsAsRead = async (req, res) => {
    try {
        const companyId = req.user.company;
        
  const filter = {
  company: companyId,
  isRead: false,
};

if (req.user.role === "franchise") {
  filter.franchise = req.user.locationId;
}

const result = await Alert.updateMany(
    filter,
            { isRead: true }
        );
        
        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} alerts marked as read`
        });
    } catch (error) {
        console.error('Error marking all alerts as read:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
