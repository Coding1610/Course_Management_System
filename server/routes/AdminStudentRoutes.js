import { Router } from "express";

import { addStudent,getAllStudents, deleteStudent ,searchStudents, editStudent } from '../controller/AcademicAdminController.js';

const Routes = Router();

// Route to add a new student
Routes.post('/addstudent', addStudent);

// Optionally, route to get all students
Routes.get('/getstudent', getAllStudents);

// Route to delete a student
Routes.delete('/deletestudent/:enrollmentNo', deleteStudent);

// Route to search for students
Routes.get('/searchstudents', searchStudents);

// Route to edit student details
Routes.put('/editstudent/:enrollmentNo', editStudent);

export default Routes;
