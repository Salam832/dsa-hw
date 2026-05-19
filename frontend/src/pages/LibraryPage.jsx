import { useEffect, useState } from "react";
import ContentCard from "../components/ContentCard";
import "./LibraryPage.css";

function LibraryPage() {
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContents() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://dsa-hw.onrender.com/api/content", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load contents");
          return;
        }

        setContents(data);
      
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchContents();
  }, []);

  const filteredContents = contents.filter((item) => {
    const itemKeywords = Array.isArray(item.keywords) ? item.keywords : [];

    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.author?.toLowerCase().includes(search.toLowerCase()) ||
      itemKeywords.join(" ").toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category ? item.category === category : true;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  return (
    <div className="library-page">
      <h1>Digital Library</h1>

      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title, author, or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Database">Database</option>
          <option value="Library Science">Library Science</option>
          <option value="Audio">Audio</option>
          <option value="Image">Image</option>
          <option value="Article">Article</option>
        </select>
      </div>

      <div className="grid">
        {filteredContents.map((item) => (
          <ContentCard key={item._id} content={item} />
        ))}
      </div>
    </div>
  );
}

export default LibraryPage;