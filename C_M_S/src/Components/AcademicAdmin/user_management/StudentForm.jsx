import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from "../../../lib/api-client";
import { ADDSTUDENT_ROUTE, EDITSTUDENT_ROUTE, SEARCHSTUDENTS_ROUTE } from "../../../utils/constants";

const StudentForm = () => {
  const { enrollment } = useParams(); // Get enrollment from the URL
  const navigate = useNavigate(); // Initialize navigate
  const [student, setStudent] = useState({
    image_url: '',
    enrollment: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Contact: '',
    tempPassword: '',
    Gender: '',
    AadharNumber: '',
    GuardianNumber: '',
    GuardianEmail: '',
    Other: {
      isPhysicalHandicap: false,
      birthPlace: '',
      AdmissionThrough: '',
      CasteCategory: ''
    },
    Academic_info: {
      Branch: '',
      Semester: '',
      Degree: '',
      Enroll_Year: ''
    },
    Address: {
      Addr: '',
      City: '',
      State: '',
      Country: '',
      PinCode: ''
    }
  });

  const [loading, setLoading] = useState(false); // Track loading state
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const [showToast, setShowToast] = useState(false); // Show toast

  useEffect(() => {
    if (enrollment) {
      fetchStudentData(enrollment);
    }
  }, [enrollment]);

  const fetchStudentData = async (enrollment) => {
    setLoading(true); // Start loading
    try {
      const response = await apiClient.get(SEARCHSTUDENTS_ROUTE(enrollment), {
        withCredentials: true,
      });

      const data = response.data || {};
      // Directly access the student object since your response returns a single student
      const studentData = data.student || {}; // Access the single student object

      // Set the student data state
      setStudent({

        image_url: studentData.image_url || '',
        enrollment: studentData.enrollment || '',
        FirstName: studentData.FirstName || '',
        LastName: studentData.LastName || '',
        Email: studentData.Email || '',
        Contact: studentData.Contact || '',
        Gender: studentData.Gender || '',
        AadharNumber: studentData.AadharNumber || '',
        GuardianNumber: studentData.GuardianNumber || '',
        GuardianEmail: studentData.GuardianEmail || '',
        Other: {
          isPhysicalHandicap: studentData.Other?.isPhysicalHandicap || false,
          birthPlace: studentData.Other?.birthPlace || '',
          AdmissionThrough: studentData.Other?.AdmissionThrough || '',
          CasteCategory: studentData.Other?.CasteCategory || ''
        },
        Academic_info: {
          Degree: studentData.Academic_info?.Degree || '',
          Branch: studentData.Academic_info?.Branch || '',
          Semester: studentData.Academic_info?.Semester || '',
          Enroll_Year: studentData.Academic_info?.Enroll_Year || ''
        },
        Address: {
          Addr: studentData.Address?.Addr || '',
          City: studentData.Address?.City || '',
          State: studentData.Address?.State || '',
          Country: studentData.Address?.Country || '',
          PinCode: studentData.Address?.PinCode || ''
        }
      });
    } catch (error) {
      console.error("Error fetching student data:", error);
      setToastMessage("Error fetching student data. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("Other.") || name.startsWith("Academic_info.") || name.startsWith("Address.")) {
      const [main, sub] = name.split(".");
      setStudent((prevStudent) => ({
        ...prevStudent,
        [main]: { ...prevStudent[main], [sub]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    }
  };

  const resetForm = () => {
    setStudent({
      image_url: '',
      enrollment: '',
      FirstName: '',
      LastName: '',
      Email: '',
      Contact: '',
      tempPassword: '',
      Gender: '',
      AadharNumber: '',
      GuardianNumber: '',
      GuardianEmail: '',
      Other: {
        isPhysicalHandicap: false,
        birthPlace: '',
        AdmissionThrough: '',
        CasteCategory: ''
      },
      Academic_info: {
        Branch: '',
        Semester: '',
        Degree: '',
        Enroll_Year: ''
      },
      Address: {
        Addr: '',
        City: '',
        State: '',
        Country: '',
        PinCode: ''
      }
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
      const url = enrollment ? EDITSTUDENT_ROUTE(enrollment) : ADDSTUDENT_ROUTE;
      const method = enrollment ? 'put' : 'post';
      const response = await apiClient[method](url, student, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        setToastMessage(response.data.message || "Success!");
        setShowToast(true);
        if (!enrollment) resetForm();

        // Navigate back on success
        setTimeout(() => {
          setShowToast(false);
          navigate(-1); // Go back to the previous page
        }, 3000);
      }
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "An error occurred while processing the student data."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (loading) {
    return <p>Loading student data...</p>; // Display loading message when fetching data
  }

  return (
    <div className="StudentForm">
      <div className='heading'>
        <h2 style={{ marginLeft: '20px' }}>
          {enrollment ? "Edit Student Details" : "Add Student Detail:"}
        </h2>
        <button onClick={() => navigate(-1)} className='user_btn' style={{ marginRight: '20px' }} >Back</button>
      </div>
      <form className="student-form" onSubmit={handleSubmit} noValidate>
        <label>Image Url:</label>
        <input
          type="text"
          name="image_url"
          value={student.image_url}
          onChange={handleChange}
          required
        />

        <label>First Name:</label>
        <input
          type="text"
          name="FirstName"
          value={student.FirstName}
          onChange={handleChange}
          required
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="LastName"
          value={student.LastName}
          onChange={handleChange}
          required
        />

        <label>Student Personal Email:</label>
        <input
          type="email"
          name="Email"
          value={student.Email}
          onChange={handleChange}
          required
          disabled={!!enrollment}
        />

        <label>Contact Number:</label>
        <input
          type="number"
          name="Contact"
          value={student.Contact}
          onChange={handleChange}
          required
        />

        <label>Gender:</label>
        <select
          name="Gender"
          value={student.Gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Aadhar Number:</label>
        <input
          type="number"
          name="AadharNumber"
          value={student.AadharNumber}
          onChange={handleChange}
          required
        />

        <label>Guardian's Contact Number:</label>
        <input
          type="number"
          name="GuardianNumber"
          value={student.GuardianNumber}
          onChange={handleChange}
          required
        />

        <label>Guardian's Email:</label>
        <input
          type="email"
          name="GuardianEmail"
          value={student.GuardianEmail}
          onChange={handleChange}
          required
        />

        <label>Is Physically Handicapped?</label>
        <input
          type="checkbox"
          name="Other.isPhysicalHandicap"
          checked={student.Other.isPhysicalHandicap}
          onChange={handleChange}
        />

        <label>Birth Place:</label>
        <input
          type="text"
          name="Other.birthPlace"
          value={student.Other.birthPlace}
          onChange={handleChange}
        />

        <label>Admission Through:</label>
        <select
          name="Other.AdmissionThrough"
          value={student.Other.AdmissionThrough}
          onChange={handleChange}
          required
        >
          <option value="">Select Admission Through</option>
          <option value="ACPC">ACPC</option>
          <option value="JOSSA">JOSSA</option>
          <option value="CSAB">CSAB</option>
        </select>
        <label>Caste Category:</label>
        <select
          name="Other.CasteCategory"
          value={student.Other.CasteCategory}
          onChange={handleChange}
          required
        >
          <option value="">Select Caste Category</option>
          <option value="General">General</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
          <option value="EWS">EWS</option>
          <option value="TFWS">TFWS</option>
        </select>
        <label>Branch:</label>
        <select
          name="Academic_info.Branch"
          value={student.Academic_info.Branch}
          onChange={handleChange}
          required
        >
          <option value="">Select Branch</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
        </select>
        <label>Student Degree:</label>
        <select
          name="Academic_info.Degree"
          value={student.Academic_info.Degree}
          onChange={handleChange}
          required
        >
          <option value="">Select Degree</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
          <option value="Ph.D">Ph.D</option>
        </select>
        <label>Semester:</label>
        <select
          name="Academic_info.Semester"
          value={student.Academic_info.Semester}
          onChange={handleChange}
          required
        >
          <option value="">Select Semester</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>

        <label>Enroll Year:</label>
        <input
          type="number"
          name="Academic_info.Enroll_Year"
          value={student.Academic_info.Enroll_Year}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="Address.Addr"
          value={student.Address.Addr}
          onChange={handleChange}
        />
        <label></label>
        <input
          type="text"
          name="Address.City"
          value={student.Address.City}
          onChange={handleChange}
        />
        <label></label>
        <input
          type="text"
          name="Address.State"
          value={student.Address.State}
          onChange={handleChange}
        />
        <label></label>
        <input
          type="text"
          name="Address.Country"
          value={student.Address.Country}
          onChange={handleChange}
        />
        <label></label>
        <input
          type="number"
          name="Address.PinCode"
          value={student.Address.PinCode}
          onChange={handleChange}
        />
        <label>Student Temp Password:</label>
        <input
          type="password"
          name="tempPassword"
          value={student.tempPassword}
          onChange={handleChange}
          required={!enrollment}

        />
        <button type="submit" className='submit-btn'>{enrollment ? "Update" : "Submit"}</button>
      </form>
      {showToast && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
};

export default StudentForm;
