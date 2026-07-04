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
    <div className="page-shell">
      <Navbar />
      <main className="container page-container flex-grow-1">
        <div className="page-header d-flex align-items-end justify-content-between flex-wrap gap-3">
          <div>
            <h1>Catalogue des cours</h1>
            <p className="text-muted mb-0">Tous les cours disponibles.</p>
          </div>
          <input
            type="search"
            className="form-control"
            style={{ maxWidth: 260 }}
            placeholder="Rechercher un cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted mt-3">Chargement des cours...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Aucun cours ne correspond à ta recherche.</p>
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
      </main>
      <Footer />
    </div>
  )
}
