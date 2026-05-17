import { useEffect, useState } from "react";
import "./UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load users");
          return;
        }

        setUsers(data);
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading users...</h2>;
  }

  return (
    <div className="users-page">
      <div className="users-card">
        <h1 className="users-title">Users Management</h1>
        <p className="users-subtitle">Manage system users and their roles</p>

        {error && (
          <p style={{ textAlign: "center", color: "red" }}>
            {error}
          </p>
        )}

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.lastLogin
                    ? user.lastLogin.slice(0, 10)
                    : "No login yet"}
                </td>
                <td>
                  <button
                    className="users-action"
                    onClick={() => alert("Edit role will be connected later")}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !error && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}

export default UsersPage;