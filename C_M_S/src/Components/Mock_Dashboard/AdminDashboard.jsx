import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../AcademicAdmin/dashboard/dashboard';
import UserManagement from '../AcademicAdmin/user_management/user_management';
import Feedback from '../AcademicAdmin/feedback/Feedback';
import CourseManagement from '../AcademicAdmin/course_management/course_management';

const AdminDashboard = () => {
  return (
      <div className='App'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
          <Route path="/user_management/*" element={<UserManagement />} />
          <Route path="/course_management/*" element={<CourseManagement />} />
          <Route path="/feedback/*" element={<Feedback />} />
          
        </Routes>
      </div>
  );
};

export default AdminDashboard;
