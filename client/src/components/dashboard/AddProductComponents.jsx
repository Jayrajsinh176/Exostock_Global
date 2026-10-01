import { MdEdit, MdInventory2, MdImage } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCategories,
  getVendors,
  createProduct,
  updateProduct,
} from "../../api";

const getCategoryValue = (category) => {
  if (!category) {
    return "";
  }

  if (typeof category === "object") {
    return category.id || category._id || "";
  }

  return category;
};

const AddProductForm = ({ product = null, onSubmitSuccess = null }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!product;
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: getCategoryValue(product?.category),
    vendor: product?.vendor?._id || product?.vendor || "",
    price: product?.price ? String(product.price) : "",
    lowStockThreshold: product?.lowStockThreshold
      ? String(product.lowStockThreshold)
      : "5",
    image: null,

    addInitialStock: false,
    initialQuantity: "",
    purchasePrice: "",
    paymentStatus: "unpaid",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await getCategories();
        if (categoryResponse.data) {
          setCategories(categoryResponse.data);
        }

        const vendorResponse = await getVendors();
        if (vendorResponse.vendors) {
          setVendors(vendorResponse.vendors);
        } else if (vendorResponse.data) {
          setVendors(vendorResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Update form data when product prop changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: getCategoryValue(product.category),
        vendor: product.vendor?._id || product.vendor || "",
        price: product.price ? String(product.price) : "",
        lowStockThreshold: product.lowStockThreshold
          ? String(product.lowStockThreshold)
          : "5",
        image: null,

        addInitialStock: false,
        initialQuantity: "",
        purchasePrice: "",
        paymentStatus: "unpaid",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "price" ||
      name === "initialQuantity" ||
      name === "purchasePrice" ||
      name === "lowStockThreshold"
    ) {
      // Allow empty string or valid numbers
      if (value === "" || !isNaN(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null }));
      return;
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Product image must be 2 MB or smaller");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file || null,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.addInitialStock) {
      if (!formData.initialQuantity) {
        toast.error("Please enter initial quantity");
        return;
      }

      if (!formData.purchasePrice) {
        toast.error("Please enter purchase price");
        return;
      }
    }

    setLoading(true);

    try {
      const productPayload = new FormData();

      productPayload.append("name", formData.name);
      productPayload.append("sku", formData.sku);
      productPayload.append("category", formData.category);
      productPayload.append("vendor", formData.vendor);
      productPayload.append(
        "price",
        formData.price === "" ? 0 : parseFloat(formData.price),
      );
      productPayload.append(
        "lowStockThreshold",
        formData.lowStockThreshold === ""
          ? 5
          : parseInt(formData.lowStockThreshold, 10),
      );
      productPayload.append("addInitialStock", formData.addInitialStock);

      productPayload.append("initialQuantity", formData.initialQuantity);

      productPayload.append("purchasePrice", formData.purchasePrice);

      productPayload.append("paymentStatus", formData.paymentStatus);
      if (formData.image) {
        productPayload.append("image", formData.image);
      }

      if (isEditMode) {
        const response = await updateProduct(product.id, productPayload);
        if (response) {
          toast.success("Product updated successfully!");
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        }
      } else {
        const response = await createProduct(productPayload);
        if (response) {
          toast.success("Product created successfully!");
          // Reset form
          setFormData({
            name: "",
            sku: "",
            category: "",
            vendor: "",
            price: "",
            lowStockThreshold: "5",
            image: null,

            addInitialStock: false,
            initialQuantity: "",
            purchasePrice: "",
            paymentStatus: "unpaid",
          });
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        }
      }
    } catch (error) {
      toast.error(
        error.message ||
          `Failed to ${isEditMode ? "update" : "create"} product`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-3">
            <MdEdit className="text-[20px] text-[#6C757D]" />
            <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#212529]">
              {isEditMode ? "Edit" : "Basic"} Information
            </h3>
          </div>

          {/* Section Content */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Product Name */}
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Minimalist Oak Chair"
                  disabled={loading}
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="SKU-2024-001"
                  disabled={loading}
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                />
              </div>

              {/* Category */}
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#0d5b96] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor */}
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Vendor
                </label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] text-[#212529] focus:outline-none focus:border-[#0d5b96] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select Vendor (Optional)</option>
                  {vendors.map((vendor) => (
                    <option
                      key={vendor._id || vendor.id}
                      value={vendor._id || vendor.id}
                    >
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="w-full h-11 border border-[#DEE2E6] rounded-lg px-3 py-2"
                />

                {product?.image && !formData.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${product.image}`}
                    alt="Product"
                    className="mt-3 h-24 w-24 object-cover rounded-lg border"
                  />
                )}

                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="mt-3 h-24 w-24 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Inventory & Pricing */}
        <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="px-8 py-6 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-3">
            <MdInventory2 className="text-[20px] text-[#6C757D]" />
            <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#212529]">
              Inventory & Pricing
            </h3>
          </div>

          {/* Section Content */}
          <div className="p-8">
            <div className="grid grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[14px]">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    disabled={loading}
                    className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg pl-8 pr-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                  disabled={loading}
                  className="w-full h-11 bg-white border border-[#DEE2E6] rounded-lg px-4 text-[14px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96] transition-colors disabled:opacity-50"
                />
              </div>
              <div className="col-span-3 mt-6 border-t border-[#DEE2E6] pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="addInitialStock"
                    checked={formData.addInitialStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        addInitialStock: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-[14px] font-semibold">
                    Add Initial Inventory
                  </span>
                </label>
              </div>
              {formData.addInitialStock && (
                <div className="col-span-3 grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[12px] font-semibold uppercase mb-2">
                      Initial Quantity
                    </label>

                    <input
                      type="number"
                      name="initialQuantity"
                      value={formData.initialQuantity}
                      onChange={handleChange}
                      required={formData.addInitialStock}
                      min="1"
                      className="w-full h-11 border rounded-lg px-4"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase mb-2">
                      Purchase Price
                    </label>

                    <input
                      type="number"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      required={formData.addInitialStock}
                      onChange={handleChange}
                      min="0"
                      className="w-full h-11 border rounded-lg px-4"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase mb-2">
                      Payment Status
                    </label>

                    <select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleChange}
                      className="w-full h-11 border rounded-lg px-4"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            disabled={loading}
            className="px-6 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-[#0d5b96] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span>✓</span>
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Product"
                : "Save Product"}
          </button>
        </div>
      </form>
    </>
  );
};

export { AddProductForm };
