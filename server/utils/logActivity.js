import Activity from "../models/activity.model.js";


export const logActivity = async ({
  userId,
  companyId,
  action,
  details = "",
  metadata = {},
}) => {
  try {
    // Validate required fields
    if (!userId || !companyId || !action) {
      console.error("[Activity Log] Missing required fields:", {
        userId,
        companyId,
        action,
      });
      return;
    }

    await Activity.create({
      user: userId,
      company: companyId,
      action,
      details,
      metadata,
    });
  } catch (error) {
    console.error("[Activity Log Error]", {
      action,
      userId,
      companyId,
      error: error.message,
    });
  }
};
