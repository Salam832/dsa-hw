import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ContentDetailsPage.css";

function ContentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const canEditContent = role === "Admin" || role === "Uploader";
  const canDeleteContent = role === "Admin";

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editType, setEditType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editKeywords, setEditKeywords] = useState("");

  useEffect(() => {
    async function fetchContentDetails() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://dsa-hw.onrender.com/api/content/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Content not found");
          return;
        }

        setContent(data);
        setEditTitle(data.title || "");
        setEditAuthor(data.author || "");
        setEditCategory(data.category || "");
        setEditType(data.type || "");
        setEditDescription(data.description || "");
        setEditKeywords(
          Array.isArray(data.keywords) ? data.keywords.join(", ") : ""
        );
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchContentDetails();
  }, [id]);

  async function handleRead() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://dsa-hw.onrender.com/api/content/${id}/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Failed to open file");
        return;
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      window.open(fileUrl, "_blank");
    } catch (err) {
      alert("Server error");
    }
  }

  async function handleDownload() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://dsa-hw.onrender.com/api/content/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Download failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = content.title || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Server error");
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://dsa-hw.onrender.com/api/content/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            author: editAuthor,
            category: editCategory,
            type: editType,
            description: editDescription,
            keywords: editKeywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter((keyword) => keyword !== ""),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Update failed");
        return;
      }

      setContent(data);
      setIsEditing(false);
      alert("Content updated successfully");
    } catch {
      alert("Server error");
    }
  }

  async function handleDelete() {
    if (!canDeleteContent) {
      alert("Only Admin can delete content");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://dsa-hw.onrender.com/api/content/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("Content deleted successfully");
      navigate("/library");
    } catch {
      alert("Server error");
    }
  }

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </h2>
    );
  }

  if (error || !content) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        {error || "Content not found"}
      </h2>
    );
  }

  const keywords = Array.isArray(content.keywords) ? content.keywords : [];

  return (
    <div className="details-page">
      <div className="details-card">
        {!isEditing ? (
          <>
            <h1>{content.title}</h1>

            <p>
              <strong>Author:</strong> {content.author}
            </p>

            <p>
              <strong>Category:</strong> {content.category}
            </p>

            <p>
              <strong>Type:</strong> {content.type}
            </p>

            <p>
              <strong>Added:</strong>{" "}
              {content.createdAt?.slice(0, 10) || "N/A"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {content.description || "No description"}
            </p>

            <div className="keywords">
              {keywords.map((kw) => (
                <span key={kw}>{kw}</span>
              ))}
            </div>

            <p>
              <strong>Reads:</strong> {content.readCount || 0}
            </p>

            <p>
              <strong>Downloads:</strong> {content.downloadCount || 0}
            </p>

            <div className="buttons">
              <button className="read-btn" onClick={handleRead}>
                Read
              </button>

              <button className="download-btn" onClick={handleDownload}>
                Download
              </button>
            </div>

            {(canEditContent || canDeleteContent) && (
              <div className="buttons manage-buttons">
                {canEditContent && (
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Content
                  </button>
                )}

                {canDeleteContent && (
                  <button className="delete-btn" onClick={handleDelete}>
                    Delete Content
                  </button>
                )}
              </div>
            )}

            <Link to="/library" className="back-link">
              ← Back to Library
            </Link>
          </>
        ) : (
          <>
            <h1>Edit Content</h1>

            <form className="edit-form" onSubmit={handleUpdate}>
              <label>Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <label>Author</label>
              <input
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
              />

              <label>Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Books">Books</option>
                <option value="Research Papers">Research Papers</option>
                <option value="Articles">Articles</option>
                <option value="Audio Files">Audio Files</option>
                <option value="Images">Images</option>
              </select>

              <label>Type</label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="PDF">PDF</option>
                <option value="Image">Image</option>
                <option value="Audio">Audio</option>
              </select>

              <label>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <label>Keywords</label>
              <input
                value={editKeywords}
                onChange={(e) => setEditKeywords(e.target.value)}
                placeholder="MongoDB, NoSQL, Database"
              />

              <div className="buttons">
                <button className="edit-btn" type="submit">
                  Save Changes
                </button>

                <button
                  className="delete-btn"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentDetailsPage;