exports.up = async function (knex) {
  const hasColumn = async (column) =>
    knex.schema.hasColumn('symptom_logs', column);

  const hasPainType = await hasColumn('pain_type');
  const hasPainLocation = await hasColumn('pain_location');
  const hasPainLevel = await hasColumn('pain_level');

  return knex.schema.alterTable('symptom_logs', function (table) {
    if (!hasPainType) table.text('pain_type');
    if (!hasPainLocation) table.text('pain_location');
    if (!hasPainLevel) table.integer('pain_level');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('symptom_logs', function (table) {
    table.dropColumn('pain_type');
    table.dropColumn('pain_location');
    table.dropColumn('pain_level');
  });
};

