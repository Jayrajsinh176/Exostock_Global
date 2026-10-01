import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdSave,
  MdArrowBack,
  MdLock,
} from "react-icons/md";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import {
  AuthService,
  updateUser,
  getUserById,
  getFranchiseProfile,
  updateFranchiseProfile,
} from "../api";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const loginType = AuthService.getLoginType();

  const currentUser =
    loginType === "franchise"
      ? AuthService.getFranchise()
      : AuthService.getUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        if (loginType === "franchise") {
          const response = await getFranchiseProfile();

          const user = response.franchise || response.data || response;

          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: "franchise",
          });
        } else if (currentUser?.id) {
          const response = await getUserById(currentUser.id);

          const user = response.user || response.data || response;

          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "staff",
          });
        } else {
          setFormData({
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            phone: currentUser?.phone || "",
            role: currentUser?.role || "staff",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback to localStorage data
        setFormData({
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          phone: currentUser?.phone || "",
          role: currentUser?.role || "staff",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);
      if (loginType === "franchise") {
        await updateFranchiseProfile({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });
      } else {
        await updateUser(currentUser.id, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });
      }

      // Update localStorage
      const updatedUser = {
        ...currentUser,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      };
      if (loginType === "franchise") {
        AuthService.setFranchise(updatedUser);
      } else {
        AuthService.setUser(updatedUser);
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const company = AuthService.getCompany();

  if (loading) {
    return (
      <div className="flex bg-[#F8F9FA] min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 lg:ml-[300px]">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin">
                <div className="w-12 h-12 border-4 border-[#DEE2E6] border-t-[#0d5b96] rounded-full"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Toaster position="top-right" />
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#6C757D] hover:text-[#212529] mb-4 transition-colors"
            >
              <MdArrowBack className="text-[20px]" />
              <span className="text-[14px]">Back</span>
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              My Profile
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              View and update your personal information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-6">
                <h2 className="text-[18px] font-semibold text-[#212529] mb-6">
                  Personal Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D] text-[20px]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d5b96] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D] text-[20px]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-[#DEE2E6] rounded-lg text-[14px] bg-[#F8F9FA] text-[#6C757D] cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[12px] text-[#6C757D] mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D] text-[20px]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0d5b96] focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Role - Read Only */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={
                        formData.role.charAt(0).toUpperCase() +
                        formData.role.slice(1)
                      }
                      disabled
                      className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg text-[14px] bg-[#F8F9FA] text-[#6C757D] cursor-not-allowed capitalize"
                    />
                    <p className="text-[12px] text-[#6C757D] mt-1">
                      Contact admin to change your role
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-[#0d5b96] text-white rounded-lg font-semibold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdSave className="text-[20px]" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-6">
                <h2 className="text-[18px] font-semibold text-[#212529] mb-6">
                  Company Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#0d5b96] rounded-full flex items-center justify-center">
                      <MdBusiness className="text-[24px] text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#212529]">
                        {company?.company_name || "Your Company"}
                      </p>
                      <p className="text-[12px] text-[#6C757D]">
                        Plan:{" "}
                        {loginType === "franchise"
                          ? "Business"
                          : company?.plan?.charAt(0).toUpperCase() +
                            company?.plan?.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DEE2E6]">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                          Company Email
                        </p>
                        <p className="text-[14px] text-[#212529]">
                          {company?.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                          Company Phone
                        </p>
                        <p className="text-[14px] text-[#212529]">
                          {company?.phone || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                          Address
                        </p>
                        <p className="text-[14px] text-[#212529]">
                          {company?.address || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-6 mt-6">
                <h2 className="text-[18px] font-semibold text-[#212529] mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {loginType !== "franchise" && (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-medium text-[#212529] hover:bg-[#F8F9FA] transition-colors text-left"
                    >
                      View Subscription
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/notifications")}
                    className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-medium text-[#212529] hover:bg-[#F8F9FA] transition-colors text-left"
                  >
                    Notification Settings
                  </button>
                  <button
                    onClick={() => navigate("/change-password")}
                    className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-medium text-[#212529] hover:bg-[#F8F9FA] transition-colors text-left flex items-center gap-2"
                  >
                    <MdLock className="text-[18px]" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
