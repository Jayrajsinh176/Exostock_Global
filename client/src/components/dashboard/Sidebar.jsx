import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../../api";
import BrandMark from "../common/BrandMark";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdGroup,
  MdPayments,
  MdSettings,
  MdLogout,
  MdNotifications,
  MdPerson,
  MdFactCheck,
  MdBusiness,
  MdReceiptLong,
  MdStore,
  MdExpandMore,
  MdChevronRight,
  MdClose,
  MdSmartToy,
  MdSwapHoriz,
  MdAssessment,
} from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginType = AuthService.getLoginType();

  const user =
    loginType === "franchise"
      ? AuthService.getFranchise()
      : AuthService.getUser();

  const isFranchise = AuthService.isFranchise();
  const isStaff = user?.role === "staff";
  const hasBusinessAccess = AuthService.hasBusinessAccess();

  const vendorPaths = ["/vendors", "/purchases/add", "/vendor/purchase-history"];
  const franchisePaths = ["/franchises/add", "/franchises"];
  const reportPaths = [
    "/reports/products",
    "/reports/orders",
    "/reports/stock-transfers",
  ];

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(() =>
    vendorPaths.includes(location.pathname),
  );
  const [franchiseOpen, setFranchiseOpen] = useState(() =>
    franchisePaths.includes(location.pathname),
  );
  const [reportsOpen, setReportsOpen] = useState(() =>
    reportPaths.includes(location.pathname),
  );
  const [prevPathname,setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsMobileOpen(false);
    setVendorOpen(vendorPaths.includes(location.pathname));
    setFranchiseOpen(franchisePaths.includes(location.pathname));
    setReportsOpen(reportPaths.includes(location.pathname));
  }

  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsMobileOpen((isOpen) => !isOpen);
    };

    const handleCloseSidebar = () => {
      setIsMobileOpen(false);
    };

    window.addEventListener("toggle-dashboard-sidebar", handleToggleSidebar);
    window.addEventListener("close-dashboard-sidebar", handleCloseSidebar);

    return () => {
      window.removeEventListener(
        "toggle-dashboard-sidebar",
        handleToggleSidebar,
      );
      window.removeEventListener("close-dashboard-sidebar", handleCloseSidebar);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
  }, [isMobileOpen]);

  const navigateTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    AuthService.clearAuth();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <div
        className={`w-[min(88vw,300px)] lg:w-[300px] h-[100dvh] bg-[#F8F9FA] border-r border-[#DEE2E6] fixed left-0 top-0 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Area */}
        <div className="px-4 py-4 border-b border-[#DEE2E6]">
          <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2">
            <BrandMark
              compact
              showPowered={false}
              className="flex-1"
            />
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setIsMobileOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#0d5b96] hover:bg-[#E9ECEF] lg:hidden"
            >
              <MdClose className="text-[22px]" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          <NavItem
            icon="dashboard"
            label="Dashboard"
            path="/dashboard"
            active={isActive("/dashboard")}
            onClick={() => navigateTo("/dashboard")}
          />
          <div className="space-y-1">
            <button
              onClick={() => setVendorOpen(!vendorOpen)}
              className="w-full h-11 flex items-center justify-between px-3 rounded-md text-[#6C757D] font-medium hover:bg-[#E9ECEF]"
            >
              <div className="flex items-center gap-3">
                <MdBusiness className="text-[18px]" />
                <span className="text-[14px]">Vendor</span>
              </div>

              {vendorOpen ? (
                <MdExpandMore className="text-[18px]" />
              ) : (
                <MdChevronRight className="text-[18px]" />
              )}
            </button>

            {vendorOpen && (
              <div className="ml-8 space-y-1">
                <button
                  onClick={() => navigateTo("/vendors")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                    isActive("/vendors")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                  }`}
                >
                  Vendors
                </button>
                <button
                  onClick={() => navigateTo("/purchases/add")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                    isActive("/purchases/add")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                  }`}
                >
                  Add Purchase
                </button>

                <button
                  onClick={() => navigateTo("/vendor/purchase-history")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                    isActive("/vendor/purchase-history")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                  }`}
                >
                  Purchase History
                </button>
              </div>
            )}
          </div>
          <NavItem
            icon="category"
            label="Categories"
            path="/categories"
            active={isActive("/categories")}
            onClick={() => navigateTo("/categories")}
          />
          <NavItem
            icon="inventory_2"
            label="Products"
            path="/products"
            active={isActive("/products") || isActive("/products/add")}
            onClick={() => navigateTo("/products")}
          />
          {!isStaff && !isFranchise && (
            <NavItem
              icon="group"
              label="Users"
              path="/users"
              active={isActive("/users")}
              onClick={() => navigateTo("/users")}
            />
          )}
          {loginType !== "franchise" && !isStaff && (
            <NavItem
              icon="payments"
              label="Subscription"
              path="/subscription"
              active={isActive("/subscription")}
              onClick={() => navigateTo("/subscription")}
            />
          )}
          <NavItem
            icon="fact_check"
            label="Billing"
            path="/billing"
            active={isActive("/billing")}
            onClick={() => navigateTo("/billing")}
          />

          <NavItem
            icon="receipt"
            label="Billing History"
            path="/billing-history"
            active={isActive("/billing-history")}
            onClick={() => navigateTo("/billing-history")}
          />
          {!isFranchise && !isStaff && AuthService.hasStandardAccess() && (
            <div className="space-y-1">
              <button
                onClick={() => setFranchiseOpen(!franchiseOpen)}
                className="w-full h-11 flex items-center justify-between px-3 rounded-md text-[#6C757D] font-medium hover:bg-[#E9ECEF]"
              >
                <div className="flex items-center gap-3">
                  <MdStore className="text-[18px]" />
                  <span className="text-[14px]">Franchises</span>
                </div>

                {franchiseOpen ? (
                  <MdExpandMore className="text-[18px]" />
                ) : (
                  <MdChevronRight className="text-[18px]" />
                )}
              </button>

              {franchiseOpen && (
                <div className="ml-8 space-y-1">
                  <button
                    onClick={() => navigateTo("/franchises/add")}
                    className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                      isActive("/franchises/add")
                        ? "bg-[#E9ECEF] text-black font-semibold"
                        : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                  >
                    Add Franchise
                  </button>

                  <button
                    onClick={() => navigateTo("/franchises")}
                    className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                      isActive("/franchises")
                        ? "bg-[#E9ECEF] text-black font-semibold"
                        : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                  >
                    Franchise List
                  </button>

                  {/* <button
                  onClick={() => navigateTo("/franchises/performance")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${isActive("/franchises/performance")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                >
                  Franchise Performance
                </button> */}
                </div>
              )}
            </div>
          )}
          {AuthService.hasStandardAccess() && (
            <NavItem
              icon="swap_horiz"
              label="Stock Transfer History"
              path="/stock-transfers/history"
              active={isActive("/stock-transfers/history")}
              onClick={() => navigateTo("/stock-transfers/history")}
            />
          )}
          {AuthService.hasBasicAccess() && (
          <div className="space-y-1">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full h-11 flex items-center justify-between px-3 rounded-md text-[#6C757D] font-medium hover:bg-[#E9ECEF]"
            >
              <div className="flex items-center gap-3">
                <MdAssessment className="text-[18px]" />
                <span className="text-[14px]">Reports</span>
              </div>

              {reportsOpen ? (
                <MdExpandMore className="text-[18px]" />
              ) : (
                <MdChevronRight className="text-[18px]" />
              )}
            </button>

            {reportsOpen && (
              <div className="ml-8 space-y-1">
                <button
                  onClick={() => navigateTo("/reports/products")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                    isActive("/reports/products")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                  }`}
                >
                  Product Reports
                </button>
                <button
                  onClick={() => navigateTo("/reports/orders")}
                  className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                    isActive("/reports/orders")
                      ? "bg-[#E9ECEF] text-black font-semibold"
                      : "text-[#6C757D] hover:bg-[#E9ECEF]"
                  }`}
                >
                  Order Reports
                </button>
                {AuthService.hasStandardAccess() && (
                  <button
                    onClick={() => navigateTo("/reports/stock-transfers")}
                    className={`w-full h-10 text-left px-3 rounded-md text-[13px] ${
                      isActive("/reports/stock-transfers")
                        ? "bg-[#E9ECEF] text-black font-semibold"
                        : "text-[#6C757D] hover:bg-[#E9ECEF]"
                    }`}
                  >
                    Stock Transfer Reports
                  </button>
                )}
              </div>
            )}
          </div>
          )}
          {/* Divider */}
          <div className="border-t border-[#DEE2E6] my-3 -mx-3"></div>

          {hasBusinessAccess && (
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false);
                window.dispatchEvent(new CustomEvent("open-ai-assistant"));
              }}
              className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-[#6C757D] font-medium transition-all duration-150 hover:bg-[#E9ECEF]"
            >
              <MdSmartToy className="text-[18px]" />
              <span className="text-[14px]">AI Assistant</span>
            </button>
          )}

          <NavItem
            icon="notifications"
            label="Notifications"
            path="/notifications"
            active={isActive("/notifications")}
            onClick={() => navigateTo("/notifications")}
          />
          <NavItem
            icon="person"
            label="My Profile"
            path="/profile"
            active={isActive("/profile")}
            onClick={() => navigateTo("/profile")}
          />
        </nav>

        {/* User Info + Logout (bottom) */}
        <div className="px-4 py-4 border-t border-[#DEE2E6] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0d5b96] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#212529] truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[12px] text-[#6C757D] truncate capitalize">
                {isFranchise ? "Franchise Manager" : user?.role || "staff"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#6C757D] font-medium hover:bg-[#E9ECEF] hover:text-[#212529] transition-colors"
          >
            <MdLogout className="text-[18px]" />
            <span className="text-[13px]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick, path }) => {
  const iconMap = {
    dashboard: MdDashboard,
    inventory_2: MdInventory2,
    category: MdCategory,
    business: MdBusiness,
    group: MdGroup,
    payments: MdPayments,
    settings: MdSettings,
    notifications: MdNotifications,
    person: MdPerson,
    fact_check: MdFactCheck,
    receipt: MdReceiptLong,
    store: MdStore,
    swap_horiz: MdSwapHoriz,
  };

  const IconComponent = iconMap[icon];

  return (
    <button
      onClick={onClick}
      className={`w-full h-11 flex items-center gap-3 px-3 rounded-md transition-all duration-150 ${
        active
          ? "bg-[#E9ECEF] text-[#0d5b96] font-semibold border-l-3 border-[#0d5b96] pl-2"
          : "text-[#6C757D] font-medium hover:bg-[#E9ECEF]"
      }`}
    >
      {IconComponent && <IconComponent className="text-[18px]" />}
      <span className="text-[14px]">{label}</span>
    </button>
  );
};

export default Sidebar;
