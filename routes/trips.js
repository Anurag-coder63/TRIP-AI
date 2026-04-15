const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Save a new trip
router.post('/', async (req, res) => {
  const { user_id, departure, destination, budget, group_size, duration_days, trip_type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO trips (user_id, departure, destination, budget, group_size, duration_days, trip_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, departure, destination, budget, group_size || 1, duration_days, trip_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all trips for a user
router.get('/:user_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY trip_id DESC',
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a trip
router.delete('/:trip_id', async (req, res) => {
  try {
    await pool.query('DELETE FROM trips WHERE trip_id = $1', [req.params.trip_id]);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
