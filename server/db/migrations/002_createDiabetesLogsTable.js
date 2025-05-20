exports.up = function (knex) {
  return knex.schema.createTable('diabetes_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.float('level').notNullable();
    table.text('notes');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('diabetes_logs');
};
