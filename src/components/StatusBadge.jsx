const CLASS_MAP = {
  Open: "badge badge-open",
  "In Progress": "badge badge-progress",
  Resolved: "badge badge-resolved",
};

export default function StatusBadge({ status }) {
  return <span className={CLASS_MAP[status] || "badge"}>{status}</span>;
}