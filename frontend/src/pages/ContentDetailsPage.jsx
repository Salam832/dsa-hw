import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ContentDetailsPage.css";

function ContentDetailsPage() {
  const { id } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContentDetails() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/content/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Content not found");
          return;
        }

        setContent(data);
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchContentDetails();
  }, [id]);

  function handleRead() {
    const token = localStorage.getItem("token");

    window.open(
      `http://localhost:5000/api/content/${id}/view?token=${token}`,
      "_blank"
    );
  }

  async function handleDownload() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/content/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Download failed");
        return;
      }

      alert("Download recorded successfully");
    } catch (err) {
      alert("Server error");
    }
  }

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
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
        <h1>{content.title}</h1>

        <p><strong>Author:</strong> {content.author}</p>
        <p><strong>Category:</strong> {content.category}</p>
        <p><strong>Type:</strong> {content.type}</p>
        <p><strong>Added:</strong> {content.createdAt?.slice(0, 10) || "N/A"}</p>
        <p><strong>Description:</strong> {content.description || "No description"}</p>

        <div className="keywords">
          {keywords.map((kw) => (
            <span key={kw}>{kw}</span>
          ))}
        </div>

        <p><strong>Reads:</strong> {content.readCount || 0}</p>
        <p><strong>Downloads:</strong> {content.downloadCount || 0}</p>

        <div className="buttons">
          <button className="read-btn" onClick={handleRead}>
            Read
          </button>

          <button className="download-btn" onClick={handleDownload}>
            Download
          </button>
        </div>

        <Link to="/library" className="back-link">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
}

export default ContentDetailsPage;