import { Link } from "react-router-dom";
import "./ContentCard.css";

function ContentCard({ content }) {
  const keywords = Array.isArray(content.keywords) ? content.keywords : [];
  const contentId = content._id || content.id;

  return (
    <div className="card">
      <span className="badge">{content.type}</span>

      <h2>{content.title}</h2>
      <p>Author: {content.author}</p>
      <p>Category: {content.category}</p>

      <div className="keywords">
        {keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>

      <p>Reads: {content.readCount || 0}</p>
      <p>Downloads: {content.downloadCount || 0}</p>

      {contentId ? (
        <Link to={`/content/${contentId}`}>View Details</Link>
      ) : (
        <span>No ID found</span>
      )}
    </div>
  );
}

export default ContentCard;