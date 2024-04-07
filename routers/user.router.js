import express from 'express'
import { getClient } from '../utils/initDatabase.js'
import cloudinary from '../utils/Cloudinary.js'
import multer from 'multer'
import { authorizeUser } from '../middlewares/authorizeUser.js'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.put(
  '/updateProfile',
  authorizeUser,
  upload.single('profilePicture'),
  async (req, res) => {
    let { name, email } = req.body
    const userId = req.userId
    let profilePicture = null

    try {
      const client = await getClient()

      const userDetails = await client.query(
        `select * from users where id = ${userId}`
      )
      if (!name) {
        name = userDetails.rows[0].name
      }
      if (!email) {
        email = userDetails.rows[0].email
      }
      // Check if the new email already exists for another user
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      )
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' })
      }

      // Upload profile picture to Cloudinary if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        profilePicture = result.secure_url
      }

      const updatedAt = new Date().toISOString()
      // Update the user profile in the users table
      const updatedUser = await client.query(
        'UPDATE users SET name = $1, email = $2, profile_picture = $3, updated_at = $4 WHERE id = $5 RETURNING *',
        [name, email, profilePicture, updatedAt, userId]
      )

      res.json(updatedUser.rows[0])
    } catch (error) {
      console.error('Error updating user profile:', error)
      res.status(500).json({ message: 'Internal server error', error })
    }
  }
)

export const userRouters = router
