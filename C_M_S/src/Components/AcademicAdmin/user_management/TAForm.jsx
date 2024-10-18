import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { ADDTA_ROUTE, EDITTA_ROUTE, SEARCHTAS_ROUTE, GETNONTA_ROUTE, GETFACULTYS_ROUTE, GETCOURSES_ROUTE } from "../../../utils/constants";

const TAForm = () => {
  const { enrollment } = useParams(); // Get TA ID from the URL
  const navigate = useNavigate(); // Initialize navigate
  const [ta, setTA] = useState({
    enrollment: '', // studentId (enrollment number)
    facultyId: '', // facultyId
    teachingSemester: '', // teaching semester
    teachingCourses: '', // courseId
    startDate: '', // Start date
    endDate: '', // End date
    stipendAmount: '', // Stipend amount
  });

  const [loading, setLoading] = useState(false); // Track loading state
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const [showToast, setShowToast] = useState(false); // Show toast

  useEffect(() => {
    if (enrollment) {
      fetchTAData(enrollment); // Fetch TA data for editing if enrollment is present
    }
  }, [enrollment]);
  function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  const fetchTAData = async (id) => {
    setLoading(true); // Start loading
    try {
      const response = await apiClient.get(SEARCHTAS_ROUTE(id), {
        withCredentials: true,
      });

      const data = response.data || {};
      const taData = data.tas[0] || {}; // Access the single TA object
      setTA({
        enrollment: taData.enrollment || '',
        facultyId: taData.facultyId || '',
        teachingSemester: taData.teachingSemester || '',
        teachingCourses: taData.teachingCourses || '',
        startDate: formatDate(taData.startDate) || '',
        endDate: formatDate(taData.endDate) || '',
        stipendAmount: taData.stipendAmount || '',
      });
    } catch (error) {
      console.error("Error fetching TA data:", error);
      setToastMessage("Error fetching TA data. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTA((prevTA) => ({
      ...prevTA,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setTA({
      enrollment: '',
      facultyId: '',
      teachingSemester: '',
      teachingCourses: '',
      startDate: '',
      endDate: '',
      stipendAmount: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMessage("");
    setShowToast(false);

    if (!e.target.checkValidity()) {
      setToastMessage("Please fill out all required fields.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    try {
      const url = enrollment ? EDITTA_ROUTE(enrollment) : ADDTA_ROUTE;
      const method = enrollment ? 'put' : 'post';
      const response = await apiClient[method](url, ta, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        setToastMessage(response.data.message || "Success!");
        setShowToast(true);
        if (!enrollment) resetForm();

        // Navigate back on success
        setTimeout(() => {
          setShowToast(false);
          navigate(-1); // Go back to the previous page
        }, 3000);
      }
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "An error occurred while processing the TA data."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (loading) {
    return <p>Loading TA data...</p>; // Display loading message when fetching data
  }

  return (
    <div className="TAForm">
      <div className='heading'>
        <h2 style={{ marginLeft: '20px' }}>
          {enrollment ? "Edit TA Details" : "Add TA Detail:"}
        </h2>
        <button onClick={() => navigate(-1)} className='user_btn' style={{ marginRight: '20px' }} >Back</button>
      </div>
      <form className="student-form" onSubmit={handleSubmit} noValidate>

        <label>Student Enrollment ID:</label>
        <input
          type="text"
          name="enrollment"
          value={ta.enrollment}
          onChange={handleChange}
          required
        />

        <label>Faculty ID:</label>
        <input
          type="text"
          name="facultyId"
          value={ta.facultyId}
          onChange={handleChange}
          required
        />

        <label>Course ID:</label>
        <input
          type="text"
          name="teachingCourses"
          value={ta.teachingCourses}
          onChange={handleChange}
          required
        />

        <label>Teaching Semester:</label>
        <input
          type="number"
          name="teachingSemester"
          value={ta.teachingSemester}
          onChange={handleChange}
          required
        />

        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={ta.startDate}
          onChange={handleChange}
          required
        />

        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={ta.endDate}
          onChange={handleChange}
        />

        <label>Stipend Amount:</label>
        <input
          type="text"
          name="stipendAmount"
          value={ta.stipendAmount}
          onChange={handleChange}
        />

        <button type="submit" className='submit-btn'>{enrollment ? "Update" : "Submit"}</button>
      </form>
      {showToast && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
};

export default TAForm;
