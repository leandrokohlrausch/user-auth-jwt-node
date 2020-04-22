
exports.up = function (knex) {
    return knex.schema.createTable('requests_maps', function (table) {
        table.increments();
        table.string('url').notNullable();
        table.string('http_method').notNullable();
        table.unique(['url', 'http_method']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('requests_maps');
};
