import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETSTUDENTS_ROUTE, DELETESTUDENT_ROUTE, SEARCHSTUDENTS_ROUTE } from "../../../utils/constants";


const StudentHome = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents(); // Fetch students on mount
  }, []);

  const handleEditClick = (enrollment) => {
    navigate(`/user_management/student_form/${enrollment}`);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(GETSTUDENTS_ROUTE, { withCredentials: true });
      setStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching students.");
    } finally {
      setLoading(false);
    }
  };

  // Delete student function
  const handleDelete = async (enrollmentNo) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiClient.delete(DELETESTUDENT_ROUTE(enrollmentNo), { withCredentials: true });
        setStudents(students.filter(student => student.enrollmentNo !== enrollmentNo)); // Update state to remove student
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the student.");
      }
    }
  };

  // Search students based on input
  const searchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(SEARCHSTUDENTS_ROUTE(searchQuery), { withCredentials: true });
      const studentData = response.data?.student; // Directly access the student object

      if (studentData) {
        setStudents([{
          enrollmentNo: studentData.enrollment || '',
          CollegeEmail: studentData.CollegeEmail || '',
          name: `${studentData.FirstName} ${studentData.LastName}` || '',
          degree: studentData.Academic_info?.Degree || '',
          branch: studentData.Academic_info?.Branch || '',
          semester: studentData.Academic_info?.Semester || '',
          contactNumber: studentData.Contact || '',
        }]);
      } else {
        setStudents([]); // Empty array if no student is found
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while searching for students.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Home">
      <h2>Student Management</h2>
      <div className="search_add">
        <input
          type="text"
          placeholder="Search students"
          className="search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
        />
        <button className="user_btn" onClick={searchStudents}>Search</button>
        <button className="user_btn" onClick={() => navigate('/user_management/student_form')}>Add User</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="table-container">
          {students.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Enrollment No</th>
                  <th>Name</th>
                  <th>CollegeEmail Id</th>
                  <th>Degree</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>Phone No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.enrollmentNo}</td>
                    <td>{student.name}</td>
                    <td>{student.CollegeEmail}</td>
                    <td>{student.degree}</td>
                    <td>{student.branch}</td>
                    <td>{student.semester}</td>
                    <td>{student.contactNumber}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleEditClick(student.enrollmentNo)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(student.enrollmentNo)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No students found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentHome;
