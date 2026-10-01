import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdArrowBack,
  MdClose,
  MdDownload,
  MdPrint,
  MdReceiptLong,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { formatCurrency } from "../../constants/pos";
import { AuthService, getBillingHistory } from "../../api";

const PAGE_SIZE = 10;

const BRAND = {
  name: "Exostock",
  tagline: "Powered by Exostock",
  navy: "#1a2535",
};

// Every invoice belongs to a company/seller on the Exostock platform.
// Resolve that company's details from the order; fall back to a placeholder
// only if the order genuinely has none attached.
const getCompany = (order) => {
  const company = AuthService.getCompany() || {};

  const vendor = order?.company || order?.vendor || order?.store || {};

  return {
    name:
      company.company_name ||
      vendor.name ||
      vendor.companyName ||
      order?.companyName ||
      "Unknown Seller",

    address:
      company.address ||
      vendor.address ||
      order?.companyAddress ||
      "",

    email:
      company.email ||
      vendor.email ||
      order?.companyEmail ||
      "",

    phone:
      company.phone ||
      vendor.phone ||
      order?.companyPhone ||
      "",
  };
};

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

const formatPlainAmount = (amount) => `$${Number(amount || 0).toFixed(2)}`;

const getInvoiceNumber = (order) =>
  order?.invoiceNumber || order?.orderNumber || "N/A";

const getProductNames = (items = []) =>
  items
    .map((item) => item.productName || item.product?.name || "Product")
    .join(", ");

const getProductQuantities = (items = []) =>
  items.map((item) => item.quantity).join(", ");

const getStatusClass = (status) => {
  const value = (status || "").toLowerCase();
  if (value === "paid") return "status-paid";
  if (value === "pending") return "status-pending";
  if (value === "failed" || value === "refunded") return "status-bad";
  return "";
};

const getInvoiceStyles = () => `
  .sheet { max-width: 820px; margin: 24px auto; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #E4E8EE; box-shadow: 0 8px 28px rgba(26,37,53,0.08); font-family: Arial, sans-serif; color: #1a2535; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; background: #1a2535; color: #fff; padding: 22px 28px; }
  .header .brand { display: flex; align-items: center; gap: 12px; }
  .logo { width: 44px; height: 44px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #1a2535; font-weight: 800; font-size: 17px; flex-shrink: 0; }
  .header h1 { margin: 0; font-size: 19px; letter-spacing: 0.3px; }
  .header .sub { font-size: 11.5px; opacity: 0.7; margin-top: 3px; max-width: 420px; }
  .platform-badge { font-size: 10px; font-weight: 700; background: #AE4329; color: #fff; padding: 5px 11px; border-radius: 999px; white-space: nowrap; margin-top: 2px; }
  .body { padding: 28px; }
  .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px 24px; padding-bottom: 22px; border-bottom: 1px solid #E4E8EE; margin-bottom: 24px; }
  .info-grid .label { color: #0d5b96; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
  .info-grid .value { color: #1a2535; font-size: 15px; font-weight: 600; text-transform: capitalize; }
  .status-paid { color: #2E7D32; }
  .status-pending { color: #B7791F; }
  .status-bad { color: #DC3545; }
  h3.section-title { font-size: 13px; margin: 0; padding: 14px 18px; background: #F8F9FA; border-bottom: 1px solid #E4E8EE; color: #1a2535; font-weight: 700; }
  .table-wrap { border: 1px solid #E4E8EE; border-radius: 10px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #F8F9FA; }
  th { padding: 11px 18px; text-align: left; font-size: 11px; font-weight: 700; color: #0d5b96; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #E4E8EE; }
  td { padding: 13px 18px; font-size: 13.5px; color: #1a2535; border-bottom: 1px solid #F1F3F5; }
  .totals { width: 320px; margin-left: auto; margin-top: 22px; border: 1px solid #E4E8EE; border-radius: 10px; overflow: hidden; }
  .totals .row { display: flex; justify-content: space-between; padding: 12px 18px; font-size: 13.5px; color: #0d5b96; font-weight: 600; border-bottom: 1px solid #F1F3F5; }
  .totals .row span:last-child { color: #1a2535; font-weight: 600; }
  .totals .grand { background: #1a2535; color: #fff; font-weight: 800; font-size: 15px; border-bottom: none; }
  .totals .grand span { color: #fff !important; }
  .footer { text-align: center; padding: 16px; border-top: 1px solid #E4E8EE; color: #ADB5BD; font-size: 11px; }
`;

const getInvoiceSheetMarkup = (order) => {
  const company = getCompany(order);
  const rows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td>${item.productName || item.product?.name || "Product"}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitPrice || 0)}</td>
          <td>${formatCurrency(item.subtotal || item.quantity * item.unitPrice)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div class="sheet">
      <div class="header">
        <div class="brand">
          <div class="logo">${company.name.charAt(0).toUpperCase()}</div>
          <div>
            <h1>${company.name}</h1>
            <div class="sub">${[company.address, company.phone, company.email].filter(Boolean).join(" &nbsp;|&nbsp; ")}</div>
          </div>
        </div>
        <div class="platform-badge">${BRAND.tagline}</div>
      </div>
      <div class="body">
        <div class="info-grid">
          <div><div class="label">Invoice Number</div><div class="value">${getInvoiceNumber(order)}</div></div>
          <div><div class="label">Customer</div><div class="value">${order.customerName || "Walk-in Customer"}</div></div>
          <div><div class="label">Billing Date</div><div class="value">${formatDate(order.billingDate || order.createdAt)}</div></div>
          <div><div class="label">Payment Status</div><div class="value ${getStatusClass(order.paymentStatus)}">${order.paymentStatus || "N/A"}</div></div>
          <div><div class="label">Payment Method</div><div class="value">${order.paymentMethod || "N/A"}</div></div>
          <div><div class="label">Grand Total</div><div class="value">${formatCurrency(order.total || 0)}</div></div>
        </div>

        <div class="table-wrap">
          <h3 class="section-title">Products</h3>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="totals">
          <div class="row"><span>Subtotal</span><span>${formatCurrency(order.subtotal || 0)}</span></div>
          <div class="row"><span>GST</span><span>${formatCurrency(order.tax || 0)}</span></div>
          <div class="row"><span>Discount</span><span>${formatCurrency(order.discount || 0)}</span></div>
          <div class="row grand"><span>Grand Total</span><span>${formatCurrency(order.total || 0)}</span></div>
        </div>
      </div>
      <div class="footer">Thank you for choosing ${company.name}. This is a system-generated invoice. ${BRAND.tagline}.</div>
    </div>
  `;
};

const buildInvoiceHtml = (order) => `
  <!doctype html>
  <html>
    <head>
      <title>Invoice ${getInvoiceNumber(order)}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #1a2535; margin: 0; background: #F1F3F5; }
        ${getInvoiceStyles()}
        @media print { body { background: #fff; } .sheet { margin: 0; border: none; border-radius: 0; box-shadow: none; } }
      </style>
    </head>
    <body>
      ${getInvoiceSheetMarkup(order)}
    </body>
  </html>
`;

const BillingHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: PAGE_SIZE,
  });
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    paymentStatus: "",
    paymentMethod: "",
    sort: "newest",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const query = useMemo(
    () => ({
      ...filters,
      page: pagination.page,
      limit: PAGE_SIZE,
    }),
    [filters, pagination.page],
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getBillingHistory(query);
        setOrders(response.data || []);
        setPagination(
          response.pagination || {
            total: 0,
            page: 1,
            pages: 1,
            limit: PAGE_SIZE,
          },
        );
      } catch (err) {
        setError(err.message || "Failed to load billing history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [query]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const changePage = (page) => {
    if (page < 1 || page > pagination.pages) return;
    setPagination((current) => ({ ...current, page }));
  };

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.write(buildInvoiceHtml(order));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadPdf = (order) => {
    const doc = new jsPDF();
    const company = getCompany(order);
    const invoiceNumber = getInvoiceNumber(order);
    const navy = [26, 37, 53];

    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 26, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.text(company.name, 14, 12);
    doc.setFontSize(8);
    doc.text(
      [company.address, company.phone, company.email].filter(Boolean).join("  |  "),
      14,
      19,
    );
    doc.setFontSize(7);
    doc.setTextColor(174, 67, 41);
    doc.text(BRAND.tagline, 196, 8, { align: "right" });

    doc.setTextColor(26, 37, 53);
    const info = [
      ["Invoice Number", invoiceNumber],
      ["Customer", order.customerName || "Walk-in Customer"],
      ["Billing Date", formatDate(order.billingDate || order.createdAt)],
      ["Payment Status", order.paymentStatus || "N/A"],
      ["Payment Method", order.paymentMethod || "N/A"],
      ["Grand Total", formatPlainAmount(order.total)],
    ];
    let y = 34;
    info.forEach(([label, value], index) => {
      const x = 14 + (index % 3) * 65;
      const row = Math.floor(index / 3);
      doc.setFontSize(7.5);
      doc.setTextColor(108, 117, 125);
      doc.text(label.toUpperCase(), x, y + row * 16);
      doc.setFontSize(11);
      doc.setTextColor(26, 37, 53);
      doc.text(String(value), x, y + row * 16 + 6);
    });

    autoTable(doc, {
      startY: y + 24,
      head: [["Product", "Quantity", "Price", "Subtotal"]],
      body: (order.items || []).map((item) => [
        item.productName || item.product?.name || "Product",
        item.quantity,
        formatPlainAmount(item.unitPrice),
        formatPlainAmount(item.subtotal || item.quantity * item.unitPrice),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [248, 249, 250], textColor: navy, fontStyle: "bold" },
      theme: "grid",
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(26, 37, 53);
    doc.text(`Subtotal: ${formatPlainAmount(order.subtotal)}`, 140, finalY);
    doc.text(`GST: ${formatPlainAmount(order.tax)}`, 140, finalY + 7);
    doc.text(`Discount: ${formatPlainAmount(order.discount)}`, 140, finalY + 14);

    doc.setFillColor(...navy);
    doc.rect(136, finalY + 19, 60, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`Grand Total: ${formatPlainAmount(order.total)}`, 140, finalY + 26);

    doc.save(`${invoiceNumber}.pdf`);
  };

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
              onClick={() => navigate("/billing")}
              className="flex items-center gap-2 text-[#212529] hover:text-[#0d5b96] text-[14px] font-semibold mb-4 transition-colors"
            >
              <MdArrowBack className="text-[18px]" />
              Back to Billing
            </button>
            <h1 className="text-[28px] font-bold text-[#212529] mb-2">
              Billing History
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              Completed orders from the existing Orders collection.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#DEE2E6] p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Search
                </label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6C757D]" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(event) =>
                      updateFilter("search", event.target.value)
                    }
                    placeholder="Invoice number or customer name"
                    className="w-full h-[42px] pl-10 pr-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <FilterInput
                label="Date"
                type="date"
                value={filters.date}
                onChange={(value) => updateFilter("date", value)}
              />
              <FilterSelect
                label="Payment Status"
                value={filters.paymentStatus}
                onChange={(value) => updateFilter("paymentStatus", value)}
                options={[
                  ["paid", "Paid"],
                  ["pending", "Pending"],
                  ["failed", "Failed"],
                  ["refunded", "Refunded"],
                ]}
              />
              <FilterSelect
                label="Payment Method"
                value={filters.paymentMethod}
                onChange={(value) => updateFilter("paymentMethod", value)}
                options={[
                  ["online", "Online"],
                  ["cash", "Cash"],
                ]}
              />
              <FilterSelect
                label="Sort"
                value={filters.sort}
                onChange={(value) => updateFilter("sort", value)}
                options={[
                  ["newest", "Newest First"],
                  ["oldest", "Oldest First"],
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center justify-between gap-4">
              <h2 className="text-[16px] font-semibold text-[#212529]">
                Completed Bills
              </h2>
              <span className="text-[12px] text-[#6C757D]">
                {pagination.total} records
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-[14px] text-[#6C757D]">
                Loading billing history...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-[14px] text-[#DC3545]">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <MdReceiptLong className="text-[36px] text-[#ADB5BD] mx-auto mb-3" />
                <p className="text-[14px] text-[#6C757D]">
                  No Billing History Found
                </p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead className="bg-[#F8F9FA] border-b border-[#DEE2E6]">
                      <tr>
                        {[
                          "Invoice Number",
                          "Customer Name",
                          "Product Names",
                          "Product Quantity",
                          "Subtotal",
                          "GST",
                          "Discount",
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
                      {orders.map((order) => (
                        <HistoryRow
                          key={order._id}
                          order={order}
                          onView={setSelectedInvoice}
                          onPrint={handlePrint}
                          onDownload={handleDownloadPdf}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden divide-y divide-[#DEE2E6]">
                  {orders.map((order) => (
                    <div key={order._id} className="p-4 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[14px] font-semibold text-[#212529]">
                            {getInvoiceNumber(order)}
                          </p>
                          <p className="text-[12px] text-[#6C757D]">
                            {order.customerName || "Walk-in Customer"}
                          </p>
                        </div>
                        <p className="text-[14px] font-bold text-[#212529]">
                          {formatCurrency(order.total || 0)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[12px]">
                        <Info
                          label="Products"
                          value={getProductNames(order.items)}
                        />
                        <Info
                          label="Quantity"
                          value={getProductQuantities(order.items)}
                        />
                        <Info
                          label="Payment"
                          value={`${order.paymentMethod || "N/A"} / ${order.paymentStatus || "N/A"}`}
                        />
                        <Info
                          label="Date"
                          value={formatDate(
                            order.billingDate || order.createdAt,
                          )}
                        />
                      </div>
                      <RowActions
                        order={order}
                        onView={setSelectedInvoice}
                        onPrint={handlePrint}
                        onDownload={handleDownloadPdf}
                      />
                    </div>
                  ))}
                </div>

                <div className="px-4 sm:px-6 py-4 border-t border-[#DEE2E6] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[12px] text-[#6C757D]">
                    Page {pagination.page} of {pagination.pages || 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="h-9 px-3 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`h-9 min-w-9 px-3 rounded-lg text-[13px] font-semibold ${page === pagination.page
                            ? "bg-[#0d5b96] text-white"
                            : "border border-[#DEE2E6] text-[#212529]"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="h-9 px-3 border border-[#DEE2E6] rounded-lg text-[13px] font-semibold text-[#212529] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPrint={handlePrint}
          onDownload={handleDownloadPdf}
        />
      )}
    </div>
  );
};

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
      <option value="">All</option>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </div>
);

const HistoryRow = ({ order, onView, onPrint, onDownload }) => (
  <tr className="hover:bg-[#F8F9FA] transition-colors">
    <td className="px-4 py-4 text-[13px] font-semibold text-[#212529]">
      {getInvoiceNumber(order)}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">
      {order.customerName || "Walk-in Customer"}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#6C757D] max-w-[220px] truncate">
      {getProductNames(order.items)}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#6C757D] max-w-[220px] truncate">
      {getProductQuantities(order.items)}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">
      {formatCurrency(order.subtotal || 0)}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">
      {formatCurrency(order.tax || 0)}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#212529]">
      {formatCurrency(order.discount || 0)}
    </td>
    <td className="px-4 py-4 text-[13px] font-bold text-[#212529]">
      {formatCurrency(order.total || 0)}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#212529] capitalize">
      {order.paymentMethod || "N/A"}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#212529] capitalize">
      {order.paymentStatus || "N/A"}
    </td>
    <td className="px-4 py-4 text-[13px] text-[#6C757D]">
      {formatDate(order.billingDate || order.createdAt)}
    </td>
    <td className="px-4 py-4">
      <RowActions
        order={order}
        onView={onView}
        onPrint={onPrint}
        onDownload={onDownload}
        compact
      />
    </td>
  </tr>
);

const RowActions = ({
  order,
  onView,
  onPrint,
  onDownload,
  compact = false,
}) => (
  <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
    <button
      onClick={() => onView(order)}
      title="View Invoice"
      className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
    >
      <MdVisibility className="text-[18px]" />
    </button>
    <button
      onClick={() => onPrint(order)}
      title="Print Invoice"
      className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
    >
      <MdPrint className="text-[18px]" />
    </button>
    <button
      onClick={() => onDownload(order)}
      title="Download PDF"
      className="h-9 w-9 flex items-center justify-center bg-[#0d5b96] rounded-lg text-white hover:bg-[#1A1A1A]"
    >
      <MdDownload className="text-[18px]" />
    </button>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6C757D] mb-1">
      {label}
    </p>
    <p className="text-[12px] text-[#212529] break-words">{value || "N/A"}</p>
  </div>
);

const statusColor = (status) => {
  const value = (status || "").toLowerCase();
  if (value === "paid") return "text-[#2E7D32]";
  if (value === "pending") return "text-[#B7791F]";
  if (value === "failed" || value === "refunded") return "text-[#DC3545]";
  return "text-[#1a2535]";
};

const InvoiceModal = ({ order, onClose, onPrint, onDownload }) => {
  const company = getCompany(order);
  const contactLine = [company.phone, company.email]
    .filter(Boolean)
    .join("  •  ");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-10000 bg-black/60 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-[880px] max-h-[92vh] overflow-hidden shadow-2xl my-auto flex flex-col">
        <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
          {/* Header */}
          <div className="bg-[#1a2535] px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#1a2535] font-extrabold text-[18px]">
                  {company.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-[18px] font-bold text-white truncate">
                  {company.name}
                </h1>
                {company.address && (
                  <p className="text-[11.5px] text-white/60 truncate max-w-[480px]">
                    {company.address}
                  </p>
                )}

                {contactLine && (
                  <p className="text-[11.5px] text-white/60 truncate max-w-[480px]">
                    {contactLine}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] font-semibold bg-[#AE4329] text-white px-2.5 py-1 rounded-full whitespace-nowrap">
                {BRAND.tagline}
              </span>
              <button
                onClick={onClose}
                className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <MdClose className="text-[18px]" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5 pb-6 border-b border-[#E4E8EE]">
              <InfoField label="Invoice Number" value={getInvoiceNumber(order)} />
              <InfoField
                label="Customer"
                value={order.customerName || "Walk-in Customer"}
              />
              <InfoField
                label="Billing Date"
                value={formatDate(order.billingDate || order.createdAt)}
              />
              <InfoField
                label="Payment Status"
                value={order.paymentStatus || "N/A"}
                valueClassName={statusColor(order.paymentStatus)}
                capitalize
              />
              <InfoField
                label="Payment Method"
                value={order.paymentMethod || "N/A"}
                capitalize
              />
              <InfoField
                label="Grand Total"
                value={formatCurrency(order.total || 0)}
              />
            </div>

            {/* Products */}
            <div className="border border-[#E4E8EE] rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-[#F8F9FA] border-b border-[#E4E8EE]">
                <h3 className="text-[14px] font-bold text-[#1a2535]">Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-white">
                    <tr>
                      {["Product", "Quantity", "Price", "Subtotal"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#6C757D] border-b border-[#E4E8EE]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, index) => (
                      <tr
                        key={`${item.product || item.productName}-${index}`}
                        className="border-b border-[#F1F3F5] last:border-b-0"
                      >
                        <td className="px-5 py-3 text-[13px] text-[#1a2535]">
                          {item.productName || item.product?.name || "Product"}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#1a2535]">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#1a2535]">
                          {formatCurrency(item.unitPrice || 0)}
                        </td>
                        <td className="px-5 py-3 text-[13px] font-semibold text-[#1a2535]">
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

            {/* Totals */}
            <div className="ml-auto max-w-[340px] border border-[#E4E8EE] rounded-xl overflow-hidden">
              <SummaryLine
                label="Subtotal"
                value={formatCurrency(order.subtotal || 0)}
              />
              <SummaryLine label="GST" value={formatCurrency(order.tax || 0)} />
              <SummaryLine
                label="Discount"
                value={formatCurrency(order.discount || 0)}
              />
              <SummaryLine
                label="Grand Total"
                value={formatCurrency(order.total || 0)}
                grand
              />
            </div>

            <p className="text-center text-[12px] text-[#ADB5BD]">
              Thank you for choosing {company.name}. This is a system-generated invoice. {BRAND.tagline}.
            </p>
          </div>

          <div className="px-6 sm:px-8 py-5 border-t border-[#E4E8EE] flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => onPrint(order)}
              className="h-10 px-4 border border-[#1a2535]/20 rounded-lg text-[13px] font-semibold text-[#1a2535] hover:bg-[#F8F9FA] flex items-center justify-center gap-2"
            >
              <MdPrint className="text-[18px]" />
              Print Invoice
            </button>
            <button
              onClick={() => onDownload(order)}
              className="h-10 px-4 bg-[#1a2535] rounded-lg text-[13px] font-semibold text-white hover:bg-[#0d5b96] flex items-center justify-center gap-2"
            >
              <MdDownload className="text-[18px]" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const InfoField = ({ label, value, valueClassName = "", capitalize = false }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#6C757D] mb-1">
      {label}
    </p>
    <p
      className={`text-[14px] font-semibold text-[#1a2535] ${valueClassName} ${capitalize ? "capitalize" : ""
        }`}
    >
      {value}
    </p>
  </div>
);

const SummaryLine = ({ label, value, grand = false }) => (
  <div
    className={`flex items-center justify-between gap-4 px-5 py-3 ${grand
        ? "bg-[#1a2535] text-white"
        : "bg-white border-b border-[#F1F3F5]"
      }`}
  >
    <span
      className={`text-[13px] ${grand ? "font-bold text-[15px]" : "text-[#6C757D]"}`}
    >
      {label}
    </span>
    <span
      className={`text-[13px] ${grand ? "font-bold text-[15px]" : "font-semibold text-[#1a2535]"
        }`}
    >
      {value}
    </span>
  </div>
);

export default BillingHistoryPage;
