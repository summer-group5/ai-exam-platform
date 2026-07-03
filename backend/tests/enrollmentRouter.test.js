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

// test if teacher is not owner
 it('returns 403 when teacher is not owner', async () => {
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
                teacher_id: 'anotherTeacher', // different owner
              },
              error: null,
            }),
          }),
        }),
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  const res = await request(app)
    .get('/api/courses/1/enrollments')
    .set('Authorization', 'Bearer token');

  expect(res.status).toBe(403);
  expect(res.body).toEqual({
    error: 'Forbidden',
  });



  expect(fakeSupabase.auth.getUser).toHaveBeenCalledWith('token');
});
  
describe('POST /api/courses/:courseId/enrollments/import', () => {
  it('imports valid CSV', async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'teacher1',
        },
      },
      error: null,
    });

    fakeSupabase.auth.admin = {
      inviteUserByEmail: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'stu1',
          },
        },
        error: null,
      }),
    };

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

      if (table === 'users') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: null,
                error: null,
              }),
            }),
          }),
          insert: async () => ({
            error: null,
          }),
        };
      }

      if (table === 'course_enrollments') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: null,
                  error: null,
                }),
              }),
            }),
          }),
          insert: async () => ({
            error: null,
          }),
        };
      }
    });

    const csv =
      'name,email\n' +
      'Anna,anna@test.com\n';

    const res = await request(app)
      .post('/api/courses/1/enrollments/import')
      .set('Authorization', 'Bearer token')
      .attach('file', Buffer.from(csv), 'students.csv');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      imported: 1,
      skipped: [],
    });
  });
});



  it('returns 400 when no file is uploaded', async () => {
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

    throw new Error(`Unexpected table: ${table}`);
  });

  const res = await request(app)
  .post('/api/courses/1/enrollments/import')
  .set('Authorization', 'Bearer token') 
  
  });

  it('skips duplicate emails', async () => {
    
    fakeSupabase.auth.getUser.mockResolvedValue({
    data: {
      user: {
        id: 'teacher1',
      },
    },
    error: null,
  });
  
  fakeSupabase.auth.admin = {
    inviteUserByEmail: vi.fn().mockResolvedValue({
      data: {
        user: { id: 'stu1' },
      },
      error: null,
    }),
  };
  
  // TODO
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

    if (table === 'users') {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: null,
            }),
          }),
        }),
        insert: async () => ({
          error: null,
        }),
      };
    }

    if (table === 'course_enrollments') {
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
        insert: async () => ({
          error: null,
        }),
      };
    }
  });

  const csv =
    'name,email\n' +
    'Anna,anna@test.com\n' +
    'Bob,anna@test.com\n';

  const res = await request(app)
    .post('/api/courses/1/enrollments/import')
    .set('Authorization', 'Bearer token')
    .attach('file', Buffer.from(csv), 'students.csv');

  expect(res.status).toBe(200);
  expect(res.body.imported).toBe(1);
  expect(res.body.skipped).toEqual([
    {
      row: 3,
      email: 'anna@test.com',
      reason: 'duplicate-in-file',
    },
  ]);

  });


describe('DELETE /api/courses/:courseId/enrollments/:studentId', () => {
  it('removes a student', async () => {
    // TODO
  
  });

  it('returns 404 when enrollment does not exist', async () => {
    // TODO
  });
});