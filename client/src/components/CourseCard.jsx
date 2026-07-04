import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

export default function CourseCard({ course }) {
  const navigate = useNavigate()
  const { _id, title, description, lessonsCount, quizzesCount, totalLessons, completedLessons } = course

  return (
    <div className="card course-card h-100">
      <div className="card-body d-flex flex-column">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-description text-clamp-2">{description}</p>
        <div className="course-card-meta">
          <span className="badge bg-light fw-normal">{lessonsCount} leçons</span>
          <span className="badge bg-light fw-normal">{quizzesCount} quiz</span>
        </div>
        <ProgressBar value={completedLessons} total={totalLessons} label="Progression" height={6} />
        <button
          className="btn btn-quiet btn-sm mt-3"
          onClick={() => navigate(`/courses/${_id}`)}
        >
          Voir le cours
        </button>
      </div>
    </div>
  )
}
