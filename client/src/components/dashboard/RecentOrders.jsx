import { useEffect, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getOrders } from "../../api";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders({
        page,
        limit: 10,
        search,
      });

      setOrders(data.orders || []);
      setPagination(
        data.pagination || {
          page: 1,
          pages: 1,
          total: 0,
          limit: 10,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-gray-200">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest customer orders
          </p>
        </div>

        {/* Search */}

        <div className="relative w-full lg:w-80">

          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2154F3] focus:border-[#2154F3] outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-[#F8F9FA]">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Order No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Items
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Quantity
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Payment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-10 text-center text-gray-500"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-10 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-semibold text-[#2154F3]">
                    {order.orderNumber}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-800">
                        {order.customerName || "Walk-in Customer"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {order.customerPhone || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    {order.items?.length
                      ? order.items.map((item, index) => (
                          <div key={index}>
                            {item.productName || item.product?.name || "Product"}
                          </div>
                        ))
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    {order.items?.length
                      ? order.items.map((item, index) => (
                          <div key={index}>{item.quantity}</div>
                        ))
                      : 0}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ${Number(order.total || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex flex-col gap-1">

                      <span className="text-xs text-gray-500 capitalize">
                        {order.paymentMethod}
                      </span>

                      <span
                        className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {!loading && pagination.pages > 1 && (

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-t">

          <div className="text-sm text-gray-500">

            Showing{" "}

            {(pagination.page - 1) * pagination.limit + 1}

            {" - "}

            {Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}

            {" of "}

            {pagination.total}

            {" Orders"}

          </div>

          <div className="flex items-center gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-10 h-10 rounded-lg border hover:bg-gray-100 disabled:opacity-40"
            >
              <FiChevronLeft className="mx-auto" />
            </button>

            {Array.from(
              { length: pagination.pages },
              (_, index) => index + 1
            ).map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                  page === number
                    ? "bg-[#2154F3] text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              disabled={page === pagination.pages}
              onClick={() => setPage(page + 1)}
              className="w-10 h-10 rounded-lg border hover:bg-gray-100 disabled:opacity-40"
            >
              <FiChevronRight className="mx-auto" />
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default RecentOrders;