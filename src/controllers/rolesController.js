const rolesService = require('../services/rolesService');

const rolesController = {

    async create (request, response) {
        const role = await rolesService.create(request);
        return response.json(role);
    },

    async findAll (request, response) {
        const roles = await rolesService.findAll();
        return response.json(roles);
    },

    async findById (request, response) {
        const role = await rolesService.findById(request);
        return response.json(role);
    },

    async delete (request, response) {
        const ret = await rolesService.delete(request);
        ret.error ? response.status(ret.status) : response.status(204);
        return response.send();
    }

};

module.exports = rolesController;