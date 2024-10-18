import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETTAS_ROUTE, DELETETA_ROUTE, SEARCHTAS_ROUTE } from "../../../utils/constants";

const TA_home = () => {
  const navigate = useNavigate();
  const [tas, setTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTAs(); // Fetch TAs on mount
  }, []);

  const fetchTAs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(GETTAS_ROUTE, { withCredentials: true });
      const taData = response.data?.tas; // Access the TA array
      if (taData) {
        setTAs(taData.map(ta => ({
          enrollment: ta.enrollment || '', // Reference to student enrollment
          facultyId: ta.facultyId || '',  // Reference to faculty
          teachingSemester: ta.teachingSemester || '',
          teachingCourses: ta.teachingCourses || '',
          studentName: ta.studentName || '',
          studentEmail: ta.studentEmail || '',
          contactNumber: ta.contactNumber || '',
          semester: ta.semester || '' // Add semester field here
        })));
      }

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching TAs.");
    } finally {
      setLoading(false);
    }
  };

  // Delete TA function
  const handleDelete = async (enrollment) => {
    if (window.confirm('Are you sure you want to delete this TA?')) {
      try {
        await apiClient.delete(DELETETA_ROUTE(enrollment), { withCredentials: true });
        setTAs(tas.filter(ta => ta.enrollment !== enrollment)); // Update state to remove TA
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the TA.");
      }
    }
  };

  // Search TAs based on input
  const searchTAs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(SEARCHTAS_ROUTE(searchQuery), { withCredentials: true });
      const taData = response.data?.tas; // Access the TA array
      setTAs(taData.map(ta => ({
        enrollment: ta.enrollment || '',
        facultyId: ta.facultyId || '',
        teachingSemester: ta.teachingSemester || '',
        teachingCourses: ta.teachingCourses || '',
        studentName: ta.studentName || '',
        studentEmail: ta.studentEmail || '',
        contactNumber: ta.contactNumber || '',
        semester: ta.semester || ''
      }))); // Update state with the filtered TA data
    } catch (err) {
      setError("An error occurred while searching for TAs.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (enrollment) => {
    navigate(`/user_management/ta_form/${enrollment}`);
  };
  return (
    <div className="Home">
      <h2>Teaching Assistant Management</h2>
      <div className="search_add">
        <input
          type="text"
          placeholder="Search TAs"
          className="search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
        />
        <button className="user_btn" onClick={searchTAs}>Search</button>
        <button className="user_btn" onClick={() => navigate('/user_management/ta_form')}>Add TA</button>
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
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Faculty ID</th>
                <th>Teaching Semester</th>
                <th>Teaching Courses</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tas.map((ta, index) => (
                <tr key={index}>
                  <td>{ta.enrollment}</td>
                  <td>{ta.studentName}</td>
                  <td>{ta.studentEmail}</td>
                  <td>{ta.contactNumber}</td>
                  <td>{ta.facultyId}</td>
                  <td>{ta.teachingSemester}</td>
                  <td>{ta.teachingCourses}</td>
                  <td>{ta.semester}</td>
                  <td className="actions">
                  <button className="edit-btn" onClick={() => handleEditClick(ta.enrollment)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(ta.enrollment)}>Delete</button>
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

export default TA_home;
