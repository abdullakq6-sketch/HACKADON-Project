import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js";
import IssueForm from "../IssueForm.jsx";
import IssueHistory from "../IssueHistory.jsx";

export default function AssetPublicPage() {
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      const snap = await getDoc(doc(db, "assets", assetId));
      if (snap.exists()) setAsset({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetchAsset();

    const unsub = onSnapshot(
      query(collection(db, "issues"), where("assetId", "==", assetId)),
      (snap) => setIssues(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [assetId]);

  if (loading) {
    return (
      <div className="public-page">
        <div className="empty-state">Loading asset...</div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="public-page">
        <div className="empty-state">Ye asset nahi mila. QR code check karo.</div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="container-sm">
        <div className="public-info-card">
          <div className="public-info-top">
            <div className="public-info-icon">
              {asset.category ? asset.category.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <h1>{asset.name}</h1>
              <p className="public-sub">{asset.category} • {asset.location}</p>
            </div>
          </div>

          <div className="public-info-meta">
            <div className="public-info-meta-item">
              <span className="public-info-meta-label">Serial No</span>
              <span className="public-info-meta-value">{asset.serialNumber}</span>
            </div>
            <div className="public-info-meta-item">
              <span className="public-info-meta-label">Category</span>
              <span className="public-info-meta-value">{asset.category}</span>
            </div>
            <div className="public-info-meta-item">
              <span className="public-info-meta-label">Location</span>
              <span className="public-info-meta-value">{asset.location}</span>
            </div>
          </div>
        </div>

        <IssueForm assetId={assetId} />

        <div style={{ marginTop: "20px" }}>
          <h3 className="section-title">Maintenance History</h3>
          <IssueHistory issues={issues} editable={false} />
        </div>
      </div>
    </div>
  );
}