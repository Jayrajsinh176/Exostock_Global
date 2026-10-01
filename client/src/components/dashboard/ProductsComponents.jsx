import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdImage,
  MdSearch,
  MdInventory,
  MdSwapHoriz,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  deleteProduct,
  getCategories,
  getProducts,
  getOrderStats,
  addStock,
  transferStock,
  getFranchiseLocations,
} from "../../api";
import ConfirmationModal from "../common/ConfirmationModal";
import { AuthService } from "../../api";
import { isPlanAtLeast } from "../../constants/plans";

const loginType = AuthService.getLoginType();
const company = AuthService.getCompany();
const user = AuthService.getUser();

const currentPlan = company?.plan || "Basic";
// Main Store <-> franchise transfers: Standard+. Franchise <-> franchise: Business+.
const canTransferStock = isPlanAtLeast(currentPlan, "Standard");
const canInterFranchiseTransfer = isPlanAtLeast(currentPlan, "Business");
const isFranchise = loginType === "franchise";
const isStaff = user?.role === "staff";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ProductThumbnail = ({ image, name }) => {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const imageUrl = image?.startsWith("http")
    ? image
    : `${API_BASE_URL}${image || ""}`;

  if (!image || imageUnavailable) {
    return (
      <div
        className="h-11 w-11 rounded-md border border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-center text-[#ADB5BD]"
        title="No product image"
      >
        <MdImage className="text-[20px]" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${name || "Product"} thumbnail`}
      onError={() => setImageUnavailable(true)}
      className="h-11 w-11 rounded-md border border-[#DEE2E6] object-cover bg-[#F8F9FA]"
    />
  );
};

const ProductsHeader = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Read at render time so a plan change or re-login is picked up without a reload.
  const canImportCsv =
    AuthService.getLoginType() !== "franchise" &&
    AuthService.getUser()?.role !== "staff" &&
    isPlanAtLeast(AuthService.getCompany()?.plan, "Standard");

  const handleAddProduct = () => {
    navigate("/products/add");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }

    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-[12px] uppercase font-semibold tracking-[0.08em] text-[#6C757D] mb-2">
          Catalog Management
        </p>
        <h1 className="text-[28px] font-bold text-[#212529] mb-2">Products</h1>
        <p className="text-[14px] text-[#6C757D]">
          Manage your architectural hardware and materials inventory.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {canImportCsv && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                hidden
                onChange={handleCSVUpload}
              />

              <button
                onClick={handleImportClick}
                className="bg-[#0d5b96] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
              >
                Import CSV
              </button>
            </>
          )}

        <button
          onClick={handleAddProduct}
          className="bg-[#0d5b96] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
        >
          <MdAdd className="text-[18px]" />
          Add Product
        </button>
      </div>
    </div>
  );
};

const SummaryCards = ({ refreshKey = 0 }) => {
  const [stats, setStats] = useState({
    inventoryValue: "$0.00",
    lowStockAlerts: 0,
    totalProducts: 0,
    totalRevenue: "$0.00",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productResponse = await getProducts({ limit: 1000 });
        const orderResponse = await getOrderStats();

        if (productResponse.products) {
          const totalValue = productResponse.products.reduce(
            (sum, product) =>
              sum + Number(product.price) * Number(product.stock),
            0,
          );

          const lowStockCount = productResponse.products.filter(
            (product) =>
              Number(product.stock) <= Number(product.lowStockThreshold || 5),
          ).length;

          setStats({
            inventoryValue: `$${totalValue.toFixed(2)}`,
            lowStockAlerts: lowStockCount,
            totalProducts: productResponse.count || 0,
            totalRevenue: `$${(orderResponse.stats?.totalRevenue || 0).toFixed(
              2,
            )}`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [refreshKey]);

  const cards = [
    { label: "Inventory Value", value: stats.inventoryValue, icon: "payments" },
    { label: "Total Revenue", value: stats.totalRevenue, icon: "trending_up" },
    {
      label: "Low Stock Alerts",
      value: stats.lowStockAlerts.toString(),
      icon: "warning",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toString(),
      icon: "movement",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-5 shadow-md"
        >
          <p className="text-[12px] uppercase font-semibold text-[#6C757D] tracking-wide mb-2">
            {card.label}
          </p>
          <p className="text-[20px] font-bold text-[#212529]">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

const ProductsTable = ({ onProductsChanged }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingStockId, setEditingStockId] = useState(null);
  const [editingStockValue, setEditingStockValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [franchises, setFranchises] = useState([]);

  const [transferData, setTransferData] = useState({
    toLocationId: "",
    quantity: "",
    notes: "",
  });
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);
  const visiblePageCount = Math.min(3, totalPages);
  const firstVisiblePage = Math.max(
    1,
    Math.min(currentPage - 1, totalPages - visiblePageCount + 1),
  );
  const visiblePages =
    totalCount === 0
      ? []
      : Array.from(
          { length: visiblePageCount },
          (_, index) => firstVisiblePage + index,
        );
  const showingFrom = products.length > 0 ? (currentPage - 1) * limit + 1 : 0;
  const showingTo = products.length > 0 ? showingFrom + products.length - 1 : 0;
  const [stockData, setStockData] = useState({
    quantity: "",
    reason: "Purchase",
    notes: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (fetchError) {
        console.error("Failed to fetch categories:", fetchError);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const loginType = AuthService.getLoginType();

    if (!canTransferStock) {
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await getFranchiseLocations();

        const franchise = AuthService.getFranchise();

        let locations = response.locations || [];

        if (loginType === "franchise") {
          locations = locations.filter(
            (location) => location._id !== franchise._id,
          );

          // Below Business, a franchise can only send stock back to the Main Store
          if (!canInterFranchiseTransfer) {
            locations = locations.filter((location) => location.isDefault);
          }
        }

        setFranchises(locations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          page: currentPage,
          limit,
          search: searchTerm,
          category: categoryFilter,
        });

        if (response.products) {
          let filteredProducts = response.products;

          if (stockFilter) {
            filteredProducts = filteredProducts.filter((product) => {
              if (stockFilter === "in-stock") return product.stock > 5;
              if (stockFilter === "low-stock")
                return product.stock > 0 && product.stock <= 5;
              if (stockFilter === "out-of-stock") return product.stock === 0;
              return true;
            });
          }

          setProducts(filteredProducts);
          setTotalCount(response.count || filteredProducts.length);
        } else {
          setProducts([]);
          setTotalCount(response.count || 0);
        }

        setError("");
      } catch (fetchError) {
        setError(fetchError.message || "Failed to fetch products");
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, stockFilter]);

  const getStatusColor = (stock, threshold) => {
    if (stock === 0) {
      return {
        bg: "#F8D7DA",
        text: "#721C24",
        border: "#F5C6CB",
        status: "OUT OF STOCK",
      };
    }

    if (stock <= threshold) {
      return {
        bg: "#FFF3CD",
        text: "#856404",
        border: "#FFEEBA",
        status: "LOW STOCK",
      };
    }

    return {
      bg: "#D4EDDA",
      text: "#155724",
      border: "#C3E6CB",
      status: "IN STOCK",
    };
  };

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDetails = (productId) => {
    navigate(`/products/${productId}/details`);
  };

  const handleDelete = (productId) => {
    setDeleteProductId(productId);
    setIsDeleteConfirmOpen(true);
  };

  const handleStockEdit = (product) => {
    setEditingStockId(product.id);
    setEditingStockValue(product.stock.toString());
  };

  const handleAddStock = (product) => {
    setSelectedProduct(product);

    setStockData({
      quantity: "",
      reason: "Purchase",
      notes: "",
    });

    setShowAddStockModal(true);
  };

  const handleTransferStock = (product) => {
    setSelectedProduct(product);

    setTransferData({
      toLocationId: "",
      quantity: "",
      notes: "",
    });

    setShowTransferModal(true);
  };

  const handleSubmitStock = async () => {
    if (!stockData.quantity || Number(stockData.quantity) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    try {
      const response = await addStock(selectedProduct.id, stockData);

      toast.success(response.message);

      // Refresh current page
      const productsResponse = await getProducts({
        page: currentPage,
        limit,
        search: searchTerm,
        category: categoryFilter,
      });

      setProducts(productsResponse.products || []);
      setTotalCount(productsResponse.count || 0);

      onProductsChanged?.();

      setShowAddStockModal(false);
      setSelectedProduct(null);

      setStockData({
        quantity: "",
        reason: "Purchase",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSubmitTransfer = async () => {
    if (!transferData.toLocationId) {
      toast.error("Please select a location.");
      return;
    }

    if (!transferData.quantity || Number(transferData.quantity) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    try {
      const response = await transferStock({
        productId: selectedProduct.id,
        toLocationId: transferData.toLocationId,
        quantity: Number(transferData.quantity),
        notes: transferData.notes,
      });

      toast.success(response.message);

      // Refresh products
      const productsResponse = await getProducts({
        page: currentPage,
        limit,
        search: searchTerm,
        category: categoryFilter,
      });

      setProducts(productsResponse.products || []);
      setTotalCount(productsResponse.count || 0);

      onProductsChanged?.();

      setShowTransferModal(false);
      setSelectedProduct(null);

      setTransferData({
        toLocationId: "",
        quantity: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleStockSave = (productId) => {
    const newStock = parseInt(editingStockValue, 10);

    if (isNaN(newStock) || newStock < 0) {
      toast.error("Please enter a valid stock value (0 or more)");
      return;
    }

    // Update local state
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product,
      ),
    );

    setEditingStockId(null);
    setEditingStockValue("");

    // When backend is ready, call updateProductStock(productId, newStock)
    console.log(`Stock updated for product ${productId} to ${newStock}`);
  };

  const handleStockCancel = () => {
    setEditingStockId(null);
    setEditingStockValue("");
  };

  const onConfirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProduct(deleteProductId);
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setProducts((currentProducts) =>
          currentProducts.filter((product) => product.id !== deleteProductId),
        );
      }

      setTotalCount((count) => Math.max(0, count - 1));
      onProductsChanged?.();
      setIsDeleteConfirmOpen(false);
      setDeleteProductId(null);
    } catch (deleteError) {
      console.error("Failed to delete product:", deleteError);
      toast.error(deleteError.message || "Failed to delete product");
      setIsDeleteConfirmOpen(false);
      setDeleteProductId(null);
    }
  };

  const onCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteProductId(null);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-6 text-center">
        <p className="text-[#DC3545]">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] space-y-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[18px]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#6C757D] uppercase mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] focus:outline-none focus:border-[#0d5b96]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6C757D] uppercase mb-2">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(event) => {
                  setStockFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] focus:outline-none focus:border-[#0d5b96]"
              >
                <option value="">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter("");
                  setStockFilter("");
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] hover:bg-[#F8F9FA] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-[#6C757D]"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-[#6C757D]"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const statusInfo = getStatusColor(
                    product.stock,
                    product.lowStockThreshold || 5,
                  );

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                    >
                      <td className="px-6 py-3">
                        <ProductThumbnail
                          image={product.image}
                          name={product.name}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[14px] font-semibold text-[#212529]">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-mono text-[#212529]">
                          {product.sku}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#6C757D]">
                          {product.category &&
                          typeof product.category === "object"
                            ? product.category.name
                            : product.category}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {editingStockId === product.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editingStockValue}
                              onChange={(e) =>
                                setEditingStockValue(e.target.value)
                              }
                              className="w-16 px-2 py-1 border border-[#DEE2E6] rounded text-[14px] focus:outline-none focus:border-[#0d5b96]"
                              autoFocus
                            />
                            <button
                              onClick={() => handleStockSave(product.id)}
                              className="px-2 py-1 text-[12px] bg-[#28A745] text-white rounded hover:bg-[#218838] transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleStockCancel}
                              className="px-2 py-1 text-[12px] bg-[#6C757D] text-white rounded hover:bg-[#5a6268] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p
                            className="text-[14px] font-semibold text-[#212529] cursor-pointer hover:text-[#343A40] transition-colors"
                            onClick={() => handleStockEdit(product)}
                            title="Click to edit stock"
                          >
                            {product.stock}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] font-semibold text-[#212529]">
                          ${product.price.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border"
                          style={{
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.text,
                            borderColor: statusInfo.border,
                          }}
                        >
                          {statusInfo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="text-black hover:text-[#343A40] transition-colors"
                          >
                            <MdEdit className="text-[20px]" />
                          </button>

                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-[#DC3545] hover:text-[#c82333] transition-colors"
                              title="Delete Product"
                            >
                              <MdDelete className="text-[20px]" />
                            </button>
                          )}

                          <button
                            onClick={() => handleAddStock(product)}
                            className="text-[#198754] hover:text-[#157347] transition-colors"
                            title="Add Stock"
                          >
                            <MdInventory className="text-[20px]" />
                          </button>

                          {canTransferStock && (
                            <button
                              onClick={() => handleTransferStock(product)}
                              className="text-[#0D6EFD] hover:text-[#0A58CA] transition-colors"
                              title="Transfer Stock"
                            >
                              <MdSwapHoriz className="text-[20px]" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDetails(product.id)}
                            className="px-2 py-1 border border-[#DEE2E6] rounded text-[12px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
          <span className="text-[13px] text-[#6C757D]">
            Showing {showingFrom}-{showingTo} of {totalCount} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-[13px] transition-colors ${
                  page === currentPage
                    ? "bg-[#0d5b96] text-white"
                    : "border border-[#DEE2E6] hover:bg-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(Math.max(totalPages, 1), currentPage + 1),
                )
              }
              disabled={totalCount === 0 || currentPage >= totalPages}
              className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
          isDangerous={true}
        />

        {/* Add Stock Modal */}

        {showAddStockModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-5">Add Stock</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product
                  </label>

                  <input
                    type="text"
                    value={selectedProduct.name}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Stock
                  </label>

                  <input
                    type="text"
                    value={selectedProduct.stock}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity to Add
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={stockData.quantity}
                    onChange={(e) =>
                      setStockData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    placeholder="Enter quantity"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason
                  </label>

                  <select
                    value={stockData.reason}
                    onChange={(e) =>
                      setStockData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Purchase">Purchase</option>
                    <option value="Return">Return</option>
                    <option value="Manual Adjustment">Manual Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes
                  </label>

                  <textarea
                    rows={3}
                    value={stockData.notes}
                    onChange={(e) =>
                      setStockData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Optional notes..."
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddStockModal(false);
                    setSelectedProduct(null);

                    setStockData({
                      quantity: "",
                      reason: "Purchase",
                      notes: "",
                    });
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitStock}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Stock Modal */}

        {showTransferModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-5">Transfer Stock</h2>

              <div className="space-y-4">
                {/* Product */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product
                  </label>

                  <input
                    type="text"
                    value={selectedProduct.name}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Current Stock */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Main Store Stock
                  </label>

                  <input
                    type="text"
                    value={selectedProduct.stock}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Transfer To
                  </label>

                  <select
                    value={transferData.toLocationId}
                    onChange={(e) =>
                      setTransferData((prev) => ({
                        ...prev,
                        toLocationId: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Location</option>

                    {franchises.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.locationName || location.company_name}
                        {location.name ? ` (${location.name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={transferData.quantity}
                    onChange={(e) =>
                      setTransferData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes
                  </label>

                  <textarea
                    rows={3}
                    value={transferData.notes}
                    onChange={(e) =>
                      setTransferData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Optional notes..."
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedProduct(null);

                    setTransferData({
                      toLocationId: "",
                      quantity: "",
                      notes: "",
                    });
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitTransfer}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { ProductsHeader, SummaryCards, ProductsTable };
