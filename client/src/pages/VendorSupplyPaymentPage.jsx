import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { getVendorSupplyRequestById, payVendorSupplyRequest } from "../api";

const VendorSupplyPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorId, requestId } = useParams();

  const [request, setRequest] = useState(
    location.state?.notification?.metadata || null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await getVendorSupplyRequestById(vendorId, requestId);
        setRequest(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load supply request details");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId && requestId) {
      fetchRequest();
    }
  }, [vendorId, requestId]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.error("Select a payment method");
      return;
    }

    try {
      setSubmitting(true);
      const response = await payVendorSupplyRequest(vendorId, requestId, {
        paymentMethod,
        paymentReference,
      });

      toast.success(
        `Payment completed. Invoice: ${response.data.invoiceNumber}`,
      );
      navigate("/notifications");
    } catch (error) {
      toast.error(error.message || "Failed to complete payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Toaster position="top-right" />
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          <button
            onClick={() => navigate("/notifications")}
            className="flex items-center gap-2 text-[#6C757D] hover:text-[#212529] mb-5 transition-colors"
          >
            <MdArrowBack className="text-[20px]" />
            <span className="text-[14px]">Back to Notifications</span>
          </button>

          <div className="bg-white rounded-xl border border-[#DEE2E6] p-6 max-w-3xl">
            <h1 className="text-2xl font-bold text-[#212529] mb-2">
              Vendor Payment
            </h1>
            <p className="text-[#6C757D] mb-6">
              Complete payment and generate vendor invoice confirmation.
            </p>

            {loading ? (
              <div className="py-8 text-center text-[#6C757D]">
                Loading request details...
              </div>
            ) : !request ? (
              <div className="py-8 text-center text-[#6C757D]">
                Supply request not found
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg p-4 mb-6">
                  <div>
                    <p className="text-xs text-[#6C757D]">Request</p>
                    <p className="text-sm font-semibold text-[#212529]">
                      {request.requestNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6C757D]">Vendor</p>
                    <p className="text-sm font-semibold text-[#212529]">
                      {request.vendorName || request.vendorId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6C757D]">Product</p>
                    <p className="text-sm font-semibold text-[#212529]">
                      {request.productName || request.productId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6C757D]">Amount</p>
                    <p className="text-sm font-semibold text-[#212529]">
                      ${Number(request.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#212529] mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
                    >
                      <option value="online">Online Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#212529] mb-1">
                      Payment Reference
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Transaction/Reference ID"
                      className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/notifications")}
                      className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[#212529]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-[#0d5b96] text-white rounded-lg disabled:opacity-60"
                    >
                      {submitting ? "Processing..." : "Complete Payment"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorSupplyPaymentPage;
