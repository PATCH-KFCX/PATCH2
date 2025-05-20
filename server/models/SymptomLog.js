const db = require('../db/knex');


class SymptomLog {
  static async create(userId, data) {
    const { date, symptoms, painType, painLocation, painLevel } = data;

    const [newLog] = await db('symptom_logs')
      .insert({
        user_id: userId,
        date,
        symptoms: symptoms.join(', '),
        pain_type: painType.join(', '),
        pain_location: painLocation.join(', '),
        pain_level: painLevel,
      })
      .returning([
        'id',
        'date',
        'symptoms',
        'pain_type',
        'pain_location',
        'pain_level',
      ]);

    return {
      id: newLog.id,
      date: newLog.date,
      symptoms: newLog.symptoms?.split(', ') || [],
      painType: newLog.pain_type?.split(', ') || [],
      painLocation: newLog.pain_location?.split(', ') || [],
      painLevel: newLog.pain_level,
    };
  }

  static async listForUser(userId) {
    const rows = await db('symptom_logs')
      .where({ user_id: userId })
      .orderBy('date', 'desc');

    return rows.map((row) => ({
      id: row.id,
      date: row.date,
      symptoms: row.symptoms?.split(', ') || [],
      painType: row.pain_type?.split(', ') || [],
      painLocation: row.pain_location?.split(', ') || [],
      painLevel: row.pain_level,
    }));
  }

  static async delete(userId, logId) {
    return db('symptom_logs').where({ id: logId, user_id: userId }).del();
  }
}

module.exports = SymptomLog;
