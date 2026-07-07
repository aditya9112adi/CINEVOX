const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', authRoutes)

// MongoDB Connection
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas')
  })
  .catch(err => {
    console.error('Database connection error:', err)
  })

