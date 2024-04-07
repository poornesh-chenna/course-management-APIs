import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './utils/initDatabase.js'
import { createTables } from './utils/createTables.js'
import { AuthRouters } from './routers/auth.router.js'
import { userRouters } from './routers/user.router.js'
import { CourseRouters } from './routers/course.router.js'
import { EnrollmentRouters } from './routers/enrollment.router.js'

const app = express()

app.use(express.json())

app.use(cors())

dotenv.config()

try {
  await connectDatabase()
} catch (err) {
  console.log(err)
  process.exit()
}

// create tables
createTables()

// CHECK SERVER HEALTH
app.get('/', async (req, res) => {
  res.send('<h1>Server is up and running....</h1>')
})

app.use('/api/auth', AuthRouters)
app.use('/api/users', userRouters)
app.use('/api/course', CourseRouters)
app.use('/api/enroll', EnrollmentRouters)

app.listen(5000, () => {
  console.log(`Server running on port 5000`)
})
