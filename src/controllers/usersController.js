const usersService = require('../services/usersService');

const usersController = {

    async create (request, response) {
        const user = await usersService.create(request);
        if (user.error) response.status(user.status);
        return response.json(user);
    },

    async authentication (request, response) {
        const user = await usersService.authentication(request);
        if (user.error) response.status(user.status);
        return response.json(user);
    },

    async findAll (request, response) {
        const users = await usersService.findAll();
        return response.json(users);
    },

    async findById (request, response) {
        const user = await usersService.findById(request);
        return response.json(user);
    },

    async update (request, response) {
        const user = await usersService.update(request);
        if (user.error) response.status(user.status);
        return response.json(user);
    },

    async delete (request, response) {
        const ret = await usersService.delete(request);
        ret.error ? response.status(ret.status) : response.status(204);
        return response.send(ret.error);
    }

};

module.exports = usersController;