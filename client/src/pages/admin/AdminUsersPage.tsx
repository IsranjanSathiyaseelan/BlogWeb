import { useEffect, useState } from "react";
import { fetchAdminUsers, deleteAdminUser } from "../../api/admin";
import type { AdminUser } from "../../api/admin";
import "./AdminDashboardPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAdminUsers();
        setUsers(response.users);
      } catch (err) {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch {
      setError("Unable to delete user.");
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-table-header">
        <h2 className="admin-table-title">User Management</h2>
        <p className="admin-table-subtitle">
          Manage accounts, roles, and admin actions from this view.
        </p>
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Blogs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.blogCount}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-table-action admin-table-action--edit"
                      disabled
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-table-action admin-table-action--delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
