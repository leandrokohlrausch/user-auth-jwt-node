const app = require('../../src/app');
const connection = require('../../src/repositories/connection');

const supertest = require('supertest');
const appRoot = require('app-root-path');
const fs = require('fs');

describe('User', () => {

    let dataTest = {};

    beforeAll(async () => {
        await connection.migrate.latest();
        await connection.seed.run();
    });

    afterAll(async () => {
        await connection.migrate.rollback();
        await connection.destroy();
        const dbFile = appRoot + "/src/database/test.sqlite";
        fs.unlink(dbFile, (err) => {
            if (err) console.log(err);
        });
        done();
    });

    it('Should be able to authenticate a User',async () => {
        const response = await supertest(app)
            .post("users/authentication")
            .send({
                username: "admin", //using data seed admin user
                password: "admin"
            });
        expect(response.body).toHaveProperty('token');
        dataTest.token = response.body.token;
    });

    it('Should be able to create a new Role',async () => {
        const response = await supertest(app)
            .post("/roles")
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({
                authority: "ROLE_TEST"
            });
        expect(response.body).toHaveProperty('id');
        dataTest.roleId = response.body.id;
    });

    it('Should be able to create a new User',async () => {
        const response = await supertest(app)
            .post("/users")
            .send({
                name: "User Test",
                email: "usertest@gmail.com",
                password: "usertest",
                username: "usertest",
                roles: [ { role_id: dataTest.roleId } ]
            });

        expect(response.body).toHaveProperty('name');
    });

    it('Should be get all requests Maps by User',async () => {
        const response = await supertest(app)
            .get("/requestsMaps")
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({});

        expect(response.body).toHaveLength(1);
    });

})