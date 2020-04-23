const connection = require('./connection');

const rolesRepository = {

    async create (authority) {
        const record = await connection('roles').insert({ authority });
        return { id : record[0], authority };
    },

    async findAll () {
        return await connection('roles')
            .select("*");
    },

    async findById (id) {
        return await connection('roles')
            .where('id', id)
            .select("*")
            .first();
    },

    async findAllByUser (user) {
        if (!user) return  [];
        return await connection('roles')
            .join('users_roles', 'role_id', '=', 'roles.id')
            .where('users_roles.user_id', user.id)
            .select('roles.*');
    },

    async findAllByRequestMaps (requestMap) {
        if (!requestMap) return  [];
        return await connection('roles')
            .join('roles_requests_maps', 'role_id', '=', 'roles.id')
            .where('roles_requests_maps.request_map_id', requestMap.id)
            .select('roles.*');
    },

    async delete (id) {
        return await connection.transaction(function(trx) {
            return trx('roles_requests_maps')
                .where("role_id", id)
                .delete()
                .then(function (ret) {
                    return trx('users_roles')
                        .where('role_id', id)
                        .delete();
                }).then( function (ret) {
                    return trx('roles')
                        .where('id', id)
                        .delete();
                });
        }).then(function(ret) {
            return ret; //number rows deleted
        }).catch(function(error) {
            return {error : error, status: 500}
        });
    }

};

module.exports = rolesRepository;