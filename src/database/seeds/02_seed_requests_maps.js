const requestsMapsData = require('../seeds_data/seed_requests_maps_data');
const rolesRequestsMapsData = require('../seeds_data/seed_roles_requests_maps_data');

exports.seed = function(knex) {
  return knex('roles_requests_maps')
      .del()
      .then( () => {
          knex('requests_maps').del();
      })
      .then(function () {
          return knex('requests_maps').insert(requestsMapsData)
              .then( () => {
                  return knex('roles_requests_maps').insert(rolesRequestsMapsData);
              });
      });
};
