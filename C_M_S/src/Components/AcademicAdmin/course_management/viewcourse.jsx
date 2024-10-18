import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { GETCOURSES_ROUTE, DELETECOURSE_ROUTE, SEARCHCOURSE_ROUTE } from "../../../utils/constants";

const ViewCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourses(); // Fetch courses on mount
  }, []);

  const handleEditClick = (courseID) => {
    navigate(`/course_management/addcourse/${courseID}`);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(GETCOURSES_ROUTE, { withCredentials: true });
      setCourses(response.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  // Delete course function
  const handleDelete = async (courseID) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await apiClient.delete(DELETECOURSE_ROUTE(courseID), { withCredentials: true });
        setCourses(courses.filter(course => course.courseID !== courseID)); // Update state to remove course
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while deleting the course.");
      }
    }
  };

  // Search courses based on input
  const searchCourses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(SEARCHCOURSE_ROUTE(searchQuery), { withCredentials: true });
      setCourses(response.data.courses); // Update state with the filtered course data
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while searching for courses.");
    } finally {
      setLoading(false);
    }
  };

  // Function to download the file
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop(); // Use file name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="Home">
      <h2>Course Management</h2>
      <div className="search_add">
        <input
          type="text"
          placeholder="Search courses"
          className="search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
        />
        <button className="user_btn" onClick={searchCourses}>Search</button>
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
                <th>Course ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Instructor ID</th>
                <th>Instructor Name</th>
                <th>Credit</th>
                <th>Download File</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseID}</td>
                  <td>{course.courseName}</td>
                  <td>{course.department}</td>
                  <td>{course.branch}</td>
                  <td>{course.semester}</td>
                  <td>{course.courseInstructorID}</td>
                  <td>{course.courseInstructorName}</td>
                  <td>{course.courseCredit}</td>
                  <td>
                    {course.courseFileUrl ? (
                      <button className="download-btn" onClick={() => handleDownload(course.courseFileUrl)}>
                        Download
                      </button>
                    ) : (
                      <span>No File</span>
                    )}
                  </td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEditClick(course.courseID)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(course.courseID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseID}</td>
                  <td>{course.courseName}</td>
                  <td>{course.department}</td>
                  <td>{course.branch}</td>
                  <td>{course.semester}</td>
                  <td>{course.courseInstructorID}</td>
                  <td>{course.courseInstructorName}</td>
                  <td>{course.courseCredit}</td>
                  <td>
                    {course.courseFileUrl ? (
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(course.courseFileUrl)}
                      >
                        Download
                      </button>
                    ) : (
                      <span>No File</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(course.courseID)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(course.courseID)}
                    >
                      Delete
                    </button>
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

export default ViewCourse;
