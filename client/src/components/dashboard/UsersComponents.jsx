import { useState, useEffect } from "react";
import { MdPersonAdd, MdSearch, MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthService, getUsers, addUser, updateUser, deleteUser } from "../../api";
import { isPlanAtLeast } from "../../constants/plans";
import ConfirmationModal from "../common/ConfirmationModal";

const UsersHeader = ({ onAddClick, loading }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[28px] font-bold text-[#212529] mb-2">Users</h1>
        <p className="text-[14px] text-[#6C757D]">
          Manage your team members and roles
        </p>
      </div>
      <button
        onClick={onAddClick}
        disabled={loading}
        className="bg-[#0d5b96] text-white px-6 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <MdPersonAdd className="text-[18px]" />
        Add User
      </button>
    </div>
  );
};

const UsersTable = ({ showAddForm, setShowAddForm }) => {
  const navigate = useNavigate();
  const company = AuthService.getCompany();
  const loginType = AuthService.getLoginType();
  const isFranchise = loginType === "franchise";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState("staff");
  const [addingUser, setAddingUser] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      });

      let filteredUsers = response.data || [];

      // Apply role filter
      if (roleFilter) {
        filteredUsers = filteredUsers.filter((user) => {
          const userRole =
            typeof user.role === "string" ? user.role : user.role || "";
          return userRole.toLowerCase() === roleFilter.toLowerCase();
        });
      }

      // Apply status filter
      if (statusFilter) {
        filteredUsers = filteredUsers.filter((user) => {
          const userStatus =
            typeof user.status === "string"
              ? user.status
              : user.status?.value || "active";
          return userStatus.toLowerCase() === statusFilter.toLowerCase();
        });
      }

      setUsers(filteredUsers);
      setTotalCount(response.meta?.total || filteredUsers.length);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      !newUserName ||
      !newUserEmail ||
      !newUserPhone ||
      !newUserPassword ||
      !newUserConfirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (newUserPassword !== newUserConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setAddingUser(true);
      await addUser({
        name: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        password: newUserPassword,
      });
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPhone("");
      setNewUserPassword("");
      setNewUserConfirmPassword("");
      setNewUserRole("staff");
      setShowAddForm(false);
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleteUserId(userId);
    setIsDeleteConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteUserId) return;

    try {
      await deleteUser(deleteUserId);
      setUsers(
        users.filter((u) => u._id !== deleteUserId && u.id !== deleteUserId),
      );
      setTotalCount(totalCount - 1);
      setIsDeleteConfirmOpen(false);
      setDeleteUserId(null);
    } catch (err) {
      setError(err.message || "Failed to delete user");
      setIsDeleteConfirmOpen(false);
      setDeleteUserId(null);
    }
  };

  const onCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteUserId(null);
  };

  const handleEditUser = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const getRoleBadge = (role) => {
    const roleUpper = role?.toUpperCase();

    if (roleUpper === "ADMIN") {
      return {
        bg: "#0d5b96",
        text: "#FFFFFF",
        border: "none",
      };
    }

    if (roleUpper === "MANAGER") {
      return {
        bg: "#E7F1FF",
        text: "#0D6EFD",
        border: "#0D6EFD",
      };
    }

    return {
      bg: "#F1F3F5",
      text: "#212529",
      border: "#DEE2E6",
    };
  };

  const getStatusColor = (status) => {
    const statusValue =
      typeof status === "string" ? status : status?.value || "active";
    return statusValue.toLowerCase() === "active" ? "#28A745" : "#6C757D";
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && users.length === 0) {
    return (
      <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d5b96]"></div>
        <p className="mt-4 text-[#6C757D]">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] rounded-lg text-[14px]">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-6 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg">
          <h3 className="text-[16px] font-bold text-[#212529] mb-4">
            Add New User
          </h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
                  disabled={addingUser}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
                  disabled={addingUser}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
                  disabled={addingUser}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                  Role
                </label>
                {!isFranchise && isPlanAtLeast(company?.plan, "Standard") ? (
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
                    disabled={addingUser}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] text-[#212529] bg-[#F8F9FA]">
                    Staff
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                  Temporary Password
                </label>

                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
                  disabled={addingUser}
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#212529] mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={newUserConfirmPassword}
                  onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                  placeholder="Confirm temporary password"
                  className="w-full px-4 py-2 border border-[#DEE2E6] rounded-lg text-[14px] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
                  disabled={addingUser}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addingUser}
                className="px-4 py-2 bg-[#0d5b96] text-white rounded-lg font-semibold text-[14px] hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                {addingUser ? "Adding..." : "Add User"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-[#DEE2E6] rounded-lg font-semibold text-[14px] hover:bg-[#F8F9FA] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#DEE2E6] space-y-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ADB5BD] text-[18px]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-[#DEE2E6] rounded-lg text-[13px] placeholder-[#ADB5BD] focus:outline-none focus:border-[#0d5b96] focus:ring-1 focus:ring-[#0d5b96]"
            />
          </div>

          {/* Filter Panel - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6C757D] uppercase mb-2">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] focus:outline-none focus:border-[#0d5b96]"
              >
                <option value="">All Roles</option>
                {!isFranchise && <option value="admin">Admin</option>}

                {!isFranchise && isPlanAtLeast(company?.plan, "Standard") && (
                  <option value="manager">Manager</option>
                )}

                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6C757D] uppercase mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] focus:outline-none focus:border-[#0d5b96]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-[#DEE2E6] rounded-md text-[13px] hover:bg-[#F8F9FA] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <span className="text-[12px] text-[#6C757D] font-medium">
            Showing{" "}
            {users.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
            results
          </span>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-white border border-[#DEE2E6] rounded-lg shadow-md overflow-hidden">
        {/* Table */}
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F9FA] border-b-2 border-[#DEE2E6]">
                  <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] uppercase font-semibold text-[#6C757D] tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roleBadge = getRoleBadge(user.role);

                  return (
                    <tr
                      key={user._id || user.id}
                      className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors duration-100"
                    >
                      {/* Name with Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0d5b96] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#212529]">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#6C757D]">
                          {user.email}
                        </p>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#6C757D]">
                          {user.phone}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border"
                          style={{
                            backgroundColor: roleBadge.bg,
                            color: roleBadge.text,
                            borderColor: roleBadge.border || roleBadge.bg,
                          }}
                        >
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#6C757D]">
                          {user.locationId?.displayName || "-"}
                        </p>
                      </td>
                      {/* Joined Date */}
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-[#6C757D]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUser(user._id || user.id)}
                            className="text-black hover:text-[#343A40] transition-colors"
                          >
                            <MdEdit className="text-[20px]" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id || user.id)
                            }
                            className="text-[#DC3545] hover:text-[#c82333] transition-colors"
                            title="Delete user"
                          >
                            <MdDelete className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-[#6C757D]">
            <p className="text-[14px]">No users found</p>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
          <div className="px-6 py-4 border-t border-[#DEE2E6] bg-[#F8F9FA] flex items-center justify-between">
            <span className="text-[13px] text-[#6C757D]">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              results
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50"
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-[13px] transition-colors ${
                      page === currentPage
                        ? "bg-[#0d5b96] text-white"
                        : "border border-[#DEE2E6] hover:bg-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-[#DEE2E6] rounded text-[13px] hover:bg-white transition-colors disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        isDangerous={true}
      />
    </>
  );
};

export { UsersHeader, UsersTable };
