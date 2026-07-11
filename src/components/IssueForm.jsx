import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

export default function IssueForm({ assetId, onSubmitted }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [reporterName, setReporterName] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "issues"), {
        assetId,
        description,
        category,
        reporterName: reporterName || "Anonymous",
        status: "Open",
        createdAt: serverTimestamp(),
      });
      setDescription("");
      setReporterName("");
      setDone(true);
      onSubmitted && onSubmitted();
    } catch (err) {
      console.error("Error submitting issue:", err);
      alert("Issue submit nahi ho saka. Dobara try karo.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="success-box">
        ✓ Issue report ho gaya. Maintenance team ko notify kar diya gaya hai.
        <button
          onClick={() => setDone(false)}
          className="link"
          style={{ display: "block", marginTop: "8px", background: "none", border: "none", cursor: "pointer" }}
        >
          Ek aur issue report karo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Issue Report Karo</h3>

      <div className="form-group">
        <textarea
          className="textarea"
          placeholder="Problem kya hai? (e.g. AC se pani leak ho raha hai)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>General</option>
          <option>Electrical</option>
          <option>Plumbing</option>
          <option>HVAC</option>
          <option>Structural</option>
          <option>Safety Hazard</option>
        </select>
      </div>

      <div className="form-group">
        <input
          className="input"
          placeholder="Your name (optional)"
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
        />
      </div>

      <button type="submit" disabled={saving} className="btn btn-danger" style={{ width: "100%" }}>
        {saving ? "Submitting..." : "Report Issue"}
      </button>
    </form>
  );
}