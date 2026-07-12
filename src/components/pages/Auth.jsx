import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      console.error("Auth error code:", err.code);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "80vh", 
      fontFamily: "'Segoe UI', Roboto, sans-serif", 
      backgroundColor: "#f8f9fa", 
      padding: "20px" 
    }}>
      <div style={{ 
        background: "#ffffff", 
        padding: "40px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", 
        width: "100%", 
        maxWidth: "420px", 
        boxSizing: "border-box" 
      }}>
        {isSignUp ? (
          <>
            <h2 style={{ margin: "0 0 8px 0", color: "#1a1a1a", fontSize: "24px", fontWeight: "600" }}>Create an account</h2>
            <p style={{ color: "#666666", fontSize: "14px", margin: "0 0 24px 0" }}>Get started with MaintainIQ today.</p>
          </>
        ) : (
          <>
            <h2 style={{ margin: "0 0 8px 0", color: "#1a1a1a", fontSize: "24px", fontWeight: "600" }}>Welcome back</h2>
            <p style={{ color: "#666666", fontSize: "14px", margin: "0 0 24px 0" }}>Sign in to your dashboard to manage assets.</p>
          </>
        )}

        {error && (
          <div style={{ 
            backgroundColor: "#ffebe6", 
            color: "#cc0000", 
            padding: "10px 14px", 
            borderRadius: "6px", 
            fontSize: "14px", 
            marginBottom: "20px", 
            borderLeft: "4px solid #cc0000" 
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#444444", marginBottom: "6px" }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              autoComplete="off"
              style={{ 
                padding: "12px 14px", 
                fontSize: "15px", 
                border: "1px solid #cccccc", 
                borderRadius: "6px", 
                outline: "none",
                width: "100%",
                boxSizing: "border-box"
              }} 
            />
          </div>

          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#444444", marginBottom: "6px" }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              autoComplete="new-password"
              style={{ 
                padding: "12px 14px", 
                fontSize: "15px", 
                border: "1px solid #cccccc", 
                borderRadius: "6px", 
                outline: "none",
                width: "100%",
                boxSizing: "border-box"
              }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "12px", 
              backgroundColor: "#0066cc", 
              color: "#ffffff", 
              border: "none", 
              borderRadius: "6px", 
              fontSize: "16px", 
              fontWeight: "600", 
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              marginTop: "10px"
            }}
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#555555", marginTop: "24px" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ 
              background: "none", 
              border: "none", 
              color: "#0066cc", 
              fontSize: "14px", 
              fontWeight: "600", 
              cursor: "pointer", 
              padding: "0", 
              marginLeft: "6px", 
              textDecoration: "underline" 
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;