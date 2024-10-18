import { Router } from 'express';
import {
  createFeedback,
  getActiveFeedback,
  getInactiveFeedback,
  deleteFeedback,
  searchFeedback,
  editFeedback,
  getFeedbackResponses
} from '../controller/AcademicAdminController.js'; // Import feedback controller functions

const feedbackRoutes = Router();

// Route to create a new feedback form
feedbackRoutes.post('/addfeedback', createFeedback);

// Route to get all active feedback forms
feedbackRoutes.get('/getactivefeedback', getActiveFeedback);

feedbackRoutes.get('/getresponses/:feedbackID', getFeedbackResponses);


// Route to get all inactive feedback forms
feedbackRoutes.get('/getinactivefeedback', getInactiveFeedback);

// Route to delete a feedback form by ID
feedbackRoutes.delete('/deletefeedback/:feedbackID', deleteFeedback);

// Route to search feedback forms (e.g., by course, faculty)
feedbackRoutes.get('/searchfeedback', searchFeedback);

// Route to edit feedback form details by ID
feedbackRoutes.put('/editfeedback/:feedbackID', editFeedback);

export default feedbackRoutes;
