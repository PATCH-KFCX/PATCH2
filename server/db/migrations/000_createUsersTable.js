// This function runs when the migration is applied (e.g., `knex migrate:latest`)
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // Unique user ID (auto-incrementing primary key)

    table.string('name'); // The user's name

    table.integer('age'); // The user's age

    table.string('email'); // The user's email address

    table.string('password_hash'); // Securely stored hashed password

    table.text('preexisting_conditions'); // Optional text describing any known medical conditions

    // Note: created_at and updated_at timestamps could be added here if needed
  });
};


// This function runs when the migration is rolled back (e.g., `knex migrate:rollback`)
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users'); // Deletes the users table if it exists
};
