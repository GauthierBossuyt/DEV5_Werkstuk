const APP = require("../source/server.js");
const SUPERTEST = require("supertest");
const { database } = require("../source/database.js");
const REQUEST = SUPERTEST(APP);
const SONG = { title: "Lost My Mind", artist: "Alison Wonderland" };
const USER = {
    username: "Gauthier",
    password: "@userPass0",
    email: "user@user.be",
    spotifyID: "ABCDEFGHIKJLMO",
};

beforeAll(async () => {
    let doesSongsTableExist = await database.doesTableExist("songs");
    let doesUsersTableExist = await database.doesTableExist("users");
    let doesUserSongTableExist = await database.doesTableExist("user_song");

    doesUserSongTableExist
        ? await database.truncateTable("user_song")
        : await database.createUserSongTable();

    doesSongsTableExist
        ? await database.truncateTable("songs")
        : await database.createSongsTable();

    doesUsersTableExist
        ? await database.truncateTable("users")
        : await database.createUserTable();
});

test("Testing initializing adding users and songs to the databases through routes", async () => {
    let response = await REQUEST.post("/users").send({
        user: USER,
    });
    expect(response.status).toBe(200);
    response = await REQUEST.post("/users").send({
        user: {
            ...USER,
            username: "JohnDoe",
        },
    });
    expect(response.status).toBe(200);

    respons = await REQUEST.post("/songs").send({ song: SONG });
    expect(response.status).toBe(200);

    respons = await REQUEST.post("/songs").send({
        song: { ...SONG, artist: "Dillon Francis" },
    });
    expect(response.status).toBe(200);
});

test("Test adding a song to an user", async () => {
    let response = await REQUEST.post("/addSong").send({
        USER_ID: 1,
        SONG_ID: 1,
    });
    expect(response.status).toBe(200);
    response = await REQUEST.post("/addSong").send({
        USER_ID: 1,
        SONG_ID: 1,
    });
    expect(response.status).toBe(404);
    response = await REQUEST.post("/addSong").send({
        USER_ID: 1,
        SONG_ID: 2,
    });
    expect(response.status).toBe(200);
    response = await REQUEST.post("/addSong").send({
        USER_ID: 2,
        SONG_ID: 1,
    });
    expect(response.status).toBe(200);
    response = await REQUEST.post("/addSong").send({
        USER_ID: 4,
        SONG_ID: 5,
    });
    expect(response.status).toBe(404);
    response = await REQUEST.post("/addSong").send({});
    expect(response.status).toBe(400);
});

test("Test get all songs connected to a user", async () => {
    let resp = await REQUEST.get("/userSongs").send({ USER_ID: 1 });
    expect(resp.body.songs).toHaveLength(2);
    resp = await REQUEST.get("/userSongs").send({ USER_ID: 2 });
    expect(resp.body.songs).toHaveLength(1);
    resp = await REQUEST.get("/userSongs").send({ USER_ID: 4 });
    expect(resp.body.songs).toHaveLength(0);
});

test("Test get all users connected to a song", async () => {
    let resp = await REQUEST.get("/songUsers").send({ SONG_ID: 1 });
    expect(resp.body.users).toHaveLength(2);
    resp = await REQUEST.get("/songUsers").send({ SONG_ID: 2 });
    expect(resp.body.users).toHaveLength(1);
    resp = await REQUEST.get("/songUsers").send({ SONG_ID: 4 });
    expect(resp.body.users).toHaveLength(0);
});

afterAll(async () => {
    await database.truncateTable("songs");
    await database.truncateTable("users");
    await database.truncateTable("user_song");
});
