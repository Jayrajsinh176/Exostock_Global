import { useEffect, useMemo, useState } from "react";
import {
  MdArrowBack,
  MdClose,
  MdImage,
  MdReceiptLong,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { formatCurrency } from "../constants/pos";
import { getProductDetails } from "../api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const PAGE_SIZE = 10;

const tabs = ["Overview", "Sales History", "Stock Movement", "Vendor Details"];

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [details, setDetails] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: PAGE_SIZE,
  });
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    sort: "newest",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const query = useMemo(
    () => ({ ...filters, page: pagination.page, limit: PAGE_SIZE }),
    [filters, pagination.page],
  );

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getProductDetails(id, query);
        setDetails(response.data);
        setPagination(
          response.data?.pagination || {
            total: 0,
            page: 1,
            pages: 1,
            limit: PAGE_SIZE,
          },
        );
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, query]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const changePage = (page) => {
    if (page < 1 || page > (pagination.pages || 1)) return;
    setPagination((current) => ({ ...current, page }));
  };

  const product = details?.product;
  const pageNumbers = Array.from(
    { length: pagination.pages || 1 },
    (_, index) => index + 1,
  );

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-[#212529] hover:text-[#0d5b96] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Products
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              Product Details
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              Inventory, sales, and vendor record.
            </p>
          </div>

          {loading && !details ? (
            <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 text-center text-[14px] text-[#6C757D]">
              Loading product details...
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-[#DEE2E6] p-8 text-center text-[14px] text-[#DC3545]">
              {error}
            </div>
          ) : product ? (
            <>
              <ProductHero product={product} />

              <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
                <div className="px-4 sm:px-6 bg-[#F8F9FA] border-b border-[#DEE2E6] overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-max">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-4 text-[13px] font-semibold border-b-2 transition-colors ${
                          activeTab === tab
                            ? "border-[#0d5b96] text-[#0d5b96]"
                            : "border-transparent text-[#6C757D] hover:text-[#212529]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {activeTab === "Overview" && (
                    <OverviewTab
                      product={product}
                      overview={details.overview}
                    />
                  )}
                  {activeTab === "Sales History" && (
                    <SalesHistoryTab
                      sales={details.salesHistory || []}
                      filters={filters}
                      pagination={pagination}
                      pageNumbers={pageNumbers}
                      loading={loading}
                      onFilterChange={updateFilter}
                      onPageChange={changePage}
                      onViewInvoice={setSelectedInvoice}
                    />
                  )}
                  {activeTab === "Stock Movement" && (
                    <StockMovementTab movements={details.stockMovement || []} />
                  )}
                  {activeTab === "Vendor Details" && (
                    <VendorTab vendor={product.vendor} />
                  )}
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

const ProductHero = ({ product }) => (
  <div className="bg-white rounded-lg border border-[#DEE2E6] p-4 sm:p-6 mb-6">
    <div className="grid grid-cols-1 xl:grid-cols-[180px_1fr] gap-6">
      <ProductImage image={product.image} name={product.name} />
      <div>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
          <div>
            <p className="text-[12px] uppercase font-semibold tracking-[0.08em] text-[#6C757D] mb-2">
              {product.sku || "N/A"}
            </p>
            <h2 className="text-[24px] font-bold text-[#212529]">
              {product.name}
            </h2>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Info label="Category" value={product.category?.name || "N/A"} />
          <Info label="Vendor" value={product.vendor?.name || "N/A"} />
          <Info
            label="Selling Price"
            value={formatCurrency(product.price || 0)}
          />
          <Info
            label="Cost Price"
            value={formatCurrency(product.costPrice || 0)}
          />
          <Info label="Current Stock" value={product.stock ?? 0} />
          <Info
            label="Inventory Value"
            value={formatCurrency(product.inventoryValue || 0)}
          />
          <Info label="Created Date" value={formatDate(product.createdAt)} />
          <Info label="Updated Date" value={formatDate(product.updatedAt)} />
        </div>
      </div>
    </div>
  </div>
);

const ProductImage = ({ image, name }) => {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const imageUrl = image?.startsWith("http")
    ? image
    : `${API_BASE_URL}${image || ""}`;

  if (!image || imageUnavailable) {
    return (
      <div className="h-[180px] w-full xl:w-[180px] rounded-lg border border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-center text-[#ADB5BD]">
        <MdImage className="text-[42px]" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name || "Product"}
      onError={() => setImageUnavailable(true)}
      className="h-[180px] w-full xl:w-[180px] rounded-lg border border-[#DEE2E6] object-cover bg-[#F8F9FA]"
    />
  );
};

const OverviewTab = ({ product, overview }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <InfoCard label="Product Information" value={product.name} />
    <InfoCard label="Current Stock" value={product.stock ?? 0} />
    <InfoCard
      label="Selling Price"
      value={formatCurrency(product.price || 0)}
    />
    <InfoCard
      label="Cost Price"
      value={formatCurrency(product.costPrice || 0)}
    />
    <InfoCard
      label="Inventory Value"
      value={formatCurrency(product.inventoryValue || 0)}
    />
    <InfoCard label="Total Units Sold" value={overview?.totalUnitsSold || 0} />
    <InfoCard
      label="Total Revenue Generated"
      value={formatCurrency(overview?.totalRevenueGenerated || 0)}
    />
    <InfoCard
      label="Profit Per Unit"
      value={formatCurrency(overview?.profitPerUnit || 0)}
    />
    <InfoCard label="Product Status" value={product.status || "N/A"} />
  </div>
);

const SalesHistoryTab = ({
  sales,
  filters,
  pagination,
  pageNumbers,
  loading,
  onFilterChange,
  onPageChange,
  onViewInvoice,
}) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="md:col-span-2">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
          Search
        </label>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6C757D]" />
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Invoice number or customer name"
            className="w-full h-[42px] pl-10 pr-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
          />
        </div>
      </div>
      <FilterInput
        label="Date"
        type="date"
        value={filters.date}
        onChange={(value) => onFilterChange("date", value)}
      />
      <FilterSelect
        label="Sort"
        value={filters.sort}
        onChange={(value) => onFilterChange("sort", value)}
        options={[
          ["newest", "Newest First"],
          ["oldest", "Oldest First"],
        ]}
      />
    </div>

    <div className="border border-[#DEE2E6] rounded-lg overflow-hidden">
      {loading ? (
        <div className="p-8 text-center text-[14px] text-[#6C757D]">
          Loading sales history...
        </div>
      ) : sales.length === 0 ? (
        <div className="p-8 text-center">
          <MdReceiptLong className="text-[36px] text-[#ADB5BD] mx-auto mb-3" />
          <p className="text-[14px] text-[#6C757D]">No Sales History Found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#F8F9FA] border-b border-[#DEE2E6]">
                <tr>
                  {[
                    "Invoice Number",
                    "Customer Name",
                    "Quantity Sold",
                    "Unit Price",
                    "Total Amount",
                    "Payment Method",
                    "Payment Status",
                    "Billing Date",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                {sales.map((sale) => (
                  <tr
                    key={`${sale.orderId}-${sale.invoiceNumber}`}
                    className="hover:bg-[#F8F9FA] transition-colors"
                  >
                    <td className="px-4 py-4 text-[13px] font-semibold text-[#212529]">
                      {sale.invoiceNumber || sale.orderNumber || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#212529]">
                      {sale.customerName || "Walk-in Customer"}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#212529]">
                      {sale.quantitySold}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#212529]">
                      {formatCurrency(sale.unitPrice || 0)}
                    </td>
                    <td className="px-4 py-4 text-[13px] font-semibold text-[#212529]">
                      {formatCurrency(sale.totalAmount || 0)}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#212529] capitalize">
                      {sale.paymentMethod || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#212529] capitalize">
                      {sale.paymentStatus || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#6C757D]">
                      {formatDate(sale.billingDate)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => onViewInvoice(sale)}
                        title="View Invoice"
                        className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
                      >
                        <MdVisibility className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            pagination={pagination}
            pageNumbers={pageNumbers}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  </div>
);

const StockMovementTab = ({ movements }) => (
  <div className="border border-[#DEE2E6] rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead className="bg-[#F8F9FA] border-b border-[#DEE2E6]">
          <tr>
            {["Date", "Action", "Quantity", "Remaining Stock"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DEE2E6]">
          {movements.map((movement, index) => (
            <tr
              key={`${movement.date}-${index}`}
              className="hover:bg-[#F8F9FA] transition-colors"
            >
              <td className="px-4 py-4 text-[13px] text-[#6C757D]">
                {formatDate(movement.date)}
              </td>
              <td className="px-4 py-4 text-[13px] font-semibold text-[#212529]">
                {movement.action}
                {movement.notes && (
                  <p className="mt-1 text-[12px] font-normal text-[#6C757D]">
                    {movement.notes}
                  </p>
                )}
              </td>
              <td
                className={`px-4 py-4 text-[13px] font-semibold ${movement.quantity < 0 ? "text-[#DC3545]" : "text-[#28A745]"}`}
              >
                {movement.quantity > 0
                  ? `+${movement.quantity}`
                  : movement.quantity}
              </td>
              <td className="px-4 py-4 text-[13px] text-[#212529]">
                {movement.remainingStock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const VendorTab = ({ vendor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <InfoCard label="Vendor Name" value={vendor?.name || "N/A"} />
    <InfoCard label="Phone" value={vendor?.phone || "N/A"} />
    <InfoCard label="Email" value={vendor?.email || "N/A"} />
    <InfoCard label="Address" value={vendor?.address || "N/A"} />
    <InfoCard
      label="Company"
      value={vendor?.company || vendor?.companyName || "N/A"}
    />
    <InfoCard label="Vendor Status" value={vendor?.status || "N/A"} />
  </div>
);

const InvoiceModal = ({ order, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg border border-[#DEE2E6] w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
      <div className="px-5 py-4 border-b border-[#DEE2E6] flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#212529]">
            Invoice Details
          </h2>
          <p className="text-[13px] text-[#6C757D]">
            {order.invoiceNumber || order.orderNumber || "N/A"}
          </p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F8F9FA]">
          <MdClose className="text-[20px] text-[#212529]" />
        </button>
      </div>
      <div className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Info
            label="Invoice Number"
            value={order.invoiceNumber || order.orderNumber || "N/A"}
          />
          <Info
            label="Customer"
            value={order.customerName || "Walk-in Customer"}
          />
          <Info label="Billing Date" value={formatDate(order.billingDate)} />
          <Info label="Payment Status" value={order.paymentStatus || "N/A"} />
          <Info label="Payment Method" value={order.paymentMethod || "N/A"} />
          <Info
            label="Grand Total"
            value={formatCurrency(order.orderTotal || 0)}
          />
        </div>
        <div className="border border-[#DEE2E6] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#F8F9FA] border-b border-[#DEE2E6]">
            <h3 className="text-[14px] font-semibold text-[#212529]">
              Products
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  {["Product", "Quantity", "Price", "Subtotal"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D]"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                {(order.items || []).map((item) => (
                  <tr
                    key={`${item.product || item.productName}-${item.quantity}`}
                  >
                    <td className="px-4 py-3 text-[13px] text-[#212529]">
                      {item.productName || "Product"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#212529]">
                      {formatCurrency(
                        item.subtotal || item.quantity * item.unitPrice,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Pagination = ({ pagination, pageNumbers, onPageChange }) => (
  <div className="px-4 sm:px-6 py-4 border-t border-[#DEE2E6] flex flex-col sm:flex-row items-center justify-between gap-4">
    <p className="text-[12px] text-[#6C757D]">
      Page {pagination.page} of {pagination.pages || 1}
    </p>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="h-9 px-3 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] disabled:opacity-50"
      >
        Previous
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-9 min-w-9 px-3 rounded-lg text-[13px] font-semibold ${
            page === pagination.page
              ? "bg-[#0d5b96] text-white"
              : "border border-[#DEE2E6] text-[#212529]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.pages}
        className="h-9 px-3 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);

const FilterInput = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full h-[42px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full h-[42px] px-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
    >
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] mb-1">
      {label}
    </p>
    <p className="text-[13px] text-[#212529] break-words">
      {value === undefined || value === null || value === "" ? "N/A" : value}
    </p>
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg p-4">
    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] mb-2">
      {label}
    </p>
    <p className="text-[16px] font-semibold text-[#212529] break-words">
      {value === undefined || value === null || value === "" ? "N/A" : value}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusMap = {
    "In Stock": { bg: "#D4EDDA", text: "#155724", border: "#C3E6CB" },
    "Low Stock": { bg: "#FFF3CD", text: "#856404", border: "#FFEEBA" },
    "Out of Stock": { bg: "#F8D7DA", text: "#721C24", border: "#F5C6CB" },
  };
  const colors = statusMap[status] || statusMap["Out of Stock"];

  return (
    <span
      className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border uppercase"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {status || "N/A"}
    </span>
  );
};

export default ProductDetailsPage;
