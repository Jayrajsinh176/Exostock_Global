import { MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import KPICards from "../components/dashboard/KPICards";
import InventoryTrendChart from "../components/dashboard/InventoryTrendChart";
import InventoryHealthFeed from "../components/dashboard/InventoryHealthFeed";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import RecentOrders from "../components/dashboard/RecentOrders";
import SubscriptionAlert from "../components/dashboard/SubscriptionAlert";
import DailySalesSummary from "../components/dashboard/DailySalesSummary";
import BusinessOverview from "../components/dashboard/BusinessOverview";
import { AuthService } from "../api";
const DashboardPage = () => {
  const isFranchise = AuthService.isFranchise();
  const hasBusinessAccess = AuthService.hasBusinessAccess();
  const hasStandardAccess = AuthService.hasStandardAccess();
  const user = AuthService.getUser();
  const isStaff = user?.role === "staff";

  const handleExportReport = () => {
    // For now, show a toast. In production, this would generate a PDF/CSV
    toast(
      "Export functionality coming soon! This will generate a PDF/CSV report of your inventory data.",
    );
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[300px]">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-[24px] font-bold text-[#212529] sm:text-[28px]">
                Inventory Overview
              </h1>
              <p className="text-[13px] text-[#6C757D] sm:text-[14px]">
                Real-time status of your global architecture warehouse.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isStaff && (
                <button
                  onClick={handleExportReport}
                  className="rounded-lg border border-[#DEE2E6] px-4 py-2 text-[13px] font-semibold text-[#212529] transition-colors hover:bg-[#F8F9FA] sm:text-[14px]"
                >
                  Export Report
                </button>
              )}
            </div>
          </div>

          {!isFranchise && !isStaff && <SubscriptionAlert />}

          {/* KPI Cards */}
          <KPICards />

          {hasBusinessAccess && !isFranchise && !isStaff && (
            <BusinessOverview />
          )}

          {/* Daily Sales Summary */}
          <DailySalesSummary />

          {/* Low Stock Alerts Table */}
          {hasStandardAccess && <LowStockAlerts />}

          {/* Inventory Trend Chart */}
          {!isStaff && <InventoryTrendChart />}

          {/* Recent Orders Table */}
          <RecentOrders />
          {/* Inventory Health Feed */}
          {/* <InventoryHealthFeed /> */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
