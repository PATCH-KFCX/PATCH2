const knex = require('../db/knex');

class DiabetesLog {
  static async create({ userId, date, level, notes }) {
    const query = `
      INSERT INTO diabetes_logs (user_id, date, level, notes)
      VALUES (?, ?, ?, ?)
      RETURNING *;
    `;
    const result = await knex.raw(query, [userId, date, level, notes]);
    return result.rows[0];
  }

  static async findByUser(userId) {
    const query = `
      SELECT * FROM diabetes_logs
      WHERE user_id = ?
      ORDER BY date DESC;
    `;
    const result = await knex.raw(query, [userId]);
    return result.rows;
  }

  static async deleteById(id, userId) {
    const query = `
      DELETE FROM diabetes_logs
      WHERE id = ? AND user_id = ?
      RETURNING *;
    `;
    const result = await knex.raw(query, [id, userId]);
    return result.rowCount > 0;
  }
}

module.exports = DiabetesLog;
