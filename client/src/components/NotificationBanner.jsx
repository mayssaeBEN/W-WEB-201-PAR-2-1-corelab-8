import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCourses, fetchCourse } from '../services/api'
import { formatDate } from '../utils/date'

const DISMISSED_KEY = 'basketball_dismissed_notifications'

function getDismissed() {
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY)) || [] } catch { return [] }
}

function dismiss(id) {
  const d = getDismissed()
  if (!d.includes(id)) localStorage.setItem(DISMISSED_KEY, JSON.stringify([...d, id]))
}

export default function NotificationBanner() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    async function check() {
      const dismissed = getDismissed()
      const courses = await fetchCourses().catch(() => [])
      const now = new Date()
      const sevenDaysAgo = new Date(now - 7 * 24 * 3600 * 1000)
      const found = []

      for (const c of courses.slice(0, 5)) {
        const full = await fetchCourse(c._id).catch(() => null)
        if (!full?.lessons) continue
        for (const l of full.lessons) {
          const avail = new Date(l.availableAt)
          const id = `lesson_new_${l._id}`
          if (avail >= sevenDaysAgo && avail <= now && !dismissed.includes(id) && !l.completed) {
            found.push({ id, lessonId: l._id, courseId: c._id, title: l.title, courseTitle: c.title, date: l.availableAt })
          }
        }
      }
      setNotifications(found.slice(0, 3))
    }
    check()
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="mb-4">
      {notifications.map(n => (
        <div key={n.id} className="notification-item">
          <div className="flex-grow-1">
            <span className="fw-semibold small">Nouvelle leçon disponible : </span>
            <span className="small">"{n.title}" dans <em>{n.courseTitle}</em> (depuis le {formatDate(n.date)})</span>
          </div>
          <button className="btn btn-sm btn-accent"
            onClick={() => { dismiss(n.id); setNotifications(p => p.filter(x => x.id !== n.id)); navigate(`/lessons/${n.lessonId}`) }}>
            Voir
          </button>
          <button className="btn btn-sm btn-link text-muted p-0" onClick={() => { dismiss(n.id); setNotifications(p => p.filter(x => x.id !== n.id)) }}>Fermer</button>
        </div>
      ))}
    </div>
  )
}
