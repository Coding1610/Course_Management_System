import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { ADDFEEDBACK_ROUTE, EDITFEEDBACK_ROUTE, SEARCHFEEDBACK_ROUTE } from "../../../utils/constants";

const FeedbackForm = () => {
  const { feedbackID } = useParams(); // Get feedbackID from the URL
  const navigate = useNavigate(); // Initialize navigate
  const [feedback, setFeedback] = useState({
    feedbackID: '',
    feedbackName: '', // New field
    courseID: '',
    departmentID: '',
    facultyID: '',
    branch: '', // New field
    startDateTime: '',
    endDateTime: '',
  });

  const [loading, setLoading] = useState(false); // Track loading state
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const [showToast, setShowToast] = useState(false); // Show toast

  useEffect(() => {
    if (feedbackID) {
      fetchFeedbackData(feedbackID);
    }
  }, [feedbackID]);
// Arrow function to format a date to the desired string format
const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
  const fetchFeedbackData = async (feedbackID) => {
    setLoading(true); // Start loading
    try {
      const response = await apiClient.get(SEARCHFEEDBACK_ROUTE(feedbackID), {
        withCredentials: true,
      });
      const feedbackData = response.data.feedbacks[0] || {};
      // Set fetched data to the state
      setFeedback({
        feedbackID: feedbackData.feedbackID || '',
        feedbackName: feedbackData.feedbackName || '', // Fetch feedbackName
        courseID: feedbackData.courseID || '',
        departmentID: feedbackData.departmentID || '',
        facultyID: feedbackData.facultyID || '',
        branch: feedbackData.branch || '', // Fetch branch
        startDateTime: formatDateForInput(feedbackData.startDateTime) || '', // Keep original format for datetime-local
        endDateTime: formatDateForInput(feedbackData.endDateTime)  || '', // Keep original format for datetime-local
      });
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      setToastMessage("Error fetching feedback data. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({ ...prevFeedback, [name]: value }));
  };

  const resetForm = () => {
    setFeedback({
      feedbackID: '',
      feedbackName: '', // Reset feedbackName
      courseID: '',
      departmentID: '',
      facultyID: '',
      branch: '', // Reset branch
      startDateTime: '',
      endDateTime: '',
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
      const url = feedbackID ? EDITFEEDBACK_ROUTE(feedbackID) : ADDFEEDBACK_ROUTE;
      const method = feedbackID ? 'put' : 'post';
      const response = await apiClient[method](url, feedback, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        setToastMessage(response.data.message || "Success!");
        setShowToast(true);
        if (!feedbackID) resetForm();

        // Navigate back on success
        setTimeout(() => {
          setShowToast(false);
          navigate(-1); // Go back to the previous page
        }, 3000);
      }
    } catch (error) {
      console.log(error)
      setToastMessage(
        error.response?.data?.message || "An error occurred while processing the feedback data."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (loading) {
    return <p>Loading feedback data...</p>; // Display loading message when fetching data
  }

  return (
    <div className="FeedbackForm">
      <div className='heading'>
        <h2 style={{ marginLeft: '20px' }}>
          {feedbackID ? "Edit Feedback Details" : "Create Feedback Form"}
        </h2>
        <button onClick={() => navigate(-1)} className='user_btn' style={{ marginRight: '20px' }} >Back</button>
      </div>
      <form className="student-form" onSubmit={handleSubmit} noValidate>
        <label>Feedback ID:</label>
        <input
          type="text"
          name="feedbackID"
          value={feedback.feedbackID}
          onChange={handleChange}
          required={!feedbackID}
          disabled={!!feedbackID} // Disable in edit mode
        />

        <label>Feedback Name:</label> {/* New field */}
        <input
          type="text"
          name="feedbackName"
          value={feedback.feedbackName}
          onChange={handleChange}
          required
        />

        <label>Course ID:</label>
        <input
          type="text"
          name="courseID"
          value={feedback.courseID}
          onChange={handleChange}
          required
        />

        <label>Department ID:</label>
        <input
          type="text"
          name="departmentID"
          value={feedback.departmentID}
          onChange={handleChange}
          required
        />

        <label>Faculty ID:</label>
        <input
          type="text"
          name="facultyID"
          value={feedback.facultyID}
          onChange={handleChange}
          required
        />

        <label>Branch:</label> {/* New field */}
        <input
          type="text"
          name="branch"
          value={feedback.branch}
          onChange={handleChange}
          required
        />

        <label>Start Date and Time:</label>
        <input
          type="datetime-local" // Changed to datetime-local
          name="startDateTime"
          value={feedback.startDateTime}
          onChange={handleChange}
          required
        />

        <label>End Date and Time:</label>
        <input
          type="datetime-local" // Changed to datetime-local
          name="endDateTime"
          value={feedback.endDateTime}
          onChange={handleChange}
          required
        />

        <button type="submit" className='submit-btn' style={{ gridColumn: -2 }}>
          {feedbackID ? "Update" : "Submit"}
        </button>
      </form>
      {showToast && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
};

export default FeedbackForm;
