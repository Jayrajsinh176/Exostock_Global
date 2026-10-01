import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack, MdCreditCard, MdAttachMoney } from "react-icons/md";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { PAYMENT_METHODS } from "../../constants/pos";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, subtotal, gst, total, customerData } =
    location.state || {};

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS.ONLINE);

  // Redirect if no state
  if (!cartItems) {
    navigate("/billing");
    return null;
  }

  const handleContinue = () => {
    navigate("/billing/review", {
      state: {
        cartItems,
        subtotal,
        gst,
        total,
        customerData,
        paymentMethod: selectedMethod,
      },
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
              onClick={() => navigate("/billing")}
              className="flex items-center gap-2 text-[#212529] hover:text-[#0d5b96] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Cart
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              Select Payment Method
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              Choose how you'd like to pay for your order
            </p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 xl:gap-8 max-w-[1000px]">
            {/* Payment Options */}
            <div className="xl:col-span-4 space-y-4">
              {/* Online Payment */}
              <div
                onClick={() => setSelectedMethod(PAYMENT_METHODS.ONLINE)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMethod === PAYMENT_METHODS.ONLINE
                    ? "border-[#0d5b96] bg-[#F8F9FA]"
                    : "border-[#DEE2E6] hover:border-[#ADB5BD]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Radio Button */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedMethod === PAYMENT_METHODS.ONLINE
                        ? "border-[#0d5b96] bg-[#0d5b96]"
                        : "border-[#DEE2E6]"
                    }`}
                  >
                    {selectedMethod === PAYMENT_METHODS.ONLINE && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <MdCreditCard className="text-[24px] text-[#212529]" />
                      <h3 className="text-[16px] font-semibold text-[#212529]">
                        Online Payment
                      </h3>
                    </div>
                    <p className="text-[13px] text-[#6C757D] ml-9">
                      Credit Card, Debit Card, UPI, Net Banking
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash Payment */}
              <div
                onClick={() => setSelectedMethod(PAYMENT_METHODS.CASH)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMethod === PAYMENT_METHODS.CASH
                    ? "border-[#0d5b96] bg-[#F8F9FA]"
                    : "border-[#DEE2E6] hover:border-[#ADB5BD]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Radio Button */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedMethod === PAYMENT_METHODS.CASH
                        ? "border-[#0d5b96] bg-[#0d5b96]"
                        : "border-[#DEE2E6]"
                    }`}
                  >
                    {selectedMethod === PAYMENT_METHODS.CASH && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <MdAttachMoney className="text-[24px] text-[#28A745]" />
                      <h3 className="text-[16px] font-semibold text-[#212529]">
                        Cash
                      </h3>
                    </div>
                    <p className="text-[13px] text-[#6C757D] ml-9">
                      Pay when order is ready
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 sticky top-24">
                <h3 className="text-[14px] font-semibold text-[#212529] mb-4">
                  Order Total
                </h3>

                <div className="space-y-3 pb-4 border-b border-[#DEE2E6]">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#6C757D]">Subtotal</span>
                    <span className="font-semibold text-[#212529]">
                      ${subtotal?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#6C757D]">GST (18%)</span>
                    <span className="font-semibold text-[#212529]">
                      ${gst?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 mb-6">
                  <span className="text-[14px] font-semibold text-[#212529]">
                    Total
                  </span>
                  <span className="text-[20px] font-bold text-[#0d5b96]">
                    ${total?.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full h-[44px] bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentPage;
