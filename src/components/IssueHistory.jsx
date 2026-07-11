import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import StatusBadge from "./StatusBadge.jsx";

const STATUS_FLOW = ["Open", "In Progress", "Resolved"];

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function IssueHistory({ issues, editable = false }) {
  const [notesDraft, setNotesDraft] = useState({});

  const advanceStatus = async (issue) => {
    const currentIdx = STATUS_FLOW.indexOf(issue.status);
    const nextStatus = STATUS_FLOW[Math.min(currentIdx + 1, STATUS_FLOW.length - 1)];

    const updates = { status: nextStatus };
    if (nextStatus === "Resolved") {
      updates.resolvedAt = serverTimestamp();
      updates.resolutionNotes = notesDraft[issue.id] || "Resolved.";
    }

    await updateDoc(doc(db, "issues", issue.id), updates);
  };

  if (!issues || issues.length === 0) {
    return <p className="muted-italic"></p>;
  }

  return (
    <div>
      {issues.map((issue) => (
        <div key={issue.id} className="issue-item">
          <div className="issue-item-top">
            <div>
              <p className="issue-desc">{issue.description}</p>
              <p className="issue-meta">
                {issue.category} • Reported by {issue.reporterName || "Anonymous"} • {formatDate(issue.createdAt)}
              </p>
            </div>
            <StatusBadge status={issue.status} />
          </div>

          {issue.status === "Resolved" && issue.resolutionNotes && (
            <p className="resolution-note">✓ {issue.resolutionNotes}</p>
          )}

          {editable && issue.status !== "Resolved" && (
            <div className="issue-actions">
              {issue.status === "In Progress" && (
                <input
                  className="notes-input"
                  placeholder="Resolution notes..."
                  value={notesDraft[issue.id] || ""}
                  onChange={(e) =>
                    setNotesDraft((prev) => ({ ...prev, [issue.id]: e.target.value }))
                  }
                />
              )}
              <button onClick={() => advanceStatus(issue)} className="btn btn-primary btn-small">
                Mark as {issue.status === "Open" ? "In Progress" : "Resolved"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}