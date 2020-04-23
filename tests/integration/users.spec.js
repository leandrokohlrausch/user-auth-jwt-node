const app = require('../../src/app');
const connection = require('../../src/repositories/connection');

const supertest = require('supertest');
const appRoot = require('app-root-path');
const fs = require('fs');

describe('User', () => {

    let dataTest = {
        USERNAME_ADMIN : "admin",
        PASSWORD_ADMIN : "admin",
        ROLE_ID_USER : 2,
        ROLE_ID_ADMIN : 1,
        NAME_USERTEST : "Anything",
        EMAIL_USERTEST : "anything@gmail.com",
        USERNAME_USERTEST : "usertest",
        PASSWORD_USERTEST : "usertest",
        NEW_NAME_USERTEST: "Anything2",
        ROLE_AUTHORITY_TEST : "ROLE_ANYTHING"
    };

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
            .post("/users/authentication")
            .send({
                username: dataTest.USERNAME_ADMIN,
                password: dataTest.PASSWORD_ADMIN
            });
        expect(response.body).toHaveProperty('token');
        dataTest.token = response.body.token;
    });

    it('Should be able to create a new Role',async () => {
        const response = await supertest(app)
            .post("/roles")
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({
                authority: dataTest.ROLE_AUTHORITY_TEST
            });
        expect(response.body).toHaveProperty('id');
        dataTest.roleId = response.body.id;
    });

    it('Should be get Role by Id',async () => {
        const response = await supertest(app)
            .get("/roles/" + dataTest.roleId)
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({});
        expect(response.body).toHaveProperty("authority");
    });

    it('Should be able to create a new User',async () => {
        const response = await supertest(app)
            .post("/users")
            .send({
                name: dataTest.NAME_USERTEST,
                email: dataTest.EMAIL_USERTEST,
                password: dataTest.USERNAME_USERTEST,
                username: dataTest.PASSWORD_USERTEST,
                roles: [
                        { role_id: dataTest.roleId },
                        { role_id: dataTest.ROLE_ID_USER }
                    ]
            });
        expect(response.body).toHaveProperty('id');
        dataTest.userId = response.body.id;
    });

    it('Should be get all Users',async () => {
        const response = await supertest(app)
            .get("/users")
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({});
        expect(response.body).toHaveLength(2);
    });

    it('Should be able to Delete a Role',async () => {
        const response = await supertest(app)
            .delete("/roles/" + dataTest.roleId)
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({});
        expect(response.status).toEqual(204);
    });

    it('Should be able to authenticate a new Created User',async () => {
        const response = await supertest(app)
            .post("/users/authentication")
            .send({
                username: dataTest.USERNAME_USERTEST,
                password: dataTest.PASSWORD_USERTEST
            });
        expect(response.body).toHaveProperty('token');
        dataTest.token = response.body.token;
    });

    it('Should be able to update a new Created User',async () => {
        const response = await supertest(app)
            .put("/users/" + dataTest.userId)
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({
                name: dataTest.NEW_NAME_USERTEST,
                roles: [
                    { role_id: dataTest.ROLE_ID_USER },
                    { role_id: dataTest.ROLE_ID_ADMIN }
                ]
            });
        expect(response.status).toEqual(200);
    });

    it('Should be get a new Created Users By Id',async () => {
        const response = await supertest(app)
            .get("/users/" + dataTest.userId)
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({});
        expect(response.body.name).toEqual(dataTest.NEW_NAME_USERTEST);
    });

    it('Should be able to Delete a new Created user',async () => {
        const response = await supertest(app)
            .delete("/users/" + dataTest.userId)
            .set('Authorization',`Bearer ${dataTest.token}`)
            .send({});
        expect(response.status).toEqual(204);
    });

})