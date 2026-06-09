import './App.css'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

import { supabase } from './utils/supabase'

// Get data from the "users" table in Supabase and log it to the console - quick test for the connection test.
function App() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase
        .schema('public')
        .from('users')
        .select('*')

      console.log('SUPABASE DATA:', data)
      console.log('SUPABASE ERROR:', error)
    }

    testSupabase()
  }, [])

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App