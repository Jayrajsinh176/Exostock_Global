import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import {
  CurrentPlanBanner,
  UsageProgressBar,
  TransactionHistory,
} from "../components/dashboard/SubscriptionComponents";
import PricingUpgradeCards from "../components/dashboard/PricingUpgradeCards";

const SubscriptionPage = () => {
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
          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-[#212529] mb-2">
              Subscription & Billing
            </h1>
            <p className="text-[14px] text-[#6C757D]">
              View and manage your current subscription plan and explore upgrade
              options.
            </p>
          </div>

          {/* Current Plan Banner */}
          <CurrentPlanBanner />

          {/* Usage Progress Bar */}
          <UsageProgressBar />

          {/* Plan Upgrade Cards */}
          <PricingUpgradeCards />

          {/* Transaction History */}
          <TransactionHistory />
        </main>
      </div>
    </div>
  );
};

export default SubscriptionPage;
