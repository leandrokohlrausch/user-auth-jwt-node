
exports.up = function (knex) {
    return knex.schema.createTable('users_roles', function (table) {
        table.increments();
        table.integer('role_id').references('id').inTable('roles');
        table.integer('user_id').references('id').inTable('users');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users_roles');
};
