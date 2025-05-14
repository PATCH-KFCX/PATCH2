exports.up = async function (knex) {
  const hasPainType = await knex.schema.hasColumn('symptom_logs', 'pain_type');
  const hasPainLocation = await knex.schema.hasColumn(
    'symptom_logs',
    'pain_location'
  );
  const hasPainLevel = await knex.schema.hasColumn(
    'symptom_logs',
    'pain_level'
  );

  return knex.schema.table('symptom_logs', function (table) {
    if (!hasPainType) table.text('pain_type');
    if (!hasPainLocation) table.text('pain_location');
    if (!hasPainLevel) table.integer('pain_level');
  });
};

exports.down = function (knex) {
  return knex.schema.table('symptom_logs', function (table) {
    table.dropColumn('pain_type');
    table.dropColumn('pain_location');
    table.dropColumn('pain_level');
  });
};
