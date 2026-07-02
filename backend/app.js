const express = require('express');
const cors = require('cors');

const assignmentRouter = require('./src/assignmentRouter');

//const enrollmentRouter = require('./src/enrollmentRouter');
// testing enrollment with vitest
const { supabaseAdmin } = require('./src/supabaseAdmin');
const createEnrollmentRouter = require('./src/enrollmentRouter');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/courses/:courseId/assignments', assignmentRouter);

//app.use('/api/courses/:courseId/enrollments', enrollmentRouter);
// testing enrollment with vitest
app.use(
  '/api/courses/:courseId/enrollments',
  createEnrollmentRouter(supabaseAdmin)
);
module.exports = app;