// This function runs when we apply the migration (e.g., using `knex migrate:latest`)
exports.up = function (knex) {
  return knex.schema.createTable('symptom_logs', (table) => {
    table.increments('id').primary(); // Unique ID for each symptom log (auto-incrementing)

    table.integer('user_id'); // Foreign key: connects each log to a specific user

    table.date('date'); // The date the symptom was experienced or logged

    table.text('symptoms'); // Free text field to describe the symptoms

    table.string('pain_type'); // Type of pain (e.g., dull, sharp, aching)

    table.string('pain_location'); // Where on the body the pain is located

    table.integer('pain_level'); // Pain severity on a scale (e.g., 1 to 10)

    table.string('doctor_type'); // What kind of doctor might be needed (e.g., Dentist, Primary Care)

    table.text('other_notes'); // Optional field for extra info or context

    table.timestamps(true, true); // Automatically adds created_at and updated_at columns
  });
};

// This function runs when we roll back the migration (e.g., using `knex migrate:rollback`)
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('symptom_logs'); // Deletes the table if it exists
};
