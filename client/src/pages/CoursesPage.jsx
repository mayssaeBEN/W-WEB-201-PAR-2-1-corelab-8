import { useEffect, useState } from 'react'
import { fetchCourses } from '../services/api'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1200 }}>
        <div className="mb-4">
          <h1 className="fw-bold" style={{ fontSize: '1.8rem' }}>📚 Catalogue des cours</h1>
          <p className="text-muted">Tous tes cours de basketball disponibles sur la plateforme.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="text-muted mt-3">Chargement des cours...</p>
          </div>
        ) : (
          <div className="row g-4">
            {courses.map(course => (
              <div key={course._id} className="col-12 col-sm-6 col-lg-4">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
