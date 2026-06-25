//Main.jsx//
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import App from "./App"
import Frontpage from './pages/Frontpage'
import Studentspage from './pages/Studentspage'
import Teacherspage from './pages/Teacherspage'
import Examdesignpage from './pages/Examdesignpage'
import Createquizpage from './pages/Createquizpage'
import Createcoursepage from './pages/Createcoursepage'
import Loginpage from './pages/Loginpage'
import Coursepage from './pages/Coursepage'
import Exampage from './pages/Exampage'
import ProtectedRoute from './components/ProtectedRoute'
import MyCoursespage from './pages/MyCoursespage'
import SubmitExampage from './pages/SubmitExampage'
import ExamResultspage from './pages/ExamResultspage'
import CreateAssignmentPage from './pages/CreateAssignmentPage'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not Found</div>,
    children:[
    { index: true, element: <Frontpage/> },

     // Student route
      { path: "student", element: <ProtectedRoute><Studentspage /></ProtectedRoute> },
    // Teacher route
      { path: "teacher", element: <ProtectedRoute><Teacherspage /></ProtectedRoute> },

      // Design exam route
      {path: "design-exam", element: <ProtectedRoute><Examdesignpage /></ProtectedRoute>},

     // Design quiz route
      {path: "create-quiz", element: <ProtectedRoute><Createquizpage /></ProtectedRoute>},

      // Create course route
      {path: "create-course", element: <ProtectedRoute><Createcoursepage /></ProtectedRoute>},

      // Login route
      {path: "login", element: <Loginpage />},
      { path: "student", element: <Studentspage /> },
    // Teacher route
      { path: "teacher", element: <Teacherspage /> },

      // Design exam route
     

     // Design quiz route
      

      // Create course route
     

      // My courses route
      {path: "my-courses", element: <MyCoursespage />},

      // Single course route
      {path: "Coursepage/:id", element: <ProtectedRoute><Coursepage /></ProtectedRoute>},

      //  Route for exam page
      { path:"/Coursepage/:id/exam", element: <ProtectedRoute><Exampage /></ProtectedRoute> },
      //  Route for exam page 
      
 
      //  Route for submit exam page 
      

      //  Route for exam results 
      { path:"/Coursepage/:id/exam/results", element: <ExamResultspage /> },

      { path:"/Coursepage/:id/exam/submit", element: <SubmitExampage /> },

      { path: "/Coursepage/:id/create-assignment", element: <ProtectedRoute><CreateAssignmentPage /></ProtectedRoute> }


    ]


  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>


      <RouterProvider router={router} />


  </StrictMode>,
);
