const express = require('express');
const router = express.Router();
const DiabetesLog = require('../models/DiabetesLog');

// POST /api/diabetes-logs
router.post('/', async (req, res) => {
  try {
    const { userId, date, level, notes } = req.body;

    if (!userId || !date || !level) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newLog = await DiabetesLog.create({ userId, date, level, notes });

    // Send a proper success response
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating diabetes log:', error);

    // Send an error response
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/diabetes-logs?userId=xx
router.get('/', async (req, res) => {
  try {
    const { userId } = req.session;
    if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

    const logs = await DiabetesLog.findByUser(userId);
    res.json(logs);
  } catch (err) {
    console.error('Failed to fetch diabetes logs:', err);
    res.status(500).json({ message: 'Error fetching logs.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

    const result = await DiabetesLog.deleteById(id, userId);
    if (result) {
      res.status(200).json({ message: 'Log deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Log not found.' });
    }
  } catch (err) {
    console.error('Error deleting diabetes log:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
