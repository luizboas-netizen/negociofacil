
function ProgressBar({ value, max = 100, label = 'Progresso' }) {
  const valorNumerico = Number(value) || 0
  const valorMaximo = Number(max) || 0

  const percentage =
    valorMaximo > 0
      ? Math.min(100, Math.max(0, (valorNumerico / valorMaximo) * 100))
      : 0

  const percentualArredondado = Math.round(percentage)

  return (
    <div className="progress-component">
      <div className="progress-component-header">
        <span>{label}</span>
        <strong>{percentualArredondado}%</strong>
      </div>

      <div
        className="progress-component-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={percentualArredondado}
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
