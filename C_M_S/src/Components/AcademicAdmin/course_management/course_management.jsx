import React from 'react'
import { Routes, Route } from 'react-router-dom';
import "./course_management.css";
import Viewcourse from './viewcourse.jsx';
import AddCourse from './addcourse.jsx';
// import Deletedcourse from './deletedcourse.jsx'

const course_management = () => {
  return (
    <div className='course_management'>
      <Routes>
        <Route path="/" element={<Viewcourse />} />
        <Route path="*" element={<Viewcourse />} /> 
        <Route path="/addcourse" element={<AddCourse />} /> 
        <Route path="/viewcourse" element={<Viewcourse />} />
        <Route path="/addcourse/:courseID" element={<AddCourse />} />
        {/* <Route path="/deletedcourse" element={<Deletedcourse />} /> */}
      </Routes>
    </div>
  )
}

export default course_management
