import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import AdminDashboard from "./components/pages/AdminDashboard.jsx";
import AssetPublicPage from "./components/pages/AssetPublicPage.jsx";
import Auth from "./components/pages/Auth";
import Home from "./components/pages/Home.jsx";
import About from "./components/pages/About.jsx";
import PublicDirectory from "./components/pages/PublicDirectory.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setOpenCount(0);
      return;
    }

    let assetIds = [];
    const unsubAssets = onSnapshot(
      query(collection(db, "assets"), where("ownerId", "==", user.uid)),
      (snap) => {
        assetIds = snap.docs.map((d) => d.id);
      }
    );

    const unsubIssues = onSnapshot(collection(db, "issues"), (snap) => {
      const count = snap.docs.filter((d) => {
        const data = d.data();
        return assetIds.includes(data.assetId) && data.status !== "Resolved";
      }).length;
      setOpenCount(count);
    });

    return () => {
      unsubAssets();
      unsubIssues();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <BrowserRouter>
      <div>
        <nav className="navbar">
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <Link to="/" className="nav-link-icon brand">
              <span>🏠</span> MaintainIQ
            </Link>
            <Link to="/about" className="nav-link-icon">
              <span>ℹ️</span> About
            </Link>
            <Link to="/report" className="nav-link-icon">
              <span>📋</span> Report Issue
            </Link>
          </div>

          {user ? (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Link to="/" className="notif-bell" title={`${openCount} open issues`}>
                🔔
                {openCount > 0 && <span className="notif-badge">{openCount}</span>}
              </Link>
              <div
                title={user.email}
                style={{
                  width: '35px', height: '35px', borderRadius: '50%',
                  backgroundColor: '#f5a623', color: '#1a1206', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                  fontSize: '16px', textTransform: 'uppercase', cursor: 'pointer'
                }}
              >
                {user.email ? user.email.charAt(0) : 'U'}
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-small">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-small" style={{ textDecoration: 'none' }}>
              Login / Signup
            </Link>
          )}
        </nav>

        <Routes>
          <Route path="/asset/:assetId" element={<AssetPublicPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/report" element={<PublicDirectory />} />

          <Route
            path="/"
            element={
              checking ? (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#8a8a94' }}>Loading...</p>
              ) : user ? (
                <AdminDashboard />
              ) : (
                <Home />
              )
            }
          />

          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;