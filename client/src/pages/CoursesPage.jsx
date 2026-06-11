import { useEffect, useState } from 'react'
import { fetchCourses } from '../services/api'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import Footer from '../components/Footer'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4 flex-grow-1" style={{ maxWidth: 1200 }}>
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '1.8rem' }}>📚 Catalogue des cours</h1>
            <p className="text-muted mb-0">Tous tes cours de basketball disponibles sur la plateforme.</p>
          </div>
          <input
            type="search"
            className="form-control rounded-pill"
            placeholder="🔍 Rechercher un cours..."
            style={{ maxWidth: 260 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="text-muted mt-3">Chargement des cours...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <p className="text-muted mt-2">Aucun cours ne correspond à ta recherche.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(course => (
              <div key={course._id} className="col-12 col-sm-6 col-lg-4">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
