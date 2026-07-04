import { useNavigate } from 'react-router-dom'
import { isLessonAvailable, isLessonCompleted } from '../services/api'
import { formatDate } from '../utils/date'

export default function LessonItem({ lesson, index }) {
  const navigate = useNavigate()
  const available = isLessonAvailable(lesson)
  const completed = lesson.completed || isLessonCompleted(lesson._id)

  function handleClick() {
    if (!available) return
    navigate(`/lessons/${lesson._id}`)
  }

  return (
    <div
      className={`lesson-item ${completed ? 'is-completed' : ''} ${available ? 'lesson-available' : 'lesson-locked'}`}
      onClick={handleClick}
      role="button"
      tabIndex={available ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div
        className="lesson-index"
      >
        {completed ? 'OK' : available ? index + 1 : '-'}
      </div>

      <div className="flex-grow-1">
        <div className="fw-semibold" style={{ fontSize: '0.95rem', color: available ? '#111827' : '#6b7280' }}>
          {lesson.title}
        </div>
        {!available && (
          <small className="text-muted">
            Disponible le {formatDate(lesson.availableAt)}
          </small>
        )}
        {available && completed && (
          <small className="text-success fw-medium">Leçon complétée</small>
        )}
      </div>

      {available && (
        <span className="text-muted" style={{ fontSize: '1.1rem' }}>&gt;</span>
      )}
    </div>
  )
}
