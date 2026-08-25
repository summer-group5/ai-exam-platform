require('dotenv').config();
const express = require('express');
const cors = require('cors');
const assignmentRouter = require('./src/assignmentRouter')

const examRouter = require("./src/examRouter");
const questionRouter = require("./src/questionRouter");

const port = Number(process.env.PORT || 4000);
const monitoringRouter = require('./src/monitoringRouter')
const enrollmentRouter = require('./src/enrollmentRouter')
const submissionRouter = require('./src/submissionRouter')

const courseRouter = require('./src/courseRouter')

const app = express();
app.use(cors());
app.use(express.json());

// Course-level routes (must be before /:courseId routes)
app.use('/api/courses', courseRouter)

// Assignment CRUD
app.use('/api/courses/:courseId/assignments', assignmentRouter)
// Assignment submissions
app.use('/api/courses/:courseId/assignments/:assignmentId', submissionRouter)
// Assignment questions
app.use('/api/courses/:courseId/assignments/:assignmentId', questionRouter)
app.use('/api/courses/:courseId/enrollments', enrollmentRouter)
app.use('/api', monitoringRouter);
app.use("/api/courses/:courseId/exam", examRouter);
app.use("/api/exams", questionRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
