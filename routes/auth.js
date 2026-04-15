const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const crypto  = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'tripai_salt_2024').digest('hex');
}

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, gender } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required!' });
  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters!' });

  try {
    const exists = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(400).json({ error: 'This email is already registered!' });

    const hashed = hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, gender)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, name, email, phone, gender, created_at`,
      [name.trim(), email.toLowerCase().trim(), hashed, phone || null, gender || null]
    );

    res.status(201).json({ message: 'Account created!', user: result.rows[0] });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required!' });

  try {
    const hashed = hashPassword(password);
    const result = await pool.query(
      `SELECT user_id, name, email, phone, gender, created_at
       FROM users WHERE email = $1 AND password_hash = $2`,
      [email.toLowerCase().trim(), hashed]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Incorrect email or password!' });

    res.json({ message: 'Login successful!', user: result.rows[0] });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
