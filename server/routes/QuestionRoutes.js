// Example: questionRoutes.js
import { Router } from 'express';
import {
  createQuestion,
  getActiveQuestions,
  getInactiveQuestions,
  editQuestion,
  deleteQuestion
} from '../controller/AcademicAdminController.js'; // Import question controller functions

const questionRoutes = Router();

// Route to create a new question
questionRoutes.post('/addquestion', createQuestion);

// Route to get all active questions
questionRoutes.get('/getactivequestions', getActiveQuestions);

// Route to get all inactive questions
questionRoutes.get('/getinactivequestions', getInactiveQuestions);

// Route to edit a question by ID
questionRoutes.put('/editquestion/:questionID', editQuestion);

// Route to delete a question by ID
questionRoutes.delete('/deletequestion/:questionID', deleteQuestion);

export default questionRoutes;
