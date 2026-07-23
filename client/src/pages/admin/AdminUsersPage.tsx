import { useEffect, useState, useMemo } from "react";
import { fetchAdminUsers, deleteAdminUser } from "../../api/admin";
import type { AdminUser } from "../../api/admin";
import "./AdminUsersPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAdminUsers();
        setUsers(response.users);
      } catch {
        setError("Unable to load user registry.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(user.id);
    setError("");

    try {
      await deleteAdminUser(user.id);
      setUsers((current) => current.filter((u) => u.id !== user.id));
    } catch {
      setError(`Failed to delete ${user.name}. Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="admin-users-page">
      {/* Page Header */}
      <div className="admin-users-header">
        <div>
          <h1 className="admin-users-title">User Directory</h1>
          <p className="admin-users-subtitle">
            Manage account permissions, roles, and platform access.
          </p>
        </div>
        <div className="admin-users-count-badge">
          {users.length} {users.length === 1 ? "User" : "Users"}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="admin-error-banner">
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar / Search */}
      <div className="admin-users-toolbar">
        <div className="admin-search-wrapper">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="admin-table-row-skeleton">
                  <td>
                    <div className="skeleton-cell avatar-text" />
                  </td>
                  <td>
                    <div className="skeleton-cell medium" />
                  </td>
                  <td>
                    <div className="skeleton-cell small" />
                  </td>
                  <td className="text-right">
                    <div className="skeleton-cell small align-right" />
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="admin-table-empty">
                    <p className="admin-empty-title">
                      {searchQuery
                        ? "No matching users found"
                        : "No users registered"}
                    </p>
                    <p className="admin-empty-sub">
                      {searchQuery
                        ? `No results for "${searchQuery}". Try a different search term.`
                        : "Registered user accounts will appear here."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isDeleting = deletingId === user.id;
                const isAdmin = user.role?.toLowerCase() === "admin";

                return (
                  <tr
                    key={user.id}
                    className={isDeleting ? "row-deleting" : ""}
                  >
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar">
                          {getInitials(user.name)}
                        </div>
                        <span className="admin-user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="admin-user-email">{user.email}</td>
                    <td>
                      <span
                        className={`admin-role-badge ${
                          isAdmin ? "role-admin" : "role-user"
                        }`}
                      >
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-actions-cell">
                        <button
                          type="button"
                          className="admin-btn-action admin-btn-delete"
                          onClick={() => handleDelete(user)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;