import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { MdChevronRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AuthService, getUserById, updateUser } from "../api";
import { isPlanAtLeast } from "../constants/plans";

const EditUserPage = () => {
  const company = AuthService.getCompany();
  const loginType = AuthService.getLoginType();
  const isFranchise = loginType === "franchise";
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (isFranchise) {
      navigate("/dashboard", { replace: true });
    }
  }, [isFranchise, navigate]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUser, setUpdatingUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(userId);

        if (response && response.user) {
          setUser(response.user);
          setFormData({
            name: response.user.name || "",
            email: response.user.email || "",
            phone: response.user.phone || "",
            role: response.user.role || "staff",
          });
          setError("");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch user");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdatingUser(true);
    try {
      await updateUser(userId, formData);
      toast.success("User updated successfully!");
      navigate("/users");
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[300px]">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[12px] text-[#6C757D] mb-6">
            <span>Users</span>
            <MdChevronRight className="text-[16px]" />
            <span className="font-semibold text-[#212529]">Edit User</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529] mb-2">
                Edit User
              </h1>
              <p className="text-[14px] text-[#6C757D]">
                Update user details and permissions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 mb-6 text-[#721C24]">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-8 text-center text-[#6C757D]">
              Loading user information...
            </div>
          )}

          {/* Form */}
          {!loading && user && !error && (
            <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
              <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#212529]">
                  User Information
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      disabled={updatingUser}
                      className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      disabled={updatingUser}
                      className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      disabled={updatingUser}
                      className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={updatingUser}
                      className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#0d5b96] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="staff">Staff</option>

                      {!isFranchise && isPlanAtLeast(company?.plan, "Standard") && (
                        <option value="manager">Manager</option>
                      )}

                      {!isFranchise && <option value="admin">Admin</option>}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#DEE2E6]">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updatingUser}
                    className="px-6 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingUser}
                    className="px-8 py-2 bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>✓</span>
                    {updatingUser ? "Updating..." : "Update User"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!loading && !user && !error && (
            <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-8 text-center text-[#6C757D]">
              User not found
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditUserPage;
