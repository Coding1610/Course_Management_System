import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETFACULTYS_ROUTE, DELETEFACULTY_ROUTE, SEARCHFACULTYS_ROUTE } from "../../../utils/constants";

const FacultyHome = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFaculty(); // Fetch faculty on mount
  }, []);

  const handleEditClick = (facultyId) => {
    navigate(`/user_management/faculty_form/${facultyId}`);
  };

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(GETFACULTYS_ROUTE, { withCredentials: true });
      setFaculty(response.data.faculty);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching faculty.");
    } finally {
      setLoading(false);
    }
  };

  // Delete faculty function
  const handleDelete = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await apiClient.delete(DELETEFACULTY_ROUTE(facultyId), { withCredentials: true });
        setFaculty(faculty.filter(member => member.facultyId !== facultyId)); // Update state to remove faculty member
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the faculty member.");
      }
    }
  };

  // Search faculty based on input
  const searchFaculty = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(SEARCHFACULTYS_ROUTE(searchQuery), { withCredentials: true });
      setFaculty(response.data.faculty); // Update state with the filtered faculty data
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while searching for faculty.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Home">
      <h2>Faculty Management</h2>
      <div className="search_add">
        <input
          type="text"
          placeholder="Search Faculty"
          className="search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
        />
        <button className="user_btn" onClick={searchFaculty}>Search</button>
        <button className="user_btn" onClick={() => navigate('/user_management/faculty_form')}>Add Faculty</button>
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
                <th>Faculty ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>department</th>
                <th>College Email</th>
                <th>Contact Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((member, index) => (
                <tr key={index}>
                  <td>{member.facultyId}</td>
                  <td>{member.FirstName}</td>
                  <td>{member.LastName}</td>
                  <td>{member.department}</td>
                  <td>{member.CollegeEmail}</td>
                  <td>{member.contactNumber}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEditClick(member.facultyId)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(member.facultyId)}>Delete</button>
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

export default FacultyHome;
