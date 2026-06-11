import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse } from '../../services/api'
import { createLesson, updateLesson, deleteLesson, createQuiz, importQuiz, deleteQuiz } from '../../services/adminApi'
import { formatDate } from '../../utils/date'
import Navbar from '../../components/Navbar'

const EMPTY_LESSON = { title: '', content: '', order: 1, availableAt: '' }
const EMPTY_QUIZ = { title: '', passingScore: 70, questions: [] }

export default function AdminCourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON)
  const [editingLesson, setEditingLesson] = useState(null)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [savingLesson, setSavingLesson] = useState(false)

  const [quizJson, setQuizJson] = useState('')
  const [quizImportMode, setQuizImportMode] = useState('form')
  const [quizForm, setQuizForm] = useState({ ...EMPTY_QUIZ })
  const [savingQuiz, setSavingQuiz] = useState(false)
  const [showQuizForm, setShowQuizForm] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function reload() {
    const data = await fetchCourse(courseId)
    setCourse(data)
    setLoading(false)
  }

  useEffect(() => { reload() }, [courseId])

  function flash(msg) { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  function startEditLesson(lesson) {
    setEditingLesson(lesson._id)
    setLessonForm({ title: lesson.title, content: lesson.content, order: lesson.order, availableAt: lesson.availableAt?.split('T')[0] || '' })
    setShowLessonForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSaveLesson(e) {
    e.preventDefault()
    setSavingLesson(true); setError('')
    try {
      const payload = { ...lessonForm, order: parseInt(lessonForm.order) || 1 }
      if (editingLesson) await updateLesson(editingLesson, payload)
      else await createLesson(courseId, payload)
      await reload()
      setShowLessonForm(false)
      setEditingLesson(null)
      setLessonForm(EMPTY_LESSON)
      flash(editingLesson ? 'Leçon modifiée ✅' : 'Leçon créée ✅')
    } catch (err) { setError(err.message) }
    finally { setSavingLesson(false) }
  }

  async function handleDeleteLesson(id) {
    if (!confirm('Supprimer cette leçon ?')) return
    await deleteLesson(id)
    await reload()
    flash('Leçon supprimée')
  }

  async function handleSaveQuiz(e) {
    e.preventDefault()
    setSavingQuiz(true); setError('')
    try {
      if (quizImportMode === 'json') {
        await importQuiz(courseId, { json: JSON.parse(quizJson) })
      } else {
        await createQuiz(courseId, quizForm)
      }
      await reload()
      setShowQuizForm(false)
      setQuizForm({ ...EMPTY_QUIZ })
      setQuizJson('')
      flash('Quiz créé ✅')
    } catch (err) { setError(err.message) }
    finally { setSavingQuiz(false) }
  }

  async function handleDeleteQuiz(id) {
    if (!confirm('Supprimer ce quiz ?')) return
    await deleteQuiz(id)
    await reload()
    flash('Quiz supprimé')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-warning" role="status" />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1000 }}>
        <button className="btn btn-sm btn-outline-secondary rounded-pill mb-3" onClick={() => navigate('/admin/courses')}>← Retour aux cours</button>

        <div className="rounded-4 p-4 mb-4 text-white" style={{ background: `linear-gradient(135deg, ${course?.color}cc, ${course?.color})` }}>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '2.5rem' }}>{course?.icon}</span>
            <div>
              <h1 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>{course?.title}</h1>
              <small style={{ opacity: 0.85 }}>{course?.lessons?.length} leçons · {course?.quizzes?.length} quiz</small>
            </div>
          </div>
        </div>

        {success && <div className="alert alert-success rounded-3 py-2 mb-3">{success}</div>}
        {error && <div className="alert alert-danger rounded-3 py-2 mb-3">{error}</div>}

        {/* ── Leçons ── */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>📖 Leçons</h2>
            <button className="btn btn-sm rounded-pill text-white fw-semibold px-3" style={{ background: '#f97316', border: 'none' }}
              onClick={() => { setShowLessonForm(!showLessonForm); setEditingLesson(null); setLessonForm(EMPTY_LESSON) }}>
              {showLessonForm && !editingLesson ? 'Annuler' : '➕ Ajouter'}
            </button>
          </div>

          {showLessonForm && (
            <form onSubmit={handleSaveLesson} className="mb-4 p-3 rounded-3" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <h6 className="fw-bold mb-3">{editingLesson ? 'Modifier la leçon' : 'Nouvelle leçon'}</h6>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-7">
                  <label className="form-label small fw-semibold text-muted">Titre</label>
                  <input className="form-control rounded-3" placeholder="Titre de la leçon" value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small fw-semibold text-muted">Ordre</label>
                  <input type="number" className="form-control rounded-3" min="1" value={lessonForm.order} onChange={e => setLessonForm(p => ({ ...p, order: e.target.value }))} />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small fw-semibold text-muted">Disponible le</label>
                  <input type="date" className="form-control rounded-3" value={lessonForm.availableAt} onChange={e => setLessonForm(p => ({ ...p, availableAt: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Contenu HTML</label>
                  <textarea className="form-control rounded-3 font-monospace" rows={8} placeholder="<h2>Titre</h2><p>Contenu de la leçon en HTML...</p>" value={lessonForm.content} onChange={e => setLessonForm(p => ({ ...p, content: e.target.value }))} style={{ fontSize: '0.82rem' }} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn rounded-pill text-white fw-semibold px-4" style={{ background: '#0f3460', border: 'none' }} disabled={savingLesson}>
                  {savingLesson ? 'Sauvegarde...' : editingLesson ? '💾 Modifier' : '✅ Créer'}
                </button>
                <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => { setShowLessonForm(false); setEditingLesson(null) }}>Annuler</button>
              </div>
            </form>
          )}

          {course?.lessons?.length === 0 ? (
            <p className="text-muted small">Aucune leçon. Ajoutez-en une.</p>
          ) : (
            course?.lessons?.map(l => (
              <div key={l._id} className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                <div className="fw-bold text-muted" style={{ minWidth: 24 }}>{l.order}</div>
                <div className="flex-grow-1">
                  <div className="fw-semibold small">{l.title}</div>
                  <small className="text-muted">Dispo : {formatDate(l.availableAt)} {new Date(l.availableAt) > new Date() ? '🔒' : '✅'}</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm rounded-pill" style={{ background: '#f0f9ff', color: '#0f3460', border: '1px solid #bae6fd', fontSize: '0.75rem' }} onClick={() => startEditLesson(l)}>Modifier</button>
                  <button className="btn btn-sm rounded-pill" style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.75rem' }} onClick={() => handleDeleteLesson(l._id)}>Supprimer</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Quiz ── */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>✅ Quiz</h2>
            <button className="btn btn-sm rounded-pill text-white fw-semibold px-3" style={{ background: '#16a34a', border: 'none' }} onClick={() => setShowQuizForm(!showQuizForm)}>
              {showQuizForm ? 'Annuler' : '➕ Ajouter'}
            </button>
          </div>

          {showQuizForm && (
            <form onSubmit={handleSaveQuiz} className="mb-4 p-3 rounded-3" style={{ background: '#f0fff4', border: '1px solid #86efac' }}>
              <div className="d-flex gap-2 mb-3">
                {['form', 'json'].map(m => (
                  <button key={m} type="button" className={`btn btn-sm rounded-pill ${quizImportMode === m ? 'text-white' : 'btn-outline-secondary'}`}
                    style={quizImportMode === m ? { background: '#16a34a', border: 'none' } : {}}
                    onClick={() => setQuizImportMode(m)}>
                    {m === 'form' ? '📝 Formulaire' : '📄 Importer JSON'}
                  </button>
                ))}
              </div>

              {quizImportMode === 'json' ? (
                <>
                  <label className="form-label small fw-semibold text-muted">JSON du quiz</label>
                  <textarea className="form-control rounded-3 font-monospace mb-3" rows={8} placeholder={'{\n  "title": "Quiz Basketball",\n  "passingScore": 70,\n  "questions": [\n    {\n      "text": "Combien de joueurs ?",\n      "options": ["4", "5", "6"],\n      "correctAnswers": ["5"]\n    }\n  ]\n}'} value={quizJson} onChange={e => setQuizJson(e.target.value)} style={{ fontSize: '0.8rem' }} />
                </>
              ) : (
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-8">
                    <label className="form-label small fw-semibold text-muted">Titre du quiz</label>
                    <input className="form-control rounded-3" placeholder="Ex: Quiz règles fondamentales" value={quizForm.title} onChange={e => setQuizForm(p => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-muted">Seuil de réussite (%)</label>
                    <input type="number" className="form-control rounded-3" min="0" max="100" value={quizForm.passingScore} onChange={e => setQuizForm(p => ({ ...p, passingScore: parseInt(e.target.value) }))} />
                  </div>
                  <div className="col-12">
                    <div className="alert alert-info rounded-3 small py-2">
                      💡 Pour ajouter des questions, utilisez le mode <strong>Importer JSON</strong> avec le format ci-dessus.
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn rounded-pill text-white fw-semibold px-4" style={{ background: '#16a34a', border: 'none' }} disabled={savingQuiz}>
                  {savingQuiz ? 'Sauvegarde...' : '✅ Créer le quiz'}
                </button>
                <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setShowQuizForm(false)}>Annuler</button>
              </div>
            </form>
          )}

          {course?.quizzes?.length === 0 ? (
            <p className="text-muted small">Aucun quiz. Ajoutez-en un.</p>
          ) : (
            course?.quizzes?.map(q => (
              <div key={q._id} className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                <div className="flex-grow-1">
                  <div className="fw-semibold small">{q.title}</div>
                  <small className="text-muted">{q.questions?.length} questions · Seuil : {q.passingScore}%</small>
                </div>
                <button className="btn btn-sm rounded-pill" style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.75rem' }} onClick={() => handleDeleteQuiz(q._id)}>Supprimer</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
