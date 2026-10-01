import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MdSave, MdArrowBack } from "react-icons/md";
import { getVendors, getVendorProducts, createSupplyRequest, } from "../../api";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

const AddPurchasePage = () => {
    const [formData, setFormData] = useState({
        vendorId: "",
        productId: "",
        quantity: "",
        quotedPrice: "",
        expectedDeliveryDate: "",
        notes: "",
    });

    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const totalAmount =
        Number(formData.quantity || 0) *
        Number(formData.quotedPrice || 0);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const vendorRes = await getVendors();

            setVendors(vendorRes.data || []);

            // Prefill from "Request Stock" (?vendorId=...&productId=...)
            const vendorId = searchParams.get("vendorId");
            const productId = searchParams.get("productId");

            if (vendorId) {
                const productRes = await getVendorProducts(vendorId);
                const vendorProducts = productRes.data || [];

                setProducts(vendorProducts);
                setFormData((prev) => ({
                    ...prev,
                    vendorId,
                    productId: vendorProducts.some(
                        (product) => product._id === productId,
                    )
                        ? productId
                        : "",
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleVendorChange = async (e) => {
        const vendorId = e.target.value;

        setFormData((prev) => ({
            ...prev,
            vendorId,
            productId: "",
        }));

        setProducts([]);

        if (!vendorId) {
            return;
        }

        try {
            const response = await getVendorProducts(vendorId);

            setProducts(response.data || []);
        } catch (error) {
            console.error("Failed to load vendor products:", error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.vendorId) {
            alert("Please select a vendor");
            return;
        }

        if (!formData.productId) {
            alert("Please select a product");
            return;
        }

        if (!formData.quantity || Number(formData.quantity) <= 0) {
            alert("Please enter a valid quantity");
            return;
        }

        if (!formData.quotedPrice || Number(formData.quotedPrice) <= 0) {
            alert("Please enter a valid purchase price");
            return;
        }

        if (!formData.expectedDeliveryDate) {
            alert("Please select expected delivery date");
            return;
        }

        try {
            const requestData = {
                vendorId: formData.vendorId,
                productId: formData.productId,
                quantity: Number(formData.quantity),
                quotedPrice: Number(formData.quotedPrice),
                expectedDeliveryDate: formData.expectedDeliveryDate,
                notes: formData.notes,
            };

            const response = await createSupplyRequest(requestData);

            console.log("Supply Request Created:", response);

            alert("Purchase request created successfully!");

        } catch (error) {
            console.error("Create Supply Request Error:", error);

            alert(error.message || "Failed to create purchase request");
        }
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

                    {/* Everything below is your existing form */}

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#212529]">
                            Add Purchase Request
                        </h1>

                        <p className="text-[#6C757D] mt-1">
                            Create a new purchase request for stock.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Vendor */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Vendor
                                </label>

                                <select
                                    name="vendorId"
                                    value={formData.vendorId}
                                    onChange={handleVendorChange}
                                    className="w-full border rounded-lg p-3"
                                >
                                    <option value="">Select Vendor</option>

                                    {vendors.map((vendor) => (
                                        <option key={vendor._id} value={vendor._id}>
                                            {vendor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Product */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Product
                                </label>
                                <select
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    disabled={!formData.vendorId}
                                    className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Product</option>

                                    {products.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3"
                                    />
                                </div>

                                {/* Purchase Price */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Purchase Price / Unit
                                    </label>

                                    <input
                                        type="number"
                                        name="quotedPrice"
                                        value={formData.quotedPrice}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">
                                    Total Purchase Amount
                                </label>

                                <div className="w-full border border-[#0066B3] rounded-lg p-3 font-semibold text-[#6C757D]">
                                    ${totalAmount.toLocaleString("en-US")}
                                </div>
                            </div>

                            {/* Expected Delivery */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Expected Delivery Date
                                </label>

                                <input
                                    type="date"
                                    name="expectedDeliveryDate"
                                    value={formData.expectedDeliveryDate}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Notes
                                </label>

                                <textarea
                                    rows="4"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                    placeholder="Enter notes..."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-5 py-2 rounded-lg border flex items-center gap-2"
                                >
                                    <MdArrowBack />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"
                                >
                                    <MdSave />
                                    Save Purchase
                                </button>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AddPurchasePage;