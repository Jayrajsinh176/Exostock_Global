import { useEffect, useMemo, useState } from "react";
import { MdSearch, MdDownload } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { getStockTransferHistory, AuthService } from "../../api";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

const TYPE_BADGES = {
  sent: { label: "Sent", className: "bg-orange-100 text-orange-700" },
  received: { label: "Received", className: "bg-green-100 text-green-700" },
  distribution: { label: "Distribution", className: "bg-blue-100 text-blue-700" },
  return: { label: "Return", className: "bg-purple-100 text-purple-700" },
  interFranchise: { label: "Inter-Franchise", className: "bg-teal-100 text-teal-700" },
};

// A location that fails to populate is the Main Store (see StockTransferHistoryPage).
const isMainStore = (location) => !location || location.isDefault;

const getLocationName = (location) => location?.locationName || "Main Store";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN") : "-";

// The server already scopes franchise logins to transfers touching their own
// location, so they get Sent/Received; company viewers see every transfer and
// get the kind of movement instead.
const getTransferTypeKey = (transfer, { isFranchiseViewer, myLocationId }) => {
  if (isFranchiseViewer) {
    if (myLocationId && transfer.fromLocation?._id === myLocationId) return "sent";
    if (myLocationId && transfer.toLocation?._id === myLocationId) return "received";
    return null;
  }

  if (isMainStore(transfer.fromLocation)) return "distribution";
  if (isMainStore(transfer.toLocation)) return "return";
  return "interFranchise";
};

// Date inputs give "YYYY-MM-DD"; compare against local-day boundaries.
const isWithinRange = (value, fromDate, toDate) => {
  const time = new Date(value).getTime();
  if (fromDate && time < new Date(`${fromDate}T00:00:00`).getTime()) return false;
  if (toDate && time > new Date(`${toDate}T23:59:59.999`).getTime()) return false;
  return true;
};

const StockTransferReportsPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const isFranchiseViewer = AuthService.isFranchise();
  const myLocationId = isFranchiseViewer
    ? AuthService.getFranchise()?._id
    : AuthService.getUser()?.locationId;

  const typeOptions = isFranchiseViewer
    ? ["sent", "received"]
    : ["distribution", "return", "interFranchise"];

  useEffect(() => {
    let cancelled = false;

    const fetchReport = async () => {
      try {
        const response = await getStockTransferHistory();
        if (!cancelled) setTransfers(response.data || []);
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Failed to load stock transfer report");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReport();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(
    () =>
      transfers.map((transfer) => ({
        ...transfer,
        typeKey: getTransferTypeKey(transfer, { isFranchiseViewer, myLocationId }),
      })),
    [transfers, isFranchiseViewer, myLocationId],
  );

  const filteredTransfers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((transfer) => {
      if (type && transfer.typeKey !== type) return false;
      if (!isWithinRange(transfer.createdAt, fromDate, toDate)) return false;
      if (!term) return true;
      return (
        transfer.product?.name?.toLowerCase().includes(term) ||
        transfer.product?.sku?.toLowerCase().includes(term) ||
        getLocationName(transfer.fromLocation).toLowerCase().includes(term) ||
        getLocationName(transfer.toLocation).toLowerCase().includes(term) ||
        transfer.transferredBy?.name?.toLowerCase().includes(term)
      );
    });
  }, [rows, search, type, fromDate, toDate]);

  const totals = useMemo(
    () =>
      filteredTransfers.reduce(
        (sum, transfer) => {
          const quantity = transfer.quantity || 0;
          sum.quantity += quantity;
          if (transfer.typeKey) {
            sum.byType[transfer.typeKey] = (sum.byType[transfer.typeKey] || 0) + quantity;
          }
          return sum;
        },
        { quantity: 0, byType: {} },
      ),
    [filteredTransfers],
  );

  const handleDownloadPdf = () => {
    if (filteredTransfers.length === 0) {
      toast.error("No stock transfers to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const navy = [26, 37, 53];
    const gray = [108, 117, 125];
    const user = isFranchiseViewer ? AuthService.getFranchise() : AuthService.getUser();

    doc.setFontSize(18);
    doc.setTextColor(...navy);
    doc.text("Stock Transfer Report", 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(...gray);
    const meta = [`Generated on ${new Date().toLocaleString("en-IN")}`];
    if (user?.name) meta.push(`Generated by ${user.name}`);
    if (fromDate || toDate) {
      meta.push(`Period: ${fromDate || "Start"} to ${toDate || "Today"}`);
    }
    if (type) meta.push(`Type: ${TYPE_BADGES[type].label}`);
    doc.text(meta.join("   |   "), 14, 27);

    doc.text(
      [
        `Transfers: ${filteredTransfers.length}`,
        `Total Qty: ${totals.quantity}`,
        ...typeOptions.map(
          (key) => `${TYPE_BADGES[key].label} Qty: ${totals.byType[key] || 0}`,
        ),
      ].join("   |   "),
      14,
      33,
    );

    autoTable(doc, {
      startY: 39,
      head: [["#", "Date", "Type", "Product", "SKU", "From", "To", "Qty", "Transferred By", "Notes"]],
      body: filteredTransfers.map((transfer, index) => [
        String(index + 1),
        formatDate(transfer.createdAt),
        TYPE_BADGES[transfer.typeKey]?.label || "-",
        transfer.product?.name || "-",
        transfer.product?.sku || "-",
        getLocationName(transfer.fromLocation),
        getLocationName(transfer.toLocation),
        String(transfer.quantity ?? 0),
        transfer.transferredBy?.name || "-",
        transfer.notes || "-",
      ]),
      foot: [["", "", "", "", "", "", "Total", String(totals.quantity), "", ""]],
      styles: { fontSize: 8 },
      headStyles: { fillColor: navy, textColor: [255, 255, 255], fontStyle: "bold" },
      footStyles: { fillColor: [248, 249, 250], textColor: navy, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 9 },
        7: { halign: "right" },
      },
      theme: "grid",
      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(173, 181, 189);
        doc.text("Powered by Exostock", 14, pageHeight - 10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - 14,
          pageHeight - 10,
          { align: "right" },
        );
      },
    });

    doc.save(`stock-transfer-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529]">
                Stock Transfer Reports
              </h1>
              <p className="text-[14px] text-[#6C757D] mt-1">
                {isFranchiseViewer
                  ? "Stock sent from and received at your location."
                  : "All stock movements across your locations."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={loading || filteredTransfers.length === 0}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-[#0d5b96] text-white text-sm font-semibold hover:bg-[#0a4a7a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdDownload className="text-lg" />
              Download PDF
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Total Transfers" value={filteredTransfers.length} />
            {typeOptions.map((key) => (
              <SummaryCard
                key={key}
                label={`${TYPE_BADGES[key].label} Qty`}
                value={totals.byType[key] || 0}
              />
            ))}
            {isFranchiseViewer && (
              <SummaryCard label="Total Qty Moved" value={totals.quantity} />
            )}
          </div>

          {/* Card */}
          <div className="bg-white border border-[#DEE2E6] rounded-2xl shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-5 border-b border-[#DEE2E6] flex flex-col lg:flex-row lg:items-end gap-4">
              <div className="relative w-full lg:max-w-sm">
                <MdSearch className="absolute left-3 top-3 text-[#ADB5BD] text-lg" />
                <input
                  type="text"
                  placeholder="Search by product, location, or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:ml-auto">
                <label className="text-xs text-[#6C757D]">
                  Type
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 w-full h-11 px-3 border border-[#DEE2E6] rounded-lg text-sm text-[#212529] bg-white focus:outline-none focus:border-black"
                  >
                    <option value="">All</option>
                    {typeOptions.map((key) => (
                      <option key={key} value={key}>
                        {TYPE_BADGES[key].label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs text-[#6C757D]">
                  From
                  <input
                    type="date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="mt-1 w-full h-11 px-3 border border-[#DEE2E6] rounded-lg text-sm text-[#212529] focus:outline-none focus:border-black"
                  />
                </label>

                <label className="text-xs text-[#6C757D]">
                  To
                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    className="mt-1 w-full h-11 px-3 border border-[#DEE2E6] rounded-lg text-sm text-[#212529] focus:outline-none focus:border-black"
                  />
                </label>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Product</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">From</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">To</th>
                    <th className="px-5 py-4 text-center text-sm font-semibold">Qty</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Transferred By</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="py-10 text-center text-[#6C757D]">
                        Loading stock transfer report...
                      </td>
                    </tr>
                  ) : filteredTransfers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-10 text-center text-[#6C757D]">
                        No stock transfers found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransfers.map((transfer) => {
                      const badge = TYPE_BADGES[transfer.typeKey];
                      return (
                        <tr
                          key={transfer._id}
                          className="border-t border-[#F1F3F5] hover:bg-[#FAFAFA]"
                        >
                          <td className="px-5 py-4 text-sm whitespace-nowrap">
                            {formatDate(transfer.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            {badge ? (
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            ) : (
                              <span className="text-sm text-[#ADB5BD]">-</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <div className="font-semibold">{transfer.product?.name || "-"}</div>
                            {transfer.product?.sku && (
                              <div className="text-xs text-[#6C757D]">{transfer.product.sku}</div>
                            )}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            {getLocationName(transfer.fromLocation)}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            {getLocationName(transfer.toLocation)}
                          </td>
                          <td className="px-5 py-4 text-sm text-center font-semibold">
                            {transfer.quantity}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            {transfer.transferredBy?.name || "-"}
                          </td>
                          <td className="px-5 py-4 text-sm text-[#6C757D]">
                            {transfer.notes || "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#DEE2E6] text-sm text-[#6C757D]">
              Showing {filteredTransfers.length} of {transfers.length} transfer(s)
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="bg-white border border-[#DEE2E6] rounded-2xl shadow-sm p-5">
    <p className="text-[13px] text-[#6C757D]">{label}</p>
    <p className="text-[24px] font-bold text-[#212529] mt-1">{value}</p>
  </div>
);

export default StockTransferReportsPage;
