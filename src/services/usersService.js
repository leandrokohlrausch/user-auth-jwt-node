const usersRepository = require('../repositories/usersRepository');
const rolesRepository = require('../repositories/rolesRepository');
const constantsConfig = require('../config/constants');
const asyncForEach = require('../utils/asyncForEach');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersService = {

    async create (request) {
        const { name, email, username, password, roles } = request.body;
        const encrypt = await bcrypt.hash(password, constantsConfig.bcryptSalt);
        const user = await usersRepository.create({ name, email, username, password : encrypt }, roles);
        return user;
    },

    async authentication (request) {
        const { username, password } = request.body;
        const user = await usersRepository.findByUsername(username);
        if (!user) return { error: "user not found with this username", status: 400 };
        let compare =  await bcrypt.compare(password, user.password);
        if (!compare) {
            return { error: "Password incorrect", status: 401 };
        } else {
            user.id = undefined;
            user.password = undefined;
            const token = jwt.sign({ username: user.username }, constantsConfig.jwtsecret, {
                expiresIn : constantsConfig.jwtMinutesExpired * 60
            });
            user.token = token;
        }
        return user;
    },

    async findAll () {
        const users = await usersRepository.findAll();
        await asyncForEach(users, async (user) => {
            user.roles = await rolesRepository.findAllByUser(user);
        })
        return users;
    },

    async findUserByUsername (username) {
        const user = await usersRepository.findByUsername(username);
        if (user) user.roles =  await rolesRepository.findAllByUser(user);
        return user;
    },

    async findById (request) {
        const { id } = request.query;
        return await usersRepository.findById(id);
    },

    async update (request) {
        const { id } = request.params;
        const usernameAuth = request.headers['myapp_username'];
        const userAuth = await usersRepository.findByUsername(usernameAuth);
        if (id !== userAuth.id) return { error : "You dont have permission to update another user", status: 403 }

        const { name, email, username, password, roles } = request.body;
        const encrypt = password ? await bcrypt.hash(password, constantsConfig.bcryptSalt) : undefined;
        let user = {};
        if (name) user.name = name;
        if (email) user.email = email;
        if (username) user.username = username;
        if  (encrypt) user.password = encrypt;
        return await usersRepository.update(id, user, roles);
    },

    async delete (request) {
        const { id } = request.params;
        const usernameAuth = request.headers['myapp_username'];
        const userAuth = await usersRepository.findByUsername(usernameAuth);
        if (id !== userAuth.id) return { error : "You dont have permission to delete another user", status: 403 }

        return await usersRepository.delete(id);
    }

};

module.exports = usersService;