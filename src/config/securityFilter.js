const constantsConfig = require('./constants');
const requestsMapsService = require('../services/requestsMapsService');

const jwt = require('jsonwebtoken');

const securityFilter = async (request, response, next) => {
    const token = request.headers.authorization;

    if (!token) return response.status(401).send({error: 'No token provider'});

    const n = token.startsWith("Bearer ");
    if (!n)  return response.status(401).send({error: 'Authorization token malformatted -> Bearer HASH_TOKEN'});

    const hash = token.replace("Bearer ", "");
    let username;
    jwt.verify(hash, constantsConfig.jwtsecret, (err, decoded) => {
        if (err) return response.status(401).send({error: `Invalid Token ${hash}, err ${err}, decoded ${decoded}`});
        username = decoded.username;
    });

    let url = request.path;
    if (Object.entries(request.params).length > 0) {
        Object.getOwnPropertyNames(request.params).forEach(function (prop, idx, array) {
            var value = request.params[prop];
            url = url.toString().replace(value, ':' + prop);
        });
    }
    const access = await requestsMapsService.validateAccess(url, request.method, username);
    if (!access) return response.status(403).send({error: `User not have access to this route`});
    request.headers['myapp_username'] = username;
    next();
};

module.exports = securityFilter;