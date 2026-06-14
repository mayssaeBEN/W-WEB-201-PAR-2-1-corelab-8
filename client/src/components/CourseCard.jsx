import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

export default function CourseCard({ course }) {
  const navigate = useNavigate()
  const { _id, title, description, lessonsCount, quizzesCount, totalLessons, completedLessons } = course

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-orange text-white">
        <h3 className="h6 fw-bold mb-0">{title}</h3>
      </div>
      <div className="card-body d-flex flex-column">
        <p className="text-muted small">{description}</p>
        <div className="mb-3">
          <span className="badge bg-light text-dark border me-2">{lessonsCount} leçons</span>
          <span className="badge bg-light text-dark border">{quizzesCount} quiz</span>
        </div>
        <ProgressBar value={completedLessons} total={totalLessons} label="Progression" height={8} />
        <button
          className="btn btn-orange btn-sm mt-auto"
          onClick={() => navigate(`/courses/${_id}`)}
        >
          Voir le cours
        </button>
      </div>
    </div>
  )
}
