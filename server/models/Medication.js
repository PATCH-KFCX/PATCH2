const knex = require('../db/knex');

class Medication {
  static async create(userId, data) {
    const { name, dose, frequency, notes } = data;
    const [newMedication] = await knex('medications')
      .insert({ user_id: userId, name, dose, frequency, notes })
      .returning('*');
    return newMedication;
  }

  static async listForUser(userId) {
    return knex('medications').where({ user_id: userId }).orderBy('created_at', 'desc');
  }

  static async delete(userId, id) {
    return knex('medications').where({ id, user_id: userId }).del();
  }
}

module.exports = Medication;