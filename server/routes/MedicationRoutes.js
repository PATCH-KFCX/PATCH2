const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');

// GET /api/medications
router.get('/', async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const medications = await Medication.listForUser(userId);
    res.json(medications);
  } catch (err) {
    console.error('Error fetching medications:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/medications
router.post('/', async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const newMedication = await Medication.create(userId, req.body);
    res.status(201).json(newMedication);
  } catch (err) {
    console.error('Error creating medication:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// DELETE /api/medications/:id
router.delete('/:id', async (req, res) => {
  const { userId } = req.session;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const deleted = await Medication.delete(userId, id);
    if (deleted) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Medication not found.' });
    }
  } catch (err) {
    console.error('Error deleting medication:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;