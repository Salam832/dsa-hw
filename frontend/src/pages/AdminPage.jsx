import { Link } from "react-router-dom";
import "./AdminPage.css";

function AdminPage() {
  return (
    <div className="admin-page">
      <div className="admin-card">

        <h1>Admin Dashboard</h1>

        <div className="admin-grid">

          <Link to="/users" className="admin-box">
            <h2>Users Management</h2>
            <p>View users and change roles</p>
          </Link>

          <Link to="/upload" className="admin-box">
            <h2>Upload Content</h2>
            <p>Add new books and files</p>
          </Link>

          <Link to="/library" className="admin-box">
            <h2>Digital Library</h2>
            <p>View all uploaded content</p>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default AdminPage;