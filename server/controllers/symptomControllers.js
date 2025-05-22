const SymptomLog = require('../models/SymptomLog');
const knex = require('../db/knex');

// POST /api/symptoms
exports.create = async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const newLog = await SymptomLog.create(userId, req.body);

    if (!newLog) {
      return res.status(500).json({ message: 'Failed to save symptom log' });
    }

    res.status(201).json(newLog);
  } catch (err) {
    console.error('❌ Error saving symptom log:', err);
    res.status(500).json({ message: 'Server error saving symptom log' });
  }
};

// GET /api/symptoms
exports.listForUser = async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).send({ message: 'Not authenticated.' });

  try {
    const logs = await SymptomLog.listForUser(userId);
    res.send(logs);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching logs' });
  }
};

exports.remove = async (req, res) => {
  const { userId } = req.session;
  const { id } = req.params;

  if (!userId) return res.status(401).send({ message: 'Not authenticated.' });

  try {
    await SymptomLog.delete(userId, id); // this method must exist
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting symptom log' });
  }
};

// Update a symptom log
exports.updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const { symptom, severity, notes, date } = req.body;
    const [updated] = await knex('symptoms')
      .where({ id })
      .update({ symptom, severity, notes, date }, [
        'id',
        'symptom',
        'severity',
        'notes',
        'date',
      ]);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
