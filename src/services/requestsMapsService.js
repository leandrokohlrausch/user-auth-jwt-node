const requestsMapsRepository = require('../repositories/requestsMapsRepository');
const rolesRepository = require('../repositories/rolesRepository');
const usersService = require('../services/usersService');
const asyncForEach = require('../utils/asyncForEach');

const requestsMapsService = {

    async validateAccess (url, method, username) {
        const requestMap = await requestsMapsRepository.findByUrl(url, method);
        if (requestMap) {
            requestMap.roles = await rolesRepository.findAllByRequestMaps(requestMap);
            const user = await usersService.findUserByUsername(username);
            const hasRole = requestMap.roles.filter( (role) => {
                return user.roles.filter( (rolee) => role.id === rolee.id ).length > 0;
            });
            const access = hasRole.length > 0;
            return access;
        }
        return false;
    },

    async findAll() {
        const requestsMaps = await requestsMapsRepository.findAll();
        await asyncForEach(requestsMaps, async (requestMap) => {
            requestMap.roles = await rolesRepository.findAllByRequestMaps(requestMap);
        })
        return requestsMaps;
    },

    async create (request) {
        const { url, httpMethod, roles } = request.body;
        return await requestsMapsRepository.create({ url: url, http_method: httpMethod }, roles);
    },

    async delete (request) {
        const { id } = request.params;
        return await requestsMapsRepository.delete(id);
    }

};

module.exports = requestsMapsService;