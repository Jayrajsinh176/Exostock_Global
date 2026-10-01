import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdNotifications,
  MdWarning,
  MdInventory2,
  MdCheckCircle,
  MdArrowBack,
  MdDoneAll,
  MdRefresh,
  MdPayments,
} from "react-icons/md";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { AuthService } from "../api";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/alert`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        // If no alerts API data, show sample notifications
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (alertId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/alert/${alertId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
        },
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === alertId ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        toast.success("Notification marked as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alert/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "low_stock":
        return <MdWarning className="text-[24px] text-[#FFC107]" />;
      case "out_of_stock":
        return <MdInventory2 className="text-[24px] text-[#DC3545]" />;
      case "reorder_reminder":
        return <MdRefresh className="text-[24px] text-[#0d5b96]" />;
      case "vendor_order_ready":
        return <MdPayments className="text-[24px] text-[#0d5b96]" />;
      default:
        return <MdNotifications className="text-[24px] text-[#6C757D]" />;
    }
  };

  const getNotificationColor = (type, severity) => {
    if (severity === "critical") return "border-l-[#DC3545]";
    if (severity === "high") return "border-l-[#FFC107]";
    if (type === "low_stock") return "border-l-[#FFC107]";
    if (type === "out_of_stock") return "border-l-[#DC3545]";
    return "border-l-[#0d5b96]";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getActionRoute = (notification) => {
    if (
      notification?.type === "vendor_order_ready" &&
      notification?.metadata?.paymentRoute
    ) {
      return notification.metadata.paymentRoute;
    }
    return null;
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Toaster position="top-right" />
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-[300px]">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#6C757D] hover:text-[#212529] mb-4 transition-colors"
            >
              <MdArrowBack className="text-[20px]" />
              <span className="text-[14px]">Back</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-[#212529] mb-2">
                  Notifications
                </h1>
                <p className="text-[14px] text-[#6C757D]">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-[#0d5b96] hover:bg-[#F1F3F5] rounded-lg transition-colors"
                >
                  <MdDoneAll className="text-[18px]" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin">
                  <div className="w-12 h-12 border-4 border-[#DEE2E6] border-t-[#0d5b96] rounded-full"></div>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-4">
                  <MdCheckCircle className="text-[40px] text-[#28A745]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#212529] mb-2">
                  No notifications
                </h3>
                <p className="text-[14px] text-[#6C757D] text-center max-w-md">
                  You're all caught up! New notifications will appear here when
                  there are important updates about your inventory.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#DEE2E6]">
                {notifications.map((notification) => {
                  const actionRoute = getActionRoute(notification);

                  return (
                    <div
                      key={notification._id}
                      className={`flex items-start gap-4 p-6 border-l-4 ${getNotificationColor(notification.type, notification.severity)} ${
                        !notification.isRead ? "bg-[#F8F9FA]" : "bg-white"
                      } hover:bg-[#F8F9FA] transition-colors cursor-pointer`}
                      onClick={() =>
                        !notification.isRead && markAsRead(notification._id)
                      }
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white border border-[#DEE2E6] rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p
                              className={`text-[14px] ${!notification.isRead ? "font-semibold" : "font-medium"} text-[#212529]`}
                            >
                              {notification.message}
                            </p>
                            {notification.product && (
                              <p className="text-[13px] text-[#6C757D] mt-1">
                                Product: {notification.product.name} (
                                {notification.product.sku})
                              </p>
                            )}
                            {notification.metadata && (
                              <>
                                {(notification.metadata.currentStock !==
                                  undefined ||
                                  notification.metadata.threshold !==
                                    undefined) && (
                                  <p className="text-[12px] text-[#6C757D] mt-1">
                                    Current Stock:{" "}
                                    {notification.metadata.currentStock} |
                                    Threshold: {notification.metadata.threshold}
                                  </p>
                                )}
                                {notification.type === "vendor_order_ready" && (
                                  <p className="text-[12px] text-[#6C757D] mt-1">
                                    Request:{" "}
                                    {notification.metadata.requestNumber} |
                                    Vendor: {notification.metadata.vendorName} |
                                    Amount: $
                                    {Number(
                                      notification.metadata.totalAmount || 0,
                                    ).toFixed(2)}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-[12px] text-[#6C757D]">
                              {formatDate(notification.createdAt)}
                            </p>
                            {!notification.isRead && (
                              <span className="inline-block w-2 h-2 bg-[#0d5b96] rounded-full mt-2"></span>
                            )}
                            {actionRoute && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(actionRoute, {
                                    state: { notification },
                                  });
                                }}
                                className="mt-3 px-3 py-1.5 text-[12px] font-semibold bg-[#0d5b96] text-white rounded hover:bg-[#1A1A1A]"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg p-6">
            <h3 className="text-[16px] font-semibold text-[#212529] mb-2">
              About Notifications
            </h3>
            <p className="text-[14px] text-[#6C757D]">
              Notifications are automatically generated when products reach low
              stock thresholds or run out of stock. Configure your alert
              preferences to customize which notifications you receive.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
