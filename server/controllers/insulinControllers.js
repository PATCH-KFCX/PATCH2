const knex = require('../db/knex');
// POST /api/diabetes-logs
exports.create = async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  const { level, date, notes } = req.body;

  try {
    const [log] = await knex('diabetes_logs')
      .insert({
        user_id: userId,
        level,
        date,
        notes,
      })
      .returning('*');

    res.status(201).json(log); // ✅ Return new log in JSON format
  } catch (err) {
    console.error('❌ Error saving insulin log:', err);
    res.status(500).json({ message: 'Failed to save insulin log' });
  }
};

// GET /api/diabetes-logs
exports.listForUser = async (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const logs = await db('diabetes_logs')
      .where({ user_id: userId })
      .orderBy('date', 'desc');
    res.json(logs);
  } catch (err) {
    console.error('❌ Error fetching insulin logs:', err);
    res.status(500).json({ message: 'Failed to fetch insulin logs' });
  }
};

// DELETE /api/diabetes-logs/:id
exports.remove = async (req, res) => {
  const { userId } = req.session;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    await db('diabetes_logs').where({ user_id: userId, id }).del();
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error deleting insulin log:', err);
    res.status(500).json({ message: 'Failed to delete insulin log' });
  }
};
