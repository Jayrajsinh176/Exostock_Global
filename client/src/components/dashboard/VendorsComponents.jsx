import { useState, useEffect } from "react";
import {
  MdSearch,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdClose,
  MdArrowBack,
  MdAdd,
} from "react-icons/md";
import toast from "react-hot-toast";
import {
  AuthService,
  getProducts,
  getVendors,
  getVendorById,
  getVendorProducts,
  getVendorOrders,
  createVendor,
  updateVendor,
  createVendorSupplyRequest,
  getVendorSupplyRequests,
  updateVendorSupplyRequestStatus,
  updateSupplyRequestStatus,
  updateSupplyRequestPayment,
} from "../../api";

const loginType = AuthService.getLoginType();
const isCompany = loginType !== "franchise";
// ============================================
// VENDORS HEADER COMPONENT
// ============================================
export const VendorsHeader = ({ onAddVendor }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#212529]">
          Vendors Management
        </h1>
        <p className="text-[#6C757D] mt-2">
          Manage and view all your vendors, their products, and order history
        </p>
      </div>
      <button
        onClick={onAddVendor}
        className="flex items-center gap-2 px-4 py-2 bg-[#0d5b96] text-white font-semibold rounded-lg hover:bg-[#1A1A1A] transition-colors"
      >
        <MdAdd className="text-xl" />
        Add Vendor
      </button>
    </div>
  );
};

// ============================================
// VENDORS LIST COMPONENT
// ============================================
export const VendorsList = ({
  refreshKey,
  selectedVendor,
  onVendorSelect,
  onVendorsChanged,
}) => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [refreshKey]);

  useEffect(() => {
    filterVendors();
  }, [searchTerm, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVendors();
      setVendors(response.data || []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    if (!searchTerm.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(term) ||
        vendor.phone.includes(term) ||
        (vendor.email && vendor.email.toLowerCase().includes(term)),
    );
    setFilteredVendors(filtered);
  };

  const handleVendorAdded = () => {
    setShowAddForm(false);
    fetchVendors(); // Refresh the vendor list
  };

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#495057]"></div>
      </div>
    );
  }

  if (selectedVendor) {
    return (
      <VendorDetailView
        vendorId={selectedVendor}
        onBack={() => onVendorSelect(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Vendor Form - Shows First When Active */}
      {isCompany && showAddForm && (
        <AddVendorForm
          onClose={() => setShowAddForm(false)}
          onVendorAdded={handleVendorAdded}
        />
      )}

      {/* Header with Add Button */}
      {isCompany && !showAddForm && (
        <VendorsHeader onAddVendor={() => setShowAddForm(true)} />
      )}

      {/* Search Bar - Hidden when form is showing */}
      {!showAddForm && (
        <div className="bg-white rounded-lg border border-[#DEE2E6] p-4">
          <div className="flex items-center gap-3 bg-[#F8F9FA] rounded px-4 py-2">
            <MdSearch className="text-[#6C757D] text-xl" />
            <input
              type="text"
              placeholder="Search vendor by name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#212529] placeholder-[#6C757D]"
            />
          </div>
        </div>
      )}

      {/* Vendors Grid - Hidden when form is showing */}
      {!showAddForm && (
        <>
          {error ? (
            <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 text-[#721C24]">
              Error: {error}
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 text-center">
              <p className="text-[#6C757D]">No vendors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onSelect={() => onVendorSelect(vendor._id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================
// VENDOR CARD COMPONENT
// ============================================
const VendorCard = ({ vendor, onSelect }) => {
  const statusColors = {
    active: "bg-[#D4EDDA] text-[#155724]",
    inactive: "bg-[#E2E3E5] text-[#383D41]",
    suspended: "bg-[#F8D7DA] text-[#721C24]",
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg border border-[#DEE2E6] p-6 hover:shadow-lg hover:border-[#0d5b96] transition-all cursor-pointer"
    >
      {/* Vendor Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#212529]">{vendor.name}</h3>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${statusColors[vendor.status] || statusColors.inactive}`}
          >
            {vendor.status || "inactive"}
          </span>
        </div>
      </div>

      {/* Vendor Details */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-[#495057]">
          <MdPhone className="text-[#6C757D]" />
          <span>{vendor.phone}</span>
        </div>
        {vendor.email && (
          <div className="flex items-center gap-2 text-[#495057]">
            <MdEmail className="text-[#6C757D]" />
            <span className="truncate">{vendor.email}</span>
          </div>
        )}
        {vendor.address && (
          <div className="flex items-start gap-2 text-[#495057]">
            <MdLocationOn className="text-[#6C757D] flex-shrink-0 mt-0.5" />
            <span className="flex-1">{vendor.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// VENDOR DETAIL VIEW COMPONENT
// ============================================
const VendorDetailView = ({ vendorId, onBack }) => {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // products | history | requests
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchVendorDetails();
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vendorRes, productsRes, ordersRes, requestsRes] =
        await Promise.all([
          getVendorById(vendorId),
          getVendorProducts(vendorId),
          getVendorOrders(vendorId),
          getVendorSupplyRequests(vendorId),
        ]);

      setVendor(vendorRes.data);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setSupplyRequests(requestsRes.data || []);
    } catch (err) {
      console.error("Error fetching vendor details:", err);
      setError(err.message || "Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  };

  const refreshSupplyRequests = async () => {
    try {
      const requestsRes = await getVendorSupplyRequests(vendorId);
      setSupplyRequests(requestsRes.data || []);
    } catch (err) {
      console.error("Error refreshing supply requests:", err);
    }
  };

  const handleVendorUpdated = (updatedVendor) => {
    setVendor(updatedVendor);
    setShowEditModal(false);
    toast.success("Vendor updated successfully");
  };

  const handleToggleStatus = async () => {
    if (!vendor) return;

    const nextStatus = vendor.status === "active" ? "inactive" : "active";

    try {
      const response = await updateVendor(vendor._id, { status: nextStatus });
      setVendor(response.data);
      toast.success(`Vendor marked as ${nextStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update vendor status");
    }
  };

  const handleOrderCreated = async () => {
    setShowOrderModal(false);
    await refreshSupplyRequests();
    toast.success("Order request sent to vendor");
  };

  const handleMarkRequestReady = async (requestId) => {
    try {
      await updateVendorSupplyRequestStatus(vendorId, requestId, {
        status: "shipped",
        vendorResponseNotes: "Ready for dispatch",
      });
      await refreshSupplyRequests();
      toast.success("Request marked as ready and admin notification created");
    } catch (err) {
      toast.error(err.message || "Failed to update request");
    }
  };

  const handleMarkDelivered = async (requestId) => {
    try {
      await updateSupplyRequestStatus(requestId, "delivered");

      await refreshSupplyRequests();

      toast.success("Request marked as delivered and stock updated");
    } catch (err) {
      toast.error(err.message || "Failed to mark request as delivered");
    }
  };

  const handleMarkPaid = async (requestId) => {
    try {
      await updateSupplyRequestPayment(requestId, { paymentStatus: "paid" });

      await refreshSupplyRequests();

      toast.success("Request marked as paid");
    } catch (err) {
      toast.error(err.message || "Failed to mark request as paid");
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#495057]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 text-[#721C24]">
        Error: {error}
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-[#6C757D] mb-4">Vendor not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#0d5b96] text-white rounded hover:bg-[#1A1A1A] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const statusColors = {
    active: "bg-[#D4EDDA] text-[#155724]",
    inactive: "bg-[#E2E3E5] text-[#383D41]",
    suspended: "bg-[#F8D7DA] text-[#721C24]",
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-[#212529] hover:text-[#0d5b96] transition-colors"
      >
        <MdArrowBack /> Back to Vendors
      </button>

      {/* Vendor Header Section */}
      <div className="bg-white rounded-lg border border-[#DEE2E6] p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#212529]">{vendor.name}</h1>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-semibold mt-3 ${statusColors[vendor.status] || statusColors.inactive}`}
            >
              {vendor.status || "inactive"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {isCompany && (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-2 text-sm font-semibold border border-[#DEE2E6] text-[#212529] rounded hover:border-[#0d5b96]"
                >
                  Edit Vendor
                </button>

                <button
                  onClick={handleToggleStatus}
                  className="px-3 py-2 text-sm font-semibold border border-[#DEE2E6] text-[#212529] rounded hover:border-[#0d5b96]"
                >
                  {vendor.status === "active" ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => setShowOrderModal(true)}
                  className="px-3 py-2 text-sm font-semibold bg-[#0d5b96] text-white rounded hover:bg-[#1A1A1A]"
                >
                  Send Order
                </button>
              </>
            )}
          </div>
        </div>

        {/* Vendor Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#212529] mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MdPhone className="text-[#212529] text-xl" />
                <div>
                  <p className="text-xs text-[#6C757D]">Phone</p>
                  <p className="text-[#212529] font-semibold">{vendor.phone}</p>
                </div>
              </div>
              {vendor.email && (
                <div className="flex items-center gap-3">
                  <MdEmail className="text-[#212529] text-xl" />
                  <div>
                    <p className="text-xs text-[#6C757D]">Email</p>
                    <p className="text-[#212529] font-semibold">
                      {vendor.email}
                    </p>
                  </div>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-start gap-3">
                  <MdLocationOn className="text-[#212529] text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6C757D]">Address</p>
                    <p className="text-[#212529] font-semibold">
                      {vendor.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-[#DEE2E6]">
        <div className="flex border-b border-[#DEE2E6]">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === "products"
                ? "text-[#0d5b96] border-b-2 border-[#0d5b96]"
                : "text-[#6C757D] hover:text-[#495057]"
              }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === "history"
                ? "text-[#0d5b96] border-b-2 border-[#0d5b96]"
                : "text-[#6C757D] hover:text-[#495057]"
              }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === "requests"
                ? "text-[#0d5b96] border-b-2 border-[#0d5b96]"
                : "text-[#6C757D] hover:text-[#495057]"
              }`}
          >
            Requests ({supplyRequests.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === "products" && <ProductsTab products={products} />}
          {activeTab === "history" && <OrderHistoryTab orders={orders} />}
          {activeTab === "requests" && (
            <SupplyRequestsTab
              requests={supplyRequests}
              onMarkReady={handleMarkRequestReady}
              onMarkDelivered={handleMarkDelivered}
              onMarkPaid={handleMarkPaid}
            />
          )}
        </div>
      </div>

      {isCompany && showEditModal && (
        <EditVendorModal
          vendor={vendor}
          onClose={() => setShowEditModal(false)}
          onVendorUpdated={handleVendorUpdated}
        />
      )}

      {isCompany && showOrderModal && (
        <SendOrderModal
          vendor={vendor}
          products={products}
          onClose={() => setShowOrderModal(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  );
};

// ============================================
// PRODUCTS TAB COMPONENT
// ============================================
const ProductsTab = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">No products supplied by this vendor</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#DEE2E6]">
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Product Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              SKU
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Category
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Price
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Stock
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-[#DEE2E6] hover:bg-[#F8F9FA]"
            >
              <td className="py-3 px-4 text-[#212529]">{product.name}</td>
              <td className="py-3 px-4 text-[#6C757D]">{product.sku}</td>
              <td className="py-3 px-4 text-[#6C757D]">
                {product.category?.name || "N/A"}
              </td>
              <td className="py-3 px-4 text-[#212529] font-semibold">
                ${product.price?.toFixed(2) || 0}
              </td>
              <td className="py-3 px-4">
                <span
                  className={
                    product.stock > 0 ? "text-[#28A745]" : "text-[#DC3545]"
                  }
                >
                  {product.stock || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// ORDER HISTORY TAB COMPONENT
// ============================================
const OrderHistoryTab = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">No order history with this vendor</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#DEE2E6]">
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Order ID
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Products
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Quantity
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Total Amount
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const vendorProducts =
              order.items?.filter((item) => item.product) || [];
            const totalQty = vendorProducts.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0,
            );
            const totalAmount = vendorProducts.reduce(
              (sum, item) =>
                sum +
                (item.subtotal ?? (item.unitPrice || 0) * (item.quantity || 0)),
              0,
            );

            return (
              <tr
                key={order._id}
                className="border-b border-[#DEE2E6] hover:bg-[#F8F9FA]"
              >
                <td className="py-3 px-4 text-[#212529] font-semibold">
                  {order._id?.slice(-6)}
                </td>
                <td className="py-3 px-4 text-[#6C757D] max-w-xs truncate">
                  {vendorProducts
                    .map((item) => item.product?.name || item.productName)
                    .join(", ") || "N/A"}
                </td>
                <td className="py-3 px-4 text-[#212529]">{totalQty}</td>
                <td className="py-3 px-4 text-[#212529] font-semibold">
                  ${totalAmount.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "completed"
                        ? "bg-[#D4EDDA] text-[#155724]"
                        : order.status === "pending"
                          ? "bg-[#FFF3CD] text-[#856404]"
                          : order.status === "cancelled"
                            ? "bg-[#F8D7DA] text-[#721C24]"
                            : "bg-[#E2E3E5] text-[#383D41]"
                      }`}
                  >
                    {order.status || "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#6C757D]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// SUPPLY REQUESTS TAB COMPONENT
// ============================================
const SupplyRequestsTab = ({
  requests,
  onMarkReady,
  onMarkDelivered,
  onMarkPaid,
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6C757D]">No supply requests yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#DEE2E6]">
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Request
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Product
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Qty
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Amount
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Payment
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-[#6C757D]">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request._id}
              className="border-b border-[#DEE2E6] hover:bg-[#F8F9FA]"
            >
              <td className="py-3 px-4 text-[#212529] font-semibold">
                {request.requestNumber}
              </td>
              <td className="py-3 px-4 text-[#6C757D]">
                {request.productId?.name || "N/A"}
              </td>
              <td className="py-3 px-4 text-[#212529]">{request.quantity}</td>
              <td className="py-3 px-4 text-[#212529] font-semibold">
                ${Number(request.totalAmount || 0).toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${request.paymentStatus === "paid"
                      ? "bg-[#D4EDDA] text-[#155724]"
                      : "bg-[#FFF3CD] text-[#856404]"
                    }`}
                >
                  {request.paymentStatus || "unpaid"}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded text-xs font-semibold bg-[#E2E3E5] text-[#383D41]">
                  {request.status || "pending"}
                </span>
              </td>
              <td className="py-3 px-4">
                {(request.status === "pending" ||
                  request.status === "confirmed") && (
                    <button
                      onClick={() => onMarkReady(request._id)}
                      className="px-2 py-1 text-xs font-semibold bg-[#0d5b96] text-white rounded hover:bg-[#1A1A1A]"
                    >
                      Mark Ready
                    </button>
                  )}
                {request.status === "shipped" && (
                  <button
                    onClick={() => onMarkDelivered(request._id)}
                    className="px-2 py-1 text-xs font-semibold bg-[#28A745] text-white rounded hover:bg-[#218838]"
                  >
                    Mark Delivered
                  </button>
                )}
                {request.status === "delivered" &&
                  request.paymentStatus !== "paid" && (
                    <button
                      onClick={() => onMarkPaid(request._id)}
                      className="px-2 py-1 text-xs font-semibold bg-[#0d5b96] text-white rounded hover:bg-[#1A1A1A]"
                    >
                      Mark Paid
                    </button>
                  )}
                {request.paymentStatus === "paid" && (
                  <span className="text-xs text-[#155724]">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// EDIT VENDOR MODAL
// ============================================
const EditVendorModal = ({ vendor, onClose, onVendorUpdated }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    address: vendor?.address || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      toast.error("Name, phone, and address are required");
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateVendor(vendor._id, formData);
      onVendorUpdated(response.data);
    } catch (err) {
      toast.error(err.message || "Failed to update vendor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl border border-[#DEE2E6] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-[#212529]">Edit Vendor</h3>
          <button
            onClick={onClose}
            className="text-[#6C757D] hover:text-[#212529]"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Vendor name"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
          />
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
          />
          <textarea
            rows="3"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Address"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96] resize-none"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[#212529]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#0d5b96] text-white rounded-lg disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// SEND ORDER MODAL
// ============================================
const SendOrderModal = ({ vendor, products, onClose, onOrderCreated }) => {
  const user = AuthService.getUser();
  const company = AuthService.getCompany();

  const normalizeProduct = (item) => {
    const productId = item?._id || item?.id;
    if (!productId) return null;

    return {
      ...item,
      _id: productId,
      price: Number(item?.price || 0),
    };
  };

  const [availableProducts, setAvailableProducts] = useState(
    (products || []).map(normalizeProduct).filter(Boolean),
  );
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    expectedDeliveryDate: "",
    quotedPrice: 0,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const normalized = (products || []).map(normalizeProduct).filter(Boolean);
    setAvailableProducts(normalized);
  }, [products]);

  useEffect(() => {
    const loadFallbackProducts = async () => {
      if ((products || []).length > 0) return;

      try {
        setLoadingProducts(true);
        const response = await getProducts({ page: 1, limit: 200 });
        const normalized = (response.products || [])
          .map(normalizeProduct)
          .filter(Boolean);
        setAvailableProducts(normalized);
      } catch (err) {
        console.error("Failed to load products for order modal:", err);
        setAvailableProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadFallbackProducts();
  }, [products]);

  useEffect(() => {
    if (formData.productId || availableProducts.length === 0) return;

    const firstProduct = availableProducts[0];
    setFormData((prev) => ({
      ...prev,
      productId: firstProduct._id,
      quotedPrice: firstProduct.price || 0,
    }));
  }, [availableProducts, formData.productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productId ||
      !formData.quantity ||
      !formData.expectedDeliveryDate ||
      !formData.quotedPrice
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      setSubmitting(true);
      await createVendorSupplyRequest(vendor._id, {
        ...formData,
        quantity: Number(formData.quantity),
        quotedPrice: Number(formData.quotedPrice),
        shopName: company?.name || "",
        ownerName: user?.name || "",
        ownerEmail: user?.email || "",
        ownerPhone: user?.phone || "",
      });
      await onOrderCreated();
    } catch (err) {
      toast.error(err.message || "Failed to create supply request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-[#DEE2E6] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-[#212529]">
            Send Order to {vendor.name}
          </h3>
          <button
            onClick={onClose}
            className="text-[#6C757D] hover:text-[#212529]"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#212529] mb-1">
              Product
            </label>
            <select
              value={formData.productId}
              disabled={loadingProducts || availableProducts.length === 0}
              onChange={(e) => {
                const product = availableProducts.find(
                  (item) => item._id === e.target.value,
                );
                setFormData((prev) => ({
                  ...prev,
                  productId: e.target.value,
                  quotedPrice: product?.price || prev.quotedPrice,
                }));
              }}
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
            >
              <option value="">
                {loadingProducts ? "Loading products..." : "Select product"}
              </option>
              {availableProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
            {!loadingProducts && availableProducts.length === 0 && (
              <p className="text-[12px] text-[#DC3545] mt-2">
                No products found. Add products first, then send order request.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
              }
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-1">
              Quoted Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.quotedPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quotedPrice: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#212529] mb-1">
              Expected Delivery
            </label>
            <input
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expectedDeliveryDate: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#212529] mb-1">
              Notes
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96] resize-none"
              placeholder="Any additional instructions"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[#212529]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                submitting || loadingProducts || availableProducts.length === 0
              }
              className="px-4 py-2 bg-[#0d5b96] text-white rounded-lg disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// ADD VENDOR FORM COMPONENT (INLINE)
// ============================================
const AddVendorForm = ({ onClose, onVendorAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError("Vendor name is required");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }

    // Phone validation - simple check
    if (!/^\d{10,}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    try {
      setLoading(true);
      const response = await createVendor(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      // Close form after successful submission
      setTimeout(() => {
        onVendorAdded();
      }, 500);
    } catch (err) {
      console.error("Error creating vendor:", err);
      setError(err.message || "Failed to create vendor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#212529]">Add New Vendor</h2>
        <p className="text-[#6C757D] mt-2">Fill in the vendor details below</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 text-sm text-[#721C24]">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-[#D4EDDA] border border-[#C3E6CB] rounded-lg p-4 text-sm text-[#155724]">
          Vendor created successfully!
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Vendor Name */}
          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-2">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter vendor name"
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#212529] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
              disabled={loading}
            />
          </div>

          {/* Placeholder for grid alignment */}
          <div></div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#212529] mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter vendor address"
            rows="4"
            className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] resize-none"
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#E9ECEF] text-[#212529] font-semibold rounded-lg hover:bg-[#DEE2E6] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0d5b96] text-white font-semibold rounded-lg hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
};
