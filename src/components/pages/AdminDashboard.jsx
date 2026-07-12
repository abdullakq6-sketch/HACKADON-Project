import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase.js";
import AssetForm from "../AssetForm.jsx";
import AssetCard from "../AssetCard.jsx";

export default function AdminDashboard() {
  const [assets, setAssets] = useState([]);
  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const uid = auth.currentUser ? auth.currentUser.uid : null;
    if (!uid) return;

    const unsubAssets = onSnapshot(
      query(collection(db, "assets"), where("ownerId", "==", uid)),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAssets(list);
      }
    );

    const unsubIssues = onSnapshot(collection(db, "issues"), (snap) =>
      setIssues(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubAssets();
      unsubIssues();
    };
  }, []);

  const ownAssetIds = useMemo(() => new Set(assets.map((a) => a.id)), [assets]);
  const ownIssues = useMemo(
    () => issues.filter((i) => ownAssetIds.has(i.assetId)),
    [issues, ownAssetIds]
  );

  const openIssuesCount = ownIssues.filter((i) => i.status !== "Resolved").length;
  const inProgressCount = ownIssues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = ownIssues.filter((i) => i.status === "Resolved").length;

  const assetsWithIssueCount = useMemo(() => {
    return assets.map((asset) => {
      const assetOpenIssues = ownIssues.filter(
        (i) => i.assetId === asset.id && i.status !== "Resolved"
      ).length;
      return { ...asset, openIssues: assetOpenIssues };
    });
  }, [assets, ownIssues]);

  const filteredAssets = useMemo(() => {
    let result = assetsWithIssueCount;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (filter === "open") {
      result = result.filter((a) => a.openIssues > 0);
    } else if (filter === "clean") {
      result = result.filter((a) => a.openIssues === 0);
    }

    return result;
  }, [assetsWithIssueCount, search, filter]);

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>{assets.length} assets registered • {openIssuesCount} open issues</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Close" : "+ Add Asset"}
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-accent">
          <p className="stat-value">{assets.length}</p>
          <p className="stat-label">Total assets</p>
        </div>
        <div className="stat-card stat-danger">
          <p className="stat-value">{openIssuesCount}</p>
          <p className="stat-label">Open issues</p>
        </div>
        <div className="stat-card stat-warning">
          <p className="stat-value">{inProgressCount}</p>
          <p className="stat-label">In progress</p>
        </div>
        <div className="stat-card stat-success">
          <p className="stat-value">{resolvedCount}</p>
          <p className="stat-label">Resolved</p>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: "24px" }}>
          <AssetForm onAdded={() => setShowForm(false)} />
        </div>
      )}

      {assets.length > 0 && (
        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search by name, location, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-pills">
            <button
              className={`filter-pill ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-pill ${filter === "open" ? "active" : ""}`}
              onClick={() => setFilter("open")}
            >
              Needs attention
            </button>
            <button
              className={`filter-pill ${filter === "clean" ? "active" : ""}`}
              onClick={() => setFilter("clean")}
            >
              All clear
            </button>
          </div>
        </div>
      )}

      {assets.length === 0 ? (
        <div className="empty-state">
         No asset has been registered yet. Click "+ Add Asset".
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="empty-state">No assets were found with this search/filter.</div>
      ) : (
        <div className="asset-list">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} issues={ownIssues} />
          ))}
        </div>
      )}
    </div>
  );
}