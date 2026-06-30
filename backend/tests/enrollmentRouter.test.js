import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../src/supabaseAdmin.js', () => ({
  supabaseAdmin: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn()
  }
}))
import app from '../index'
import { supabaseAdmin } from '../src/supabaseAdmin.js'




console.log("HIT ENROLLMENT ROUTE")


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

    supabaseAdmin.from
      .mockReturnValueOnce({
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
      })

      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            order: async () => ({
              data: [
                {
                  id: 1,
                  student_id: 'stu1'
                }
              ], error: null
            })
          })
        })
      })

      .mockReturnValueOnce({
        select: () => ({
          in: async () => ({
            data: [
              {
                id: 'stu1',
                name: 'Anna'
              }
            ],
            error: null
          })
        })
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