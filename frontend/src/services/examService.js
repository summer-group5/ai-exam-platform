// examService.js
import { supabase } from "../utils/supabase";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session.access_token;
}

export async function getMyExamSession(courseId) {
  const token = await getAuthToken();

  const res = await fetch(`${BACKEND}/api/courses/${courseId}/exam/my-session`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getExam(courseId) {
  const token = await getAuthToken();

  const res = await fetch(`${BACKEND}/api/courses/${courseId}/exam`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to load exam");
  }

  return res.json();
}

export async function createExam(courseId, { title, duration_minutes, start_time }) {
  const token = await getAuthToken();

  const res = await fetch(`${BACKEND}/api/courses/${courseId}/exam`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, duration_minutes, start_time })
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body;
}

export async function addExamQuestion(courseId, { question_text, order_number }) {
  const token = await getAuthToken();

  const res = await fetch(`${BACKEND}/api/courses/${courseId}/exam/questions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question_text, order_number })
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body;
}

export async function addExamOption(courseId, questionId, { option_text, is_correct }) {
  const token = await getAuthToken();

  const res = await fetch(`${BACKEND}/api/courses/${courseId}/exam/questions/${questionId}/options`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ option_text, is_correct })
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body;
}