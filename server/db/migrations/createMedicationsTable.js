exports.up = function (knex) {
  return knex.schema.createTable('medications', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.decimal('dosage').notNullable();
    table.string('unit').notNullable(); // e.g., mg, ml
    table.string('frequency').notNullable(); // e.g., "Twice a day"
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('medications');
};
