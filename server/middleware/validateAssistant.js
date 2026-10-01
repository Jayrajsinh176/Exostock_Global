export const validateAssistantMessage = (req, res, next) => {
  const { message } = req.body || {};

  if (typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
    });
  }

  if (trimmedMessage.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Message must be 500 characters or fewer",
    });
  }

  req.body.message = trimmedMessage;
  next();
};
