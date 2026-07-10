const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const router = express.Router()

// ============================
// POST /api/register
// ============================
router.post('/register', async (req, res) => {
  try {
    const {username, password} = req.body
    if (!username || !password) {
      return res.status(400).json({error_msg: 'Username and password are required'})
    }

    const existingUser = await User.findOne({username})
    if (existingUser) {
      return res.status(400).json({error_msg: 'Username already exists'})
    }

    const user = new User({username, password})
    await user.save()

    res.status(201).json({message: 'User registered successfully'})
  } catch (error) {
    console.error('Register Error:', error.message)
    res.status(500).json({error_msg: 'Internal server error'})
  }
})

// ============================
// POST /api/login
// ============================
router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body
    if (!username || !password) {
      return res.status(400).json({error_msg: 'Username and password are required'})
    }

    const user = await User.findOne({username})
    if (!user) {
      return res.status(401).json({error_msg: 'Invalid username or password'})
    }

    if (password !== user.password) {
      return res.status(401).json({error_msg: 'Invalid username or password'})
    }

    // Fetch NxtWave movie content token
    const nxtWaveResponse = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: 'rahul', password: 'rahul@2021'}),
    })
    const nxtWaveData = await nxtWaveResponse.json()
    if (!nxtWaveResponse.ok) {
      return res.status(500).json({error_msg: 'Failed to retrieve movie session token.'})
    }

    res.status(200).json({jwt_token: nxtWaveData.jwt_token})
  } catch (error) {
    console.error('Login Error:', error.message)
    res.status(500).json({error_msg: 'Internal server error'})
  }
})

module.exports = router
