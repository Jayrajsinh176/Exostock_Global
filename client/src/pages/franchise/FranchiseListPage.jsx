import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdSearch,
  MdVisibility,
  MdEdit,
  MdBlock,
  MdCheckCircle,
} from "react-icons/md";
import {
  getFranchises,
  toggleFranchiseStatus,
  AuthService,
} from "../../api";
import toast from "react-hot-toast";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function FranchiseListPage() {
  const navigate = useNavigate();

  const isFranchise = AuthService.isFranchise();
  const isStaff = AuthService.getUser()?.role === "staff";

  useEffect(() => {
    if (isFranchise || isStaff) {
      navigate("/dashboard", { replace: true });
    }
  }, [isFranchise, isStaff, navigate]);

  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const response = await getFranchises();
        setFranchises(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchFranchises();
  }, []);

  const handleToggleStatus = async () => {
    try {
      const response = await toggleFranchiseStatus(selectedFranchise._id);

      toast.success(response.message);

      setFranchises((prev) =>
        prev.map((location) =>
          location._id === selectedFranchise._id
            ? {
              ...location,
              status: response.status,
            }
            : location
        )
      );

      setShowStatusModal(false);
      setSelectedFranchise(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const filteredFranchises = franchises.filter((location) => {
    const value = search.toLowerCase();

    return (
      location.locationName?.toLowerCase().includes(value) ||
      location.name?.toLowerCase().includes(value) ||
      location.phone?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529]">
                Location List
              </h1>

              <p className="text-[14px] text-[#6C757D] mt-1">
                Manage all your business locations.
              </p>
            </div>

            <button
              onClick={() => navigate("/franchises/add")}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-[#212529] transition"
            >
              <MdAdd size={18} />
              Add Location
            </button>
          </div>

          {/* Card */}
          <div className="bg-white border border-[#DEE2E6] rounded-2xl shadow-sm overflow-hidden">

            {/* Search */}
            <div className="p-5 border-b border-[#DEE2E6]">
              <div className="relative max-w-sm">
                <MdSearch className="absolute left-3 top-3 text-[#ADB5BD] text-lg" />

                <input
                  type="text"
                  placeholder="Search Location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-[#F8F9FA]">
                  <tr>


                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Manager
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Address
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Created
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-10 text-center text-[#6C757D]"
                      >
                        Loading locations...
                      </td>
                    </tr>
                  ) : filteredFranchises.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-10 text-center text-[#6C757D]"
                      >
                        No locations found.
                      </td>
                    </tr>
                  ) : (
                    filteredFranchises.map((location) => (
                      <tr
                        key={location._id}
                        className="border-t border-[#F1F3F5] hover:bg-[#FAFAFA]"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold">
                            {location.locationName}
                          </div>

                          {location.isDefault && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              Head Office
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {location.name}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {location.email}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {location.phone}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {location.address}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${location.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {location.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {new Date(location.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() =>
                                navigate(`/franchises/${location._id}`)
                              }
                              className="w-9 h-9 rounded-lg border border-[#DEE2E6] flex items-center justify-center hover:bg-gray-100"
                              title="View"
                            >
                              <MdVisibility size={18} />
                            </button>

                            <button
                              onClick={() =>
                                navigate(`/franchises/${location._id}/edit`)
                              }
                              className="w-9 h-9 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-50"
                              title="Edit"
                            >
                              <MdEdit size={18} />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedFranchise(location);
                                setShowStatusModal(true);
                              }}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${location.status === "active"
                                  ? "border border-red-200 text-red-600 hover:bg-red-50"
                                  : "border border-green-200 text-green-600 hover:bg-green-50"
                                }`}
                              title={
                                location.status === "active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {location.status === "active" ? (
                                <MdBlock size={18} />
                              ) : (
                                <MdCheckCircle size={18} />
                              )}
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#DEE2E6] text-sm text-[#6C757D]">
              Showing {filteredFranchises.length} of {franchises.length} location(s)
            </div>
          </div>
        </main>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-bold text-[#212529]">
              {selectedFranchise?.status === "active"
                ? "Deactivate Location"
                : "Activate Location"}
            </h2>

            <p className="mt-3 text-sm text-[#6C757D] leading-6">
              {selectedFranchise?.status === "active"
                ? "Are you sure you want to deactivate this location? It will no longer be available for day-to-day operations until it is activated again."
                : "Are you sure you want to activate this location?"}
            </p>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedFranchise(null);
                }}
                className="px-5 py-2 border border-[#DEE2E6] rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleToggleStatus}
                className={`px-5 py-2 rounded-lg text-white font-semibold ${selectedFranchise?.status === "active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {selectedFranchise?.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}