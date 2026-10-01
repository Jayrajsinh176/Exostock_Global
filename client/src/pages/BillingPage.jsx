import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdArrowBack, MdSearch, MdAdd } from "react-icons/md";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import CartItems from "../components/billing/CartItems";
import CustomerInfo from "../components/billing/CustomerInfo";
import PaymentMethod from "../components/billing/PaymentMethod";
import OrderSummary from "../components/billing/OrderSummary";
import PaymentSuccess from "../components/billing/PaymentSuccess";
import { AuthService } from "../api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BillingPage = () => {
  const navigate = useNavigate();
  const loginType = AuthService.getLoginType();
  const token = AuthService.getToken();

  // States
  const [currentStep, setCurrentStep] = useState("cart"); // cart, customer, payment, confirm, success
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [customerData, setCustomerData] = useState({
    type: "new",
    name: "",
    email: "",
    phone: "",
    address: "",
    customerId: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isConfirming, setIsConfirming] = useState(false);

  // Search products
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/billing/search?query=${encodeURIComponent(query)}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        // Filter out items already in cart
        const filtered = data.data.filter(
          (product) =>
            !cartItems.find((item) => item.productId === product._id),
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search products");
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxRate = 18; // GST 18%
  const gst = (subtotal * taxRate) / 100;
  const total = subtotal + gst;

  // Cart Functions
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.productId !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.productId === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product._id,
    );
    if (existingItem) {
      updateQuantity(product._id, existingItem.quantity + 1);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product._id,
          name: product.name,
          sku: product.sku,
          category: product.category?.name || "N/A",
          price: product.price,
          stock: product.stock,
          quantity: 1,
        },
      ]);
    }
    setSearchQuery("");
    setSearchResults([]);
    setShowProductSearch(false);
  };

  // Customer Functions
  const handleCustomerChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerSelect = (type) => {
    setCustomerData((prev) => ({ ...prev, type }));
  };

  // Validate steps
  const isCartValid = cartItems.length > 0;
  const isCustomerValid =
    customerData.type === "new"
      ? customerData.name.trim() && customerData.phone.trim()
      : customerData.customerId;

  // Navigation
  const goToCustomerStep = () => {
    if (isCartValid) {
      setCurrentStep("customer");
    } else {
      toast.error("Please add at least one product to cart");
    }
  };

  const goToPaymentStep = () => {
    if (isCustomerValid) {
      setCurrentStep("payment");
    } else {
      toast.error("Please fill in required customer information");
    }
  };

  const goToConfirmStep = () => {
    setCurrentStep("confirm");
  };

  const processPayment = async () => {
    setIsConfirming(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/billing/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          customerData,
          paymentMethod,
          subtotal,
          tax: gst,
          discount: 0,
          total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order completed successfully!");
        setCurrentStep("success");
        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            ...data.data,
            itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal,
            tax: gst,
            total,
          }),
        );
      } else {
        toast.error(data.message || "Failed to complete order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  // After Success Actions
  const handleDownloadInvoice = () => {
    toast("Invoice download functionality coming soon!");
  };

  const handleNewOrder = () => {
    // Reset everything
    setCartItems([]);
    setCustomerData({
      type: "new",
      name: "",
      email: "",
      phone: "",
      address: "",
      customerId: "",
      notes: "",
    });
    setPaymentMethod("online");
    setCurrentStep("cart");
  };

  const handleViewOrders = () => {
    navigate("/dashboard");
  };

  // Render based on step
  if (currentStep === "success") {
    return (
      <div className="flex bg-[#F8F9FA] min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 lg:ml-[300px]">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <PaymentSuccess
              order={JSON.parse(localStorage.getItem("lastOrder") || "{}")}
              onDownloadInvoice={handleDownloadInvoice}
              onNewOrder={handleNewOrder}
              onViewOrders={handleViewOrders}
            />
          </main>
        </div>
      </div>
    );
  }

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
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[#212529] hover:text-[#0d5b96] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Dashboard
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              Billing & Orders
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              Create and manage orders with items, customer info, and payment
              details.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
            {["cart", "customer", "payment", "confirm"].map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[12px] ${
                    currentStep === step
                      ? "bg-[#0d5b96] text-white"
                      : currentStep >
                          ["cart", "customer", "payment", "confirm"].indexOf(
                            step,
                          )
                        ? "bg-[#28A745] text-white"
                        : "bg-[#E9ECEF] text-[#6C757D]"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && <div className="h-1 w-8 bg-[#E9ECEF]"></div>}
              </div>
            ))}
          </div>

          {/* Content Area - Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
            {/* Left Column - Main Form */}
            <div className="xl:col-span-2 space-y-6">
              {/* STEP 1: Cart */}
              {currentStep === "cart" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">
                      Cart
                    </h2>

                    {/* Product Search */}
                    <div className="mb-6 relative">
                      <button
                        onClick={() => setShowProductSearch(!showProductSearch)}
                        className="w-full h-[44px] px-4 bg-white border border-[#DEE2E6] rounded-lg text-[14px] text-[#6C757D] hover:bg-[#F8F9FA] transition-colors flex items-center gap-2 justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <MdSearch className="text-[18px]" />
                          {showProductSearch
                            ? "Hide product list"
                            : "Search for products"}
                        </span>
                        <MdAdd className="text-[18px]" />
                      </button>

                      {/* Product Search Dropdown */}
                      {showProductSearch && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#DEE2E6] rounded-lg shadow-lg z-10">
                          <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              handleSearch(e.target.value);
                            }}
                            className="w-full h-[40px] px-4 border-b border-[#DEE2E6] text-[14px] focus:outline-none"
                          />
                          <div className="max-h-[300px] overflow-y-auto">
                            {isSearching ? (
                              <div className="p-4 text-center">
                                <p className="text-[13px] text-[#6C757D]">
                                  Searching...
                                </p>
                              </div>
                            ) : searchResults.length > 0 ? (
                              searchResults.map((product) => (
                                <button
                                  key={product._id}
                                  onClick={() => addToCart(product)}
                                  className="w-full text-left p-3 border-b border-[#E9ECEF] hover:bg-[#F8F9FA] transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-[13px] font-semibold text-[#212529]">
                                        {product.name}
                                      </p>
                                      <p className="text-[11px] text-[#6C757D]">
                                        SKU: {product.sku} | Stock:{" "}
                                        {product.stock}
                                      </p>
                                    </div>
                                    <p className="text-[13px] font-bold text-[#212529]">
                                      ${product.price}
                                    </p>
                                  </div>
                                </button>
                              ))
                            ) : searchQuery ? (
                              <div className="p-4 text-center">
                                <p className="text-[13px] text-[#6C757D]">
                                  No products found
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cart Items */}
                    {cartItems.length > 0 ? (
                      <CartItems
                        items={cartItems}
                        onRemoveItem={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onAddMoreProducts={() => setShowProductSearch(true)}
                      />
                    ) : (
                      <div className="bg-white border border-[#DEE2E6] rounded-lg p-8 text-center">
                        <p className="text-[14px] text-[#6C757D]">
                          Your cart is empty. Search and add products to
                          continue.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToCustomerStep}
                    disabled={!isCartValid}
                    className="w-full h-[44px] bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Customer Info
                  </button>
                </div>
              )}

              {/* STEP 2: Customer Info */}
              {currentStep === "customer" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">
                      Customer Information
                    </h2>
                    <CustomerInfo
                      customerData={customerData}
                      onCustomerChange={handleCustomerChange}
                      onCustomerSelect={handleCustomerSelect}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep("cart")}
                      className="flex-1 h-[44px] border-2 border-[#0d5b96] text-[#0d5b96] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goToPaymentStep}
                      disabled={!isCustomerValid}
                      className="flex-1 h-[44px] bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Method */}
              {currentStep === "payment" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">
                      Payment Method
                    </h2>
                    <PaymentMethod
                      paymentMethod={paymentMethod}
                      onPaymentMethodChange={setPaymentMethod}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep("customer")}
                      className="flex-1 h-[44px] border-2 border-[#0d5b96] text-[#0d5b96] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={goToConfirmStep}
                      className="flex-1 h-[44px] bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Order Confirmation */}
              {currentStep === "confirm" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#212529] mb-4">
                      Confirm Your Order
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-white border border-[#DEE2E6] rounded-lg p-4">
                        <h3 className="text-[14px] font-semibold text-[#212529] mb-3">
                          Order Items
                        </h3>
                        <div className="space-y-2">
                          {cartItems.map((item) => (
                            <div
                              key={item.productId}
                              className="flex gap-3 pb-3 border-b border-[#E9ECEF]"
                            >
                              <div className="flex-1">
                                <p className="text-[13px] font-semibold text-[#212529]">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-[#6C757D]">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-[13px] font-bold text-[#212529]">
                                ${item.price * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-[#DEE2E6] rounded-lg p-4">
                        <h3 className="text-[14px] font-semibold text-[#212529] mb-3">
                          Customer Details
                        </h3>
                        <p className="text-[13px] text-[#212529]">
                          <strong>Name:</strong> {customerData.name}
                        </p>
                        <p className="text-[13px] text-[#212529]">
                          <strong>Phone:</strong> {customerData.phone}
                        </p>
                        {customerData.email && (
                          <p className="text-[13px] text-[#212529]">
                            <strong>Email:</strong> {customerData.email}
                          </p>
                        )}
                        <p className="text-[13px] text-[#212529]">
                          <strong>Payment:</strong>{" "}
                          {paymentMethod === "online" ? "Online" : "Cash"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep("payment")}
                      className="flex-1 h-[44px] border-2 border-[#0d5b96] text-[#0d5b96] rounded-lg text-[14px] font-semibold hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={processPayment}
                      disabled={isConfirming}
                      className="flex-1 h-[44px] bg-[#28A745] text-white rounded-lg text-[14px] font-semibold hover:bg-[#218838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConfirming ? "Processing..." : "Complete Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="xl:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                taxRate={taxRate}
                tax={gst}
                total={total}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BillingPage;
