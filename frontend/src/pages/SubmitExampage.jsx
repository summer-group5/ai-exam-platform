import React, { useState } from 'react'
import ExamTimer from '../components/timer/ExamTimer'
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import './SubmitExampage.css'

import { submitExamSession } from '../services/monitoringService';

export default function SubmitExampage() {

  const location = useLocation();
  const exam = location.state?.exam;
  const timeLimit = location.state?.timeLimit ?? 60;
  const sessionId = location.state?.sessionId ?? null;
  const examStartedAt = location.state?.examStartedAt ?? null;

  const navigate = useNavigate();
  const { id } = useParams();

  const answers = location.state?.answers ?? [];
  const questions = location.state?.questions ?? [];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const submittableAnswers = questions
        .map((q, i) => {
          const selectedText = answers[i];
          if (!selectedText) return null;
          const option = q.question_options?.find(o => o.option_text === selectedText);
          if (!option) return null;
          return { question_id: q.id, option_id: option.id };
        })
        .filter(Boolean);

      const { score, max_score } = await submitExamSession(sessionId, submittableAnswers);

      navigate(`/Coursepage/${id}/exam/results`, {
        state: {
          score,
          max_score,
          questions,
          answers
        }
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit exam: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const returnToExam = () => {
    navigate(`/Coursepage/${id}/exam`, {
      state: {
        exam,
        timeLimit,
        answers,
        questions,
        sessionId,
        examStartedAt,
        skipIntro: true
      }
    });
  };

  return (
    <div className='submit-exam-page'>
      <div className="submit-header">
        <div className="timer-container">
          <span className="timer-span">
            <ExamTimer
              initialSeconds={(() => {
                const total = timeLimit * 60;
                if (!examStartedAt) return total;
                const elapsed = Math.floor((Date.now() - examStartedAt) / 1000);
                return Math.max(0, total - elapsed);
              })()}
              onFinish={handleSubmit}
            />
          </span>
        </div>
      </div>

      <section className='submit-section'>
        <h3 className='submit-heading'>Are you sure to submit all answers and return to course page ?</h3>

        <button className='submit-btn' type='submit' onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit all tasks and return to course'}
        </button>

        <button className='submit-btn' onClick={returnToExam} disabled={submitting}>Return to exam</button>
      </section>
    </div>
  )
}
