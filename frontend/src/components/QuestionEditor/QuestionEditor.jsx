import React, { useState } from 'react'
import { addQuestion, deleteQuestion, addOption, deleteOption } from '../../services/questionService'
import './QuestionEditor.css'

function QuestionCard({ question, courseId, assignmentId, onChanged }) {
  const [optionText, setOptionText] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleAddOption = async () => {
    if (!optionText.trim()) return
    setSaving(true)
    setError(null)
    try {
      await addOption(courseId, assignmentId, question.id, {
        option_text: optionText.trim(),
        is_correct: isCorrect
      })
      setOptionText('')
      setIsCorrect(false)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteOption = async (optionId) => {
    try {
      await deleteOption(courseId, assignmentId, question.id, optionId)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Delete this question and all its options?')) return
    try {
      await deleteQuestion(courseId, assignmentId, question.id)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='qe-question-card'>
      <div className='qe-question-header'>
        <p className='qe-question-text'>{question.question_text}</p>
        <button className='qe-delete-btn' onClick={handleDeleteQuestion}>Delete question</button>
      </div>

      <ul className='qe-options-list'>
        {question.question_options?.map(option => (
          <li key={option.id} className={`qe-option-item ${option.is_correct ? 'qe-correct' : ''}`}>
            <span>{option.option_text}</span>
            {option.is_correct && <span className='qe-correct-badge'>Correct</span>}
            <button className='qe-delete-option-btn' onClick={() => handleDeleteOption(option.id)}>✕</button>
          </li>
        ))}
      </ul>

      <div className='qe-add-option-form'>
        <input
          type='text'
          placeholder='Option text'
          value={optionText}
          onChange={e => setOptionText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddOption()}
        />
        <label className='qe-correct-label'>
          <input
            type='checkbox'
            checked={isCorrect}
            onChange={e => setIsCorrect(e.target.checked)}
          />
          Correct answer
        </label>
        <button className='qe-add-option-btn' onClick={handleAddOption} disabled={saving || !optionText.trim()}>
          {saving ? 'Adding...' : 'Add option'}
        </button>
      </div>

      {error && <p className='qe-error'>{error}</p>}
    </div>
  )
}

export default function QuestionEditor({ courseId, assignmentId, questions, onQuestionsChanged }) {
  const [questionText, setQuestionText] = useState('')
  const [maxPoints, setMaxPoints] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleAddQuestion = async () => {
    if (!questionText.trim()) return
    setSaving(true)
    setError(null)
    try {
      await addQuestion(courseId, assignmentId, {
        question_text: questionText.trim(),
        max_points: Number(maxPoints),
        order_number: questions.length + 1
      })
      setQuestionText('')
      setMaxPoints(1)
      onQuestionsChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='question-editor'>
      <h2>Questions</h2>

      {questions.length === 0 ? (
        <p className='qe-empty'>No questions yet. Add one below.</p>
      ) : (
        questions
          .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))
          .map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              courseId={courseId}
              assignmentId={assignmentId}
              onChanged={onQuestionsChanged}
            />
          ))
      )}

      <div className='qe-add-question-form'>
        <h3>Add question</h3>
        <textarea
          placeholder='Question text'
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          rows={3}
        />
        <div className='qe-points-row'>
          <label>
            Points:
            <input
              type='number'
              min='1'
              value={maxPoints}
              onChange={e => setMaxPoints(e.target.value)}
            />
          </label>
        </div>
        {error && <p className='qe-error'>{error}</p>}
        <button
          className='qe-add-question-btn'
          onClick={handleAddQuestion}
          disabled={saving || !questionText.trim()}
        >
          {saving ? 'Adding...' : 'Add question'}
        </button>
      </div>
    </div>
  )
}
