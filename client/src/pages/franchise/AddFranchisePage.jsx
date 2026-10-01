import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createFranchise, AuthService } from "../../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

const AddFranchisePage = () => {
  const navigate = useNavigate();

  const isFranchise = AuthService.isFranchise();
  const isStaff = AuthService.getUser()?.role === "staff";

  useEffect(() => {
    if (isFranchise || isStaff) {
      navigate("/dashboard", { replace: true });
    }
  }, [isFranchise, isStaff, navigate]);

  const [formData, setFormData] = useState({
    locationName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gstNumber: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: phoneOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await createFranchise(formData);

      console.log("Franchise Response:", response);

      toast.success(response.message);

      setTimeout(() => {
        navigate("/franchises");
      }, 1000);
    } catch (error) {
      console.error("Create Location Error:", error);
      toast.error(error.message);
    }
  };

  const inputClass =
    "w-full h-[40px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white transition";

  const labelClass =
    "block text-[12px] font-semibold text-[#495057] mb-2";

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[300px]">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#212529]">
              Add Location
            </h1>

            <p className="text-[14px] text-[#6C757D] mt-1">
              Create a new business location.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-4xl bg-white border border-[#DEE2E6] rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Name */}
                <div>
                  <label className={labelClass}>
                    Location Name *
                  </label>

                  <input
                    type="text"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                    placeholder="Rajkot Branch"
                    className={inputClass}
                  />
                </div>

                {/* Manager Name */}
                <div>
                  <label className={labelClass}>
                    Manager Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="manager@company.com"
                    className={inputClass}
                  />
                </div>


                {/* Phone */}
                <div>
                  <label className={labelClass}>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="9876543210"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Password *
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Confirm Password *
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={inputClass}
                  />
                </div>

                {/* GST */}
                <div>
                  <label className={labelClass}>
                    GST Number
                  </label>

                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="24ABCDE1234F1Z5"
                    className={inputClass}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Location Address
                  </label>

                  <textarea
                    rows={4}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter location address..."
                    className="w-full px-3 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white transition resize-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/franchises")}
                  className="px-5 py-2.5 border border-[#DEE2E6] rounded-lg font-medium hover:bg-[#F8F9FA]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-[#212529] transition"
                >
                  Create Location
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddFranchisePage;