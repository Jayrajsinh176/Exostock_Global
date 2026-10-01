import { useNavigate, useLocation } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems,
    subtotal,
    gst,
    total,
    paymentMethod,
    orderDate,
    orderId,
    transactionId,
  } = location.state || {};

  // Redirect if no state
  if (!cartItems) {
    navigate("/billing");
    return null;
  }

  const handleNewBill = () => {
    navigate("/billing");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[300px]">
        {/* Header */}
        <Header />

        {/* Page Content - Centered Success Message */}
        <main className="p-8 flex items-center justify-center min-h-[calc(100vh-140px)]">
          <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 max-w-[600px] w-full shadow-sm">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#D4EDDA] border-4 border-[#28A745] mb-4">
                <MdCheckCircle className="text-[48px] text-[#28A745]" />
              </div>
              <h1 className="text-[28px] font-bold text-[#212529] mb-2">
                Payment Successful!
              </h1>
              <p className="text-[14px] text-[#6C757D]">
                Your order has been confirmed and processed.
              </p>
            </div>

            {/* Order Details Box */}
            <div className="bg-[#F8F9FA] rounded-lg p-6 mb-6 border border-[#DEE2E6]">
              <div className="space-y-4">
                {/* Order ID */}
                <div className="flex items-center justify-between pb-3 border-b border-[#DEE2E6]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
                    Order ID
                  </span>
                  <span className="text-[14px] font-bold text-[#212529] font-mono">
                    {orderId}
                  </span>
                </div>

                {/* Transaction ID */}
                <div className="flex items-center justify-between pb-3 border-b border-[#DEE2E6]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
                    Transaction ID
                  </span>
                  <span className="text-[14px] font-mono text-[#6C757D]">
                    {transactionId}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between pb-3 border-b border-[#DEE2E6]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
                    Payment Method
                  </span>
                  <span className="text-[14px] font-semibold text-[#212529] capitalize">
                    {paymentMethod}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center justify-between pb-3 border-b border-[#DEE2E6]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
                    Date & Time
                  </span>
                  <span className="text-[14px] text-[#212529]">
                    {orderDate}
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D]">
                    Total Amount
                  </span>
                  <span className="text-[20px] font-bold text-[#0d5b96]">
                    ${total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="mb-6">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                Items Ordered
              </h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between p-2 bg-[#F8F9FA] border border-[#DEE2E6] rounded text-[13px]"
                  >
                    <div>
                      <p className="font-medium text-[#212529]">{item.name}</p>
                      <p className="text-[11px] text-[#6C757D]">
                        SKU: {item.sku} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[#212529]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg mb-6">
              <p className="text-[12px] text-[#212529]">
                ✓ Order confirmation has been generated. Your receipt is ready
                for download.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleNewBill}
                className="flex-1 h-[44px] bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors"
              >
                New Bill
              </button>
              <button
                onClick={handleDashboard}
                className="flex-1 h-[44px] border-2 border-[#0d5b96] text-[#0d5b96] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuccessPage;
