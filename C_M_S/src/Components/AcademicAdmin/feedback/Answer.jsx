import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETINACTIVEFEEDBACK_ROUTE, SEARCHFEEDBACK_ROUTE, GET_RESPONSES_ROUTE } from "../../../utils/constants"; // Ensure these routes exist

const Answer = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null); // Store selected feedback
  const [responses, setResponses] = useState([]); // Store responses for selected feedback

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

  // Fetch responses for the selected feedback
  const fetchResponses = async (feedbackID) => {
    try {
      const response = await apiClient.get(GET_RESPONSES_ROUTE(feedbackID), { withCredentials: true });
      console.log(response);

      // Ensure that the response data is parsed correctly if needed
      const parsedResponses = (response.data.responses || []).map((resp) => {
        if (typeof resp === "string") {
          return JSON.parse(resp); // Parse stringified response objects
        }
        return resp; // Otherwise, use the response object directly
      });

      setResponses(parsedResponses);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching responses.");
      setResponses([]); // Ensure responses is reset to an empty array in case of an error
    }
  };

  const showanswer = (feedbackID) => {
    setSelectedFeedback(feedbackID);
    fetchResponses(feedbackID); // Fetch responses for the selected feedback
  };

  return (
    <div className="Home">
      <h2>Response</h2>
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
                  <td className="actions">
                    <button className="edit-btn" onClick={() => showanswer(feedback.feedbackID)}>Answer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedFeedback && (
        <div className="responses">
          <h3>Responses for Feedback ID: {selectedFeedback}</h3>
          {Array.isArray(responses) && responses.length === 0 ? (
            <p>No responses available.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Answers</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(responses) && responses.map((response, index) => (
                  <tr key={index}>
                    <td>{response.studentID}</td>
                    <td>
                      {Array.isArray(response.answers) && response.answers.map((answer, idx) => (
                        <div key={idx}>
                          <strong>QID: {answer.questionID}</strong> - {answer.response}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Answer;
