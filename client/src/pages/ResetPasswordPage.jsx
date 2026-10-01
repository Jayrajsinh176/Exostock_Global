import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MdError,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
} from "react-icons/md";
import LoginBranding from "../components/auth/LoginBranding";
import { resetPassword } from "../api";

const inputClass =
  "w-full h-[44px] pl-10 pr-10 bg-[#F8F9FA] border border-[#0d5b96] rounded-lg text-[14px] text-[#0d5b96] caret-[#0d5b96] placeholder-[#ADB5BD] focus:outline-none focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      await resetPassword(token, password);
      toast.success("Password reset successful. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            Set New Password
          </h2>
          <p className="text-[14px] text-[#0d5b96]">
            Choose a new password for your account.
          </p>
        </div>

        {!token ? (
          <div className="p-4 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg">
            <p className="text-[13px] text-[#721C24] flex items-center gap-2">
              <MdError className="text-[16px] shrink-0" />
              This reset link is invalid. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="mt-3 inline-block text-[13px] font-semibold text-[#0d5b96] underline"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 p-4 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg">
                <p className="text-[13px] text-[#721C24] flex items-center gap-2">
                  <MdError className="text-[16px] shrink-0" />
                  {error}
                </p>
                {error.toLowerCase().includes("expired") && (
                  <Link
                    to="/forgot-password"
                    className="mt-2 inline-block text-[13px] font-semibold text-[#0d5b96] underline"
                  >
                    Request a new link
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { id: "reset-password", label: "New Password", value: password, set: setPassword },
                { id: "reset-confirm", label: "Confirm Password", value: confirmPassword, set: setConfirmPassword },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0d5b96] mb-2"
                  >
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
                      className={inputClass}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-[#0d5b96] text-white font-semibold text-[13px] uppercase tracking-[0.1em] rounded-lg hover:bg-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1 text-[14px] font-semibold text-[#0d5b96] hover:text-black transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
