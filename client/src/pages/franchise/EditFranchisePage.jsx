import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getFranchiseById,
  updateFranchise,
  AuthService,
} from "../../api";

import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

const EditFranchisePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isFranchise = AuthService.isFranchise();
  const isStaff = AuthService.getUser()?.role === "staff";

  useEffect(() => {
    if (isFranchise || isStaff) {
      navigate("/dashboard", { replace: true });
    }
  }, [isFranchise, isStaff, navigate]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    locationName: "",
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await getFranchiseById(id);

        setFormData({
          locationName: response.location.locationName || "",
          name: response.location.name || "",
          email: response.location.email || "",
          phone: response.location.phone || "",
          gstNumber: response.location.gstNumber || "",
          address: response.location.address || "",
        });
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

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

    try {
      const response = await updateFranchise(id, formData);

      toast.success(response.message);

      navigate(`/franchises/${id}`);
    } catch (error) {
      console.error(error);

      toast.error(error.message);
    }
  };

  const inputClass =
    "w-full h-[40px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white transition";

  const labelClass =
    "block text-[12px] font-semibold text-[#495057] mb-2";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <p className="text-[#6C757D] text-lg">
          Loading location...
        </p>
      </div>
    );
  }
  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#212529]">
              Edit Location
            </h1>

            <p className="text-[14px] text-[#6C757D] mt-1">
              Update location information.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-4xl bg-white border border-[#DEE2E6] rounded-2xl shadow-sm p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Franchise Name */}
                <div>
                  <label className={labelClass}>
                    Location Name *
                  </label>
                  <input
                    type="text"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Owner */}
                <div>
                  <label className={labelClass}>
                    Manager Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    className={inputClass}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Location Address *
                  </label>

                  <textarea
                    rows={4}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white transition resize-none"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={() => navigate(`/franchises/${id}`)}
                  className="px-5 py-2.5 border border-[#DEE2E6] rounded-lg font-medium hover:bg-[#F8F9FA]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-[#212529] transition"
                >
                  Update Location
                </button>

              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditFranchisePage;