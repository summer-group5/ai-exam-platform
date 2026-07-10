import { supabase } from "../utils/supabase";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session.access_token;
}

export async function getExam(courseId) {
  const token = await getAuthToken();

  const res = await fetch(
    `${BACKEND}/api/courses/${courseId}/exam`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load exam");
  }

  return res.json();
}