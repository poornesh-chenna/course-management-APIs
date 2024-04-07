import express from 'express'
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js'
import { isSuperAdmin } from '../middlewares/authorizeUser.js'
const router = express.Router()

// Route to get all courses (public)
router.get('/courses', getCourses)

// Routes for CRUD operations on courses (protected for superadmins)
router.post('/courses', isSuperAdmin, createCourse)
router.put('/courses/:id', isSuperAdmin, updateCourse)
router.delete('/courses/:id', isSuperAdmin, deleteCourse)

export const CourseRouters = router
