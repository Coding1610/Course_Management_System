import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETINACTIVEFEEDBACK_ROUTE, DELETEFEEDBACK_ROUTE, SEARCHFEEDBACK_ROUTE } from "../../../utils/constants"; // Ensure these routes exist

const Completed = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]); // Original feedback list
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]); // Filtered feedback list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [screenSize, setScreenSize] = useState(window.innerWidth); // Track screen size

  // Track window resize to update screen size state
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    fetchFeedbacks(); // Fetch feedbacks on mount
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(GETINACTIVEFEEDBACK_ROUTE, { withCredentials: true });
      const feedbackData = response.data.feedbacks;
      setFeedbacks(feedbackData); // Set original feedback list
      setFilteredFeedbacks(feedbackData); // Initialize filtered list with full feedback list
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
        const updatedFeedbacks = feedbacks.filter(feedback => feedback.feedbackID !== feedbackID);
        setFeedbacks(updatedFeedbacks); // Update original list
        setFilteredFeedbacks(updatedFeedbacks); // Update filtered list as well
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the feedback.");
      }
    }
  };

  // Client-side search function
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter feedbacks based on the search query across multiple fields
    const filtered = feedbacks.filter(feedback =>
      feedback.feedbackID.toLowerCase().includes(query) ||
      feedback.feedbackName.toLowerCase().includes(query) ||
      feedback.departmentID.toLowerCase().includes(query) ||
      feedback.branch.toLowerCase().includes(query) ||
      feedback.facultyName.toLowerCase().includes(query) ||
      feedback.courseName.toLowerCase().includes(query) ||
      new Date(feedback.startDateTime).toLocaleDateString('en-US').includes(query) || // Search in formatted date
      new Date(feedback.endDateTime).toLocaleDateString('en-US').includes(query)     // Search in formatted date
    );

    setFilteredFeedbacks(filtered); // Update filtered feedback list
  };

  const handleEditClick = (feedbackID) => {
    navigate(`/academic-admin/feedback/add/${feedbackID}`); // Adjust the route accordingly
  };

  return (
    <div className="Home">
      <h2 className='responsive'>Completed Feedback</h2>
      <div className="search_add">
        <input
          type="text"
          placeholder="Search Feedback"
          className="search_input"
          value={searchQuery}
          onChange={handleSearchInput} // Update search input and filter list
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="table-container">
          {filteredFeedbacks.length > 0 ? (
            screenSize < 768 ? (
              // Mobile/Tablet view: Render a simple list or cards
              <div className="user-table">
                {filteredFeedbacks.map((feedback, index) => (
                  <div key={index} className="feedback-card" style={{ border: "2px solid black", marginTop: "10px", padding: "10px" }}>
                    <p><strong>Feedback ID:</strong> {feedback.feedbackID}</p>
                    <p><strong>Name:</strong> {feedback.feedbackName}</p>
                    <p><strong>Department Name:</strong> {feedback.departmentID}</p>
                    <p><strong>Branch:</strong> {feedback.branch}</p>
                    <p><strong>Faculty Name:</strong> {feedback.facultyName}</p>
                    <p><strong>Course Name:</strong> {feedback.courseName}</p>
                    <p><strong>Start Date:</strong> {new Date(feedback.startDateTime).toLocaleString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}</p>
                    <p><strong>End Date:</strong> {new Date(feedback.endDateTime).toLocaleString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}</p>
                    <div className="actions">
                      <button className="edit-btn" onClick={() => handleEditClick(feedback.feedbackID)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(feedback.feedbackID)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop view: Render a table
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
                  {filteredFeedbacks.map((feedback, index) => (
                    <tr key={index}>
                      <td>{feedback.feedbackID}</td>
                      <td>{feedback.feedbackName}</td>
                      <td>{feedback.departmentID}</td>
                      <td>{feedback.branch}</td>
                      <td>{feedback.facultyName}</td>
                      <td>{feedback.courseName}</td>
                      <td>{new Date(feedback.startDateTime).toLocaleString('en-US', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}</td>
                      <td>{new Date(feedback.endDateTime).toLocaleString('en-US', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}</td>
                      <td className="actions">
                        <button className="edit-btn" onClick={() => handleEditClick(feedback.feedbackID)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(feedback.feedbackID)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <p>No feedbacks found.</p>
          )}
        </div>
      )}

    </div>
  );
};

export default Completed;