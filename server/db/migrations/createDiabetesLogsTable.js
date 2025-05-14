const express = require('express');
const router = express.Router();
const DiabetesLog = require('../models/DiabetesLog');

// POST /api/diabetes-logs
router.post('/', async (req, res) => {
  try {
    const { userId, date, level, notes } = req.body;

    // Validate input
    if (!userId || !date || !level) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Save the log to the database
    const newLog = await DiabetesLog.create({ userId, date, level, notes });
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating diabetes log:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
