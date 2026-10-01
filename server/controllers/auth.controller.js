import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import Company from "../models/company.model.js";
import Franchise from "../models/franchise.model.js";
import {
  getBackendBaseUrl,
  getFrontendBaseUrl,
  sendEmail,
} from "../utils/email.js";

const getCompanyId = (company) => String(company?._id ?? company ?? "");

const getAccessTokenVersion = (user) => user.tokenVersion ?? 0;

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      company: getCompanyId(user.company),
      role: user.role,
      tokenVersion: getAccessTokenVersion(user),
      type: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      company: getCompanyId(user.company),
      role: user.role,
      tokenVersion: getAccessTokenVersion(user),
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    }
  );

const buildUserResponse = (user) => ({
  id: user._id,
  company: getCompanyId(user.company),

  locationId: user.locationId || null,

  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status?.value || "active",
  isEmailVerified: Boolean(user.isEmailVerified),
  mustChangePassword: user.mustChangePassword,
  createdAt: user.createdAt,
});

const buildCompanyResponse = (company) => ({
  id: company._id,
  company_name: company.company_name,
  email: company.email,
  phone: company.phone,
  address: company.address,
  plan: company.plan,
  subscription_start_date: company.subscription_start_date,
  subscription_end_date: company.subscription_end_date,
});

const buildAuthPayload = (user, company) => ({
  token: generateToken(user),
  refreshToken: generateRefreshToken(user),
  user: buildUserResponse(user),
  company: company ? buildCompanyResponse(company) : undefined,
});

const getDuplicateFieldMessage = (error) => {
  const field = Object.keys(error.keyValue || {})[0];

  if (!field) {
    return "Record already exists";
  }

  return `${field} already exists`;
};

const getValidationMessages = (error) =>
  Object.values(error.errors || {}).map((item) => item.message);

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createRawToken = () => crypto.randomBytes(32).toString("hex");

const getExpiryDate = (minutes) =>
  new Date(Date.now() + minutes * 60 * 1000);

const normalizeEmail = (email) => email?.trim().toLowerCase();

const buildDevelopmentPreview = (emailResult) => {
  if (process.env.NODE_ENV === "production" || !emailResult) {
    return {};
  }

  if (emailResult.mode === "console") {
    return {
      delivery: emailResult.mode,
      emailPreview: emailResult.preview,
    };
  }

  return {
    delivery: emailResult.mode,
  };
};

const setEmailVerificationToken = (user) => {
  const rawToken = createRawToken();
  user.emailVerificationToken = hashToken(rawToken);
  user.emailVerificationExpiresAt = getExpiryDate(24 * 60);
  return rawToken;
};

const PASSWORD_RESET_OTP_MINUTES = 10;
const PASSWORD_RESET_MAX_ATTEMPTS = 5;

const setPasswordResetOtp = (user) => {
  const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  user.passwordResetToken = hashToken(otp);
  user.passwordResetExpiresAt = getExpiryDate(PASSWORD_RESET_OTP_MINUTES);
  user.passwordResetAttempts = 0;
  return otp;
};

// Temporary: return the reset code to the browser (shown in a popup) until
// email delivery is set up. Enable only with SHOW_RESET_OTP=true.
const shouldShowResetOtp = () => process.env.SHOW_RESET_OTP === "true";

const clearEmailVerificationToken = (user) => {
  user.emailVerificationToken = null;
  user.emailVerificationExpiresAt = null;
};

const clearPasswordResetToken = (user) => {
  user.passwordResetToken = null;
  user.passwordResetExpiresAt = null;
  user.passwordResetAttempts = 0;
};

const sendVerificationMail = async (user, rawToken) => {
  const verificationUrl = `${getBackendBaseUrl()}/api/auth/verify-email?token=${rawToken}`;
  const frontendUrl = `${getFrontendBaseUrl()}/verify-email?token=${rawToken}`;
  const subject = "Verify your email address";
  const text = [
    `Hello ${user.name},`,
    "",
    "Please verify your email address to complete your account setup.",
    `Verification link: ${verificationUrl}`,
    `Frontend verification link: ${frontendUrl}`,
    "",
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Hello ${user.name},</p>
    <p>Please verify your email address to complete your account setup.</p>
    <p><a href="${verificationUrl}">Verify email via API</a></p>
    <p><a href="${frontendUrl}">Open frontend verification page</a></p>
    <p>If you did not create this account, you can ignore this email.</p>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

const sendPasswordResetMail = async (user, otp) => {
  const subject = "Your password reset code";
  const text = [
    `Hello ${user.name},`,
    "",
    "We received a request to reset your ExoStock password.",
    `Your reset code: ${otp}`,
    "",
    `This code expires in ${PASSWORD_RESET_OTP_MINUTES} minutes. If you did not request a password reset, you can ignore this email.`,
  ].join("\n");

  const html = `
    <p>Hello ${user.name},</p>
    <p>We received a request to reset your ExoStock password.</p>
    <p>Your reset code: <strong style="font-size:20px;letter-spacing:4px">${otp}</strong></p>
    <p>This code expires in ${PASSWORD_RESET_OTP_MINUTES} minutes. If you did not request a password reset, you can ignore this email.</p>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

const shouldRequireEmailVerification = () =>
  process.env.REQUIRE_EMAIL_VERIFICATION === "true";

const handleAuthError = async (res, error, company, user) => {
  if (company?._id && !user?._id) {
    await Company.findByIdAndDelete(company._id).catch(() => null);
  }

  if (error.name === "ValidationError") {
    const messages = getValidationMessages(error);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation failed",
      errors: messages,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: getDuplicateFieldMessage(error),
    });
  }

  console.error("Auth error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

/**
 * @description Register a new user or create a new company with its first admin.
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  let company = null;
  let user = null;

  try {
    let { company_name, name, email, phone, password, address } = req.body;
    company_name = company_name?.trim();
    address = address?.trim();
    name = name?.trim();
    email = normalizeEmail(email);
    phone = phone?.trim();

    if (!company_name || !address || !name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    }).lean();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Phone already exists",
      });
    }

    const existingCompany = await Company.findOne({
      $or: [{ email }, { phone }],
    }).lean();

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message:
          existingCompany.email === email
            ? "Company email already exists"
            : "Company phone already exists",
      });
    }

    company = await Company.create({
      company_name,
      email,
      phone,
      address,
    });

  const defaultLocation = await Franchise.create({
    company: company._id,
    locationName: "Main Store",
    name,
    email,
    phone,
    password,
    address,
    isDefault: true,
    mustChangePassword: false,
});

    user = await User.create({
      company: company._id,
      locationId: defaultLocation._id,
      name,
      email,
      phone,
      password,
      role: "admin",
      isEmailVerified: false,
    });

    const verificationToken = setEmailVerificationToken(user);
    await user.save();

    const emailResult = await sendVerificationMail(user, verificationToken);
    const authPayload = buildAuthPayload(user, company);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      ...authPayload,
      emailVerificationRequired: true,
      ...buildDevelopmentPreview(emailResult),
    });
  } catch (error) {
    return handleAuthError(res, error, company, user);
  }
};

/**
 * @description Authenticate an existing user.
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    let { email, phone, password } = req.body;

    email = normalizeEmail(email);
    phone = phone?.trim();
    password = password?.trim();
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone and password are required",
      });
    }

    const query =
      email && phone
        ? { $or: [{ email }, { phone }] }
        : email
          ? { email }
          : { phone };

    const user = await User.findOne(query)
      .select("+password +tokenVersion +mustChangePassword")
      .populate("company");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status?.value === "inactive") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (shouldRequireEmailVerification() && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before logging in",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...buildAuthPayload(user, user.company),
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * @description Send password reset instructions to user's email.
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+passwordResetToken +passwordResetExpiresAt +passwordResetAttempts"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    const otp = setPasswordResetOtp(user);
    await user.save();

    const emailResult = await sendPasswordResetMail(user, otp);

    return res.status(200).json({
      success: true,
      message: "A reset code has been sent to your email.",
      ...buildDevelopmentPreview(emailResult),
      ...(shouldShowResetOtp() ? { otp } : {}),
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * @description Reset user's password using the emailed reset code.
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const { newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset code and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email }).select(
      "+passwordResetToken +passwordResetExpiresAt +passwordResetAttempts +tokenVersion"
    );

    if (
      !user ||
      !user.passwordResetToken ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset code is invalid or has expired",
      });
    }

    if (user.passwordResetAttempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
      clearPasswordResetToken(user);
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Too many wrong attempts. Please request a new code.",
      });
    }

    const codeMatches = crypto.timingSafeEqual(
      Buffer.from(hashToken(otp)),
      Buffer.from(user.passwordResetToken)
    );

    if (!codeMatches) {
      user.passwordResetAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Reset code is incorrect",
      });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    clearPasswordResetToken(user);
    user.tokenVersion += 1;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      token: generateToken(user),
      refreshToken: generateRefreshToken(user),
      user: buildUserResponse(user),
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * @description Change password for logged in user.
 * @route POST /api/auth/change-password
 * @access Protected
 */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    const user = await User.findById(req.user.id).select("+password +tokenVersion");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isOldPasswordMatched = await user.matchPassword(oldPassword);

    if (!isOldPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    clearPasswordResetToken(user);
    user.tokenVersion += 1;

    await user.save();
    await user.populate("company");

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      ...buildAuthPayload(user, user.company),
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * @description Invalidate active tokens for the logged in user.
 * @route POST /api/auth/logout
 * @access Protected
 */
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+tokenVersion");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.tokenVersion += 1;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * @description Refresh access and refresh tokens using a refresh token.
 * @route POST /api/auth/refresh-token
 * @access Public
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(decoded.id)
      .select("+tokenVersion")
      .populate("company");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found for this token",
      });
    }

    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({
        success: false,
        message: "Refresh token has been revoked",
      });
    }

    if (user.status?.value === "inactive") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    if (shouldRequireEmailVerification() && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before refreshing your session",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      ...buildAuthPayload(user, user.company),
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    return handleAuthError(res, error);
  }
};

/**
 * @description Send or resend email verification instructions.
 * @route POST /api/auth/send-verification-email
 * @access Public
 */
export const sendVerificationEmail = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const genericMessage =
      "If an account with that email exists and is not verified, a verification email has been sent.";

    const user = await User.findOne({ email }).select(
      "+emailVerificationToken +emailVerificationExpiresAt"
    );

    if (!user || user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const verificationToken = setEmailVerificationToken(user);
    await user.save();

    const emailResult = await sendVerificationMail(user, verificationToken);

    return res.status(200).json({
      success: true,
      message: genericMessage,
      ...buildDevelopmentPreview(emailResult),
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * @description Verify email using a verification token.
 * @route GET/POST /api/auth/verify-email
 * @access Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const token = req.body?.token || req.query?.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() },
    })
      .select("+emailVerificationToken +emailVerificationExpiresAt +tokenVersion")
      .populate("company");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification token is invalid or has expired",
      });
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    clearEmailVerificationToken(user);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      ...buildAuthPayload(user, user.company),
    });
  } catch (error) {
    return handleAuthError(res, error);
  }
};
