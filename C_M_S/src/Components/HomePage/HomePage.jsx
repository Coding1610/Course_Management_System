import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch token and user role from localStorage
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole'); // Retrieve userRole as a string directly

    // If token or userRole does not exist, redirect to login (landing page)
    if (!token || !userRole) {
      navigate('/landing-page');
      return;
    }

    // Redirect based on user role
    switch (userRole) {
      case 'master-admin':
        navigate('/master-admin-dashboard');
        break;
      case 'finance-admin':
        navigate('/finance-admin-dashboard');
        break;
      case 'academic-admin':
        navigate('/academic-admin-dashboard');
        break;
      case 'faculty':
        navigate('/faculty-dashboard');
        break;
      case 'student':
        navigate('/student-dashboard');
        break;
      default:
        navigate('/landing-page'); // Handle cases where the role is invalid
        break;
    }
   
  }, [navigate]);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default HomePage;