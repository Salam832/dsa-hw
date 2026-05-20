import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentCard from "../components/ContentCard";
import "./LibraryPage.css";

function LibraryPage() {
  const navigate = useNavigate();

  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

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
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="library-page">
      <button className="logout-btn library-logout" onClick={handleLogout}>
        Logout
      </button>

      <h1>Digital Library</h1>

      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title, author, or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

       
       <span className="category-label">
  Category
</span>

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">All</option>

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

      <div className="grid">
        {filteredContents.map((item) => (
          <ContentCard key={item._id} content={item} />
        ))}
      </div>
    </div>
  );
}

export default LibraryPage;