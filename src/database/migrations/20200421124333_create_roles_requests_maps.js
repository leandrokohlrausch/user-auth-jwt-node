
exports.up = function (knex) {
    return knex.schema.createTable('roles_requests_maps', function (table) {
        table.increments();
        table.integer('role_id').references('id').inTable('roles');
        table.integer('request_map_id').references('id').inTable('requests_maps');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('roles_requests_maps');
};
