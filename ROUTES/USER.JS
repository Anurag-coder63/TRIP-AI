const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.get('/:user_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, name, email, phone, gender, created_at FROM users WHERE user_id = $1',
      [req.params.user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:user_id', async (req, res) => {
  const { name, phone, gender } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, phone=$2, gender=$3
       WHERE user_id=$4
       RETURNING user_id, name, email, phone, gender, created_at`,
      [name, phone, gender, req.params.user_id]
    );
    res.json({ message: 'Profile updated!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;