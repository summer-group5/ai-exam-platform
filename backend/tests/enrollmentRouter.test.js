//enrollmentRouter.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { vi } from 'vitest'

vi.mock('../src/supabaseAdmin.js', () => {
  return {
    supabaseAdmin: {
      auth: {
        getUser: vi.fn(),
        admin: {
          inviteUserByEmail: vi.fn()
        }
      },
      from: vi.fn()
    }
  }
})

import request from 'supertest'
import app from '../index.js'
import { supabaseAdmin } from '../src/supabaseAdmin.js'

vi.mock('../src/supabaseAdmin.js', () => ({
  supabaseAdmin: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn((table) => {
      if (table === 'courses') {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { id: 1, teacher_id: 'teacher1' },
                error: null
              })
            })
          })
        }
      }

      if (table === 'course_enrollments') {
        return {
          select: () => ({
            eq: () => ({
              order: async () => ({
                data: [{ id: 1, student_id: 'stu1' }],
                error: null
              })
            })
          })
        }
      }

      if (table === 'users') {
        return {
          select: () => ({
            in: async () => ({
              data: [{ id: 'stu1', name: 'Anna' }],
              error: null
            })
          })
        }
      }

      throw new Error(`Unexpected table: ${table}`)
    })
  }
}))




describe('GET enrollments', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns students', async () => {

    supabaseAdmin.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'teacher1' }
        
      }, error: null
    
    })

    supabaseAdmin.from.mockImplementation((table) => {
  if (table === 'courses') {
    return {
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: 1,
              teacher_id: 'teacher1'
            },
            error: null
          })
        })
      })
    }
  }

  if (table === 'course_enrollments') {
    return {
      select: () => ({
        eq: () => ({
          order: async () => ({
            data: [
              { id: 1, student_id: 'stu1' }
            ],
            error: null
          })
        })
      })
    }
  }

  if (table === 'users') {
    return {
      select: () => ({
        in: async () => ({
          data: [
            { id: 'stu1', name: 'Anna' }
          ],
          error: null
        })
      })
    }
  }

  throw new Error(`Unexpected table: ${table}`)
})

    const res =
      await request(app)
        .get('/api/courses/1/enrollments')
        .set(
          'Authorization',
          'Bearer token'
        )

    expect(res.status).toBe(200)

    expect(
      res.body.students.length
    ).toBe(1)

  })

})





