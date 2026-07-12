import { Link } from "react-router-dom";

const VALUES = [
  {
    icon: "⚡",
    title: "Accountability first",
    desc: "Every issue reported and every action taken is permanently logged — nothing gets lost or forgotten.",
  },
  {
    icon: "🔓",
    title: "Zero friction reporting",
    desc: "Anyone can report a problem by scanning a QR code — no accounts, no app downloads, no barriers.",
  },
  {
    icon: "📊",
    title: "Data-driven maintenance",
    desc: "Patterns in repeated failures surface automatically, so teams act before assets break down.",
  },
];

const STEPS = [
  {
    title: "Register an asset",
    desc: "Admins add an asset with its name, category, location, and serial number — a QR code is generated instantly.",
  },
  {
    title: "Place the QR code",
    desc: "Print and attach the QR to the physical asset — a machine, a room, a fixture, anything that needs upkeep.",
  },
  {
    title: "Anyone scans, anyone reports",
    desc: "A staff member, student, or guest scans the code and reports an issue in seconds — no login required.",
  },
  {
    title: "Admins triage and resolve",
    desc: "The issue appears on the dashboard. Admins update its status and log resolution notes as work progresses.",
  },
  {
    title: "History builds automatically",
    desc: "Every issue stays attached to the asset forever, building a complete, searchable maintenance record.",
  },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-inner">
          <span className="hero-badge">About MaintainIQ</span>
          <h1>Built to fix the gap between "reported" and "resolved"</h1>
          <p>
            MaintainIQ started from a simple observation: maintenance issues get reported
            everywhere — verbally, in group chats, on sticky notes — and then disappear.
            We built a system where nothing gets lost.
          </p>
        </div>
      </div>

      <div className="about-story">
        <h2>Why we built this</h2>
        <p>
          Facility teams across schools, hospitals, offices, and factories all face the
          same problem: physical assets break down, but there's no reliable trail connecting
          what broke, who reported it, what was done, and when. MaintainIQ replaces scattered
          reporting with a single, permanent record tied to a QR code on the asset itself.
        </p>
        <p>
          The QR code is only the entry point. The real value is everything that happens
          after the scan — issue triage, status tracking, resolution notes, and preventive
          insights that help teams act before small problems become expensive ones.
        </p>

        <div className="about-values">
          {VALUES.map((v) => (
            <div className="about-value-card" key={v.title}>
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-timeline">
        <div className="about-timeline-inner">
          <h2>How it works</h2>
          {STEPS.map((step, i) => (
            <div className="timeline-step" key={step.title}>
              <div className="timeline-num">{i + 1}</div>
              <div className="timeline-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-inner">
          <h2>Ready to try MaintainIQ?</h2>
          <p>Sign up as an admin and register your first asset in minutes.</p>
          <Link to="/auth" className="btn btn-white btn-lg">Get Started</Link>
        </div>
      </div>

      <div className="footer-strip">
        © 2026 MaintainIQ — Asset History & Maintenance Platform
      </div>
    </div>
  );
}