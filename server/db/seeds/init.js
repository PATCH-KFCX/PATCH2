// Import the User model, which contains logic for creating and managing users
const User = require('../../models/User');

/**
 * This function runs when you execute `knex seed:run`.
 * It will populate your database with initial data for development/testing.
 */
exports.seed = async (knex) => {
  // Clear existing data from the tables to start fresh
  await knex('symptom_logs').del(); // Delete all existing symptom logs
  await knex('users').del(); // Delete all existing users

  // Reset the auto-incrementing IDs for both tables (PostgreSQL-specific)
  await knex.raw('ALTER SEQUENCE symptom_logs_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  // Create 10 test users with realistic usernames
  const names = [
    'cool_cat23',
    'l33t_guy',
    'jane.doe',
    'doctor_avocado',
    'sunny_days',
    'techie123',
    'mellow_vibes',
    'bookworm88',
    'runnergirl',
    'gamer_guy99',
  ];

  const age = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
  ];

  const emails = [
    'cool_cat23@gmail.com',
    'l33t_guy@gmail.com',
    'jane.doe@gmail.com',
    'doctor_avocado@gmail.com',
    'sunny_days@gmail.com',
    'techie123@gmail.com',
    'mellow_vibes@gmail.com',
    'bookworm88@gmail.com',
    'runnergirl@gmail.com',
    'gamer_guy99@gmail.com',
  ];

  // Use the User model to securely create each user and store their info
  const users = await Promise.all(names.map((name, i) => User.create(name, age[i], emails[i], 'password123')));
  // Creates users with hashed passwords

  // Close the Promise.all parenthesis

  // Step 3: Create 10 sample symptom log entries (1 per user)
  const symptomLogs = [
    {
      date: '2025-05-01',
      symptoms: 'Headache and nausea',
      pain_type: 'sharp',
      pain_location: 'forehead',
      pain_level: 5,
      doctor_type: 'Primary Care',
      other_notes: 'Felt worse in the morning',
    },
    {
      date: '2025-05-02',
      symptoms: 'Chest tightness',
      pain_type: 'tightness',
      pain_location: 'chest',
      pain_level: 7,
      doctor_type: 'Cardiologist',
      other_notes: 'After running up stairs',
    },
    {
      date: '2025-05-03',
      symptoms: 'Stomach cramps',
      pain_type: 'aching',
      pain_location: 'lower abdomen',
      pain_level: 4,
      doctor_type: 'Gastroenterologist',
      other_notes: 'Felt after lunch',
    },
    {
      date: '2025-05-03',
      symptoms: 'Sinus pressure',
      pain_type: 'dull',
      pain_location: 'behind eyes',
      pain_level: 3,
      doctor_type: 'Allergist',
      other_notes: 'Allergy season trigger',
    },
    {
      date: '2025-05-03',
      symptoms: 'Back pain',
      pain_type: 'chronic',
      pain_location: 'lower back',
      pain_level: 6,
      doctor_type: 'Physical Therapist',
      other_notes: 'After lifting boxes',
    },
    {
      date: '2025-05-03',
      symptoms: 'Wheezing',
      pain_type: 'tightness',
      pain_location: 'lungs',
      pain_level: 5,
      doctor_type: 'Pulmonologist',
      other_notes: 'After walking stairs',
    },
    {
      date: '2025-05-04',
      symptoms: 'Mild fever',
      pain_type: 'heat',
      pain_location: 'body',
      pain_level: 2,
      doctor_type: 'Primary Care',
      other_notes: 'Ongoing since yesterday',
    },
    {
      date: '2025-05-04',
      symptoms: 'Toothache',
      pain_type: 'sharp',
      pain_location: 'upper molar',
      pain_level: 8,
      doctor_type: 'Dentist',
      other_notes: 'Gets worse at night',
    },
    {
      date: '2025-05-04',
      symptoms: 'Ear ringing',
      pain_type: 'buzzing',
      pain_location: 'left ear',
      pain_level: 3,
      doctor_type: 'ENT',
      other_notes: 'Off and on for two days',
    },
    {
      date: '2025-05-04',
      symptoms: 'Neck stiffness',
      pain_type: 'dull',
      pain_location: 'back of neck',
      pain_level: 4,
      doctor_type: 'Chiropractor',
      other_notes: 'After sleeping wrong',
    },
  ];

  // Step 4: Link each symptom log to one of the newly created users
  await Promise.all(
    users.map((user, i) => knex('symptom_logs').insert({
      user_id: user.id, // Foreign key reference to the user
      ...symptomLogs[i], // Spread the rest of the symptom log fields
    })),
  );
};
