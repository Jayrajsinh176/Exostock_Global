import Company from "../models/company.model.js";
import Notification from "../models/notification.model.js";
import Alert from "../models/alert.model.js";
import { sendEmail, getFrontendBaseUrl } from "../utils/email.js";

export const checkAndNotifyExpiredTrials = async () => {
  try {
    const now = new Date();
    const expiredCompanies = await Company.find({
      plan: "Trial",
      subscription_end_date: { $lte: now },
    });

    for (const company of expiredCompanies) {
      const alreadyNotified = await Notification.findOne({
        company: company._id,
        "metadata.trialExpired": true,
      });

      if (alreadyNotified) continue;

      const title = "Your 14-day trial has ended";
      const message =
        "Your 14-day free trial has ended. Please upgrade your plan to continue using premium features.";

      const notif = new Notification({
        company: company._id,
        type: "subscription",
        title,
        message,
        link: `${getFrontendBaseUrl()}/subscription`,
        metadata: { trialExpired: true },
      });

      await notif.save();

      // Downgrade company to `Basic` plan (free limited plan)
      try {
        company.plan = "Basic";
        // set subscription_start_date to now and clear end date for basic
        company.subscription_start_date = new Date();
        company.subscription_end_date = null;
        await company.save();
      } catch (err) {
        console.log(
          "Failed to downgrade company plan after trial expiry:",
          company._id,
          err.message,
        );
      }

      // Also create an Alert record so it appears on the Notifications page
      try {
        const alert = new Alert({
          company: company._id,
          type: "subscription",
          message,
          severity: "high",
        });
        await alert.save();
      } catch (err) {
        console.log(
          "Failed to create alert for trial expiry:",
          company._id,
          err.message,
        );
      }

      // Attempt to email the company contact if SMTP is configured
      try {
        await sendEmail({
          to: company.email,
          subject: title,
          text: `${message} Visit ${getFrontendBaseUrl()}/subscription to upgrade.`,
          html: `<p>${message}</p><p><a href="${getFrontendBaseUrl()}/subscription">Upgrade now</a></p>`,
        });
      } catch (err) {
        // swallow email errors but log for debugging
        console.log(
          "Trial expiry email send failed for company:",
          company._id,
          err.message,
        );
      }
    }
  } catch (error) {
    console.log("Error while checking expired trials:", error);
  }
};

export const startTrialExpiryWatcher = (options = {}) => {
  const intervalMs = options.intervalMs || 24 * 60 * 60 * 1000; // daily by default

  // run once immediately
  checkAndNotifyExpiredTrials();

  // schedule recurring checks
  setInterval(() => {
    checkAndNotifyExpiredTrials();
  }, intervalMs);
};

export default startTrialExpiryWatcher;
