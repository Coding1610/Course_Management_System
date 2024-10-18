import { Router } from "express";

import { addFaculty,getAllFaculty, deleteFaculty ,searchFaculty, editFaculty } from '../controller/AcademicAdminController.js';

const Routes = Router();

// Route to add a new faculty
Routes.post('/addfaculty', addFaculty);

// Optionally, route to get all facultys
Routes.get('/getfaculty', getAllFaculty);

// Route to delete a faculty
Routes.delete('/deletefaculty/:facultyId', deleteFaculty);

// Route to search for facultys
Routes.get('/searchfacultys', searchFaculty);

// Route to edit faculty details
Routes.put('/editfaculty/:facultyId', editFaculty);

export default Routes;