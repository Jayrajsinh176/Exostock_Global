import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFranchiseById, AuthService } from "../../api";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

/* ---------- tiny inline icons (no extra deps) ---------- */

const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  building:
    "M4 21V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M12 21V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v18M4 21h16M8 10h.01M8 14h.01M16 6h.01M16 10h.01M16 14h.01",
  user: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  store:
    "M3 9l1.5-5h15L21 9M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 20v-6h6v6",
  card: "M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7ZM3 10h18",
  clock: "M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  box: "M3 8l9-5 9 5-9 5-9-5ZM3 8v9l9 5M21 8v9l-9 5M12 13v9",
  cart: "M3 4h2l2.2 11h11.6L21 8H6M6 15h12M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  dollar:
    "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  warehouse:
    "M3 21V9l9-5 9 5v12M3 21h18M9 21v-6h6v6M8 12h.01M16 12h.01",
  tag: "M12 2 3 11v6a2 2 0 0 0 2 2h6l9-9V4a2 2 0 0 0-2-2h-6ZM8 8h.01",
  alert:
    "M12 9v3m0 4h.01M10.29 3.86 1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z",
  pencil:
    "M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z",
};

/* ---------- helpers ---------- */

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value) =>
  `$${(value ?? 0).toLocaleString("en-US")}`;

/* ---------- shared UI bits ---------- */

const cardClass =
  "bg-white border border-[#DEE2E6] rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6";

const labelClass = "text-[13px] text-[#6C757D]";
const valueClass = "text-[15px] font-semibold text-[#212529]";

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 rounded-xl bg-[#AE4329]/10 text-[#AE4329] flex items-center justify-center shrink-0">
      <Icon path={icon} className="w-4.5 h-4.5" />
    </div>
    <h2 className="text-[16px] font-bold text-[#1a2535]">{title}</h2>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <p className={labelClass}>{label}</p>
    <p className={valueClass}>{value || "-"}</p>
  </div>
);

const StatCard = ({ icon, label, value, tint = "neutral" }) => {
  const TINTS = {
    neutral: "bg-[#1a2535]/5 text-[#1a2535]",
    coral: "bg-[#AE4329]/10 text-[#AE4329]",
    danger: "bg-red-100 text-red-600",
  };

  const valueColor = tint === "danger" ? "text-red-600" : "text-[#212529]";

  return (
    <div className={cardClass + " p-5"}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#6C757D] uppercase tracking-wide">
          {label}
        </p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TINTS[tint]}`}
        >
          <Icon path={icon} className="w-4 h-4" />
        </div>
      </div>
      <h3 className={`text-2xl font-bold mt-3 ${valueColor}`}>{value}</h3>
    </div>
  );
};

const SkeletonCard = () => (
  <div className={cardClass}>
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
    </div>
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonStat = () => (
  <div className={cardClass + " p-5"}>
    <div className="flex items-center justify-between">
      <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
      <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
    </div>
    <div className="h-7 w-14 bg-gray-100 rounded animate-pulse mt-3" />
  </div>
);

/* ---------- page ---------- */

export default function FranchiseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isFranchise = AuthService.isFranchise();
  const isStaff = AuthService.getUser()?.role === "staff";

  useEffect(() => {
    if (isFranchise || isStaff) {
      navigate("/dashboard", { replace: true });
    }
  }, [isFranchise, isStaff, navigate]);

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const response = await getFranchiseById(id);

        console.log(response);

        setLocation(response.location);
        setAnalytics(response.analytics);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchise();
  }, [id]);

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page header */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529]">
                Location Details
              </h1>

              <p className="text-[#6C757D] mt-1">
                View location information.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!loading && location?.company_name && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2535] text-white text-sm font-semibold">
                  <Icon path={ICONS.building} className="w-4 h-4" />
                  {location.locationName}
                </span>
              )}

              <button
                onClick={() => navigate(`/franchises/${id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#AE4329] text-white rounded-lg text-sm font-semibold hover:bg-[#913822] transition-colors"
              >
                <Icon path={ICONS.pencil} className="w-4 h-4" />
                Edit Location
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {loading ? (
              <>
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
              </>
            ) : (
              <>
                <StatCard
                  icon={ICONS.box}
                  label="Products"
                  value={analytics?.totalProducts ?? 0}
                  tint="neutral"
                />
                <StatCard
                  icon={ICONS.cart}
                  label="Orders"
                  value={analytics?.totalOrders ?? 0}
                  tint="neutral"
                />
                <StatCard
                  icon={ICONS.dollar}
                  label="Revenue"
                  value={formatCurrency(analytics?.totalRevenue)}
                  tint="coral"
                />
                <StatCard
                  icon={ICONS.warehouse}
                  label="Inventory"
                  value={formatCurrency(analytics?.inventoryValue)}
                  tint="coral"
                />
                <StatCard
                  icon={ICONS.tag}
                  label="Items Sold"
                  value={analytics?.totalItemsSold ?? 0}
                  tint="neutral"
                />
                <StatCard
                  icon={ICONS.alert}
                  label="Low Stock"
                  value={analytics?.lowStockItems ?? 0}
                  tint="danger"
                />
              </>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={cardClass}>
                <SectionHeader
                  icon={ICONS.store}
                  title="Location Information"
                />

                <div className="grid grid-cols-2 gap-6">
                  <Field
                    label="Location Name"
                    value={location?.locationName}
                  />

                  <Field
                    label="Manager"
                    value={location?.name}
                  />

                  <Field
                    label="Email"
                    value={location?.email}
                  />

                  <Field
                    label="Phone"
                    value={location?.phone}
                  />

                  <Field
                    label="Address"
                    value={location?.address}
                  />

                  <Field
                    label="GST Number"
                    value={location?.gstNumber || "-"}
                  />

                  <Field
                    label="Created"
                    value={formatDate(location?.createdAt)}
                  />

                  <div>
                    <p className={labelClass}>Status</p>

                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${location?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {location?.status}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}