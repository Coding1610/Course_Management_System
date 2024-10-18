import { Router } from "express";
import { 
  addCourse, 
  getAllCourses, 
  deleteCourse, 
  searchCourses, 
  editCourse 
} from '../controller/AcademicAdminController.js';

const Routes = Router();

// Route to add a new course
Routes.post('/addcourse', addCourse);

// Route to get all courses
Routes.get('/getcourses', getAllCourses);

// Route to delete a course by ID
Routes.delete('/deletecourse/:courseID', deleteCourse);


// Route to search for courses
Routes.get('/searchcourses', searchCourses);

// Route to edit course details by ID
Routes.put('/editcourse/:courseID', editCourse);

export default Routes;
