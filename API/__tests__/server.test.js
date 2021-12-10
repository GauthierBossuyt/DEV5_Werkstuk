const APP = require("../source/server.js");
const SUPERTEST = require("supertest");
const { database } = require("../source/database.js");
const REQUEST = SUPERTEST(APP);
const ROUTE = "/users";
const USER = {
    username: "Gauthier",
    password: "@userPass0",
    email: "user@user.be",
    spotifyID: "ABCDEFGHIKJLMO",
};
const ERROR_INSUFFICIENT_CREDENTIALS = "All credentials must be given!";
const ERROR_INVALID_CREDENTIALS = "The given credentials are invalid!";

beforeAll(async () => {
    let test = await database.doesTableExist("users");
    if (!test) {
        await database.createUserTable();
    }
});

test("POST /users", async () => {
    let response = await REQUEST.post(ROUTE);
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);

    response = await REQUEST.post(ROUTE).send({
        user: USER,
    });

    expect(response.status).toBe(200);
});

test("GET /users", async () => {
    let response = await REQUEST.get(ROUTE);
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: USER.username,
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: "",
    });
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);
});

test("PATCH /users", async () => {
    let response = await REQUEST.patch(ROUTE);
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);
    response = await REQUEST.patch(ROUTE).send({
        param: "email",
        value: "root@root.be",
        USER_ID: 1,
    });
    expect(response.status).toBe(200);
});

test("DELETE /users", async () => {
    let response = await REQUEST.delete(ROUTE);
    expect(response.status).toBe(400);

    response = await REQUEST.delete(ROUTE).send({
        user: { ...USER, email: "root@root.be" },
        USER_ID: 1,
    });
    expect(response.status).toBe(200);
});

test("End to end test", async () => {
    let response = await REQUEST.patch(ROUTE).send({
        param: "username",
        value: "Gauthier",
        USER_ID: 1,
    });
    expect(response.body.message).toBe(ERROR_INVALID_CREDENTIALS);

    response = await REQUEST.post(ROUTE).send({
        user: { ...USER, username: "JohnDoe" },
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: "JohnDoe",
    });
    expect(response.body.result).toHaveLength(1);

    response = await REQUEST.patch(ROUTE).send({
        param: "username",
        value: USER.username,
        USER_ID: 2,
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: "Gauthier",
    });
    expect(response.status).toBe(200);

    response = await REQUEST.delete(ROUTE).send({
        user: USER,
        USER_ID: 2,
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: USER.username,
    });
    expect(response.body.result).toBe("No user found!");

    response = await REQUEST.delete(ROUTE).send({
        user: USER,
        USER_ID: 2,
    });
    expect(response.body.message).toBe(ERROR_INVALID_CREDENTIALS);
});

afterAll(async () => {
    // await database.deleteTable("users");
});
