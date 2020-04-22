const rolesRepository = require('../repositories/rolesRepository');

const  rolesService = {

    async create (request) {
        const { authority } = request.body;
        return await rolesRepository.create(authority);
    },

    async findAll () {
       return await rolesRepository.findAll();
    },

    async findById (request) {
        const { id } = request.query;
        return await rolesRepository.findById(id);
    },

    async delete (request) {
        const { id } = request.params;
        return await rolesRepository.delete(id);
    }

};

module.exports = rolesService;