import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage.jsx';
import LandingPage from './Components/LandingPage/LandingPage.jsx';
import AboutUs from './Components/AboutUsPage/AboutUs.jsx';
import ContactUs from './Components/ContactUsPage/ContactUs.jsx';
import Login from './Components/LoginPage/Login.jsx';
import Student from './Components/Routes/StudentRoutes.jsx';
import Faculty from './Components/Routes/FacultyRoutes.jsx';
import AcademicAdmin from './Components/Routes/AcademicAdminRoutes.jsx';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute.jsx'; // Import the ProtectedRoute component
import Navbar from './Components/Navbar/Navbar.jsx';
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    setToken(authToken);
    setRole(userRole);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {!token || !role ? (
          <>
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about-us" element={<AboutUs/>} />
            <Route path="/contact-us" element={<ContactUs/>} />
          </>
        ) : (
          <Route path="/" element={<HomePage />} />
        )}

        {/* Protected Routes with Layout */}
        <Route element={<Navbar />}>
          <Route
            path="/student/*"
            element={
              <ProtectedRoute
                element={<Student />}
                requiredRole="student"
              />
            }
          />
          <Route
            path="/faculty/*"
            element={
              <ProtectedRoute
                element={<Faculty />}
                requiredRole="faculty"
              />
            }
          />
          <Route
            path="/academic-admin/*"
            element={
              <ProtectedRoute
                element={<AcademicAdmin />}
                requiredRole="academic-admin"
              />
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;