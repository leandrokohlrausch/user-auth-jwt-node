const usersData = require('../seeds_data/seed_users_data');
const usersRolesData = require('../seeds_data/seed_users_roles_data');

exports.seed = function(knex) {
    return knex('users_roles')
        .del()
        .then( () => {
            knex('users').del();
        })
        .then(function () {
            return knex('users').insert(usersData)
                .then( () => {
                    return knex('users_roles').insert(usersRolesData);
                });
        });
};