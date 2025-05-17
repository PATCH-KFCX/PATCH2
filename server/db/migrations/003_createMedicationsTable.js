exports.up = function (knex) {
    return knex.schema.createTable('medications', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('dosage').notNullable();
      table.string('frequency').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('medications');
  };
  