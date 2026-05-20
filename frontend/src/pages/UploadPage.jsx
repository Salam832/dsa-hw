import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

function UploadPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("PDF");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  async function handleUpload(e) {
    e.preventDefault();

    if (!title || !author || !category || !type || !file) {
      setError("Please fill all required fields.");
      setMessage("");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("keywords", keywords);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const response = await fetch("https://dsa-hw.onrender.com/api/content", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Upload failed");
        setMessage("");
        return;
      }

      setMessage(`${title} uploaded successfully!`);
      setError("");

      setTitle("");
      setAuthor("");
      setCategory("");
      setType("PDF");
      setKeywords("");
      setDescription("");
      setFile(null);
    } catch {
      setError("Server error");
      setMessage("");
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="upload-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          
        </div>

        <h1 className="upload-title">Upload New Content</h1>

        {message && <p className="upload-message">{message}</p>}
        {error && <p className="upload-error">{error}</p>}

        <form className="upload-form" onSubmit={handleUpload}>
          <div className="upload-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="Enter content title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="upload-group">
            <label>Author *</label>
            <input
              type="text"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="upload-group">
           <label>Category *</label>

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">Select Category</option>

  <option value="Books">Books</option>

  <option value="Research Papers">
    Research Papers
  </option>

  <option value="Articles">
    Articles
  </option>

  <option value="Audio Files">
    Audio Files
  </option>

  <option value="Images">
    Images
  </option>
</select>
          </div>

          <div className="upload-group">
            <label>Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="PDF">PDF</option>
              <option value="Image">Image</option>
              <option value="Audio">Audio</option>
            </select>
          </div>

          <div className="upload-group">
            <label>Keywords</label>
            <input
              type="text"
              placeholder="MongoDB, NoSQL, Database"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="upload-group">
            <label>Description</label>
            <textarea
              placeholder="Enter content description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="upload-group">
            <label>Upload File *</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <button className="upload-button" type="submit">
            Upload Content
          </button>
        </form>
        <div className="library-section">
  <button
    className="library-btn-bottom"
    onClick={() => navigate("/library")}
  >
    Go to Library
  </button>
</div>

      </div>
    </div>
  );
}

export default UploadPage;