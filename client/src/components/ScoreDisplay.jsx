export default function ScoreDisplay({ score, passed, passingScore, correct, total }) {
  const color = passed ? '#16a34a' : '#dc2626'
  const bg = passed ? '#f0fff4' : '#fff5f5'
  const border = passed ? '#86efac' : '#fca5a5'

  return (
    <div className="text-center p-4 rounded-4" style={{ background: bg, border: `2px solid ${border}` }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, color, lineHeight: 1 }}>
        {score}%
      </div>

      <div className="mt-2 mb-3" style={{ fontSize: '1.1rem', fontWeight: 600, color }}>
        {passed ? 'Réussi !' : 'Échoué'}
      </div>

      <div className="d-flex justify-content-center gap-4 mb-3">
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#16a34a' }}>{correct}</div>
          <small className="text-muted">Bonnes réponses</small>
        </div>
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#dc2626' }}>{total - correct}</div>
          <small className="text-muted">Mauvaises réponses</small>
        </div>
        <div className="text-center">
          <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#6b7280' }}>{total}</div>
          <small className="text-muted">Total questions</small>
        </div>
      </div>

      <small className="text-muted">Seuil de réussite : {passingScore}%</small>
    </div>
  )
}
