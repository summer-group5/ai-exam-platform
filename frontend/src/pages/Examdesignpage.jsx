import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./Examdesignpage.css"
import Topnav from '../components/topnav/Topnav'

import { getExam, createExam, addExamQuestion, addExamOption } from '../services/examService'
import { getExamQuestions } from '../services/questionService'

export default function Examdesignpage() {
  const { id: courseId } = useParams()
  const navigate = useNavigate()

  // Exam settings
  const [examId, setExamId] = useState(null)
  const [examTitle, setExamTitle] = useState('')
  const [examDate, setExamDate] = useState('')
  const [examTime, setExamTime] = useState('')
  const [timeLimit, setTimeLimit] = useState(60)
  const [saving, setSaving] = useState(false)

  // Questions list for display
  const [examTasks, setExamTasks] = useState([])
  const [addingQuestion, setAddingQuestion] = useState(false)

  // Manual question builder
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctOption, setCorrectOption] = useState(0)

  // Load existing exam on mount (teacher may re-enter the page)
  useEffect(() => {
    if (!courseId) return
    getExam(courseId)
      .then(async data => {
        setExamId(data.id)
        setExamTitle(data.title ?? '')
        if (data.duration_minutes) setTimeLimit(data.duration_minutes)
        try {
          const qs = await getExamQuestions(data.id)
          const mapped = qs.map(q => ({
            title: q.question_text,
            options: q.question_options.map(o => o.option_text),
            correctAnswer: (q.question_options.find(o => o.is_correct) ?? {}).option_text ?? ''
          }))
          setExamTasks(mapped)
        } catch {
          // No questions yet
        }
      })
      .catch(() => {
        // No exam yet — teacher will create one
      })
  }, [courseId])

  const handleCreateExam = async () => {
    if (!examTitle.trim()) {
      alert('Please enter an exam title')
      return
    }
    try {
      setSaving(true)
      const startTime = examDate && examTime ? `${examDate}T${examTime}:00` : null
      const exam = await createExam(courseId, {
        title: examTitle.trim(),
        duration_minutes: timeLimit,
        start_time: startTime
      })
      setExamId(exam.id)
    } catch (err) {
      alert('Failed to create exam: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      alert('Please enter a question')
      return
    }
    if (options.some(o => !o.trim())) {
      alert('Please fill in all 4 options')
      return
    }
    try {
      setAddingQuestion(true)
      const question = await addExamQuestion(courseId, {
        question_text: questionText.trim(),
        order_number: examTasks.length + 1
      })
      for (let i = 0; i < options.length; i++) {
        await addExamOption(courseId, question.id, {
          option_text: options[i].trim(),
          is_correct: i === correctOption
        })
      }
      setExamTasks(prev => [...prev, {
        title: questionText.trim(),
        options: [...options],
        correctAnswer: options[correctOption]
      }])
      setQuestionText('')
      setOptions(['', '', '', ''])
      setCorrectOption(0)
    } catch (err) {
      alert('Failed to add question: ' + err.message)
    } finally {
      setAddingQuestion(false)
    }
  }

  return (
    <>
      <Topnav />
      <div className='exam-designpage'>
        <h1>Design Exam</h1>
        <div className='design-container'>
          <div className="task-section">

            <div className="form-group">
              <label>Exam name:</label>
              <input
                type="text"
                placeholder='Give name for exam'
                value={examTitle}
                onChange={e => setExamTitle(e.target.value)}
                disabled={!!examId}
              />
            </div>

            <div className="form-group">
              <label>Exam date:</label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                disabled={!!examId}
              />
            </div>

            <div className="form-group">
              <label>Start time:</label>
              <input
                type="time"
                value={examTime}
                onChange={e => setExamTime(e.target.value)}
                disabled={!!examId}
              />
              <label>Exam time limit:</label>
              <select
                value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value))}
                disabled={!!examId}
              >
                <option value={60}>60min</option>
                <option value={90}>90min</option>
                <option value={120}>120min</option>
              </select>
            </div>

            {!examId ? (
              <button className="btn btn-primary" onClick={handleCreateExam} disabled={saving}>
                {saving ? 'Creating...' : 'Create Exam'}
              </button>
            ) : (
              <p style={{ color: 'green' }}>✓ Exam created — add questions below</p>
            )}

            {examId && (
              <>
                <h3>Current Exam Tasks</h3>
                {examTasks.length === 0 ? (
                  <p>No tasks added yet</p>
                ) : (
                  examTasks.map((task, index) => (
                    <div key={index} className="task-preview">
                      <h4>Question {index + 1}</h4>
                      <p>{task.title}</p>
                      <ul>
                        {task.options?.map((opt, i) => (
                          <li key={i}>
                            {opt === task.correctAnswer ? <strong>{opt} ✓</strong> : opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}

                <h3>Add question:</h3>
                <div className="form-group">
                  <label>Question:</label>
                  <input
                    type="text"
                    placeholder="Question text"
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                  />
                </div>
                {options.map((opt, i) => (
                  <div key={i} className="form-group">
                    <label>
                      <input
                        type="radio"
                        name="correct-option"
                        checked={correctOption === i}
                        onChange={() => setCorrectOption(i)}
                      />
                      {' '}Option {i + 1} (mark as correct):
                    </label>
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={e => {
                        const updated = [...options]
                        updated[i] = e.target.value
                        setOptions(updated)
                      }}
                    />
                  </div>
                ))}
                <button className="btn btn-primary" onClick={handleAddQuestion} disabled={addingQuestion}>
                  {addingQuestion ? 'Adding...' : 'Add Question'}
                </button>

                <div className='save-exam'>
                  <button className="btn btn-secondary" onClick={() => navigate(`/Coursepage/${courseId}`)}>
                    Finish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
