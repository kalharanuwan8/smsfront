import React from 'react'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Students from './pages/Students'
import Course from './pages/Course'
import Logs from './pages/Logs'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path ="/" element={<Login/>}/>
        <Route path ="/dashboard" element={<Dashboard/>}/>
        <Route path ="/students" element={<Students/>}/>
        <Route path= "/courses" element={<Course/>}/>
        
        <Route path= "/logs" element={<Logs/>}/>
      </Routes>
    </Router> 
    
  )
}

export default App
