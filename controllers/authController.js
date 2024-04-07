import { signJwtToken } from '../utils/jwt.js'
import { getClient } from '../utils/initDatabase.js'
import bcrypt from 'bcrypt'
import { isStrongPassword } from '../utils/passwordChecker.js'

export const register = async (req, res) => {
  const client = await getClient()

  const { name, email, password, role } = req.body

  try {
    // Check if the email already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    // Get the role ID from the roles table
    const roleResult = await client.query(
      'SELECT id FROM roles WHERE name = $1',
      [role]
    )
    const roleId = roleResult.rows[0]?.id

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          'Password is not strong enough. It should be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Inserting the new user into the users table
    const newUser = await client.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, roleId]
    )

    res.status(201).json({
      message: 'successfully Registered',
      user: newUser.rows[0],
      token: signJwtToken(newUser.rows[0].id),
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const client = await getClient()

    // Check if the user exists
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate a JWT token
    const token = signJwtToken(user.id)

    res.json({ message: 'successfully Logged in', token })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}
