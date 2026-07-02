//enrollmentRouter.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const createEnrollmentRouter = require('../src/enrollmentRouter');

const fakeSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

const app = express();
app.use(express.json());

app.use(
  '/api/courses/:courseId/enrollments',
  createEnrollmentRouter(fakeSupabase)
);

describe('GET enrollments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns students', async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'teacher1',
        },
      },
      error: null,
    });


    


    fakeSupabase.from.mockImplementation((table) => {
     
     
      
    if (table === 'courses') {
    return {
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: 1,
              teacher_id: 'teacher1',
            },
            error: null,
          }),
        }),
      }),
    };
  }

  if (table === 'course_enrollments') {
    return {
      select: () => ({
        eq: () => ({
          order: async () => ({
            data: [
              {
                id: 1,
                student_id: 'stu1',
                enrolled_at: '2025-01-01',
              },
            ],
            error: null,
          }),
        }),
      }),
    };
  }

  if (table === 'users') {
    return {
      select: () => ({
        in: async () => ({
          data: [
            {
              id: 'stu1',
              name: 'Anna',
              email: 'anna@test.com',
            },
          ],
          error: null,
        }),
      }),
    };
  }

  throw new Error(`Unexpected table: ${table}`);
    
    });

    const res = await request(app)
      .get('/api/courses/1/enrollments')
      .set('Authorization', 'Bearer token');

    console.log(res.status);
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.students.length).toBe(1);
  });


  // Test missing token  
it('returns 401 when token is missing', async () => {
    const res = await request(app)
      .get('/api/courses/1/enrollments');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Missing auth token',
    });

    expect(fakeSupabase.auth.getUser).not.toHaveBeenCalled();
  });

});

