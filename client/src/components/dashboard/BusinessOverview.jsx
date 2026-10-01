import { useEffect, useState } from "react";
import {
  MdStore,
  MdShoppingCart,
  MdInventory2,
  MdPeople,
} from "react-icons/md";
import { getBusinessOverview } from "../../api";

const BusinessOverview = () => {
  const [stats, setStats] = useState({
    totalFranchises: 0,
    totalOrders: 0,
    totalProductsSold: 0,
    totalStaff: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessOverview = async () => {
      try {
        const response = await getBusinessOverview();
        setStats(response.stats);
      } catch (error) {
        console.error("Failed to fetch business overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessOverview();
  }, []);

  const cards = [
    {
      label: "Total Franchises",
      value: stats.totalFranchises,
      description: "Active franchise locations",
      icon: MdStore,
      color: "#007BFF",
    },
    {
      label: "Total Staff",
      value: stats.totalStaff,
      description: "Active company users",
      icon: MdPeople,
      color: "#6F42C1",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      description: "Company-wide orders",
      icon: MdShoppingCart,
      color: "#28A745",
    },
    {
      label: "Products Sold",
      value: stats.totalProductsSold,
      description: "Company-wide units sold",
      icon: MdInventory2,
      color: "#FD7E14",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md animate-pulse"
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
    <>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#212529]">
          Business Overview
        </h2>
        <p className="text-sm text-[#6C757D]">
          Company-wide franchise performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md hover:shadow-lg transition-shadow duration-150"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-[11px] uppercase font-semibold text-[#6C757D] tracking-[0.08em]">
                {card.label}
              </p>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon
                  className="text-[20px]"
                  style={{ color: card.color }}
                />
              </div>
            </div>

            <p className="text-[28px] font-bold text-[#212529] mb-2">
              {card.value}
            </p>

            <p className="text-[12px] text-[#6C757D]">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default BusinessOverview;
