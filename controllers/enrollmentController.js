import { getClient } from '../utils/initDatabase.js'
export const enrollCourse = async (req, res) => {
  try {
    const client = await getClient()
    const userId = req.userId
    const courseId = req.params.courseId

    const { rows: courseCheck } = await client.query(
      'SELECT id FROM courses WHERE id = $1',
      [courseId]
    )

    if (courseCheck.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // Check if the user is already enrolled in the course
    const { rows: enrollmentCheck } = await client.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    )

    if (enrollmentCheck.length > 0) {
      return res
        .status(400)
        .json({ error: 'You are already enrolled in this course' })
    }

    const { rows } = await client.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *',
      [userId, courseId]
    )

    await client.query(
      'UPDATE courses SET totalenrollments = totalenrollments + 1 WHERE id = $1',
      [courseId]
    )

    res.status(201).json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export const getEnrollments = async (req, res) => {
  try {
    const client = await getClient()

    const userId = req.userId

    const { rows } = await client.query(
      `
      SELECT c.id, c.title, c.description, c.level, c.category
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
    `,
      [userId]
    )

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}
