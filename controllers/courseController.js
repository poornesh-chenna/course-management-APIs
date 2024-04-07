import { getClient } from '../utils/initDatabase.js'

export const createCourse = async (req, res) => {
  try {
    const client = await getClient()
    const { title, description, level, category } = req.body

    const { rows } = await client.query(
      'INSERT INTO courses (title, description, level, category, created_by, totalenrollments) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, level, category, req.userId, 0]
    )

    res.status(201).json(rows[0])
  } catch (error) {
    console.error('', error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const client = await getClient()
    const courseId = req.params.id
    const { title, description, level, category } = req.body

    const { rows } = await client.query(
      'UPDATE courses SET title = $1, description = $2, level = $3, category = $4 WHERE id = $5 RETURNING *',
      [title, description, level, category, courseId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const client = await getClient()

    const courseId = req.params.id

    const { rowCount } = await client.query(
      'DELETE FROM courses WHERE id = $1',
      [courseId]
    )

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.status(200).json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export const getCourses = async (req, res) => {
  try {
    const client = await getClient()

    const {
      category,
      level,
      page = 1,
      limit = 10,
      sortByPopularity = false,
    } = req.query

    const offset = (page - 1) * limit

    let query = 'SELECT * FROM courses'
    const filters = []

    if (category) {
      filters.push(
        `LOWER(REPLACE(category, ' ', '')) = LOWER('${category.replace(
          /\s/g,
          ''
        )}')`
      )
    }

    if (level) {
      filters.push(`LOWER(level) = LOWER('${level}')`)
    }

    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ')
    }
    if (sortByPopularity) {
      query += ' ORDER BY totalenrollments DESC'
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`

    const result = await client.query(query)

    const totalCount = await client.query('SELECT COUNT(*) FROM courses')

    res.status(200).json({
      data: result.rows,
      totalCount: totalCount.rows[0].count,
      currentPage: page,
      totalPages: Math.ceil(totalCount.rows[0].count / limit),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}
