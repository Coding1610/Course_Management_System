import express from 'express';
import { getStudentData } from '../controller/StudentController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();
router.get('/student', verifyToken, getStudentData);

export default router;
