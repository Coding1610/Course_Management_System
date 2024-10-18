import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { ADDCOURSE_ROUTE, EDITCOURSE_ROUTE, SEARCHCOURSE_ROUTE } from "../../../utils/constants";

const AddCourse = () => {
  const { courseID } = useParams(); // Get courseID from URL for editing
  const navigate = useNavigate(); // Initialize navigate
  const [course, setCourse] = useState({
    courseID: '',
    courseName: '',
    department: '',
    branch: '',
    courseStartDate: '',
    semester: '',
    courseInstructorID: '',
    courseCredit: '',
    courseFile: null // Added to track file
  });

  const [loading, setLoading] = useState(false); // Track loading state
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const [showToast, setShowToast] = useState(false); // Show toast

  // Fetch course data if courseID is available (Edit mode)
  useEffect(() => {
    if (courseID) {
      fetchCourseData(courseID);
    }
  }, [courseID]);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const fetchCourseData = async (courseID) => {
    setLoading(true); // Start loading
    try {
      const response = await apiClient.get(SEARCHCOURSE_ROUTE(courseID), {
        withCredentials: true,
      });
      const data = response.data.courses[0] || {}; // Fetch the course data

      setCourse({
        courseID: data.courseID || '',
        courseName: data.courseName || '',
        department: data.department || '',
        branch: data.branch || '',
        courseStartDate: formatDate(data.courseStartDate) || '',
        semester: data.semester || '',
        courseInstructorID: data.courseInstructorID || '',
        courseCredit: data.courseCredit || '',
        courseFile: null // Reset the file input
      });
    } catch (error) {
      console.error("Error fetching course data:", error);
      setToastMessage("Error fetching course data. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCourse((prevCourse) => ({ ...prevCourse, courseFile: file }));
  };

  const resetForm = () => {
    setCourse({
      courseID: '',
      courseName: '',
      department: '',
      branch: '',
      courseStartDate: '',
      semester: '',
      courseInstructorID: '',
      courseCredit: '',
      courseFile: null
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setToastMessage("");
  //   setShowToast(false);

  //   if (!e.target.checkValidity()) {
  //     setToastMessage("Please fill out all required fields.");
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 2000);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData(); // Create FormData to handle file upload
  //     formData.append('courseID', course.courseID);
  //     formData.append('courseName', course.courseName);
  //     formData.append('department', course.department);
  //     formData.append('branch', course.branch);
  //     formData.append('courseStartDate', course.courseStartDate);
  //     formData.append('semester', course.semester);
  //     formData.append('courseInstructorID', course.courseInstructorID);
  //     formData.append('courseCredit', course.courseCredit);

  //     // Append the file if one was selected
  //     if (course.courseFile) {
  //       formData.append('courseFile', course.courseFile);
  //     }

  //     const url = courseID ? EDITCOURSE_ROUTE(courseID) : ADDCOURSE_ROUTE;
  //     const method = courseID ? 'put' : 'post';
  //     const response = await apiClient[method](url, formData, {
  //       withCredentials: true,
  //       headers: {
  //         'Content-Type': 'multipart/form-data', // Set content type for file uploads
  //       },
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       setToastMessage(response.data.message || "Success!");
  //       setShowToast(true);
  //       if (!courseID) resetForm();

  //       // Navigate back on success
  //       setTimeout(() => {
  //         setShowToast(false);
  //         navigate(-1); // Go back to the previous page
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     setToastMessage(
  //       error.response?.data?.message || "An error occurred while processing the course data."
  //     );
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 2000);
  //   }
  // };
  
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
      const url = courseID ? EDITCOURSE_ROUTE(courseID) : ADDCOURSE_ROUTE;
      const method = courseID ? 'put' : 'post';
      const response = await apiClient[method](url, course, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        setToastMessage(response.data.message || "Success!");
        setShowToast(true);
        if (!courseID) resetForm();

        // Navigate back on success
        setTimeout(() => {
          setShowToast(false);
          navigate(-1); // Go back to the previous page
        }, 3000);
      }
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "An error occurred while processing the course data."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };
  if (loading) {
    return <p>Loading course data...</p>; // Display loading message when fetching data
  }

  return (
    <div className="CourseForm">
      <div className='heading'>
        <h2 style={{ marginLeft: '20px' }}>
          {courseID ? "Edit Course Details" : "Add Course Detail:"}
        </h2>
        <button onClick={() => navigate(-1)} className='user_btn' style={{ marginRight: '20px' }} >Back</button>
      </div>
      <form className="student-form" onSubmit={handleSubmit} noValidate>
        <label>Course ID:</label>
        <input
          type="text"
          name="courseID"
          value={course.courseID}
          onChange={handleChange}
          required={!courseID}
          disabled={!!courseID} // Disable in edit mode
        />

        <label>Course Name:</label>
        <input
          type="text"
          name="courseName"
          value={course.courseName}
          onChange={handleChange}
          required
        />

        <label>Department Name/ID:</label>
        <input
          type="text"
          name="department"
          value={course.department}
          onChange={handleChange}
          required
        />

        <label>Course Branch:</label>
        <input
          type="text"
          name="branch"
          value={course.branch}
          onChange={handleChange}
          required
        />

        <label>Course Offering Semester:</label>
        <input
          type="number"
          name="semester"
          value={course.semester}
          onChange={handleChange}
          required
        />

        <label>Course Instructor ID:</label>
        <input
          type="text"
          name="courseInstructorID"
          value={course.courseInstructorID}
          onChange={handleChange}
          required
        />

        <label>Course Credit:</label>
        <input
          type="number"
          name="courseCredit"
          value={course.courseCredit}
          onChange={handleChange}
          required
        />

        <label>Course Start Date:</label>
        <input
          type="date"
          name="courseStartDate"
          value={course.courseStartDate}
          onChange={handleChange}
          required
        />
        <label>Course File (Optional):</label>
        <input
          type="file"
          name="courseFile"
          onChange={handleFileChange}
        />

        <button type="submit" className='submit-btn'>
          {courseID ? "Update" : "Submit"}
        </button>
      </form>
      {showToast && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
};

export default AddCourse;
