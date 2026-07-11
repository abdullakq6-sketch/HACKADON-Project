import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import QRCodeDisplay from "./QRCodeDisplay.jsx";
import IssueHistory from "./IssueHistory.jsx";
import { getRecommendation } from "./utils/recommendations.js";

const REC_CLASS = {
  high: "rec-box rec-high",
  medium: "rec-box rec-medium",
  low: "rec-box rec-low",
};

export default function AssetCard({ asset, issues }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const assetIssues = issues.filter((i) => i.assetId === asset.id);
  const openCount = assetIssues.filter((i) => i.status !== "Resolved").length;
  const recommendation = getRecommendation(assetIssues);

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `"${asset.name}" ko delete karna hai? Iski saari maintenance history bhi permanently delete ho jayegi.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const issuesQuery = query(collection(db, "issues"), where("assetId", "==", asset.id));
      const issuesSnap = await getDocs(issuesQuery);
      await Promise.all(issuesSnap.docs.map((d) => deleteDoc(doc(db, "issues", d.id))));

      await deleteDoc(doc(db, "assets", asset.id));
    } catch (err) {
      console.error("Error deleting asset:", err);
      alert("Asset delete nahi ho saka. Dobara try karo.");
      setDeleting(false);
    }
  };

  return (
    <div className="asset-card">
      <div className="asset-header" style={{ cursor: "default" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1, padding: 0 }}
        >
          <div className="asset-name-row">
            <div className="category-icon">
              {asset.category ? asset.category.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="asset-name">{asset.name}</p>
              <p className="asset-meta">
                {asset.category} • {asset.location} • S/N: {asset.serialNumber}
              </p>
            </div>
          </div>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {openCount > 0 && <span className="open-count">{openCount} open</span>}
          <button onClick={handleDelete} disabled={deleting} className="delete-btn">
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "14px" }}
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="asset-body">
          <div className="asset-body-col">
            <QRCodeDisplay assetId={asset.id} assetName={asset.name} />
            <Link to={`/asset/${asset.id}`} target="_blank" className="link">
              Public page kholo →
            </Link>
            {recommendation && (
              <div className={REC_CLASS[recommendation.level]}>
                <strong>AI Suggestion: </strong>
                {recommendation.message}
              </div>
            )}
          </div>

          <div>
            <h4 className="section-title">Maintenance History</h4>
            <IssueHistory issues={assetIssues} editable />
          </div>
        </div>
      )}
    </div>
  );
}