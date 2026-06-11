import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

export default function CourseCard({ course }) {
  const navigate = useNavigate()
  const { _id, title, description, icon, color, lessonsCount, quizzesCount, totalLessons, completedLessons } = course

  return (
    <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
    >
      <div className="d-flex align-items-center justify-content-center" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)`, height: 100 }}>
        <span style={{ fontSize: '3rem' }}>{icon}</span>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1rem', lineHeight: 1.3 }}>{title}</h5>
        <p className="card-text text-muted small mb-3" style={{ flex: 1, lineHeight: 1.5 }}>{description}</p>

        <div className="d-flex gap-3 mb-3">
          <span className="badge rounded-pill" style={{ background: `${color}22`, color }}>
            📖 {lessonsCount} leçons
          </span>
          <span className="badge rounded-pill bg-light text-secondary">
            ✅ {quizzesCount} quiz
          </span>
        </div>

        <ProgressBar value={completedLessons} total={totalLessons} label="Progression" showText={true} height={8} />

        <button
          className="btn btn-sm mt-3 fw-semibold text-white rounded-pill"
          style={{ background: color, border: 'none' }}
          onClick={() => navigate(`/courses/${_id}`)}
        >
          Accéder au cours →
        </button>
      </div>
    </div>
  )
}
