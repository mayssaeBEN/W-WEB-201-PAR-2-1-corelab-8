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
      className={`d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${available ? 'lesson-available' : 'lesson-locked'}`}
      style={{
        background: available ? (completed ? '#f0fff4' : '#fff') : '#f8f9fa',
        border: `1px solid ${available ? (completed ? '#86efac' : '#e5e7eb') : '#e5e7eb'}`,
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available ? 1 : 0.7,
        transition: 'background 0.2s',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={available ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: available ? (completed ? '#16a34a' : '#3b82f6') : '#9ca3af',
          color: 'white',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}
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
