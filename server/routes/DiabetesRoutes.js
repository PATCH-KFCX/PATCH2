const express = require('express');
const router = express.Router();
const DiabetesLog = require('../models/DiabetesLog');
const checkAuthentication = require('../middleware/checkAuthentication');

// POST /api/diabetes-logs
router.post('/', checkAuthentication, async (req, res) => {
  const { date, level, notes } = req.body;
  const userId = req.session.userId;

  if (!userId || !date || !level) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newLog = await DiabetesLog.create({ userId, date, level, notes });
    res.status(201).json(newLog);
  } catch (error) {
    console.error('❌ Error creating diabetes log:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/diabetes-logs
router.get('/', checkAuthentication, async (req, res) => {
  const userId = req.session.userId;

  try {
    const logs = await DiabetesLog.findByUser(userId);
    res.json(logs);
  } catch (err) {
    console.error('❌ Failed to fetch diabetes logs:', err);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

// DELETE /api/diabetes-logs/:id
router.delete('/:id', checkAuthentication, async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const result = await DiabetesLog.deleteById(id, userId);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Log not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting diabetes log:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
