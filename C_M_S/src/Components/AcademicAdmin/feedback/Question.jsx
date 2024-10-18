import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from "../../../lib/api-client";
import { GETACTIVEQUESTIONS_ROUTE, GETINACTIVEQUESTIONS_ROUTE, ADDQUESTION_ROUTE, EDITQUESTION_ROUTE, DELETEQUESTION_ROUTE } from "../../../utils/constants";

const Question = () => {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [inactiveQuestions, setInactiveQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [responseType, setResponseType] = useState('text');
  const [questionID, setQuestionID] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Create a ref for the form
  const formRef = useRef(null);

  useEffect(() => {
    fetchActiveQuestions();
    fetchInactiveQuestions();
  }, []);

  const fetchActiveQuestions = async () => {
    try {
      const response = await apiClient.get(GETACTIVEQUESTIONS_ROUTE, { withCredentials: true });
      setActiveQuestions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching active questions.");
    }
  };

  const fetchInactiveQuestions = async () => {
    try {
      const response = await apiClient.get(GETINACTIVEQUESTIONS_ROUTE, { withCredentials: true });
      setInactiveQuestions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching inactive questions.");
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        questionID: editingQuestion ? editingQuestion.questionID : (questionID || generateUniqueID()),
        questionText: newQuestionText,
        isActive,
        responseType
      };

      if (editingQuestion) {
        await apiClient.put(EDITQUESTION_ROUTE(editingQuestion.questionID), questionData, { withCredentials: true });
      } else {
        await apiClient.post(ADDQUESTION_ROUTE, questionData, { withCredentials: true });
      }

      resetForm();
      fetchActiveQuestions();
      fetchInactiveQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while adding/editing the question.");
    }
  };

  const resetForm = () => {
    setNewQuestionText("");
    setIsActive(true);
    setResponseType('text');
    setQuestionID("");
    setEditingQuestion(null);
    setShowForm(false);
  };

  const generateUniqueID = () => {
    return `q-${Date.now()}`;
  };

  // Scroll to the form when editing a question
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionID(question.questionID);
    setNewQuestionText(question.questionText);
    setIsActive(question.isActive);
    setResponseType(question.responseType);
    setShowForm(true);
    // Delay scrolling to ensure the form is rendered
    setTimeout(() => {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleDelete = async (questionID) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await apiClient.delete(DELETEQUESTION_ROUTE(questionID), { withCredentials: true });
        setActiveQuestions(activeQuestions.filter(question => question.questionID !== questionID));
        setInactiveQuestions(inactiveQuestions.filter(question => question.questionID !== questionID));
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the question.");
      }
    }
  };

  return (
    <div className="Home">
      <h2>Active Questions</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Question ID</th>
              <th>Question Text</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeQuestions.map((question, index) => (
              <tr key={index}>
                <td>{question.questionID}</td>
                <td>{question.questionText}</td>
                <td>Active</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEditQuestion(question)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(question.questionID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Inactive Questions</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Question ID</th>
              <th>Question Text</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inactiveQuestions.map((question, index) => (
              <tr key={index}>
                <td>{question.questionID}</td>
                <td>{question.questionText}</td>
                <td>Inactive</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEditQuestion(question)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(question.questionID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="user_btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Question'}
      </button>

      {/* Form ref added here */}
      {showForm && (
        <form ref={formRef} onSubmit={handleSubmitQuestion} className="student-form">
          <label>Enter Question ID: </label>
          <input
            type="text"
            value={questionID}
            onChange={(e) => setQuestionID(e.target.value)}
            required
            disabled={!!editingQuestion}
          />
          <label>Enter Question Text: </label>
          <input
            type="text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            required
          />
          <label>Active:</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label>Response Type:</label>
          <select
            value={responseType}
            onChange={(e) => setResponseType(e.target.value)}
            required
          >
            <option value="rating">Rating</option>
            <option value="text">Text</option>
          </select>
          <button type="submit" className="submit-btn">{editingQuestion ? 'Update' : 'Submit'}</button>
        </form>
      )}
    </div>
  );
};

export default Question;
