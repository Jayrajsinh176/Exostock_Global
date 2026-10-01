import { SUBSCRIPTION_PLANS } from "../utils/subscription.js";
import Subscription from "../models/subscription.model.js";
import Company from "../models/company.model.js";
import Notification from "../models/notification.model.js";
import Alert from "../models/alert.model.js";
import { sendEmail, getFrontendBaseUrl } from "../utils/email.js";

/**
 * @description Get all Subscription plan Details
 * @route GET /api/subscription/plans
 * @access Private
 */

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
      id: key,
      label: plan.label,
      maxProducts: plan.maxProducts ? plan.maxProducts : "unlimited",
      maxUsers: Number.isFinite(plan.maxUsers) ? plan.maxUsers : "unlimited",
      features: plan.features,
      support: plan.support || "Email support and knowledge base",
    }));
    res.status(200).json({
      success: true,
      message: "Subscription plan fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.log("Subscription Plan Error : ", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription plans",
    });
  }
};

/**
 * @description subscription to a plan
 * @route POST /api/subscription/subscribe
 * @acess Protected
 */

export const subscribeToPlan = async (req, res) => {
  try {
    const { planId, paymentDetails, companyDetails } = req.body;

    if (!SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan selected",
      });
    }

    // integrate with payment gateway here (razorpay) - omitted for now

    const selectedPlan = SUBSCRIPTION_PLANS[planId];

    const now = new Date();
    let endDate = null;
    if (selectedPlan.durationMonths) {
      endDate = new Date(
        new Date(now).setMonth(
          new Date(now).getMonth() + selectedPlan.durationMonths,
        ),
      );
    } else if (selectedPlan.durationDays) {
      endDate = new Date(
        now.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000,
      );
    } else {
      endDate = new Date(new Date(now).setMonth(new Date().getMonth() + 1));
    }

    const subscriptionDetails = {
      plan: planId,
      planLabel: selectedPlan.label,
      maxProducts: selectedPlan.maxProducts,
      maxUsers: selectedPlan.maxUsers,
      features: selectedPlan.features,
      paymentDetails,
      userId: req.user._id,
      companyId: req.user.company,
     status: planId === "Trial" ? "trial" : "active",
      startDate: now,
      endDate: endDate,
    };

    const subscription = new Subscription(subscriptionDetails);
    await subscription.save();

    // Update company plan and subscription dates
    try {
      const company = await Company.findById(req.user.company);
      if (company) {
        company.plan = planId;
        company.subscription_start_date = now;
        company.subscription_end_date = endDate;
        await company.save();

        // create a notification to inform users
        const notif = new Notification({
          company: company._id,
          type: "subscription",
          title: "Subscription updated",
          message: `Your company plan is now upgraded to ${selectedPlan.label}`,
          link: `${getFrontendBaseUrl()}/subscription`,
        });
        await notif.save();

        // Also create an Alert so it appears in Notifications UI
        try {
          const alert = new Alert({
            company: company._id,
            type: "subscription",
            message: `Your company plan is now upgraded to ${selectedPlan.label}`,
            severity: "low",
          });
          await alert.save();
        } catch (e) {
          console.log(
            "Failed to create alert for subscription update:",
            e.message,
          );
        }

        // send email to company contact if SMTP configured
        try {
          await sendEmail({
            to: company.email,
            subject: "Subscription updated",
            text: `Your company plan is now upgraded to ${selectedPlan.label}. Visit ${getFrontendBaseUrl()}/subscription for details.`,
            html: `<p>Your company plan is now upgraded to <strong>${selectedPlan.label}</strong>.</p><p><a href="${getFrontendBaseUrl()}/subscription">View subscription</a></p>`,
          });
        } catch (e) {
          console.log("Subscription email failed:", e.message);
        }
      }
    } catch (err) {
      console.log("Failed to update company after subscription:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the plan",
    });
  } catch (error) {
    console.log("Subscription Error : ", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe to the plan",
    });
  }
};

/**
 * @description Get current subscription details
 * @route GET /api/subscription/current
 * @access Private
 */

export const getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      companyId: req.user.company,
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found for this company",
      });
    }

    res.status(200).json({
      success: true,
      message: "Current subscription details fetched successfully",
      data: subscription,
    });
  } catch (error) {
    console.log("Current Subscription Error : ", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch current subscription details",
    });
  }
};

/**
 * @description Cancel subscription
 * @route POST /api/subscription/cancel
 * @access Private
 */

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
  companyId: req.user.company,
}).sort({ createdAt: -1 });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }
    await subscription.remove();
    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.log("Cancel Subscription Error : ", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
    });
  }
};

export const getSubscriptionAlert = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const today = new Date();

    let alert = null;

    // Trial Plan Alert
    if (company.plan === "Trial") {
      alert = {
        type: "trial",
        title: "You're using the Trial Plan",
        message:
          "Upgrade to unlock unlimited products, unlimited users and premium analytics.",
        buttonText: "Upgrade Plan",
        buttonLink: "/subscription",
      };
    }

    // Expiry Alert
    if (company.subscription_end_date) {
      const expiryDate = new Date(company.subscription_end_date);

      const daysLeft = Math.ceil(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft <= 0) {
        alert = {
          type: "expired",
          title: "Subscription Expired",
          message:
            "Your subscription has expired. Renew now to continue using premium features.",
          buttonText: "Renew Plan",
          buttonLink: "/subscription",
        };
      } else if (daysLeft <= 7) {
        alert = {
          type: "warning",
          title: `Subscription expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
          message:
            "Renew your subscription to avoid interruption.",
          buttonText: "Renew Now",
          buttonLink: "/subscription",
        };
      }
    }

    res.status(200).json({
      success: true,
      alert,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to get subscription alert",
    });

  }
};
