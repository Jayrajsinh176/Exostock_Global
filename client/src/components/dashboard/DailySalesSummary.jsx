import { useEffect, useState } from "react";
import {
  MdShoppingCart,
  MdAttachMoney,
  MdInventory2,
  MdTrendingUp,
} from "react-icons/md";
import { getDailySalesSummary, AuthService } from "../../api";

const DailySalesSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFranchise = AuthService.isFranchise();
const user = AuthService.getUser();
const isStaff = user?.role === "staff";

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await getDailySalesSummary();

      setSummary({
        totalOrders: data.summary.totalOrders,
        totalRevenue: data.summary.totalRevenue,
        productsSold: data.summary.productsSold,
        averageOrder: data.summary.averageOrder,
      });
    } catch (error) {
      console.log(error);

      // Basic/Trial users will receive 403 from backend
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center text-gray-500">
          Loading Daily Sales Summary...
        </div>
      </div>
    );
  }

  if (isStaff) {
  return null;
}
  // Hide component if user doesn't have access
  if (!summary) {
    return null;
  }

  const cards = [
    {
      title: "Today's Orders",
      value: summary.totalOrders,
      icon: <MdShoppingCart className="text-3xl text-blue-600" />,
    },
    {
      title: "Today's Revenue",
      value: `$${summary.totalRevenue.toFixed(2)}`,
      icon: <MdAttachMoney className="text-3xl text-green-600" />,
    },
    {
      title: "Products Sold",
      value: summary.productsSold,
      icon: <MdInventory2 className="text-3xl text-orange-600" />,
    },
    {
      title: "Average Order",
      value: `$${summary.averageOrder.toFixed(2)}`,
      icon: <MdTrendingUp className="text-3xl text-purple-600" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#212529]">
          Daily Sales Summary
        </h2>
        <p className="text-sm text-[#6C757D]">
          Today's sales performance overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              {card.icon}
            </div>

            <h3 className="text-2xl font-bold text-[#212529]">
              {card.value}
            </h3>

            <p className="text-sm text-[#6C757D] mt-1">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySalesSummary;