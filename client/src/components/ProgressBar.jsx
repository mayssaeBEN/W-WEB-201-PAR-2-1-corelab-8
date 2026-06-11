export default function ProgressBar({ value, total, label, color = 'warning', showText = true, height = 12 }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      {showText && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          {label && <small className="text-muted">{label}</small>}
          <small className="fw-semibold text-dark">{pct}%</small>
        </div>
      )}
      <div className="progress rounded-pill" style={{ height }}>
        <div
          className={`progress-bar bg-${color} rounded-pill`}
          role="progressbar"
          style={{ width: `${pct}%`, transition: 'width 0.6s ease' }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showText && (
        <small className="text-muted">
          {value} / {total} {label ? '' : 'complétés'}
        </small>
      )}
    </div>
  )
}
