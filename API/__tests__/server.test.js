const APP = require("../source/index");
const SUPERTEST = require("supertest");
const REQUEST = SUPERTEST(APP);
const ROUTE = "/users";
const USER = {
    username: "user",
    password: "user",
    email: "user@user.be",
    spotifyID: 1,
};

test("Helper function to test the GET endpoint", async () => {
    let response = await REQUEST.get(ROUTE);
    expect(response.status).toBe(400);
    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: USER.username,
    });
    expect(response.status).toBe(200);
});

test("Helper function to test the POST endpoint", async () => {
    let response = await REQUEST.post(ROUTE);
    expect(response.status).toBe(400);
    response = await REQUEST.post(ROUTE).send({
        user: {
            username: USER.username,
            password: USER.password,
            email: USER.email,
            spotifyID: USER.spotifyID,
        },
    });
    expect(response.status).toBe(200);
});

test("Helper function to test the PATCH endpoint", async () => {
    let response = await REQUEST.patch(ROUTE);
    expect(response.status).toBe(400);
    response = await REQUEST.patch(ROUTE).send({
        param: "email",
        value: USER.username,
        USER_ID: 1,
    });
    expect(response.status).toBe(200);
});

test("Helper function to test the DELETE endpoint", async () => {
    let response = await REQUEST.delete(ROUTE);
    expect(response.status).toBe(400);
    response = await REQUEST.delete(ROUTE).send({
        user: {
            username: USER.username,
            password: USER.password,
            email: USER.email,
            spotifyID: USER.spotifyID,
        },
        USER_ID: 1,
    });
    expect(response.status).toBe(200);
});
