const APP = require("../source/server.js");
const SUPERTEST = require("supertest");
const { database } = require("../source/database.js");
const DATABASE = database;
const REQUEST = SUPERTEST(APP);
const ROUTE = "/users";
const USER = {
    username: "Gauthier",
    password: "@userPass0",
    email: "user@user.be",
    spotifyID: "ABCDEFGHIKJLMO",
};
const SONG = { title: "Lost My Mind", artist: "Alison Wonderland" };
const ERROR_INSUFFICIENT_CREDENTIALS = "All credentials must be given!";
const ERROR_INVALID_CREDENTIALS = "The given credentials are invalid!";

beforeAll(async () => {
    let doesSongsTableExist = await DATABASE.doesTableExist("songs");
    let doesUsersTableExist = await DATABASE.doesTableExist("users");
    let doesUserSongTableExist = await DATABASE.doesTableExist("user_song");

    doesUserSongTableExist
        ? await DATABASE.truncateTable("user_song")
        : await DATABASE.createUserSongTable();

    doesSongsTableExist
        ? await DATABASE.truncateTable("songs")
        : await DATABASE.createSongsTable();

    doesUsersTableExist
        ? await DATABASE.truncateTable("users")
        : await DATABASE.createUserTable();
});

test("End to end test", async () => {
    let response = await REQUEST.patch(ROUTE).send({
        param: "username",
        value: "Gauthier",
        USER_ID: 1,
    });
    expect(response.body.message).toBe(ERROR_INVALID_CREDENTIALS);

    resp = await REQUEST.get("/userSongs").send({ USER_ID: 1 });
    expect(resp.body.songs).toHaveLength(0);

    response = await REQUEST.get("/songs");
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);

    response = await REQUEST.post("/songs").send({ song: SONG });
    expect(response.status).toBe(200);

    resp = await REQUEST.patch("/songs").send({
        SONG_ID: 1,
        param: "artist",
        value: "Dillon Francis",
    });
    expect(resp.status).toBe(200);

    response = await REQUEST.post(ROUTE).send({
        user: { ...USER, username: "JohnDoe" },
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: "JohnDoe",
    });
    expect(response.body.result).toHaveLength(1);

    response = await REQUEST.get("/songs").send({
        param: "artist",
        value: "Dillon Francis",
    });
    expect(response.body.response).toHaveLength(1);

    response = await REQUEST.post("/addSong").send({
        USER_ID: 1,
        SONG_ID: 1,
    });
    expect(response.status).toBe(200);

    resp = await REQUEST.get("/userSongs").send({ USER_ID: 1 });
    expect(resp.body.songs).toHaveLength(1);

    resp = await REQUEST.get("/songUsers").send({ SONG_ID: 1 });
    expect(resp.body.users).toHaveLength(1);

    resp = await REQUEST.delete("/songs").send({
        song: { ...SONG, artist: "Dillon Francis" },
        SONG_ID: 1,
    });
    expect(resp.status).toBe(200);

    response = await REQUEST.patch(ROUTE).send({
        param: "username",
        value: USER.username,
        USER_ID: 1,
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: "Gauthier",
    });
    expect(response.status).toBe(200);

    resp = await REQUEST.patch("/songs").send({
        SONG_ID: 1,
        param: "title",
        value: "Phone Died",
    });
    expect(resp.status).toBe(400);

    response = await REQUEST.delete(ROUTE).send({
        user: USER,
        USER_ID: 1,
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "username",
        value: USER.username,
    });
    expect(response.body.result).toBe("No user found!");

    response = await REQUEST.delete(ROUTE).send({
        user: USER,
        USER_ID: 1,
    });
    expect(response.body.message).toBe(ERROR_INVALID_CREDENTIALS);

    response = await REQUEST.get("/songs").send({
        param: "artist",
        value: "Dillon Francis",
    });
    expect(response.status).toBe(404);

    resp = await REQUEST.get("/songUsers").send({ SONG_ID: 1 });
    expect(resp.body.users).toHaveLength(0);
});

afterAll(async () => {
    await DATABASE.truncateTable("songs");
    await DATABASE.truncateTable("users");
    await DATABASE.truncateTable("user_song");
});
