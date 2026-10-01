    import { useState } from "react";
    import { AuthService } from "../../api";
    import { useNavigate } from "react-router-dom";
    import { changePassword } from "../../api";
    import { MdVisibility, MdVisibilityOff } from "react-icons/md";
    import BrandMark from "../common/BrandMark";

    const ChangePassword = () => {
        const navigate = useNavigate();
        const loginType = AuthService.getLoginType();

        const user =
            loginType === "franchise"
                ? AuthService.getFranchise()
                : AuthService.getUser();

        const forcedChange = user?.mustChangePassword;

        const [oldPassword, setOldPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [showOldPassword, setShowOldPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const handleSubmit = async (e) => {
            e.preventDefault();

            setError("");

            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            try {
                setLoading(true);

                await changePassword({
                    oldPassword,
                    newPassword,
                });
                if (forcedChange) {
                    const updatedUser = {
                        ...user,
                        mustChangePassword: false,
                    };

                    if (loginType === "franchise") {
                        AuthService.setFranchise(updatedUser);
                    } else {
                        AuthService.setUser(updatedUser);
                    }
                }
                if (forcedChange) {
                    navigate("/dashboard");
                } else {
                    navigate("/profile");
                }
            } catch (err) {
                setError(err.message || "Unable to change password.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-12">
                <div className="mb-8">
                    <BrandMark />
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-2">
                        {forcedChange ? "Change Password" : "Update Password"}
                    </h2>

                    <p className="text-gray-500 mb-6">
                        {forcedChange
                            ? "You must change your temporary password before continuing."
                            : "Update your account password."}
                    </p>

                    {error && (
                        <div className="mb-4 text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Current Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full border rounded-lg p-3 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                                aria-label={showOldPassword ? "Hide password" : "Show password"}
                            >
                                {showOldPassword ? (
                                    <MdVisibilityOff size={18} />
                                ) : (
                                    <MdVisibility size={18} />
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border rounded-lg p-3 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? (
                                    <MdVisibilityOff size={18} />
                                ) : (
                                    <MdVisibility size={18} />
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border rounded-lg p-3 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <MdVisibilityOff size={18} />
                                ) : (
                                    <MdVisibility size={18} />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white rounded-lg py-3"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                        {!forcedChange && (
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="w-full border border-gray-300 rounded-lg py-3 mt-3"
                            >
                                Cancel
                            </button>
                        )}

                    </form>
                </div>
            </div>
        );
    };

    export default ChangePassword;