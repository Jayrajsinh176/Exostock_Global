import Company from "../models/company.model.js";
import { buildAssistantReply } from "../services/assistant.service.js";
import { isAIAssistantAllowed } from "../utils/subscription.js";

export const chatWithAssistant = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company).select("plan");

    if (!company || !isAIAssistantAllowed(company.plan)) {
      return res.status(403).json({
        success: false,
        reply:
          "The AI Assistant is available on the Business plan and above. Please upgrade your plan to access this feature.",
      });
    }

    const result = await buildAssistantReply({
      message: req.body.message,
      user: req.user,
    });

    return res.status(200).json({
      success: true,
      reply: result.reply,
      intent: result.intent,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return res.status(500).json({
      success: false,
      reply:
        "I'm unable to read inventory data right now. Please try again in a moment.",
    });
  }
};
