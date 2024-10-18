import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'; 
import { IoIosMail } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { Modal, Form, Spinner } from 'react-bootstrap';
import "./Login.css";
import { assets } from "../../assets/assets";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  let newPassword = ""; 
  let securityCode = ""; 
  let forgotPasswordUserId = ""; 

  //Error Handling
  const passwordErrorRef = useRef(null);
  const securityCodeErrorRef = useRef(null);
  const forgotPasswordErrorRef = useRef(null);
  
  // Toast notification state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Handle Login Submission
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        user_id: userId,
        password: password,
      });
  
      if (!response.data.securityCodeRequired) { 
        // Store token and role from response
        localStorage.setItem('authToken', response.data.token); 
        localStorage.setItem('userRole', response.data.role); // Store user role
      }
  
      if (response.data.securityCodeRequired) {
        setShowSecurityCodeModal(true);
    } else if (response.data.mustChangePassword) { 
        setShowChangePasswordModal(true);
    } else {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
    
        // Redirect based on user role
        // const role = response.data.role;
        // switch (role) {
        //   case 'admin':
        //     navigate('/admin-dashboard');
        //     break;
        //   case 'faculty':
        //     navigate('/faculty-dashboard');
        //     break;
        //   case 'student':
        //     navigate('/');
        //     break;
        //   default:
        //     navigate('/landing-page'); 
        //     break;
        // }
        navigate('/')
    }
    
    } catch (error) {
      console.error("Login failed:", error.response.data);
      setToastMessage("Login failed. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Handle Security Code Verification
  const handleSecurityCodeSubmit = async () => {
    if (!securityCode) {
      securityCodeErrorRef.current.innerText = "Security code is required.";
      return; // Early exit if security code is empty
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/auth/verify-security-code", {
        user_id: userId,
        securityCode: securityCode,
      });
      setToken(response.data.token);
      localStorage.setItem('authToken', response.data.token); // Store the JWT token in localStorage
      localStorage.setItem('userRole', response.data.role); // Store user role
      setShowSecurityCodeModal(false);
      const role = response.data.role; // Get user role
  
      if (response.data.mustChangePassword) {
        setShowChangePasswordModal(true);
      } else {
        setToastMessage("Login successful!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 500);
        console.log("Login successful!", response.data);
        securityCodeErrorRef.current.innerText = "";
  
        // Redirect based on user role
        setTimeout(() => {
          const role = response.data.role;
          navigate("/")
        }, 500);
        
      }
    } catch (error) {
      console.error("Security code verification failed:", error.response.data);
      securityCodeErrorRef.current.innerText = "Security code verification failed. Please try again."; 
    }
  };
  

  const handleChangePasswordSubmit = async () => {
    // Password constraints
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, one uppercase, one lowercase, one number

    if (!passwordPattern.test(newPassword)) {
      passwordErrorRef.current.innerText = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
      return;
    } else {
      passwordErrorRef.current.innerText = ""; 
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        "http://localhost:3000/api/auth/change-password",
        { userId, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }, // Send JWT token
        }
      );
      setShowChangePasswordModal(false);
      setToastMessage("Password changed successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.log("Password changed successfully!", response.data);
      passwordErrorRef.current.innerText = ""; 
    } catch (error) {
      console.error("Password change failed:", error.response.data);
      passwordErrorRef.current.innerText = "Failed to change password. Please try again.";
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordUserId) {
      forgotPasswordErrorRef.current.innerText = "Please Enter User ID";
      return; // Early exit if security code is empty
    }


    try {
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", {
        user_id: forgotPasswordUserId,
      });
  
      setShowForgotPasswordModal(false); 
      setToastMessage("Password reset instructions sent to your email.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); 
      console.log("Forgot Password Request Successful", response.data);
      forgotPasswordErrorRef.current.innerText = "";
    } catch (error) {
      console.error("Forgot Password Request Failed:", error.response.data);
      forgotPasswordErrorRef.current.innerText = "Failed to change password. Please try again.";
    }
  };

  const SecurityCodeModal = React.memo(({ show, onSubmit, onClose }) => {
    return (
      <Modal backdrop="static" show={show} hide={onClose} centered>
        <Modal.Header>
          <Modal.Title>Enter Security Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Security Code</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter security code"
                onChange={(e) => securityCode = e.target.value} // Update local variable
              />
              <p ref={securityCodeErrorRef} className="text-danger mt-2"></p> {/* Error message */}
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-purple" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-purple" onClick={onSubmit}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    );
  });

  const ChangePasswordModal = ({ show, onSubmit }) => {
    return (
      <Modal backdrop="static" show={show} centered>
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                onChange={(e) => newPassword = e.target.value} // Update local variable
              />
              <p ref={passwordErrorRef} className="text-danger mt-2"></p> {/* Error message */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-purple" onClick={onSubmit}>
            Change Password
          </button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ForgotPasswordModal = React.memo(({ show, onSubmit, onClose }) => {
    const [loading, setLoading] = useState(false); // Loading state for submit button
  
    const handleSubmitWithLoading = async () => {
      setLoading(true); // Show spinner when submit is clicked
      await onSubmit(); // Wait for submit to complete
      setLoading(false); // Hide spinner once done
    };
  
    return (
      <Modal show={show} hide={onClose} centered>
        <Modal.Header>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your User ID"
                onChange={(e) => forgotPasswordUserId = e.target.value}
              />
              <p ref={forgotPasswordErrorRef} className="text-danger mt-2"></p> {/* Error message */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-purple" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-purple d-flex justify-content-center align-items-center"
            onClick={handleSubmitWithLoading}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <Spinner
                animation="border"
                size="sm"
                className="mr-2"
              />
            ) : (
              "Submit"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    );
  });

  return (
    <>
      <div className="login-page-container d-flex">
        {/* Left Section */}
        <div className="left-section d-none d-lg-flex flex-column justify-content-center align-items-center">
          <div className="text-center">
            <h1 className="heading">Where amazing things happen</h1>
            <div className="mt-4">
              <img
                src={assets.loginImg}
                alt="Illustration"
                className="login-illustration"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section d-flex flex-column justify-content-center px-4">
          <div className="login-box mx-auto text-center">
            <img src={assets.main_icon} alt="logo" className="logo-img mb-1" />
            <h2 className="login-title mb-4">Login</h2>
            <span className="text-purple">User ID</span>
            <hr className="purple-line" />

            {/* UserId Field */}
            <div className="mb-4 text-start">
              <label htmlFor="userId" className="form-label">User ID</label>
              <div className="position-relative">
                <IoIosMail className="form-icon position-absolute" />
                <input
                  type="text"
                  name="userId"
                  id="userId"
                  className="form-control pl-10"
                  placeholder="Enter User Id"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4 text-start">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="position-relative">
                <FaLock className="form-icon position-absolute" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control pl-10"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-start mt-1 text-purple forgot-password"
              onClick={() => setShowForgotPasswordModal(true)} >
                Forgot password?
              </p>
            </div>

            {/* Continue Button */}
            <button type="button" className="btn btn-purple w-100 mb-4" onClick={handleLogin}>
              Continue
            </button>

            <p className="text-sm problem-signin">
              Problem Signing In?{" "}
              <a href="/contact-us" className="text-purple">Contact Us</a>
            </p>
          </div>
        </div>

        {/* Security Code Modal */}
        <SecurityCodeModal
        show={showSecurityCodeModal}
        onSubmit={handleSecurityCodeSubmit}
        onClose={() => setShowSecurityCodeModal(false)}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
        show={showChangePasswordModal}
        onSubmit={handleChangePasswordSubmit}
        />

        <ForgotPasswordModal
          show={showForgotPasswordModal}
          onSubmit={handleForgotPasswordSubmit}
          onClose={() => setShowForgotPasswordModal(false)}
        />

        {/* Toast Notification */}
        {showToast && (
          <div className="toast-notification">
            {toastMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
