import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdDelete,
  MdAdd,
  MdRemove,
  MdSearch,
} from "react-icons/md";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { formatCurrency, GST_RATE } from "../../constants/pos";
import { AuthService } from "../../api";

const BillingPage = () => {
  const navigate = useNavigate();
  const skuInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [skuInput, setSkuInput] = useState("");
  const [error, setError] = useState("");
  const [customerErrors, setCustomerErrors] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // Auto focus on input
  useEffect(() => {
    skuInputRef.current?.focus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        skuInputRef.current &&
        !skuInputRef.current.contains(event.target)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = AuthService.getToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Fetch products response:", response);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          console.error("Failed to fetch products:", response.statusText);
          setError("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Find product by SKU from real database
  const findProductBySKU = (sku) => {
    if (!products || products.length === 0) return null;
    return products.find(
      (product) => product.sku?.toLowerCase() === sku?.toLowerCase(),
    );
  };

  // Handle SKU input
  const handleSkuInput = (e) => {
    const value = e.target.value;
    setSkuInput(value);
    setError("");
    setHighlightedIndex(0); // Reset to first item

    if (!value.trim()) {
      setSuggestions([]);
      setShowDropDown(false);
      return;
    }

    const filtered = products
      .filter(
        (p) =>
          p.sku?.toLowerCase().includes(value.toLowerCase()) ||
          p.name?.toLowerCase().includes(value.toLowerCase()),
      )
      .slice(0, 4);

    setSuggestions(filtered);
    setShowDropDown(true);
  };

  const selectProduct = (product) => {
    const mappedProduct = {
      id: product._id || product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      stock: product.stock,
    };

    const existingItem = cartItems.find((item) => item.id === mappedProduct.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === mappedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...mappedProduct, quantity: 1 }]);
    }

    setSkuInput("");
    setSuggestions([]);
    setShowDropDown(false);
    setHighlightedIndex(0);
    skuInputRef.current?.focus();
  };
  // Handle Enter key to add product and Arrow keys for navigation
  const handleAddProduct = (e) => {
    // Handle Arrow Down - move to next suggestion
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showDropDown && suggestions.length > 0) {
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
      }
      return;
    }

    // Handle Arrow Up - move to previous suggestion
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showDropDown && suggestions.length > 0) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
      return;
    }

    // Handle Enter key
    if (e.key === "Enter") {
      e.preventDefault();

      // If dropdown is open and a product is highlighted, select it
      if (showDropDown && suggestions.length > 0) {
        selectProduct(suggestions[highlightedIndex]);
        return;
      }

      // Otherwise, search by SKU as before
      if (!skuInput.trim()) {
        setError("Please enter a SKU");
        return;
      }

      const product = findProductBySKU(skuInput);

      if (!product) {
        setError(`Product with SKU "${skuInput}" not found`);
        setSkuInput("");
        return;
      }

      // Check stock availability
      if (product.stock <= 0) {
        setError(`Product "${product.name}" is out of stock`);
        setSkuInput("");
        return;
      }

      // Check if item already exists
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Check if quantity wouldn't exceed stock
        if (existingItem.quantity >= product.stock) {
          setError(`Cannot add more. Only ${product.stock} in stock.`);
          setSkuInput("");
          return;
        }
        // Increment quantity
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        // Add new item
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }

      setSkuInput("");
      setSuggestions([]);
      setShowDropDown(false);
      setHighlightedIndex(0);
      setError("");
      skuInputRef.current?.focus();
    }
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    const product = products.find((p) => (p._id || p.id) === productId);

    if (product && quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Remove item
  const removeItem = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const gst = (subtotal * GST_RATE) / 100;
  const total = subtotal + gst;

  // Proceed to payment
  const handleProceed = () => {
    if (cartItems.length === 0) {
      setError("Cart is empty. Please add items.");
      return;
    }

    const nextCustomerErrors = {
      name: customerData.name.trim() ? "" : "Customer name is required.",
      phone: customerData.phone.trim() ? "" : "Mobile number is required.",
    };
    setCustomerErrors(nextCustomerErrors);

    if (nextCustomerErrors.name || nextCustomerErrors.phone) {
      const firstInvalid = nextCustomerErrors.name
        ? nameInputRef.current
        : phoneInputRef.current;
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid?.focus({ preventScroll: true });
      return;
    }

    navigate("/billing/payment", {
      state: {
        cartItems,
        subtotal,
        gst,
        total,
        customerData,
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
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[#212529] hover:text-[#0d5b96] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Dashboard
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              Point of Sale
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              {loading
                ? "Loading products..."
                : "Scan or enter product SKU to add items to cart"}
            </p>
          </div>

          {/* Main Layout - Left (70%) and Right (30%) */}
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 xl:gap-8">
            {/* LEFT SECTION - Product Scanning + Cart (70%) */}
            <div className="xl:col-span-4 space-y-6">
              {/* SKU Input */}
              <div className="bg-white rounded-lg border border-[#DEE2E6] p-6 relative">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                  Scan or Enter Product SKU
                </label>
                <input
                  ref={skuInputRef}
                  type="text"
                  value={skuInput}
                  onChange={handleSkuInput}
                  onKeyDown={handleAddProduct}
                  placeholder="e.g., KB-001"
                  disabled={loading}
                  className="w-full h-[48px] px-4 bg-[#F8F9FA] border-2 border-[#DEE2E6] rounded-lg text-[16px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-black focus:bg-white focus:ring-[3px] focus:ring-black/8 transition-all duration-200 disabled:opacity-50"
                />
                {/* Suggestions Dropdown */}
                {showDropDown && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-6 right-6 top-[105px] bg-white border border-[#DEE2E6] rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    {suggestions.map((product, index) => (
                      <div
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className={`px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                          index === highlightedIndex
                            ? "bg-[#0d5b96] text-white"
                            : "hover:bg-[#F8F9FA] bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p
                              className={`text-[14px] font-semibold ${
                                index === highlightedIndex
                                  ? "text-white"
                                  : "text-[#212529]"
                              }`}
                            >
                              {product.name}
                            </p>
                            <p
                              className={`text-[12px] ${
                                index === highlightedIndex
                                  ? "text-[#E9ECEF]"
                                  : "text-[#6C757D]"
                              }`}
                            >
                              {product.sku}
                            </p>
                          </div>

                          <p
                            className={`text-[13px] font-semibold ${
                              index === highlightedIndex
                                ? "text-white"
                                : "text-[#212529]"
                            }`}
                          >
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {error && (
                  <p className="text-[12px] text-[#DC3545] mt-2">{error}</p>
                )}
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
                <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                  <h2 className="text-[16px] font-semibold text-[#212529]">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[14px] text-[#6C757D] mb-4">
                      Cart is empty
                    </p>
                    <p className="text-[12px] text-[#ADB5BD]">
                      Scan or enter a product SKU above to get started
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#DEE2E6]">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 hover:bg-[#F8F9FA] transition-colors"
                      >
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                          {/* Product Info */}
                          <div className="flex-1 min-w-[180px]">
                            <h3 className="text-[14px] font-semibold text-[#212529] mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="flex items-center gap-2 text-[12px] text-[#6C757D]">
                              <span>
                                SKU:{" "}
                                <span className="font-medium">{item.sku}</span>
                              </span>
                              <span className="text-[#DEE2E6]">|</span>
                              <span>
                                Stock:{" "}
                                <span
                                  className={`font-medium ${item.stock <= 5 ? "text-[#DC3545]" : "text-[#28A745]"}`}
                                >
                                  {item.stock}
                                </span>
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-6 ml-auto">
                            {/* Unit Price */}
                            <div className="w-24 text-right">
                              <p className="text-[11px] text-[#6C757D] mb-1">
                                Price
                              </p>
                              <p className="text-[13px] font-semibold text-[#212529]">
                                {formatCurrency(item.price)}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="text-center">
                              <p className="text-[11px] text-[#6C757D] mb-1">
                                Qty
                              </p>
                              <div className="inline-flex items-center border border-[#DEE2E6] rounded overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center hover:bg-[#E9ECEF] transition-colors"
                                  title="Decrease"
                                >
                                  <MdRemove className="text-[16px] text-[#6C757D]" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      item.id,
                                      Math.max(1, parseInt(e.target.value) || 1),
                                    )
                                  }
                                  className="w-10 h-8 text-center text-[13px] font-semibold border-x border-[#DEE2E6] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center hover:bg-[#E9ECEF] transition-colors"
                                  title="Increase"
                                >
                                  <MdAdd className="text-[16px] text-[#6C757D]" />
                                </button>
                              </div>
                            </div>

                            {/* Line Total */}
                            <div className="w-24 text-right">
                              <p className="text-[11px] text-[#6C757D] mb-1">
                                Total
                              </p>
                              <p className="text-[14px] font-bold text-[#212529]">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-[#DC3545] hover:bg-[#F8D7DA] rounded transition-colors"
                              title="Remove"
                            >
                              <MdDelete className="text-[18px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
                <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                  <h2 className="text-[16px] font-semibold text-[#212529]">
                    Customer Details
                  </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                      Customer Name
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={customerData.name}
                      onChange={(e) => {
                        setCustomerData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                        setCustomerErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`w-full h-[48px] px-4 bg-[#F8F9FA] border-2 rounded-lg ${customerErrors.name ? "border-[#DC3545]" : "border-[#DEE2E6]"}`}
                    />
                    {customerErrors.name && (
                      <p className="text-[12px] text-[#DC3545] mt-2">
                        {customerErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                      Mobile Number
                    </label>
                    <input
                      ref={phoneInputRef}
                      type="text"
                      value={customerData.phone}
                      onChange={(e) => {
                        setCustomerData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }));
                        setCustomerErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      className={`w-full h-[48px] px-4 bg-[#F8F9FA] border-2 rounded-lg ${customerErrors.phone ? "border-[#DC3545]" : "border-[#DEE2E6]"}`}
                    />
                    {customerErrors.phone && (
                      <p className="text-[12px] text-[#DC3545] mt-2">
                        {customerErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full h-[48px] px-4 bg-[#F8F9FA] border-2 border-[#DEE2E6] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                      Address
                    </label>
                    <input
                      type="text"
                      value={customerData.address}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full h-[48px] px-4 bg-[#F8F9FA] border-2 border-[#DEE2E6] rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-3">
                      Notes
                    </label>
                    <textarea
                      rows="3"
                      value={customerData.notes}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-[#F8F9FA] border-2 border-[#DEE2E6] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - Order Summary (30%) */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden sticky top-24">
                <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6]">
                  <h2 className="text-[16px] font-semibold text-[#212529]">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Items Summary */}
                  {cartItems.length > 0 && (
                    <div className="space-y-2 pb-4 border-b border-[#DEE2E6]">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-[13px]"
                        >
                          <span className="text-[#212529]">
                            {item.name.substring(0, 12)}...
                          </span>
                          <span className="font-medium text-[#212529]">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 pb-4 border-b border-[#DEE2E6]">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6C757D]">Subtotal</span>
                      <span className="font-semibold text-[#212529]">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#6C757D]">GST ({GST_RATE}%)</span>
                      <span className="font-semibold text-[#212529]">
                        {formatCurrency(gst)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-[14px] font-semibold text-[#212529]">
                      Total
                    </span>
                    <span className="text-[24px] font-bold text-[#0d5b96]">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleProceed}
                    disabled={cartItems.length === 0 || loading}
                    className="w-full h-[44px] mt-6 bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Payment
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

export default BillingPage;
