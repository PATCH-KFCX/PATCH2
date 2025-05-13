const knex = require('../db/knex');

class SymptomLog {
  static async create(userId, logData) {
    const { date, symptoms, pain_type, pain_location, pain_level } = logData;

    const result = await knex('symptom_logs').insert({
      user_id: userId,
      date,
      symptoms,
      pain_type,
      pain_location,
      pain_level,
    }).returning('*');

    return result[0];
  }

  static async listForUser(userId) {
    const logs = await knex('symptom_logs').where({ user_id: userId }).orderBy('date', 'desc');
    return logs;
  }
}

module.exports = SymptomLog;
