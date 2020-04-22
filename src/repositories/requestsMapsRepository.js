const connection = require('./connection');

const requestsMapsRepository = {

    async findByUrl (url, method) {
        const requestMap = await connection('requests_maps')
            .where("url", url)
            .andWhere('http_method', method)
            .select("*")
            .first();
        return requestMap;
    },

    async findAll () {
        const requestsMaps = await connection('requests_maps').select('*');
        return requestsMaps;
    },

    async create (requestMap, roles) {
        return await connection.transaction(function(trx) {
            return trx('requests_maps').insert(requestMap).then(function (id) {
                roles.forEach( (role) => role.request_map_id = id[0] );
                return trx('roles_requests_maps').insert(roles);
            });
        }).then(function(id) {
            const reqMap =  connection('requests_maps')
                .where('id', id[0])
                .select("*");
            return reqMap;
        }).catch(function(error) {
            return {error : error, status: 500}
        });
    },

    async delete (id) {
        return await connection.transaction(function(trx) {
            return trx('roles_requests_maps')
                .where("request_map_id", id)
                .delete()
                .then(function (ret) {
                    return trx('requests_maps')
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

module.exports = requestsMapsRepository;