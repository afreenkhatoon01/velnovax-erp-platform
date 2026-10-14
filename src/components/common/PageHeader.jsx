function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {actionLabel && (
        <button
          type="button"
          className="primary-button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default PageHeader;