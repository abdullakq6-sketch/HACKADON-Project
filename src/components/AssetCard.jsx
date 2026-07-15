import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, deleteDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: asset.name,
    category: asset.category,
    location: asset.location,
    serialNumber: asset.serialNumber,
  });

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

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    if (!form.name || !form.location) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "assets", asset.id), {
        name: form.name,
        category: form.category || "General",
        location: form.location,
        serialNumber: form.serialNumber || "N/A",
      });
      setEditing(false);
    } catch (err) {
      console.error("Error updating asset:", err);
      alert("Update nahi ho saka. Dobara try karo.");
    } finally {
      setSaving(false);
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(!editing);
              setOpen(true);
            }}
            className="edit-btn"
          >
            Edit
          </button>
          <button onClick={handleDelete} disabled={deleting} className="delete-btn">
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6f6f7a", fontSize: "14px" }}
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open && editing && (
        <div style={{ padding: "0 22px 22px" }}>
          <div className="card">
            <h3>Asset Details Edit Karo</h3>
            <div className="form-group">
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Asset Name"
              />
            </div>
            <div className="form-group grid-2">
              <input
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category"
              />
              <input
                className="input"
                value={form.serialNumber}
                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                placeholder="Serial Number"
              />
            </div>
            <div className="form-group">
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleSaveEdit} disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setEditing(false)} className="btn btn-small" style={{ background: "#26262f", color: "#f2f2f5" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {open && !editing && (
        <div className="asset-body">
          <div className="asset-body-col">
            <QRCodeDisplay assetId={asset.id} assetName={asset.name} />
            <Link to={`/asset/${asset.id}`} target="_blank" className="link">
             Open the public page. →
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