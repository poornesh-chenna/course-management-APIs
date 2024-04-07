import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg
dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString,
})

let client
export const connectDatabase = async () => {
  try {
    client = await pool.connect()
    console.log('Database connected successfully...')
    return client
  } catch (err) {
    console.error('Database not connected:', err)
    throw err
  }
}

export const getClient = () => client
