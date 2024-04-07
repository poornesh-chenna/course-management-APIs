import { UnAuthorizedError } from '../CustomErrors/UnAuthorizedError.js'
import { getClient } from '../utils/initDatabase.js'
import { verifyTokenAndGetUserId } from '../utils/jwt.js'

export const authorizeUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new UnAuthorizedError()
  try {
    const userId = verifyTokenAndGetUserId(token)
    req.userId = userId
    next()
  } catch (err) {
    throw new UnAuthorizedError()
  }
}

export const isSuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw new UnAuthorizedError()
    const userId = verifyTokenAndGetUserId(token)

    req.userId = userId
    const client = await getClient()
    const { rows } = await client.query(
      'SELECT * FROM users WHERE id = $1 AND role_id = 1',
      [userId]
    )

    if (rows.length > 0) {
      next()
    } else {
      res
        .status(403)
        .json({ message: 'Forbidden.. Only superAdmin has the permission' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}
