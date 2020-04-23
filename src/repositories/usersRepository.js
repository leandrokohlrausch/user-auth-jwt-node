const connection = require('./connection');

const usersRepository = {

    async create (user, roles) {
        let userId;
        return await connection.transaction(function(trx) {
            return trx('users')
                .insert(user)
                .then(function (id) {
                    userId = id[0];
                    roles.forEach( (role) => role.user_id =  userId);
                    return trx('users_roles').insert(roles);
                });
        }).then( function (id) {
            return { id: userId };
        }).catch( function (error) {
            return { error : error, status: 500 };
        });
    },

    async findById (id) {
        return await connection('users')
            .where('id', id)
            .select("name", "username", "email", "id")
            .first();
    },

    async findAll () {
        return await connection('users')
            .select("*");
    },

    async findByUsername (username) {
        return await connection('users')
            .where('username', username)
            .select('*')
            .first();
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
            return ret;
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