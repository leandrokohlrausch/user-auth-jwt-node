const connection = require('./connection');

const usersRepository = {

    async create (user, roles) {
        return await connection.transaction(function(trx) {
            return trx('users')
                .insert(user)
                .then(function (id) {
                    roles.forEach( (role) => role.user_id = id[0] );
                    return trx('users_roles').insert(roles);
                });
        }).then(function(id) {
            const userr =  connection('users')
                .where('id', id[0])
                .select("username", "email", "name", "id");
            return userr;
        }).catch(function(error) {
            return {error : error, status: 500}
        });
    },

    async findById (id) {
        const user = await connection('users').where('id', id).select("*");
        return user;
    },

    async findAll () {
        const users = await connection('users').select("*");
        return users;
    },

    async findByUsername (username) {
        const user = await connection('users')
            .where('username', username)
            .select('*')
            .first();
        return user;
    },

    async update (id, user, roles) {
        return await connection.transaction(function (trx) {
            return trx('users_roles')
                .where('user_id', id)
                .delete()
                .then( function (ret) {
                    roles.forEach( (role) => role.user_id = id );
                    return trx('users_roles').insert(roles);
                }).then(function (rett) {
                    return trx('users').where('id', id).update(user);
                });
        }).then(function (ret) {
            const userr =  connection('users')
                .where('id', id)
                .select("username", "email", "name", "id");
            return userr;
        }).catch(function (error) {
            return {error : error, status: 500}
        });
    },

    async delete (id) {
        return await connection.transaction(function(trx) {
            return trx('users_roles')
                .where("user_id", id)
                .delete()
                .then(function (ret) {
                    return trx('users')
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

module.exports = usersRepository;