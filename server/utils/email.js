import nodemailer from "nodemailer";

const hasSmtpConfig = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

const getTransporter = () => {
  if (!hasSmtpConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      process.env.SMTP_SECURE === "true" ||
      Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const getBackendBaseUrl = () =>
  process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

export const getFrontendBaseUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();

  if (!transporter) {
    const preview = { to, subject, text, html };
    console.log("[Email Preview]", preview);
    return {
      delivered: false,
      mode: "console",
      preview,
    };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  return {
    delivered: true,
    mode: "smtp",
    messageId: info.messageId,
  };
};
