function StatusBadge({ status }) {
  const normalizedStatus = String(status || "Unknown")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {status || "Unknown"}
    </span>
  );
}

export default StatusBadge;