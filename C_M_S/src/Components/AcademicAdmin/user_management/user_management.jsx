import React from 'react';
import Student_home from './student_Home.jsx';
import Faculty_home from './faculty_home.jsx';
import TA_home from './TA_home.jsx';
import { Routes, Route } from 'react-router-dom';
import StudentForm from './StudentForm.jsx';
import FacultyForm from './FacultyForm.jsx';
import TAForm from './TAForm.jsx';
import "./user_management.css";

const User_Management = () => {
  return (
    <div className='user_management'>
      <Routes>
        <Route path="/" element={<Student_home />} />
        <Route path="*" element={<Student_home />} /> 
        <Route path="/student" element={<Student_home />} />
        <Route path="/student_form" element={<StudentForm />} />
        <Route path="/faculty_form" element={<FacultyForm />} />
        <Route path="/ta_form" element={<TAForm />} />
        <Route path="/faculty" element={<Faculty_home />} />
        <Route path="/ta" element={<TA_home />} />
        <Route path="/student_form/:enrollment" element={<StudentForm />} />
        <Route path="/faculty_form/:facultyId" element={<FacultyForm />} />
        <Route path="/ta_form/:enrollment" element={<TAForm />} />


      </Routes>
    </div>
  );
};

export default User_Management;
