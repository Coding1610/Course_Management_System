import { Router } from "express";

import { addTA, getAllTAs, deleteTA, searchTAs, editTA } from '../controller/AcademicAdminController.js';

const Routes = Router();

// Route to add a new TA
Routes.post('/addta', addTA);

// Route to add a new TA
Routes.put('/editta/:enrollmentNo', editTA);

// Route to get all TAs
Routes.get('/getta', getAllTAs);

// Route to search for TAs
Routes.get('/searchtas', searchTAs);

// Route to delete a TA
Routes.delete('/deleteta/:enrollment', deleteTA);

export default Routes;
