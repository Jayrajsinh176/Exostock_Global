import { MdWarning, MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLowStockProducts, AuthService } from "../../api";

const LowStockAlerts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = AuthService.getUser();

  const isCompanyUser = !user?.locationId;
  const isFranchiseUser = !!user?.locationId;

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        const response = await getLowStockProducts();
        const lowStockProducts = response["low-stock-products"] || [];

        // Map backend data to component data format
        const mappedProducts = lowStockProducts.map((product) => ({
          id: product._id || product.id,
          name: product.name,
          material: product.category?.name || "Uncategorized",
          sku: product.sku,
          vendorId: product.vendor?._id || product.vendor || "",
          category: product.category?.name || "N/A",
          stock: product.stock,
          threshold: product.lowStockThreshold || 5, // Default threshold
          status:
            product.stock === 0
              ? "OUT OF STOCK"
              : product.stock <= product.lowStockThreshold
                ? "LOW STOCK"
                : "IN STOCK",
          image: "📦",
        }));

        setProducts(mappedProducts);
        setError("");
      } catch (err) {
        console.error("Failed to fetch low stock products:", err);
        setError(err.message || "Failed to fetch low stock products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "LOW STOCK":
        return { bg: "#FFF3CD", text: "#856404", border: "#FFEEBA" };
      case "CRITICAL":
        return { bg: "#F8D7DA", text: "#721C24", border: "#F5C6CB" };
      case "OUT OF STOCK":
        return { bg: "#F8D7DA", text: "#721C24", border: "#F5C6CB" };
      default:
        return { bg: "#D4EDDA", text: "#155724", border: "#C3E6CB" };
    }
  };

  if (loading) {
    return (
      <div className="mb-5 overflow-hidden rounded-[18px] border border-[#0B5ED7] bg-white shadow-none">
        <div className="border-b border-[#0B5ED7] bg-[#F8F9FA] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <MdWarning className="text-[18px] text-[#DC3545] sm:text-[20px]" />
            <h3 className="text-[16px] font-semibold text-[#212529] sm:text-[18px]">
              Low Stock Alerts
            </h3>
          </div>
        </div>
        <div className="p-4 text-center sm:p-6">
          <p className="text-[#6C757D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-5 overflow-hidden rounded-[18px] border border-[#0B5ED7] bg-white shadow-none">
        <div className="border-b border-[#0B5ED7] bg-[#F8F9FA] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <MdWarning className="text-[18px] text-[#DC3545] sm:text-[20px]" />
            <h3 className="text-[16px] font-semibold text-[#212529] sm:text-[18px]">
              Low Stock Alerts
            </h3>
          </div>
        </div>
        <div className="p-4 text-center sm:p-6">
          <p className="text-[#DC3545]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 overflow-hidden rounded-[18px] border border-[#0B5ED7] bg-white shadow-none">
      <div className="border-b border-[#0B5ED7] bg-[#F8F9FA] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <MdWarning className="text-[18px] text-[#DC3545] sm:text-[20px]" />
          <h3 className="text-[16px] font-semibold text-[#212529] sm:text-[18px]">
            Low Stock Alerts
          </h3>
          <span className="ml-auto text-[11px] text-[#6C757D] sm:text-[12px]">
            {products.length} items
          </span>
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-[#DEE2E6] bg-[#F8F9FA]">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6C757D]">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6C757D]">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6C757D]">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6C757D]">
                    Threshold Status
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6C757D]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const colors = getStatusColor(product.status);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-[#F1F3F5] transition-colors duration-100 hover:bg-[#F8F9FA]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E9ECEF] text-[20px]">
                            {product.image}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#212529]">
                              {product.name}
                            </p>
                            <p className="text-[12px] text-[#6C757D]">
                              {product.material}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-mono text-[#6C757D]">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#212529]">
                            {product.stock} Units
                          </span>
                          {product.stock < product.threshold / 2 ? (
                            <span className="text-[12px] font-bold text-[#DC3545]">
                              —
                            </span>
                          ) : (
                            <span className="text-[12px] font-bold text-[#FFC107]">
                              ―
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block rounded px-3 py-1 text-[11px] font-semibold"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isCompanyUser ? (
                          <button className="rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700">
                            Restock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const params = new URLSearchParams({
                                productId: product.id,
                              });
                              if (product.vendorId) {
                                params.set("vendorId", product.vendorId);
                              }
                              navigate(`/purchases/add?${params}`);
                            }}
                            className="rounded bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600"
                          >
                            Request Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 sm:p-4 md:hidden">
            {products.map((product) => {
              const colors = getStatusColor(product.status);
              return (
                <div
                  key={product.id}
                  className="rounded-lg border border-[#E9ECEF] bg-[#F8F9FA] p-3"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E9ECEF] text-[18px]">
                      {product.image}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[#212529]">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-[#6C757D]">
                        {product.material}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6C757D]">
                    <div>
                      <p className="mb-1 font-medium text-[#495057]">SKU</p>
                      <p className="font-mono text-[#6C757D]">{product.sku}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-[#495057]">Stock</p>
                      <p className="font-semibold text-[#212529]">
                        {product.stock} units
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className="inline-block rounded px-2 py-1 text-[10px] font-semibold"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {product.status}
                    </span>

                    {isCompanyUser ? (
                      <button className="rounded bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-blue-700">
                        Restock
                      </button>
                    ) : (
                      <button className="rounded bg-orange-500 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-orange-600">
                        Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex min-h-[180px] items-center justify-center border-t border-[#0B5ED7] bg-white px-4 py-6 text-center sm:px-6">
          <p className="text-[18px] font-normal text-[#1F6FB2]">No low stock items found</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="border-t border-[#0B5ED7] px-4 py-3 text-center sm:px-6">
          <button className="text-[12px] font-semibold uppercase tracking-wider text-[#007BFF] transition-colors hover:text-[#0056b3] sm:text-[14px]">
            View All Low Stock Items
          </button>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
