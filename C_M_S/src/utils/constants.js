// export const HOST = import.meta.env.VITE_SERVER_URL;
export const HOST = 'http://localhost:3000';

// student
export const student = "api/student";
export const ADDSTUDENT_ROUTE = `${HOST}/${student}/addstudent`;
export const GETSTUDENTS_ROUTE = `${HOST}/${student}/getstudent`;

// For deleting a student by enrollmentNo
export const DELETESTUDENT_ROUTE = (enrollmentNo) => `${HOST}/${student}/deletestudent/${enrollmentNo}`;

// For searching students
export const SEARCHSTUDENTS_ROUTE = (enrollmentNo) => `${HOST}/${student}/searchstudents?search=${enrollmentNo}`;

// For editing a student
export const EDITSTUDENT_ROUTE = (enrollmentNo) => `${HOST}/${student}/editstudent/${enrollmentNo}`;

// faculty
export const faculty = "api/faculty";
export const ADDFACULTY_ROUTE = `${HOST}/${faculty}/addfaculty`;
export const GETFACULTYS_ROUTE = `${HOST}/${faculty}/getfaculty`;

// For deleting a student by enrollmentNo
export const DELETEFACULTY_ROUTE = (facultyId) => `${HOST}/${faculty}/deletefaculty/${facultyId}`;

// For searching students
export const SEARCHFACULTYS_ROUTE = (searchQuery) => `${HOST}/${faculty}/searchfacultys?search=${searchQuery}`;

// For editing a student
export const EDITFACULTY_ROUTE = (facultyId) => `${HOST}/${faculty}/editfaculty/${facultyId}`;

// TA (Teaching Assistant)
export const ta = "api/ta";
export const ADDTA_ROUTE = `${HOST}/${ta}/addta`;
export const GETTAS_ROUTE = `${HOST}/${ta}/getta`;

export const GETNONTA_ROUTE = `${HOST}/${ta}/getnonTa`;


// For searching TAs
export const SEARCHTAS_ROUTE = (searchQuery) => `${HOST}/${ta}/searchtas?search=${searchQuery}`;

// For deleting a TA by enrollmentNo
export const DELETETA_ROUTE = (enrollment) => `${HOST}/${ta}/deleteta/${enrollment}`;

export const EDITTA_ROUTE = (enrollmentNo) => `${HOST}/${ta}/editta/${enrollmentNo}`;

export const course= "api/course";
export const ADDCOURSE_ROUTE= `${HOST}/${course}/addcourse`;
export const GETCOURSES_ROUTE = `${HOST}/${course}/getcourses`;

// For editing a course
export const EDITCOURSE_ROUTE = (courseID) => `${HOST}/${course}/editcourse/${courseID}`;
// For deleting a Course by courseID
export const DELETECOURSE_ROUTE = (courseID) => `${HOST}/${course}/deletecourse/${courseID}`;
// For searching students
export const SEARCHCOURSE_ROUTE = (searchQuery) => `${HOST}/${course}/searchcourses?search=${searchQuery}`;

export const feedback = "api/feedback";

// Add a new feedback
export const ADDFEEDBACK_ROUTE = `${HOST}/${feedback}/addfeedback`;

// Get all active feedback forms
export const GETACTIVEFEEDBACK_ROUTE = `${HOST}/${feedback}/getactivefeedback`;

// Get all inactive feedback forms
export const GETINACTIVEFEEDBACK_ROUTE = `${HOST}/${feedback}/getinactivefeedback`;

// Edit a feedback form by feedbackID
export const EDITFEEDBACK_ROUTE = (feedbackID) => `${HOST}/${feedback}/editfeedback/${feedbackID}`;

// Delete a feedback form by feedbackID
export const DELETEFEEDBACK_ROUTE = (feedbackID) => `${HOST}/${feedback}/deletefeedback/${feedbackID}`;

// Search feedback forms based on search query
export const SEARCHFEEDBACK_ROUTE = (searchQuery) => `${HOST}/${feedback}/searchfeedback?search=${searchQuery}`;

export const GET_RESPONSES_ROUTE = (feedbackID) => `${HOST}/${feedback}/getresponses/${feedbackID}`;

export const question = "api/questions";

// Add a new question
export const ADDQUESTION_ROUTE = `${HOST}/${question}/addquestion`;

// Get all active questions
export const GETACTIVEQUESTIONS_ROUTE = `${HOST}/${question}/getactivequestions`;

// Get all inactive questions
export const GETINACTIVEQUESTIONS_ROUTE = `${HOST}/${question}/getinactivequestions`;



// Edit a question by questionID (if needed)
export const EDITQUESTION_ROUTE = (questionID) => `${HOST}/${question}/editquestion/${questionID}`;

// Delete a question by questionID (if needed)
export const DELETEQUESTION_ROUTE = (questionID) => `${HOST}/${question}/deletequestion/${questionID}`;