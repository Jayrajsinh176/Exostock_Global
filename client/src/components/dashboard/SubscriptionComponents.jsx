import { useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdWarning,
  MdDone,
  MdReceiptLong,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { PLAN_ORDER } from "../../constants/plans";
import {
  formatPlanPrice,
  STARTS_AT_PLANS,
} from "../../constants/pricing";
import {
  getCurrentSubscription,
  getPlans,
  getProducts,
  getUsers,
  AuthService,
  updateSubscriptionPlan,
  getCompanyProfile,
  cancelCompanySubscription,
  getFranchises,
  getCompanyBillingHistory,
} from "../../api";

const CurrentPlanBanner = () => {
  const [subscription, setSubscription] = useState(null);
  const [company, setCompany] = useState(AuthService.getCompany());
  const [isCancelling, setIsCancelling] = useState(false);

  const navigate = useNavigate();

  const isFranchise = AuthService.isFranchise();
  const isStaff = AuthService.getUser()?.role === "staff";

  useEffect(() => {
    if (isFranchise || isStaff) {
      navigate("/dashboard", { replace: true });
    }
  }, [isFranchise, isStaff, navigate]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await getCurrentSubscription();
        setSubscription(response.data || response);
      } catch (error) {
        console.error("Failed to fetch subscription details:", error);
      }
    };
    fetchSubscription();
  }, []);

  useEffect(() => {
    setCompany(AuthService.getCompany());
  }, []);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  const currentPlanName = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : company?.plan
      ? company.plan.charAt(0).toUpperCase() + company.plan.slice(1)
      : "Basic";

  const startDate =
    subscription?.startDate || company?.subscription_start_date || null;
  const endDate =
    subscription?.endDate || company?.subscription_end_date || null;

  const expiryDate = endDate ? new Date(endDate) : null;

  const daysLeft = expiryDate
    ? Math.max(
        0,
        Math.ceil(
          (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  const isTrial = (subscription?.plan || company?.plan) === "Trial";
  const trialMessage = isTrial
    ? daysLeft > 0
      ? `Your free trial expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
      : "Your trial expires today. Upgrade to keep your access."
    : "";

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelCompanySubscription();
      const updatedCompany = await getCompanyProfile();
      AuthService.setCompany(updatedCompany);
      setCompany(updatedCompany);
      const response = await getCurrentSubscription();
      setSubscription(response.data || response);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg p-6 shadow-md mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4">
            <h3 className="text-[18px] font-semibold text-[#212529]">
              {currentPlanName} Plan
            </h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4EDDA] border border-[#C3E6CB] rounded-full text-[11px] font-semibold text-[#155724]">
              <MdCheckCircle className="text-[14px]" />
              Active
            </span>
          </div>

          <div className="space-y-2 text-[14px] text-[#6C757D]">
            <p>
              Starting Date:{" "}
              <span className="font-semibold text-[#212529]">
                {formatDate(startDate)}
              </span>
            </p>
            <p>
              Expiry Date:{" "}
              <span className="font-semibold text-[#212529]">
                {formatDate(endDate)}
              </span>
            </p>
            {trialMessage && (
              <p className="text-[#856404] bg-[#fff3cd] border border-[#ffeeba] px-3 py-2 rounded-lg mt-2">
                {trialMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] font-semibold text-[#212529] hover:bg-[#F8F9FA] transition-colors">
            Manage Plan
          </button>
          <button
            className="px-4 py-2 bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg text-[14px] font-semibold text-[#721C24] hover:bg-[#F5C6CB] transition-colors disabled:opacity-60"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

const UsageProgressBar = () => {
  const [usage, setUsage] = useState({
    products: 0,
    users: 0,
    maxProducts: 50,
    maxUsers: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setLoading(true);
        const [productsRes, usersRes, franchiseRes] = await Promise.all([
          getProducts({ limit: 1000 }),
          getUsers({ limit: 1000 }),
          getFranchises(),
        ]);

        const productCount = productsRes.count || 0;
        // Admin (company owner) doesn't count against the plan's staff limit
        const userCount = (usersRes.data || []).filter(
          (user) => user.role !== "admin",
        ).length;
        const franchiseCount = franchiseRes.data?.length || 0;

        const company = AuthService.getCompany();
        const planKey = company?.plan || "Basic";

        const plansRes = await getPlans();
        const plans = plansRes.data || [];
        const currentPlan = plans.find((p) => p.id === planKey);

        const isUnlimited = (value) =>
          typeof value === "string" && value.toLowerCase() === "unlimited";
        const maxProducts = isUnlimited(currentPlan?.maxProducts)
          ? Infinity
          : currentPlan?.maxProducts || 50;
        const maxUsers = isUnlimited(currentPlan?.maxUsers)
          ? Infinity
          : currentPlan?.maxUsers || 1;
        const maxLocations = isUnlimited(currentPlan?.maxLocations)
          ? Infinity
          : currentPlan?.maxLocations || 0;

        setUsage({
          products: productCount,
          users: userCount,
          franchises: franchiseCount,
          maxProducts,
          maxUsers,
          maxLocations,
        });
      } catch (error) {
        console.error("Failed to fetch usage:", error);
        setUsage({
          products: 0,
          users: 0,
          franchises: 0,
          maxProducts: 50,
          maxUsers: 1,
          maxLocations: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  const productPercentage =
    usage.maxProducts > 0
      ? (usage.products / usage.maxProducts) * 100
      : usage.products > 0
        ? 100
        : 0;
  const userPercentage =
    usage.maxUsers > 0
      ? (usage.users / usage.maxUsers) * 100
      : usage.users > 0
        ? 100
        : 0;
  const franchisePercentage =
    usage.maxLocations > 0
      ? (usage.franchises / usage.maxLocations) * 100
      : usage.franchises > 0
        ? 100
        : 0;

  const isOverProductLimit = usage.products > usage.maxProducts;
  const isOverUserLimit = usage.users > usage.maxUsers;
  const isOverFranchiseLimit = usage.franchises > usage.maxLocations;

  const isNearProductLimit = !isOverProductLimit && productPercentage > 80;
  const isNearUserLimit = !isOverUserLimit && userPercentage > 80;
  const isNearFranchiseLimit =
    !isOverFranchiseLimit && franchisePercentage > 80;

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg p-6 shadow-md mb-8">
      <h3 className="text-[16px] font-semibold text-[#212529] mb-6">
        Plan Usage
      </h3>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] text-[#6C757D]">Products</span>
            <span className="text-[14px] font-semibold text-[#212529]">
              {usage.products} /{" "}
              {Number.isFinite(usage.maxProducts) ? usage.maxProducts : "∞"}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverProductLimit
                  ? "bg-red-500"
                  : isNearProductLimit
                    ? "bg-[#FFC107]"
                    : "bg-[#0d5b96]"
              }`}
              style={{ width: `${Math.min(productPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] text-[#6C757D]">Users</span>
            <span className="text-[14px] font-semibold text-[#212529]">
              {usage.users} /{" "}
              {Number.isFinite(usage.maxUsers) ? usage.maxUsers : "∞"}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverUserLimit
                  ? "bg-red-500"
                  : isNearUserLimit
                    ? "bg-[#FFC107]"
                    : "bg-[#0d5b96]"
              }`}
              style={{ width: `${Math.min(userPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] text-[#6C757D]">Franchises</span>
            <span className="text-[14px] font-semibold text-[#212529]">
              {usage.franchises} /{" "}
              {Number.isFinite(usage.maxLocations) ? usage.maxLocations : "∞"}
            </span>
          </div>

          <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverFranchiseLimit
                  ? "bg-red-500"
                  : isNearFranchiseLimit
                    ? "bg-[#FFC107]"
                    : "bg-[#0d5b96]"
              }`}
              style={{ width: `${Math.min(franchisePercentage, 100)}%` }}
            />
          </div>
        </div>

        {isOverProductLimit || isOverUserLimit || isOverFranchiseLimit ? (
          <div className="text-[13px] text-red-600 flex items-center gap-2">
            <MdWarning className="text-[16px] text-red-600" />
            <span>
              You have exceeded your plan limit. Please upgrade your plan to
              avoid service interruption.
            </span>
          </div>
        ) : (
          (isNearProductLimit || isNearUserLimit || isNearFranchiseLimit) && (
            <div className="text-[13px] text-[#6C757D] flex items-center gap-2">
              <MdWarning className="text-[16px] text-[#FFC107]" />
              <span>
                You are approaching your plan limit. Consider upgrading to the
                next tier for more capacity.
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const PlanUpgradeCards = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState("Basic");
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState(false);

  const sortedPlans = [...plans].sort(
    (a, b) => PLAN_ORDER.indexOf(a.id) - PLAN_ORDER.indexOf(b.id),
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const company = AuthService.getCompany();
        setCurrentPlanId(company?.plan || "Basic");

        const response = await getPlans();
        const plansData = response.data || [];
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === currentPlanId) return;
    setUpdatingPlan(true);
    try {
      await updateSubscriptionPlan(planId, "monthly", "USD");
      const companyRes = await getCompanyProfile();
      const updatedCompany = companyRes?.company || companyRes;
      AuthService.setCompany(updatedCompany);
      setCurrentPlanId(updatedCompany.plan);
    } catch (err) {
      console.error("Upgrade failed:", err);
    } finally {
      setUpdatingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h3 className="text-[18px] font-semibold text-[#212529] mb-6">
          Upgrade Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-[#DEE2E6] p-6 shadow-md animate-pulse"
            >
              <div className="h-6 bg-[#E9ECEF] rounded w-20 mb-4"></div>
              <div className="h-4 bg-[#E9ECEF] rounded w-full mb-6"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-[#E9ECEF] rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-[18px] font-semibold text-[#212529] mb-6">
        Upgrade Options
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const planPrice =
            plan.id === "Custom"
              ? "Contact Sales"
              : plan.durationDays
                ? `Free for ${plan.durationDays} days`
                : `${STARTS_AT_PLANS.includes(plan.id) ? "Starts at " : ""}${formatPlanPrice(plan.priceMonthlyUSD, "USD")} / mo`;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 shadow-sm transition-all duration-150 ${
                isCurrent
                  ? "border-[#0d5b96] bg-white shadow-xl"
                  : "border-[#E9ECEF] bg-white hover:border-[#0d5b96] hover:shadow-lg"
              }`}
            >
              {isCurrent && (
                <span className="inline-block px-3 py-1 bg-[#0d5b96] text-white text-[11px] font-semibold rounded-full mb-3">
                  Current Plan
                </span>
              )}

              <h4 className="text-[20px] font-semibold text-[#212529] mb-1 capitalize">
                {plan.label}
              </h4>
              <p className="text-[13px] uppercase tracking-[0.2em] text-[#6C757D] mb-4">
                {plan.id === "Trial" ? "Trial Offer" : "Monthly plan"}
              </p>

              <div className="mb-5">
                <span className="text-[28px] font-bold text-[#212529]">
                  {planPrice}
                </span>
                <span className="block mt-2 text-[13px] text-[#6C757D]">
                  {plan.durationDays
                    ? `${plan.durationDays}-day free trial`
                    : plan.id === "Custom"
                      ? "Custom pricing"
                      : "Billed monthly"}
                </span>
              </div>

              <div className="mb-5 text-[14px] text-[#495057] space-y-2">
                <p>
                  <span className="font-semibold text-[#212529]">
                    Products:
                  </span>{" "}
                  {plan.maxProducts === "unlimited" ||
                  plan.maxProducts === Infinity
                    ? "Unlimited"
                    : plan.maxProducts}
                </p>
                <p>
                  <span className="font-semibold text-[#212529]">Users:</span>{" "}
                  {plan.id === "Enterprise"
                    ? "10+"
                    : plan.maxUsers === "unlimited" ||
                        plan.maxUsers === Infinity
                      ? "Unlimited"
                      : plan.maxUsers}
                </p>
                <p>
                  <span className="font-semibold text-[#212529]">
                    Franchises:
                  </span>{" "}
                  {plan.maxLocations === "Unlimited"
                    ? "Unlimited"
                    : plan.maxLocations}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-[14px] font-semibold text-[#212529] mb-3">
                  What’s included
                </p>
                <ul className="space-y-3 text-[13px] text-[#6C757D]">
                  {plan.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <MdDone className="text-[16px] text-[#28A745] mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 text-[13px] text-[#6C757D]">
                <p className="font-semibold text-[#212529] mb-2">
                  Support level
                </p>
                <p>{plan.support || "Email support and knowledge base"}</p>
              </div>

              <button
                className={`w-full py-3 rounded-full text-[14px] font-semibold transition-colors ${
                  isCurrent
                    ? "bg-[#F8F9FA] text-[#212529] border border-[#DEE2E6] cursor-not-allowed"
                    : "bg-[#0d5b96] text-white hover:bg-[#1A1A1A]"
                }`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || updatingPlan || plan.id === "Custom"}
              >
                {isCurrent
                  ? "Current Plan"
                  : updatingPlan
                    ? "Updating..."
                    : plan.id === "Trial"
                      ? "Start Trial"
                      : plan.id === "Basic"
                        ? "Choose Basic"
                        : plan.id === "Standard"
                          ? "Upgrade to Standard"
                          : plan.id === "Business"
                            ? "Upgrade to Business"
                            : "Contact Sales"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PAGE_SIZE = 4;

const formatTransactionDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$" };

const formatTransactionAmount = (amount, currency = "USD") => {
  const value = Number(amount) || 0;
  if (value === 0) return "Free";
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  return `${symbol}${value.toLocaleString(
    currency === "USD" ? "en-US" : "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
};

const STATUS_STYLES = {
  paid: "bg-[#D4EDDA] border-[#C3E6CB] text-[#155724]",
  pending: "bg-[#FFF3CD] border-[#FFEEBA] text-[#856404]",
  failed: "bg-[#F8D7DA] border-[#F5C6CB] text-[#721C24]",
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getCompanyBillingHistory();
        setTransactions(response.billingHistory || []);
      } catch (fetchError) {
        setError(
          fetchError.message || "Unable to load transaction history.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleTransactions = transactions.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  return (
    <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] flex items-center gap-2">
        <MdReceiptLong className="text-[20px] text-[#6C757D]" />
        <h3 className="text-[18px] font-semibold text-[#212529]">
          Recent Transactions
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Transaction Code
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Date
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[14px] text-[#6C757D]"
                >
                  Loading transactions...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[14px] text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : visibleTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[14px] text-[#6C757D]"
                >
                  No transactions yet. Changing your plan will show up here.
                </td>
              </tr>
            ) : (
              visibleTransactions.map((tx) => (
                <tr
                  key={tx._id || tx.transactionCode}
                  className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                >
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-mono font-semibold text-[#212529]">
                      {tx.transactionCode}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] text-[#6C757D]">
                      {formatTransactionDate(tx.date)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-semibold text-[#212529]">
                      {formatTransactionAmount(tx.amount, tx.currency)}
                    </p>
                    {tx.gst > 0 && (
                      <p className="text-[12px] text-[#6C757D]">
                        {formatTransactionAmount(tx.subtotal, tx.currency)} +{" "}
                        {formatTransactionAmount(tx.gst, tx.currency)} GST (
                        {tx.gstRate}%)
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 border rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[tx.status] || STATUS_STYLES.paid}`}
                    >
                      {tx.status || "paid"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && transactions.length > 0 && (
        <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
          <span className="text-[13px] text-[#6C757D]">
            Showing {startIndex + 1}–{startIndex + visibleTransactions.length}{" "}
            of {transactions.length} transactions
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded text-[13px] transition-colors ${
                  p === currentPage
                    ? "bg-[#0d5b96] text-white"
                    : "border border-[#DEE2E6] hover:bg-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export {
  CurrentPlanBanner,
  UsageProgressBar,
  PlanUpgradeCards,
  TransactionHistory,
};
