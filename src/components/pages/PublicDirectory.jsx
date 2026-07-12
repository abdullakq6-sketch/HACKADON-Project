import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js";

export default function PublicDirectory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "assets"), (snap) => {
      setAssets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="public-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Report an issue</h1>
            <p>Pick an asset below to view its details and report a problem — no login needed.</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="empty-state">No assets have been registered yet.</div>
        ) : (
          <div className="directory-grid">
            {assets.map((asset) => (
              <Link to={`/asset/${asset.id}`} className="directory-card" key={asset.id}>
                <div className="directory-card-top">
                  <div className="category-icon">
                    {asset.category ? asset.category.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div>
                    <h3>{asset.name}</h3>
                    <p>{asset.category} • {asset.location}</p>
                  </div>
                </div>
                <span className="directory-card-cta">View & report issue →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}