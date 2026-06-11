import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ScoreDisplay from '../components/ScoreDisplay'

export default function QuizResultPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { result, quiz } = location.state || {}

  if (!result || !quiz) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Résultats indisponibles</h2>
          <p className="text-muted">Passe le quiz d'abord !</p>
          <button className="btn btn-primary rounded-pill mt-3" onClick={() => navigate(`/quiz/${quizId}`)}>
            Passer le quiz
          </button>
        </div>
      </div>
    )
  }

  const { score, passed, passingScore, correct, total, feedback } = result

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 800 }}>

        <h1 className="fw-bold mb-4" style={{ fontSize: '1.5rem' }}>Résultats du quiz</h1>
        <p className="text-muted mb-4">{quiz.title}</p>

        {/* Score */}
        <div className="mb-4">
          <ScoreDisplay score={score} passed={passed} passingScore={passingScore} correct={correct} total={total} />
        </div>

        {/* Feedback par question */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>📋 Détail des réponses</h2>
          {quiz.questions.map((q, i) => {
            const fb = feedback.find(f => f.questionId === q._id)
            return (
              <div
                key={q._id}
                className="p-3 rounded-3 mb-3"
                style={{
                  background: fb?.correct ? '#f0fff4' : '#fff5f5',
                  border: `1px solid ${fb?.correct ? '#86efac' : '#fca5a5'}`,
                }}
              >
                <div className="d-flex align-items-start gap-2 mb-2">
                  <span style={{ fontSize: '1.1rem' }}>{fb?.correct ? '✅' : '❌'}</span>
                  <p className="fw-semibold mb-0 small">{i + 1}. {q.text}</p>
                </div>
                {!fb?.correct && (
                  <div className="ms-4">
                    <small className="text-muted">Bonne réponse : </small>
                    <small className="text-success fw-semibold">{fb?.correctAnswers?.join(', ')}</small>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="d-flex gap-3 flex-wrap">
          <button
            className="btn rounded-pill fw-semibold text-white px-4"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', border: 'none' }}
            onClick={() => navigate(`/quiz/${quizId}`)}
          >
            🔄 Refaire le quiz
          </button>
          <button
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => navigate(-2)}
          >
            ← Retour au cours
          </button>
          <button
            className="btn btn-outline-primary rounded-pill px-4"
            onClick={() => navigate('/dashboard')}
          >
            🏠 Tableau de bord
          </button>
        </div>

      </div>
    </div>
  )
}
