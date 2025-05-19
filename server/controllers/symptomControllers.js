const SymptomLog = require('../models/SymptomLog');

// POST /api/symptoms
exports.create = async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).send({ message: 'Not authenticated.' });

  try {
    const newLog = await SymptomLog.create(userId, req.body);
    res.status(201).send(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error saving symptom log' });
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
