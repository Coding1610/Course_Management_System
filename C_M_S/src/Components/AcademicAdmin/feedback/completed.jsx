import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETINACTIVEFEEDBACK_ROUTE, DELETEFEEDBACK_ROUTE, SEARCHFEEDBACK_ROUTE } from "../../../utils/constants"; // Ensure these routes exist

const Completed = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFeedbacks(); // Fetch feedbacks on mount
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(GETINACTIVEFEEDBACK_ROUTE, { withCredentials: true });
      setFeedbacks(response.data.feedbacks);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback function
  const handleDelete = async (feedbackID) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await apiClient.delete(DELETEFEEDBACK_ROUTE(feedbackID), { withCredentials: true });
        setFeedbacks(feedbacks.filter(feedback => feedback.feedbackID !== feedbackID)); // Update state to remove feedback
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the feedback.");
      }
    }
  };

  // Search feedbacks based on input
  const searchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(SEARCHFEEDBACK_ROUTE(searchQuery), { withCredentials: true });
      setFeedbacks(response.data.feedbacks); // Update state with the filtered feedback data
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while searching for feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (feedbackID) => {
    navigate(`/feedback/add/${feedbackID}`); // Adjust the route accordingly
  };

  return (
    <div className="Home">
      <h2>Completed Feedback</h2>
      <div className="search_add">
        <input
          type="text"
          placeholder="Search Feedback"
          className="search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
        />
        <button className="user_btn" onClick={searchFeedbacks}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Name</th>
                <th>Department Name</th>
                <th>Branch</th>
                <th>Faculty Name</th>
                <th>Course Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback, index) => (
                <tr key={index}>
                  <td>{feedback.feedbackID}</td>
                  <td>{feedback.feedbackName}</td>
                  <td>{feedback.departmentID}</td>
                  <td>{feedback.branch}</td>
                  <td>{feedback.facultyName}</td>
                  <td>{feedback.courseName}</td>
                  <td>
                    {new Date(feedback.startDateTime).toLocaleString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}
                  </td>
                  <td>
                    {new Date(feedback.endDateTime).toLocaleString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}
                  </td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEditClick(feedback.feedbackID)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(feedback.feedbackID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Completed;
