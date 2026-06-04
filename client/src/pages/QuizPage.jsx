import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchQuiz, submitQuiz } from '../services/api'
import Navbar from '../components/Navbar'
import QuizQuestion from '../components/QuizQuestion'

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuiz(quizId).then(data => {
      setQuiz(data)
      setLoading(false)
    })
  }, [quizId])

  function handleAnswer(questionId, option) {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = quiz?.questions?.length || 0
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0

  async function handleSubmit() {
    if (!allAnswered) {
      setError(`Réponds à toutes les questions (${answeredCount}/${totalQuestions} répondues).`)
      return
    }
    setError('')
    setSubmitting(true)
    const result = await submitQuiz(quizId, answers)
    setSubmitting(false)
    if (result) {
      navigate(`/quiz/${quizId}/results`, { state: { result, quiz } })
    } else {
      setError('Une erreur est survenue. Réessaie.')
    }
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

  if (!quiz) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Quiz introuvable</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Retour</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 800 }}>

        <button className="btn btn-sm btn-outline-secondary rounded-pill mb-3" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        {/* Quiz header */}
        <div
          className="rounded-4 p-4 mb-4 text-white"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
        >
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '2.5rem' }}>🧠</span>
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{quiz.title}</h1>
              <div className="d-flex gap-3">
                <small style={{ opacity: 0.85 }}>{totalQuestions} questions</small>
                <small style={{ opacity: 0.85 }}>Seuil de réussite : {quiz.passingScore}%</small>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-3">
            <div className="d-flex justify-content-between mb-1">
              <small style={{ opacity: 0.85 }}>Questions répondues</small>
              <small style={{ opacity: 0.85 }}>{answeredCount}/{totalQuestions}</small>
            </div>
            <div className="progress rounded-pill" style={{ height: 8, background: 'rgba(255,255,255,0.3)' }}>
              <div
                className="progress-bar bg-white rounded-pill"
                style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`, transition: 'width 0.3s' }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        {quiz.questions.map((q, i) => (
          <QuizQuestion
            key={q._id}
            question={q}
            index={i}
            selected={answers[q._id]}
            onChange={handleAnswer}
          />
        ))}

        {error && (
          <div className="alert alert-warning rounded-3 mb-3" role="alert">
            ⚠️ {error}
          </div>
        )}

        <div className="d-grid">
          <button
            className="btn py-3 fw-bold rounded-pill text-white"
            style={{
              background: allAnswered ? 'linear-gradient(135deg, #f97316, #ef4444)' : '#e5e7eb',
              border: 'none',
              color: allAnswered ? 'white' : '#9ca3af',
              transition: 'all 0.2s',
            }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <><span className="spinner-border spinner-border-sm me-2" />Correction en cours...</>
            ) : (
              `Soumettre mes réponses${!allAnswered ? ` (${answeredCount}/${totalQuestions})` : ''}`
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
