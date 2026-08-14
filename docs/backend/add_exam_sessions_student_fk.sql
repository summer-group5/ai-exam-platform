/*Foreign key SQL Query to connect exam sessions to pblic users by student id*/
ALTER TABLE public.exam_sessions
ADD CONSTRAINT exam_sessions_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES public.users(id)
ON DELETE SET NULL;