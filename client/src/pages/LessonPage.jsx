import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchLesson, isLessonAvailable, markLessonComplete } from '../services/api'
import { formatDate } from '../utils/date'
import { estimateReadTime } from '../utils/time'
import Navbar from '../components/Navbar'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [markedDone, setMarkedDone] = useState(false)

  useEffect(() => {
    fetchLesson(lessonId).then(data => {
      setLesson(data)
      setLoading(false)
    })
  }, [lessonId])

  async function handleComplete() {
    setMarking(true)
    await markLessonComplete(lessonId)
    setMarkedDone(true)
    setMarking(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-warning" role="status" />
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Leçon introuvable</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Retour</button>
        </div>
      </div>
    )
  }

  const available = isLessonAvailable(lesson)

  if (!available) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="container py-5" style={{ maxWidth: 700 }}>
          <button className="btn btn-sm btn-outline-secondary rounded-pill mb-4" onClick={() => navigate(-1)}>
            Retour
          </button>
          <div className="card border-0 shadow-sm rounded-4 text-center p-5">
            <h2 className="fw-bold mb-2">{lesson.title}</h2>
            <p className="text-muted mb-1">Cette leçon n'est pas encore disponible.</p>
            <p className="text-muted">
              Elle sera accessible le <strong>{formatDate(lesson.availableAt)}</strong>.
            </p>
            <div className="alert alert-info rounded-3 mt-3 text-start">
              <strong>Pourquoi cette leçon est-elle verrouillée ?</strong><br />
              Ton enseignant a programmé une date de disponibilité pour cette leçon afin de structurer ton parcours d'apprentissage progressivement.
            </div>
            <button className="btn btn-outline-primary rounded-pill mt-2" onClick={() => navigate(-1)}>
              Retour au cours
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 860 }}>

        <button className="btn btn-sm btn-outline-secondary rounded-pill mb-3" onClick={() => navigate(-1)}>
          Retour au cours
        </button>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div
            className="p-4"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: 'white' }}
          >
            <div className="mb-1">
              <small className="text-white-50">Leçon</small>
            </div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{lesson.title}</h1>
            <small style={{ opacity: 0.7 }}>{estimateReadTime(lesson.content)} min de lecture</small>
          </div>

          <div className="card-body p-4">
            <div
              className="lesson-content"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
              style={{ lineHeight: 1.8 }}
            />
          </div>
        </div>

        {/* Mark as complete */}
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
          {markedDone ? (
            <div className="text-success">
              <p className="fw-bold mt-2 mb-3">Leçon marquée comme complétée !</p>
              <button className="btn btn-success rounded-pill px-4" onClick={() => navigate(-1)}>
                Retour au cours
              </button>
            </div>
          ) : (
            <>
              <p className="text-muted mb-3">Tu as terminé cette leçon ?</p>
              <button
                className="btn rounded-pill px-4 fw-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none' }}
                onClick={handleComplete}
                disabled={marking}
              >
                {marking ? (
                  <><span className="spinner-border spinner-border-sm me-2" /> Enregistrement...</>
                ) : (
                  'Marquer comme complétée'
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
