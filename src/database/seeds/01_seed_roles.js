const rolesData = require('../seeds_data/seed_roles_data');

exports.seed = function(knex) {

  return knex('roles').del()
    .then(function () {
      return knex('roles').insert(rolesData);
    });

};
