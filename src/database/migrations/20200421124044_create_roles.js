
exports.up = function (knex) {
    return knex.schema.createTable('roles', function (table) {
        table.increments();
        table.string('authority').notNullable().unique();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('roles');
};
