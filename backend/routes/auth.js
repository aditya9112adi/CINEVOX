const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')

const router = express.Router()
const USERS_FILE = path.join(__dirname, '../users.json')

// Helper function to read users from JSON file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty list
    return []
  }
}

// Helper function to write users to JSON file
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

// ============================
// POST /api/register
// ============================
router.post('/register', async (req, res) => {
  try {
    const {username, password} = req.body

    // --- Validation ---
    if (!username || !password) {
      return res.status(400).json({error_msg: 'Username and password are required'})
    }

    const trimmedUsername = username.trim()

    if (trimmedUsername.length < 3) {
      return res.status(400).json({error_msg: 'Username must be at least 3 characters'})
    }

    if (password.length < 6) {
      return res.status(400).json({error_msg: 'Password must be at least 6 characters'})
    }

    // --- Check if username already exists in local JSON ---
    const users = await readUsers()
    const existingUser = users.find(
      u => u.username.toLowerCase() === trimmedUsername.toLowerCase(),
    )
    if (existingUser) {
      return res.status(409).json({error_msg: 'Username already exists. Please choose another.'})
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // --- Add user and save ---
    const newUser = {
      id: Date.now().toString(),
      username: trimmedUsername,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    await writeUsers(users)

    res.status(201).json({
      message: 'Registration successful! You can now log in.',
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({error_msg: 'Server error. Please try again.'})
  }
})

// ============================
// POST /api/login
// ============================
router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body

    // --- Validation ---
    if (!username || !password) {
      return res.status(400).json({error_msg: 'Username and password are required'})
    }

    const trimmedUsername = username.trim()

    // --- Find user in local JSON ---
    const users = await readUsers()
    const user = users.find(
      u => u.username.toLowerCase() === trimmedUsername.toLowerCase(),
    )
    if (!user) {
      return res.status(401).json({error_msg: 'Username not registered. Please register first.'})
    }

    // --- Verify password ---
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({error_msg: 'Incorrect password. Please try again.'})
    }

    // --- Fetch NxtWave JWT token to authenticate movie endpoints ---
    let jwtToken = ''
    try {
      const nxtWaveResponse = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'rahul',
          password: 'rahul@2021',
        }),
      })
      const nxtWaveData = await nxtWaveResponse.json()
      if (nxtWaveResponse.ok) {
        jwtToken = nxtWaveData.jwt_token
      } else {
        return res.status(500).json({error_msg: 'Failed to retrieve movie session token.'})
      }
    } catch (fetchError) {
      return res.status(500).json({error_msg: 'Connection error with movie content server.'})
    }

    res.status(200).json({
      jwt_token: jwtToken,
      username: user.username,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({error_msg: 'Server error. Please try again.'})
  }
})

module.exports = router
