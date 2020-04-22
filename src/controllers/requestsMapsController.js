const requestsMapsService = require('../services/requestsMapsService');

const requestsMapsController = {

    async create (request, response) {
        const requestMap = await requestsMapsService.create(request);
        return response.json(requestMap);
    },

    async findAll (request, response) {
        const requestsMaps = await requestsMapsService.findAll();
        return response.json(requestsMaps);
    },

    async delete (request, response) {
        const ret = await requestsMapsService.delete(request);
        ret.error ? response.status(ret.status) : response.status(204);
        return response.send();
    }

};

module.exports = requestsMapsController;