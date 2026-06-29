import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { getEnrollments, importEnrollments, removeEnrollment } from '../services/enrollmentService'
import './EnrollmentPage.css'

export default function EnrollmentPage() {
  const { id: courseId } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [csvFile, setCsvFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    getEnrollments(courseId)
      .then(data => setStudents(data.students))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [courseId])

  async function handleRemove(studentId, studentName) {
    if (!window.confirm(`Remove ${studentName} from this course?`)) return
    try {
      await removeEnrollment(courseId, studentId)
      setStudents(prev => prev.filter(row => row.student.id !== studentId))
    } catch (err) {
      alert('Failed to remove student: ' + err.message)
    }
  }

  async function handleImport(e) {
    e.preventDefault()
    if (!csvFile) return
    setImporting(true)
    setImportResult(null)
    try {
      const result = await importEnrollments(courseId, csvFile)
      setImportResult(result)
      const data = await getEnrollments(courseId)
      setStudents(data.students)
      setCsvFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      alert('Import failed: ' + err.message)
    } finally {
      setImporting(false)
    }
  }

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My Courses', path: '/my-courses' },
    { text: 'Back to Course', path: `/Coursepage/${courseId}` }
  ]

  return (
    <>
      <Topnav links={navLinks} />
      <div className="enrollment-page">

        <div className="enrollment-header">
          <h1>Manage Students</h1>
          <Link to={`/Coursepage/${courseId}`} className="btn-secondary">
            Back to Course
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
          <>
            <section className="enrollment-section">
              <h2>Enrolled Students ({students.length})</h2>
              {students.length === 0 ? (
                <p className="empty-state">No students enrolled yet.</p>
              ) : (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Enrolled</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(row => (
                      <tr key={row.id}>
                        <td>{row.student.name}</td>
                        <td>{row.student.email}</td>
                        <td>{new Date(row.enrolled_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn-danger"
                            onClick={() => handleRemove(row.student.id, row.student.name)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="enrollment-section">
              <h2>Import from CSV</h2>
              <p className="import-hint">CSV must have columns: <code>name</code>, <code>email</code></p>
              <form onSubmit={handleImport}>
                <div className="form-group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={e => setCsvFile(e.target.files[0] ?? null)}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={!csvFile || importing}>
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </form>

              {importResult && (
                <div className="import-result">
                  <p className="import-success">Imported: {importResult.imported} student(s)</p>
                  {importResult.skipped.length > 0 && (
                    <>
                      <p className="import-skipped">Skipped: {importResult.skipped.length}</p>
                      <ul className="skipped-list">
                        {importResult.skipped.map((s, i) => (
                          <li key={i}>Row {s.row} ({s.email}): {s.reason}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  )
}
