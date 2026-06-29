//supabase.test.js
import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { supabaseAdmin } from '../src/supabaseAdmin.js'


describe('Supabase connection', () => {
  it('can connect and query users table', async () => {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1)

    expect(error).toBeNull()
    expect(Array.isArray(data)).toBe(true)
  })
})