import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MdCheckCircle,
  MdEmail,
  MdError,
  MdArrowBack,
  MdLock,
  MdPin,
  MdVisibility,
  MdVisibilityOff,
  MdClose,
} from "react-icons/md";
import LoginBranding from "../components/auth/LoginBranding";
import { requestPasswordReset, resetPassword } from "../api";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0d5b96] mb-2";

const inputClass =
  "w-full h-[44px] pl-10 pr-4 bg-[#F8F9FA] border border-[#0d5b96] rounded-lg text-[14px] text-[#0d5b96] caret-[#0d5b96] placeholder-[#ADB5BD] focus:outline-none focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const primaryButtonClass =
  "w-full h-[48px] bg-[#0d5b96] text-white font-semibold text-[13px] uppercase tracking-[0.1em] rounded-lg hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // "email" = ask for the account email, "reset" = enter code + new password
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Code returned by the server while email delivery isn't set up
  const [popupOtp, setPopupOtp] = useState("");

  const handleSendCode = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await requestPasswordReset(email.trim());

      setOtp("");
      setStep("reset");

      if (data.otp) {
        setPopupOtp(data.otp);
      } else {
        toast.success(data.message || "A reset code has been sent to your email.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit reset code");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim(), otp, password);
      toast.success("Password changed successfully. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    { id: "reset-password", label: "New Password", value: password, set: setPassword },
    { id: "reset-confirm", label: "Confirm Password", value: confirmPassword, set: setConfirmPassword },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12"
      style={{
        backgroundImage: "radial-gradient(ellipse at 60% 30%, rgba(0,0,0,0.03) 0%, transparent 70%)",
      }}
    >
      <LoginBranding />

      <div className="w-full max-w-md rounded-2xl border-2 border-[#0d5b96] bg-white p-6 sm:p-10 shadow-lg">
        <div className="mb-6">
          <h2 className="text-[22px] font-semibold text-[#0d5b96] mb-1">
            Reset Password
          </h2>
          <p className="text-[14px] text-[#0d5b96]">
            {step === "email"
              ? "Enter your account email and we'll send you a code to reset your password."
              : `Enter the code sent to ${email.trim()} and choose a new password.`}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg">
            <p className="text-[13px] text-[#721C24] flex items-center gap-2">
              <MdError className="text-[16px] shrink-0" />
              {error}
            </p>
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className={labelClass}>
                Email
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d5b96]"
                  aria-hidden="true"
                >
                  <MdEmail size={18} />
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  disabled={loading}
                  maxLength="100"
                  className={inputClass}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label htmlFor="reset-otp" className={labelClass}>
                Reset Code
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d5b96]"
                  aria-hidden="true"
                >
                  <MdPin size={18} />
                </span>
                <input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  required
                  disabled={loading}
                  className={`${inputClass} tracking-[0.3em]`}
                />
              </div>
            </div>

            {passwordFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className={labelClass}>
                  {field.label}
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d5b96]"
                    aria-hidden="true"
                  >
                    <MdLock size={18} />
                  </span>
                  <input
                    id={field.id}
                    type={showPassword ? "text" : "password"}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value.replace(/\s/g, ""))}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0d5b96] hover:text-black transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "Updating..." : "Change Password"}
            </button>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#0d5b96]">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
                disabled={loading}
                className="hover:text-black transition-colors"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="hover:text-black transition-colors"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1 text-[14px] font-semibold text-[#0d5b96] hover:text-black transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Sign In
        </Link>
      </div>

      {/* Reset code popup (temporary, until the code is only emailed) */}
      {popupOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-sm rounded-2xl border-2 border-[#0d5b96] bg-white p-6 text-center shadow-xl">
            <button
              type="button"
              onClick={() => setPopupOtp("")}
              className="absolute right-4 top-4 text-[#0d5b96] hover:text-black"
              aria-label="Close"
            >
              <MdClose size={20} />
            </button>

            <MdCheckCircle className="mx-auto mb-3 text-[40px] text-[#0F5132]" />
            <h3 className="mb-1 text-[18px] font-semibold text-[#0d5b96]">
              Your Reset Code
            </h3>
            <p className="mb-4 text-[13px] text-[#6C757D]">
              Use this code to set your new password. It expires in 10 minutes.
            </p>
            <p className="mb-5 rounded-lg bg-[#F8F9FA] py-3 text-[28px] font-bold tracking-[0.4em] text-[#0d5b96]">
              {popupOtp}
            </p>

            <button
              type="button"
              onClick={() => {
                setOtp(popupOtp);
                setPopupOtp("");
              }}
              className={primaryButtonClass}
            >
              Use This Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
