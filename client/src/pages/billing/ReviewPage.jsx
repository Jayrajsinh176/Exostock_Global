import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import toast from "react-hot-toast";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { GST_RATE } from "../../constants/pos";
import { AuthService } from "../../api";

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, subtotal, gst, total, paymentMethod, customerData } =
    location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no state
  if (!cartItems) {
    return <Navigate to="/billing" replace />;
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const customerFields = [
    { label: "Name", value: customerData?.name },
    { label: "Phone", value: customerData?.phone },
    { label: "Email", value: customerData?.email },
    { label: "Address", value: customerData?.address },
    { label: "Notes", value: customerData?.notes },
  ].filter((field) => field.value);
  const hasCustomer = customerFields.length > 0;

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              product: item.id,
              productName: item.name,
              productSku: item.sku,
              quantity: item.quantity,
              unitPrice: item.price,
              subtotal: item.price * item.quantity,
            })),
            subtotal,
            tax: gst,
            discount: 0,
            total,
            paymentMethod,
            paymentStatus: "paid",
            customerName: customerData?.name,
            customerPhone: customerData?.phone,
            customerEmail: customerData?.email,
            customerAddress: customerData?.address,
            notes: customerData?.notes,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      const order = data.order;
      const invoice = data.invoice;

      navigate("/billing/success", {
        state: {
          cartItems,
          subtotal,
          gst,
          total,
          paymentMethod,
          orderDate: new Date(order?.createdAt || Date.now()).toLocaleString(
            "en-IN",
          ),
          orderId: order?.orderNumber || order?._id,
          transactionId:
            order?.transactionId || invoice?.transactionId || "N/A",
        },
      });
    } catch (error) {
      toast.error(error.message || "Failed to confirm payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate("/billing/payment", {
      state: { cartItems, subtotal, gst, total, customerData, paymentMethod },
    });
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[300px]">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#212529] hover:text-[#0d5b96] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Payment
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              Review Your Order
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              Please verify your order details before confirming
            </p>
          </div>

          {/* Main Layout */}
          <div className="max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Items + Customer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
                <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold text-[#212529]">
                    Order Items
                  </h2>
                  <span className="text-[12px] font-medium text-[#6C757D]">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] border-b border-[#DEE2E6]">
                        <th className="text-left font-semibold px-6 py-3">
                          Product
                        </th>
                        <th className="text-right font-semibold px-4 py-3">
                          Price
                        </th>
                        <th className="text-center font-semibold px-4 py-3">
                          Qty
                        </th>
                        <th className="text-right font-semibold px-6 py-3">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9ECEF]">
                      {cartItems.map((item) => (
                        <tr key={item.sku}>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-[#212529]">
                              {item.name}
                            </p>
                            <p className="text-[12px] text-[#6C757D] mt-0.5">
                              SKU: {item.sku}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-right text-[#212529] whitespace-nowrap">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-block min-w-[32px] px-2 py-0.5 rounded bg-[#F1F3F5] font-semibold text-[#212529]">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-[#212529] whitespace-nowrap">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Details */}
              {hasCustomer && (
                <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
                  <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                    <h2 className="text-[16px] font-semibold text-[#212529]">
                      Customer Details
                    </h2>
                  </div>
                  <dl className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                    {customerFields.map(({ label, value }) => (
                      <div key={label}>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] mb-1">
                          {label}
                        </dt>
                        <dd className="text-[#212529] break-words">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Right: Summary + Actions */}
            <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden lg:sticky lg:top-6">
              <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                <h2 className="text-[16px] font-semibold text-[#212529]">
                  Payment Summary
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-[#6C757D]">Subtotal</span>
                    <span className="font-medium text-[#212529]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6C757D]">GST ({GST_RATE}%)</span>
                    <span className="font-medium text-[#212529]">
                      {formatCurrency(gst)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-dashed border-[#DEE2E6]">
                    <span className="text-[14px] font-semibold text-[#212529]">
                      Total Amount
                    </span>
                    <span className="text-[22px] font-bold text-[#0d5b96]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] border border-[#DEE2E6]">
                  <span className="text-[12px] text-[#6C757D]">
                    Payment Method
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E7F1FA] text-[#0d5b96] text-[11px] font-semibold uppercase tracking-[0.04em]">
                    {paymentMethod}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="w-full h-[48px] bg-[#28A745] text-white rounded-lg text-[14px] font-semibold hover:bg-[#218838] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>Confirm Payment · {formatCurrency(total)}</>
                    )}
                  </button>
                  <button
                    onClick={handleBack}
                    disabled={isProcessing}
                    className="w-full h-[44px] border border-[#DEE2E6] text-[#212529] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors disabled:opacity-50"
                  >
                    Back
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

export default ReviewPage;
