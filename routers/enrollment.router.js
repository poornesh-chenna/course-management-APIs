import express from 'express'
import {
  enrollCourse,
  getEnrollments,
} from '../controllers/enrollmentController.js'
import { authorizeUser } from '../middlewares/authorizeUser.js'

const router = express.Router()

// Route to enroll in a course
router.post('/:courseId', authorizeUser, enrollCourse)

// Route to get a user's course enrollments
router.get('/enrollments', authorizeUser, getEnrollments)

export const EnrollmentRouters = router
