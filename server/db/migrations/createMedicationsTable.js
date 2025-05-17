exports.up = function (knex) {
  return knex.schema.createTable('medications', (table) => {
    table.increments('id').primary(); // Unique ID
    table.integer('user_id').notNullable(); // Foreign key to users
    table.string('name').notNullable(); // Medication name
    table.string('dose').notNullable(); // Dose (e.g., "500mg")
    table.string('frequency').notNullable(); // Frequency (e.g., "Twice a day")
    table.text('notes'); // Optional notes
    table.timestamps(true, true); // Created and updated timestamps
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('medications');
};