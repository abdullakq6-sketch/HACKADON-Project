import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import AdminDashboard from "./components/pages/AdminDashboard.jsx";
import AssetPublicPage from "./components/pages/AssetPublicPage.jsx";
import Auth from "./components/pages/Auth";
import Home from "./components/pages/Home.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

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
          <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#4f46e5', fontSize: '20px' }}>MaintainIQ</Link>

          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div
                title={user.email}
                style={{
                  width: '35px', height: '35px', borderRadius: '50%',
                  backgroundColor: '#4f46e5', color: 'white', display: 'flex',
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

          <Route
            path="/"
            element={
              checking ? (
                <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</p>
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