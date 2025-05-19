const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const { checkAuthentication } = require('../middleware/checkAuthentication');

// POST /api/medications - Create a new medication log
router.post('/', async (req, res) => {
  const { name, dosage, unit, frequency } = req.body;
  const userId = req.session.userId;

  if (!name || !dosage || !unit || !frequency) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [newMedication] = await knex('medications')
      .insert({ user_id: userId, name, dosage, unit, frequency })
      .returning('*');
    res.status(201).json(newMedication);
  } catch (err) {
    console.error('Error creating medication:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/medications - Fetch all medications for the logged-in user
router.get('/', async (req, res) => {
  const userId = req.session.userId;

  try {
    const medications = await knex('medications').where({ user_id: userId });
    res.json(medications);
  } catch (err) {
    console.error('Error fetching medications:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/medications/:id - Delete a medication log
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const deleted = await knex('medications').where({ id, user_id: userId }).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Medication not found.' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting medication:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;