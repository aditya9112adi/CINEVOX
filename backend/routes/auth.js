const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

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

    if (username.trim().length < 3) {
      return res.status(400).json({error_msg: 'Username must be at least 3 characters'})
    }

    if (password.length < 6) {
      return res.status(400).json({error_msg: 'Password must be at least 6 characters'})
    }

    // --- Check if username already exists ---
    const existingUser = await User.findOne({username: username.trim()})
    if (existingUser) {
      return res.status(409).json({error_msg: 'Username already exists. Please choose another.'})
    }

    // --- Hash password (salt rounds: 10) ---
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // --- Save user to MongoDB ---
    const newUser = new User({
      username: username.trim(),
      password: hashedPassword,
    })
    await newUser.save()

    res.status(201).json({
      message: 'Registration successful! You can now log in.',
    })
  } catch (error) {
    console.error('Register error:', error)
    if (error.code === 11000) {
      return res.status(409).json({error_msg: 'Username already exists. Please choose another.'})
    }
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

    // --- Find user ---
    const user = await User.findOne({username: username.trim()})
    if (!user) {
      return res.status(401).json({error_msg: 'Invalid username or password'})
    }

    // --- Verify password ---
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({error_msg: 'Invalid username or password'})
    }

    // --- Generate JWT ---
    const jwtToken = jwt.sign(
      {id: user._id, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: '30d'},
    )

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
