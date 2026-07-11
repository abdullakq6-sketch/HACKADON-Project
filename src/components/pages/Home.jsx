import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-inner">
        <span className="hero-badge">AI-Powered Asset Management</span>
        <h1>Every asset gets a <span>digital identity</span></h1>
        <p>
          MaintainIQ gives every physical asset a QR-accessible page, an issue-reporting
          workflow, and a permanent service history — built for schools, hospitals,
          offices, factories, and facility teams.
        </p>
        <div className="hero-actions">
          <Link to="/auth" className="btn btn-primary btn-lg">Admin Login</Link>
          <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
        </div>

        <div className="feature-grid" id="features">
          <div className="feature-card">
            <div className="feature-icon">QR</div>
            <h3>Scan to report</h3>
            <p>Anyone can scan an asset's QR code and report an issue instantly — no login needed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Track & resolve</h3>
            <p>Admins triage issues, update status, and log resolution notes in one dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">AI</div>
            <h3>Preventive insights</h3>
            <p>Repeated failures are flagged automatically so maintenance stays ahead of breakdowns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}