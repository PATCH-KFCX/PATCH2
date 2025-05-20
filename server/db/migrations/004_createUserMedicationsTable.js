exports.up = function (knex) {
    return knex.schema.createTable('user_medications', (table) => {
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
  
      table.integer('medication_id').unsigned().notNullable()
        .references('id').inTable('medications').onDelete('CASCADE');
  
      table.date('start_date');
      table.date('end_date');
      table.text('notes');
  
      table.primary(['user_id', 'medication_id']);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user_medications');
  };
  