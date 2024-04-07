import { getClient } from './initDatabase.js'

export const createTables = async () => {
  const client = await getClient()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `)
    console.log('Roles table created or already exists')
  } catch (error) {
    console.error('Error creating roles table:', error)
  }

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(255),
        role_id INTEGER REFERENCES roles(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('Users table created or already exists')
  } catch (error) {
    console.error('Error creating users table:', error)
  }

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(255),
        level VARCHAR(255),
        totalEnrollments INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        created_by INTEGER REFERENCES users(id)
      )
    `)
    console.log('Courses table created or already exists')
  } catch (error) {
    console.error('Error creating courses table:', error)
  }

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        course_id INTEGER REFERENCES courses(id),
        enrolled_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('Enrollments table created or already exists')
  } catch (error) {
    console.error('Error creating enrollments table:', error)
  }
}
