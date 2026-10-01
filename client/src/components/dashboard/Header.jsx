import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdNotifications,
  MdPerson,
  MdLogout,
  MdMenu,
} from "react-icons/md";
import { AuthService } from "../../api";
import { MdWorkspacePremium } from "react-icons/md";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const loginType = AuthService.getLoginType();

  const user =
    loginType === "franchise"
      ? AuthService.getFranchise()
      : AuthService.getUser();

  const company = AuthService.getCompany();

  const currentPlan =
    loginType === "franchise" ? "Business" : company?.plan || "Trial";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  useEffect(() => {
    // Fetch unread notification count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/alert?isRead=false`, {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    AuthService.clearAuth();
    navigate("/");
  };

  const handleSidebarToggle = () => {
    window.dispatchEvent(new Event("toggle-dashboard-sidebar"));
  };

  return (
    <div className="h-14 bg-white border-b border-[#DEE2E6] sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1 max-w-[480px]">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="w-9 h-9 rounded-md border border-[#DEE2E6] text-[#495057] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <MdMenu className="text-[22px]" />
        </button>

        {/* Search Input */}
        <div className="hidden sm:block w-full relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] text-[20px]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full h-10 bg-[#F8F9FA] border border-[#DEE2E6] rounded-md pl-10 pr-4 text-[14px] text-[#212529] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:bg-[#F8F9FA] transition-all duration-150"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Current Plan */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-2 px-4 h-10 rounded-full bg-[#1E293B] text-white shadow-sm border border-[#334155]">
            <MdWorkspacePremium className="text-[#FBBF24] text-[18px]" />
            <span className="text-[13px] font-medium">{currentPlan} Plan</span>
          </div>
        </div>
        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative text-[#6C757D] hover:text-[#212529] transition-colors"
          title="Notifications"
        >
          <MdNotifications className="text-[22px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#DC3545] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#0d5b96] rounded-full flex items-center justify-center text-white text-[12px] font-bold border-2 border-[#DEE2E6]">
              {userInitials}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg border border-[#DEE2E6] shadow-lg py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[#DEE2E6]">
                <p className="text-[14px] font-semibold text-[#212529] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[12px] text-[#6C757D] truncate">
                  {user?.email || ""}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/profile");
                  }}
                  className="w-full px-4 py-2 text-left text-[14px] text-[#212529] hover:bg-[#F8F9FA] flex items-center gap-3 transition-colors"
                >
                  <MdPerson className="text-[18px] text-[#6C757D]" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/notifications");
                  }}
                  className="w-full px-4 py-2 text-left text-[14px] text-[#212529] hover:bg-[#F8F9FA] flex items-center gap-3 transition-colors"
                >
                  <MdNotifications className="text-[18px] text-[#6C757D]" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto text-[11px] bg-[#DC3545] text-white px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-[#DEE2E6] pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-[14px] text-[#DC3545] hover:bg-[#FEE2E2] flex items-center gap-3 transition-colors"
                >
                  <MdLogout className="text-[18px]" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
