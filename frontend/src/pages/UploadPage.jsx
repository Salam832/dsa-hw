import { useState } from "react";
import "./UploadPage.css";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [keywords, setKeywords] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author || !category || !type || !file) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("keywords", keywords);
      formData.append("description", "Uploaded from frontend");
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/content", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Upload failed");
        return;
      }

      setMessage(`"${data.title}" uploaded successfully!`);

      setTitle("");
      setAuthor("");
      setCategory("");
      setType("");
      setKeywords("");
      setFile(null);

      e.target.reset();
    } catch (err) {
      setMessage("Server error");
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1 className="upload-title">Upload New Content</h1>

        {message && <p className="upload-message">{message}</p>}

        <form className="upload-form" onSubmit={handleSubmit}>
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
            <input
              type="text"
              placeholder="Example: Database"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="upload-group">
            <label>Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select content type</option>
              <option value="PDF">PDF</option>
              <option value="Image">Image</option>
              <option value="Audio">Audio</option>
              <option value="Article">Article</option>
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
            <label>Upload File *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button className="upload-button" type="submit">
            Upload Content
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;