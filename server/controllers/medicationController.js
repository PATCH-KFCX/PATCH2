const knex = require('../db/knex');

// Add a new medication
exports.addMedication = async (req, res) => {
  try {
    const { name, dosage, days } = req.body;

    // Validate input
    if (!name || !dosage || !days) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert into the database
    const [newMedication] = await knex('medications').insert(
      { name, dosage, days },
      ['id', 'name', 'dosage', 'days']
    );

    res.status(201).json(newMedication);
  } catch (err) {
    console.error('Error adding medication:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all medications
exports.getMedications = async (req, res) => {
  try {
    const medications = await knex('medications').select('*');
    res.status(200).json(medications); // Ensure this returns an array
  } catch (err) {
    console.error('Error fetching medications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a medication
exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await knex('medications').where({ id }).del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (err) {
    console.error('Error deleting medication:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
