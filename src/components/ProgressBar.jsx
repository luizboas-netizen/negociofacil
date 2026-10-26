
function ProgressBar({ value, max = 100, label = 'Progresso' }) {
  const percentage = max > 0
    ? Math.min(100, Math.max(0, (value / max) * 100))
    : 0

  return (
    <div className="progress-component">
      <div className="progress-component-header">
        <span>{label}</span>
        <strong>{Math.round(percentage)}%</strong>
      </div>

      <div
        className="progress-component-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-component-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
