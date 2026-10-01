import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdSearch,
  MdSwapHoriz,
  MdCallMade,
  MdCallReceived,
  MdCompareArrows,
  MdVisibility,
  MdPrint,
  MdDownload,
  MdClose,
} from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getStockTransferHistory, AuthService } from "../api";
import toast from "react-hot-toast";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

const TYPE_BADGES = {
  sent: { label: "Sent", icon: MdCallMade, className: "bg-orange-100 text-orange-700" },
  received: { label: "Received", icon: MdCallReceived, className: "bg-green-100 text-green-700" },
  distribution: { label: "Distribution", icon: MdCallMade, className: "bg-blue-100 text-blue-700" },
  return: { label: "Return", icon: MdCallReceived, className: "bg-purple-100 text-purple-700" },
  interFranchise: { label: "Inter-Franchise", icon: MdCompareArrows, className: "bg-teal-100 text-teal-700" },
};

const BRAND = {
  name: "Exostock",
  tagline: "Powered by Exostock",
  navy: "#1a2535",
};

// A location reference that fails to populate (fromLocation/toLocation is null)
// is always the Main Store — franchises are never deleted, so the only location
// that can go missing is the original Main Store record.
const isMainStore = (location) => !location || location.isDefault;

const getLocationName = (location) => location?.locationName || "Main Store";

// Franchise viewers only see transfers touching their own location (server-scoped),
// so "Sent"/"Received" relative to them is always meaningful. Company-side viewers
// (admin/manager/staff) see every transfer, most of which never touch their own
// location, so they instead get a classification of the movement itself.
function getTransferType(transfer, { isFranchiseViewer, myLocationId }) {
  if (isFranchiseViewer) {
    if (myLocationId && transfer.fromLocation?._id === myLocationId) {
      return TYPE_BADGES.sent;
    }
    if (myLocationId && transfer.toLocation?._id === myLocationId) {
      return TYPE_BADGES.received;
    }
    return null;
  }

  if (isMainStore(transfer.fromLocation)) {
    return TYPE_BADGES.distribution;
  }
  if (isMainStore(transfer.toLocation)) {
    return TYPE_BADGES.return;
  }
  return TYPE_BADGES.interFranchise;
}

// The seller/company letterhead shown on every generated transfer invoice.
const getCompany = () => {
  const company = AuthService.getCompany() || {};

  return {
    name: company.company_name || "Unknown Company",
    address: company.address || "",
    email: company.email || "",
    phone: company.phone || "",
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

// Transfers have no invoice number of their own, so derive a stable, readable
// one from the document id (last 8 chars is plenty unique for display).
const getTransferNumber = (transfer) => {
  const id = transfer?._id || "";
  return id ? `TRF-${id.slice(-8).toUpperCase()}` : "N/A";
};

const getInvoiceStyles = () => `
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
  .sheet { max-width: 860px; margin: 24px auto; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #E4E8EE; box-shadow: 0 8px 28px rgba(26,37,53,0.08); font-family: 'Segoe UI', Arial, sans-serif; color: #1a2535; }
  .header { position: relative; display: flex; align-items: flex-start; justify-content: space-between; background: #1a2535; color: #fff; padding: 26px 32px 22px; gap: 20px; }
  .header::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, #0d5b96, #AE4329); }
  .header .brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .logo { width: 48px; height: 48px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #1a2535; font-weight: 800; font-size: 19px; flex-shrink: 0; }
  .header h1 { margin: 0; font-size: 20px; letter-spacing: 0.3px; }
  .header .sub { font-size: 11.5px; opacity: 0.72; margin-top: 4px; max-width: 420px; line-height: 1.5; }
  .doc-meta { text-align: right; flex-shrink: 0; }
  .doc-title { font-size: 12.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
  .doc-number { font-size: 18px; font-weight: 700; margin-top: 6px; }
  .platform-badge { font-size: 9.5px; font-weight: 700; background: #AE4329; color: #fff; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block; margin-top: 10px; }
  .body { padding: 30px 32px; }
  .meta-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; padding: 16px 20px; background: #F8F9FA; border: 1px solid #E4E8EE; border-radius: 10px; margin-bottom: 22px; }
  .meta-strip .label { color: #0d5b96; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .meta-strip .value { color: #1a2535; font-size: 13.5px; font-weight: 700; }
  .parties { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: stretch; margin-bottom: 24px; }
  .party { border: 1px solid #E4E8EE; border-radius: 10px; padding: 16px 18px; background: #FAFBFC; }
  .party .tag { display: inline-block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; background: #0d5b96; padding: 3px 9px; border-radius: 999px; margin-bottom: 10px; }
  .party.to .tag { background: #2E7D32; }
  .party .name { font-size: 16px; font-weight: 800; color: #1a2535; }
  .parties .arrow { display: flex; align-items: center; justify-content: center; color: #ADB5BD; font-size: 22px; }
  h3.section-title { font-size: 12.5px; margin: 0; padding: 13px 18px; background: #F8F9FA; border-bottom: 1px solid #E4E8EE; color: #1a2535; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .table-wrap { border: 1px solid #E4E8EE; border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #F8F9FA; }
  th { padding: 11px 18px; text-align: left; font-size: 10.5px; font-weight: 700; color: #0d5b96; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #E4E8EE; }
  td { padding: 14px 18px; font-size: 13.5px; color: #1a2535; border-bottom: 1px solid #F1F3F5; }
  tfoot td { background: #F8F9FA; font-weight: 800; border-bottom: none; }
  .num { text-align: right; }
  .notes { margin-bottom: 24px; font-size: 13px; color: #1a2535; border: 1px dashed #DEE2E6; border-radius: 10px; padding: 14px 18px; background: #FAFBFC; }
  .notes .label { color: #6C757D; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 36px; }
  .signatures .line { border-top: 1px solid #ADB5BD; padding-top: 8px; font-size: 11px; color: #6C757D; text-align: center; }
  .footer { text-align: center; padding: 16px; border-top: 1px solid #E4E8EE; color: #ADB5BD; font-size: 11px; }
`;

const getInvoiceSheetMarkup = (transfer) => {
  const company = getCompany();
  const contact = [company.address, company.phone, company.email]
    .filter(Boolean)
    .join(" &nbsp;|&nbsp; ");

  return `
    <div class="sheet">
      <div class="header">
        <div class="brand">
          <div class="logo">${company.name.charAt(0).toUpperCase()}</div>
          <div>
            <h1>${company.name}</h1>
            ${contact ? `<div class="sub">${contact}</div>` : ""}
          </div>
        </div>
        <div class="doc-meta">
          <div class="doc-title">Stock Transfer Invoice</div>
          <div class="doc-number">${getTransferNumber(transfer)}</div>
          <div class="platform-badge">${BRAND.tagline}</div>
        </div>
      </div>
      <div class="body">
        <div class="meta-strip">
          <div><div class="label">Date</div><div class="value">${formatDate(transfer.createdAt)}</div></div>
          <div><div class="label">Type</div><div class="value">${transfer.typeLabel || "N/A"}</div></div>
          <div><div class="label">Transferred By</div><div class="value">${transfer.transferredBy?.name || "N/A"}</div></div>
          <div><div class="label">Status</div><div class="value">Completed</div></div>
        </div>

        <div class="parties">
          <div class="party from">
            <span class="tag">Transferred From</span>
            <div class="name">${getLocationName(transfer.fromLocation)}</div>
          </div>
          <div class="arrow">&#8594;</div>
          <div class="party to">
            <span class="tag">Transferred To</span>
            <div class="name">${getLocationName(transfer.toLocation)}</div>
          </div>
        </div>

        <div class="table-wrap">
          <h3 class="section-title">Product Details</h3>
          <table>
            <thead>
              <tr><th style="width:40px;">#</th><th>Product</th><th>SKU</th><th class="num">Quantity</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${transfer.product?.name || "Product"}</td>
                <td>${transfer.product?.sku || "N/A"}</td>
                <td class="num">${transfer.quantity ?? "-"}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr><td colspan="3" class="num">Total Quantity</td><td class="num">${transfer.quantity ?? "-"}</td></tr>
            </tfoot>
          </table>
        </div>

        ${
          transfer.notes
            ? `<div class="notes"><div class="label">Notes</div><div>${transfer.notes}</div></div>`
            : ""
        }

        <div class="signatures">
          <div class="line">Prepared By</div>
          <div class="line">Received By</div>
        </div>
      </div>
      <div class="footer">This is a system-generated stock transfer invoice and does not require a physical signature. ${BRAND.tagline}.</div>
    </div>
  `;
};

const buildInvoiceHtml = (transfer) => `
  <!doctype html>
  <html>
    <head>
      <title>Invoice ${getTransferNumber(transfer)}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a2535; margin: 0; background: #F1F3F5; }
        ${getInvoiceStyles()}
        @page { margin: 12mm; }
        @media print { body { background: #fff; } .sheet { margin: 0; border: none; border-radius: 0; box-shadow: none; } }
      </style>
    </head>
    <body>
      ${getInvoiceSheetMarkup(transfer)}
    </body>
  </html>
`;

export default function StockTransferHistoryPage() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Read fresh on every render — this module is statically imported into
  // App.jsx, so a module-level constant would be frozen at pre-login state
  // (the login flow uses client-side navigate(), not a full page reload).
  const isFranchiseViewer = AuthService.isFranchise();
  const myLocationId = isFranchiseViewer
    ? AuthService.getFranchise()?._id
    : AuthService.getUser()?.locationId;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getStockTransferHistory();
        setTransfers(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load transfer history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredTransfers = transfers.filter((transfer) => {
    const value = search.toLowerCase();

    return (
      transfer.product?.name?.toLowerCase().includes(value) ||
      getLocationName(transfer.fromLocation).toLowerCase().includes(value) ||
      getLocationName(transfer.toLocation).toLowerCase().includes(value) ||
      transfer.transferredBy?.name?.toLowerCase().includes(value)
    );
  });

  const handlePrint = (transfer) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.write(buildInvoiceHtml(transfer));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadPdf = (transfer) => {
    const doc = new jsPDF();
    const company = getCompany();
    const transferNumber = getTransferNumber(transfer);
    const navy = [26, 37, 53];
    const blue = [13, 91, 150];
    const green = [46, 125, 50];
    const rust = [174, 67, 41];
    const gray = [108, 117, 125];
    const border = [222, 226, 230];

    // Letterhead band
    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(company.name, 14, 15);
    doc.setFontSize(8);
    doc.setTextColor(200, 205, 215);
    doc.text(
      [company.address, company.phone, company.email].filter(Boolean).join("  |  "),
      14,
      22,
    );

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("STOCK TRANSFER INVOICE", 196, 13, { align: "right" });
    doc.setFontSize(14);
    doc.text(transferNumber, 196, 20, { align: "right" });

    doc.setFillColor(...rust);
    doc.roundedRect(156, 24, 40, 8, 2, 2, "F");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(BRAND.tagline, 176, 29, { align: "center" });

    // From / To panels
    const panelY = 44;
    const panelH = 26;
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    doc.rect(14, panelY, 85, panelH, "S");
    doc.rect(111, panelY, 85, panelH, "S");

    doc.setFontSize(8);
    doc.setTextColor(...blue);
    doc.text("TRANSFERRED FROM", 20, panelY + 9);
    doc.setTextColor(...green);
    doc.text("TRANSFERRED TO", 117, panelY + 9);

    doc.setFontSize(13);
    doc.setTextColor(...navy);
    doc.text(getLocationName(transfer.fromLocation), 20, panelY + 18);
    doc.text(getLocationName(transfer.toLocation), 117, panelY + 18);

    doc.setDrawColor(173, 181, 189);
    doc.setLineWidth(0.5);
    doc.line(101, panelY + panelH / 2, 107, panelY + panelH / 2);
    doc.setFillColor(173, 181, 189);
    doc.triangle(
      107, panelY + panelH / 2 - 2,
      107, panelY + panelH / 2 + 2,
      110, panelY + panelH / 2,
      "F",
    );

    // Meta strip
    const metaY = panelY + panelH + 6;
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(...border);
    doc.rect(14, metaY, 182, 16, "FD");
    const info = [
      ["Date", formatDate(transfer.createdAt)],
      ["Type", transfer.typeLabel || "N/A"],
      ["Transferred By", transfer.transferredBy?.name || "N/A"],
      ["Status", "Completed"],
    ];
    info.forEach(([label, value], index) => {
      const x = 19 + index * 45.5;
      doc.setFontSize(7);
      doc.setTextColor(...blue);
      doc.text(label.toUpperCase(), x, metaY + 6);
      doc.setFontSize(9.5);
      doc.setTextColor(...navy);
      doc.text(String(value), x, metaY + 12);
    });

    // Product table
    autoTable(doc, {
      startY: metaY + 24,
      head: [["#", "Product", "SKU", "Quantity"]],
      body: [
        [
          "1",
          transfer.product?.name || "Product",
          transfer.product?.sku || "N/A",
          String(transfer.quantity ?? "-"),
        ],
      ],
      foot: [["", "", "Total Quantity", String(transfer.quantity ?? "-")]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: navy, textColor: [255, 255, 255], fontStyle: "bold" },
      footStyles: { fillColor: [248, 249, 250], textColor: navy, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 10 },
        3: { halign: "right" },
      },
      theme: "grid",
    });

    let cursorY = doc.lastAutoTable.finalY + 12;

    if (transfer.notes) {
      doc.setFontSize(8);
      doc.setTextColor(...gray);
      doc.text("NOTES", 14, cursorY);
      doc.setFontSize(10);
      doc.setTextColor(...navy);
      const noteLines = doc.splitTextToSize(String(transfer.notes), 182);
      doc.text(noteLines, 14, cursorY + 6);
      cursorY += 6 + noteLines.length * 5 + 8;
    }

    // Signature lines
    const sigY = Math.min(cursorY + 24, 265);
    doc.setDrawColor(173, 181, 189);
    doc.setLineWidth(0.3);
    doc.line(14, sigY, 84, sigY);
    doc.line(126, sigY, 196, sigY);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("Prepared By", 14, sigY + 6);
    doc.text("Received By", 126, sigY + 6);

    // Footer
    doc.setDrawColor(...border);
    doc.line(14, 282, 196, 282);
    doc.setFontSize(8);
    doc.setTextColor(173, 181, 189);
    doc.text(
      `This is a system-generated stock transfer invoice. ${BRAND.tagline}.`,
      105,
      288,
      { align: "center" },
    );

    doc.save(`${transferNumber}.pdf`);
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529]">
                Stock Transfer History
              </h1>

              <p className="text-[14px] text-[#6C757D] mt-1">
                Track stock movements between your locations.
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white border border-[#DEE2E6] rounded-2xl shadow-sm overflow-hidden">
            {/* Search */}
            <div className="p-5 border-b border-[#DEE2E6]">
              <div className="relative max-w-sm">
                <MdSearch className="absolute left-3 top-3 text-[#ADB5BD] text-lg" />

                <input
                  type="text"
                  placeholder="Search by product, location, or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-[#DEE2E6] rounded-lg text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      From
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      To
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Transferred By
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Notes
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Date
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold">
                      Invoice
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="py-10 text-center text-[#6C757D]"
                      >
                        Loading transfer history...
                      </td>
                    </tr>
                  ) : filteredTransfers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="py-10 text-center text-[#6C757D]"
                      >
                        No stock transfers found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransfers.map((transfer) => {
                      const type = getTransferType(transfer, {
                        isFranchiseViewer,
                        myLocationId,
                      });
                      const TypeIcon = type?.icon;
                      const transferWithType = {
                        ...transfer,
                        typeLabel: type?.label || "-",
                      };

                      return (
                      <tr
                        key={transfer._id}
                        className="border-t border-[#F1F3F5] hover:bg-[#FAFAFA]"
                      >
                        <td className="px-5 py-4">
                          {type ? (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${type.className}`}
                            >
                              <TypeIcon size={14} />
                              {type.label}
                            </span>
                          ) : (
                            <span className="text-sm text-[#ADB5BD]">-</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {transfer.product?.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {getLocationName(transfer.fromLocation)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MdSwapHoriz className="text-[#6C757D]" />
                            {getLocationName(transfer.toLocation)}
                          </div>
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

                        <td className="px-5 py-4 text-sm">
                          {new Date(transfer.createdAt).toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <RowActions
                            transfer={transferWithType}
                            onView={setSelectedTransfer}
                            onPrint={handlePrint}
                            onDownload={handleDownloadPdf}
                          />
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

      {selectedTransfer && (
        <TransferInvoiceModal
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
          onPrint={handlePrint}
          onDownload={handleDownloadPdf}
        />
      )}
    </div>
  );
}

const RowActions = ({ transfer, onView, onPrint, onDownload }) => (
  <div className="flex items-center justify-center gap-1">
    <button
      onClick={() => onView(transfer)}
      title="View Invoice"
      className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
    >
      <MdVisibility className="text-[18px]" />
    </button>
    <button
      onClick={() => onPrint(transfer)}
      title="Print Invoice"
      className="h-9 w-9 flex items-center justify-center border border-[#DEE2E6] rounded-lg text-[#212529] hover:bg-[#F8F9FA]"
    >
      <MdPrint className="text-[18px]" />
    </button>
    <button
      onClick={() => onDownload(transfer)}
      title="Download PDF"
      className="h-9 w-9 flex items-center justify-center bg-[#0d5b96] rounded-lg text-white hover:bg-[#1A1A1A]"
    >
      <MdDownload className="text-[18px]" />
    </button>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#6C757D] mb-1">
      {label}
    </p>
    <p className="text-[14px] font-semibold text-[#1a2535]">{value}</p>
  </div>
);

const TransferInvoiceModal = ({ transfer, onClose, onPrint, onDownload }) => {
  const company = getCompany();
  const contactLine = [company.phone, company.email].filter(Boolean).join("  •  ");

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
          <div className="relative bg-[#1a2535] px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
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
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/70">
                Stock Transfer Invoice
              </span>
              <span className="text-[16px] font-bold text-white whitespace-nowrap">
                {getTransferNumber(transfer)}
              </span>
              <span className="text-[10px] font-semibold bg-[#AE4329] text-white px-2.5 py-1 rounded-full whitespace-nowrap">
                {BRAND.tagline}
              </span>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <MdClose className="text-[18px]" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Meta strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 p-4 bg-[#F8F9FA] border border-[#E4E8EE] rounded-xl">
              <InfoField label="Date" value={formatDate(transfer.createdAt)} />
              <InfoField label="Type" value={transfer.typeLabel || "N/A"} />
              <InfoField
                label="Transferred By"
                value={transfer.transferredBy?.name || "N/A"}
              />
              <InfoField label="Status" value="Completed" />
            </div>

            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch gap-3">
              <div className="border border-[#E4E8EE] rounded-xl bg-[#FAFBFC] p-4">
                <span className="inline-block text-[9.5px] font-bold uppercase tracking-[0.08em] text-white bg-[#0d5b96] px-2.5 py-1 rounded-full mb-2">
                  Transferred From
                </span>
                <p className="text-[16px] font-extrabold text-[#1a2535]">
                  {getLocationName(transfer.fromLocation)}
                </p>
              </div>
              <div className="hidden sm:flex items-center justify-center text-[#ADB5BD] text-[22px]">
                →
              </div>
              <div className="border border-[#E4E8EE] rounded-xl bg-[#FAFBFC] p-4">
                <span className="inline-block text-[9.5px] font-bold uppercase tracking-[0.08em] text-white bg-[#2E7D32] px-2.5 py-1 rounded-full mb-2">
                  Transferred To
                </span>
                <p className="text-[16px] font-extrabold text-[#1a2535]">
                  {getLocationName(transfer.toLocation)}
                </p>
              </div>
            </div>

            {/* Product */}
            <div className="border border-[#E4E8EE] rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-[#F8F9FA] border-b border-[#E4E8EE]">
                <h3 className="text-[14px] font-bold text-[#1a2535]">Product Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead className="bg-white">
                    <tr>
                      {["#", "Product", "SKU", "Quantity"].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-[#6C757D] border-b border-[#E4E8EE] ${
                            h === "Quantity" ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-5 py-3 text-[13px] text-[#1a2535]">1</td>
                      <td className="px-5 py-3 text-[13px] text-[#1a2535]">
                        {transfer.product?.name || "Product"}
                      </td>
                      <td className="px-5 py-3 text-[13px] text-[#1a2535]">
                        {transfer.product?.sku || "N/A"}
                      </td>
                      <td className="px-5 py-3 text-[13px] font-semibold text-[#1a2535] text-right">
                        {transfer.quantity ?? "-"}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F8F9FA]">
                      <td colSpan={3} className="px-5 py-3 text-[13px] font-bold text-[#1a2535] text-right">
                        Total Quantity
                      </td>
                      <td className="px-5 py-3 text-[13px] font-bold text-[#1a2535] text-right">
                        {transfer.quantity ?? "-"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {transfer.notes && (
              <div className="border border-dashed border-[#DEE2E6] rounded-xl bg-[#FAFBFC] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#6C757D] mb-1">
                  Notes
                </p>
                <p className="text-[13px] text-[#1a2535]">{transfer.notes}</p>
              </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-10 pt-4">
              <div className="border-t border-[#ADB5BD] pt-2 text-center text-[11px] text-[#6C757D]">
                Prepared By
              </div>
              <div className="border-t border-[#ADB5BD] pt-2 text-center text-[11px] text-[#6C757D]">
                Received By
              </div>
            </div>

            <p className="text-center text-[12px] text-[#ADB5BD]">
              This is a system-generated stock transfer invoice. {BRAND.tagline}.
            </p>
          </div>

          <div className="px-6 sm:px-8 py-5 border-t border-[#E4E8EE] flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => onPrint(transfer)}
              className="h-10 px-4 border border-[#1a2535]/20 rounded-lg text-[13px] font-semibold text-[#1a2535] hover:bg-[#F8F9FA] flex items-center justify-center gap-2"
            >
              <MdPrint className="text-[18px]" />
              Print Invoice
            </button>
            <button
              onClick={() => onDownload(transfer)}
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
