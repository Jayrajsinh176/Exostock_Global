import {
  MdInventory2,
  MdCategory,
  MdWarning,
  MdPayments,
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { PLAN_PRODUCT_LIMITS } from "../../constants/plans";
import {
  getProductStats,
  getCategories,
  getProducts,
  getOrderStats,
  AuthService,
} from "../../api";

const KPICards = () => {
  const [stats, setStats] = useState({
    totalProducts: "0",
    totalCategories: "0",
    lowStockItems: "0",
    inventoryValue: "$0.00",
    totalRevenue: "$0.00",

    todayRevenue: "$0.00",
    todayOrders: "0",
    todayItemsSold: "0",
  });
  const [loading, setLoading] = useState(true);
  const isFranchise = AuthService.isFranchise();

  const company = AuthService.getCompany();

  const productLimit = PLAN_PRODUCT_LIMITS[company?.plan] ?? Infinity;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [statsResponse, categoriesResponse, orderStatsResponse] =
          await Promise.all([
            getProductStats(),
            getCategories(),
            getOrderStats(),
          ]);

        // Extract stats from response
        const productStats = statsResponse.stats || {};
        const categories = categoriesResponse.data || [];

        // Calculate total revenue
        const totalRevenue = orderStatsResponse.stats?.totalRevenue || 0;

        const todayOrders = orderStatsResponse.stats?.todayOrders || 0;

        const todayItemsSold = orderStatsResponse.stats?.todayItemsSold || 0;

        setStats({
          totalProducts: productStats.totalProducts?.toString() || "0",
          totalCategories: categories.length.toString(),
          lowStockItems: productStats.lowStocksAlerts?.toString() || "0",
          inventoryValue: `$${parseFloat(productStats.inventoryValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          totalRevenue: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          todayOrders: todayOrders.toString(),

          todayItemsSold: todayItemsSold.toString(),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats({
          totalProducts: "0",
          totalCategories: "0",
          lowStockItems: "0",
          inventoryValue: "$0.00",
          totalRevenue: "$0.00",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const hasStandardAccess = AuthService.hasStandardAccess();

  const allCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      description: Number.isFinite(productLimit)
        ? `${stats.totalProducts} / ${productLimit} Products Used`
        : "Unlimited Products",
      trend: "neutral",
      icon: MdInventory2,
      color: "#007BFF",
    },
    {
      label: "Total Categories",
      value: stats.totalCategories,
      description: "Product categories",
      trend: "neutral",
      icon: MdCategory,
      color: "#28A745",
    },
    {
      label: "Total Revenue",
      value: stats.totalRevenue,
      description: "Expected revenue from stock",
      trend: "up",
      icon: MdAttachMoney,
      color: "#FFC107",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockItems,
      description:
        parseInt(stats.lowStockItems) > 0
          ? "Items need attention"
          : "All items stocked",
      statusLabel: parseInt(stats.lowStockItems) > 0 ? "Alert" : "OK",
      status: parseInt(stats.lowStockItems) > 0 ? "critical" : "good",
      trend: "down",
      icon: MdWarning,
      color: parseInt(stats.lowStockItems) > 0 ? "#DC3545" : "#28A745",
    },
    {
      label: "Total Inventory Value",
      value: stats.inventoryValue,
      description: "Current stock value",
      trend: "up",
      icon: MdPayments,
      color: "#6610F2",
    },
  ];

  // Low stock alerts are a Standard-plan feature.
  const cards = hasStandardAccess
    ? allCards
    : allCards.filter((card) => card.label !== "Low Stock Items");
  const gridCols = hasStandardAccess ? "xl:grid-cols-5" : "xl:grid-cols-4";

  if (loading) {
    return (
      <div className={`mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridCols}`}>
        {[...Array(cards.length)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#DEE2E6] p-4 shadow-md animate-pulse sm:p-5 xl:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-[#E9ECEF] rounded w-3/4"></div>
              <div className="w-10 h-10 bg-[#E9ECEF] rounded-lg"></div>
            </div>
            <div className="h-8 bg-[#E9ECEF] rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-[#E9ECEF] rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridCols}`}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#DEE2E6] p-4 shadow-md transition-shadow duration-150 hover:shadow-lg sm:p-5 xl:p-6"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6C757D] sm:text-[11px]">
              {card.label}
            </p>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${card.color}15` }}
            >
              {card.icon && (
                <card.icon
                  className="text-[18px] sm:text-[20px]"
                  style={{ color: card.color }}
                />
              )}
            </div>
          </div>

          <p className="mb-2 text-[22px] font-bold text-[#212529] sm:text-[24px] xl:text-[28px]">
            {card.value}
          </p>

          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-[#6C757D] sm:text-[12px]">
              {card.description}
            </p>
            {card.statusLabel && (
              <span
                className={`whitespace-nowrap rounded px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${
                  card.status === "critical"
                    ? "bg-[#FEE2E2] text-[#DC3545]"
                    : "bg-[#D1FAE5] text-[#059669]"
                }`}
              >
                {card.statusLabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
