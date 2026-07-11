import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

export default function AssetForm({ onAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "assets"), {
        name,
        category: category || "General",
        location,
        serialNumber: serialNumber || "N/A",
        createdAt: serverTimestamp(),
      });
      setName("");
      setCategory("");
      setLocation("");
      setSerialNumber("");
      onAdded && onAdded();
    } catch (err) {
      console.error("Error adding asset:", err);
      alert("Asset add nahi ho saka. Firebase config check karo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Naya Asset Register Karo</h3>

      <div className="form-group">
        <input
          className="input"
          placeholder="Asset Name (e.g. AC Unit - Room 204)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group grid-2">
        <input
          className="input"
          placeholder="Category (e.g. HVAC)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="input"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          className="input"
          placeholder="Location (e.g. Building A, Floor 2)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: "100%" }}>
        {saving ? "Adding..." : "+ Add Asset & Generate QR"}
      </button>
    </form>
  );
}