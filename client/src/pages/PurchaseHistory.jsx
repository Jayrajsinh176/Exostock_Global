import { useEffect, useMemo, useState } from "react";
import {
    MdSearch,
    MdVisibility,
    MdReceiptLong,
} from "react-icons/md";
import { getPurchaseHistory } from "../api";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    useEffect(() => {
        fetchPurchaseHistory();
    }, []);

    const fetchPurchaseHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPurchaseHistory();

            setPurchases(response.data || []);
        } catch (err) {
            setError(err.message || "Failed to load purchase history");
        } finally {
            setLoading(false);
        }
    };

    const filteredPurchases = useMemo(() => {
        if (!search) return purchases;

        const keyword = search.toLowerCase();

        return purchases.filter((purchase) => {
            return (
                purchase.requestNumber?.toLowerCase().includes(keyword) ||
                purchase.vendorId?.name?.toLowerCase().includes(keyword) ||
                purchase.productId?.name?.toLowerCase().includes(keyword) ||
                purchase.invoiceNumber?.toLowerCase().includes(keyword)
            );
        });
    }, [purchases, search]);

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
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#212529]">
                                Purchase History
                            </h1>

                            <p className="text-[#6C757D] text-sm mt-1">
                                View all completed purchases from vendors.
                            </p>
                        </div>

                        <div className="relative w-full md:w-[320px]">
                            <MdSearch className="absolute left-3 top-3 text-gray-400 text-xl" />

                            <input
                                type="text"
                                placeholder="Search request, vendor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    {/* Card */}

                    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">

                        <div className="flex items-center justify-between px-6 py-4 border-b">

                            <div className="flex items-center gap-2">

                                <MdReceiptLong className="text-2xl" />

                                <h2 className="font-semibold text-lg">
                                    Purchase Records
                                </h2>

                            </div>

                            <span className="text-sm text-gray-500">
                                {filteredPurchases.length} Records
                            </span>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Request No
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Vendor
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Product
                                        </th>

                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase">
                                            Qty
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase">
                                            Amount
                                        </th>

                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase">
                                            Invoice
                                        </th>

                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase">
                                            Paid Date
                                        </th>

                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="text-center py-12 text-gray-500"
                                            >
                                                Loading purchase history...
                                            </td>
                                        </tr>
                                    ) : filteredPurchases.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="text-center py-12 text-gray-500"
                                            >
                                                No purchase history found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPurchases.map((purchase) => (
                                            <tr
                                                key={purchase._id}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4 font-medium">
                                                    {purchase.requestNumber}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="font-medium">
                                                        {purchase.vendorId?.name || "-"}
                                                    </div>

                                                    <div className="text-xs text-gray-500">
                                                        {purchase.vendorId?.phone || ""}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="font-medium">
                                                        {purchase.productId?.name || "-"}
                                                    </div>

                                                    <div className="text-xs text-gray-500">
                                                        SKU : {purchase.productId?.sku || "-"}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    {purchase.quantity}
                                                </td>

                                                <td className="px-5 py-4 text-right font-semibold">
                                                    $
                                                    {Number(
                                                        purchase.totalAmount || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    {purchase.invoiceNumber || "-"}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    {purchase.paidAt
                                                        ? new Date(
                                                            purchase.paidAt
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedPurchase(purchase)
                                                        }
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                                                    >
                                                        <MdVisibility />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* View Purchase Modal */}
                    {selectedPurchase && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">

                                <div className="flex items-center justify-between border-b px-6 py-4">
                                    <h2 className="text-xl font-semibold">
                                        Purchase Details
                                    </h2>

                                    <button
                                        onClick={() => setSelectedPurchase(null)}
                                        className="text-2xl text-gray-500 hover:text-black"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="p-6 space-y-5">

                                    <div className="grid grid-cols-2 gap-5">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Request Number
                                            </p>
                                            <p className="font-semibold">
                                                {selectedPurchase.requestNumber}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Invoice Number
                                            </p>
                                            <p className="font-semibold">
                                                {selectedPurchase.invoiceNumber || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Vendor
                                            </p>
                                            <p className="font-semibold">
                                                {selectedPurchase.vendorId?.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Product
                                            </p>
                                            <p className="font-semibold">
                                                {selectedPurchase.productId?.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Quantity
                                            </p>
                                            <p className="font-semibold">
                                                {selectedPurchase.quantity}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Amount
                                            </p>
                                            <p className="font-semibold text-green-600">
                                                $
                                                {Number(
                                                    selectedPurchase.totalAmount || 0
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Payment Status
                                            </p>

                                            <span className="inline-flex px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
                                                {selectedPurchase.paymentStatus}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Paid Date
                                            </p>

                                            <p className="font-semibold">
                                                {selectedPurchase.paidAt
                                                    ? new Date(
                                                        selectedPurchase.paidAt
                                                    ).toLocaleString()
                                                    : "-"}
                                            </p>
                                        </div>

                                    </div>

                                    {selectedPurchase.notes && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Notes
                                            </p>

                                            <div className="bg-gray-50 rounded-lg p-3">
                                                {selectedPurchase.notes}
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="border-t px-6 py-4 flex justify-end">
                                    <button
                                        onClick={() => setSelectedPurchase(null)}
                                        className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                                    >
                                        Close
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 text-center text-red-600">
                            {error}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PurchaseHistory;