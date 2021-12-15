const APP = require("../source/server.js");
const SUPERTEST = require("supertest");
const { database } = require("../source/database.js");
const REQUEST = SUPERTEST(APP);
const ROUTE = "/songs";
const SONG = { title: "Lost My Mind", artist: "Alison Wonderland" };
const ERROR_INSUFFICIENT_CREDENTIALS = "All credentials must be given!";

beforeAll(async () => {
    let test = await database.doesTableExist("songs");
    if (test) {
        await database.truncateTable("songs");
    } else {
        await database.createUserTable("songs");
    }
});

test("POST /songs", async () => {
    let response = await REQUEST.post(ROUTE);
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);

    response = await REQUEST.post(ROUTE).send({ song: SONG });
    expect(response.status).toBe(200);

    response = await REQUEST.post(ROUTE).send({ song: SONG });
    expect(response.status).toBe(400);

    response = await REQUEST.post(ROUTE).send({
        song: { ...SONG, artist: "Dillon Francis" },
    });
    expect(response.status).toBe(200);
});

test("GET /songs", async () => {
    let response = await REQUEST.get(ROUTE);
    expect(response.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);

    response = await REQUEST.get(ROUTE).send({
        param: "title",
        value: SONG.title,
    });
    expect(response.status).toBe(200);

    response = await REQUEST.get(ROUTE).send({
        param: "title",
        value: "Dancing Queen",
    });
    expect(response.status).toBe(404);

    response = await REQUEST.get(ROUTE).send({
        param: "artist",
        value: "Dillon Francis",
    });
    expect(response.body.response).toHaveLength(1);

    response = await REQUEST.get(ROUTE).send({
        param: "artist",
        value: "ABBA",
    });
    expect(response.status).toBe(404);
});

test("PATCH /songs", async () => {
    let resp = await REQUEST.patch(ROUTE);
    expect(resp.body.message).toBe(ERROR_INSUFFICIENT_CREDENTIALS);

    resp = await REQUEST.patch(ROUTE).send({
        SONG_ID: 1,
        param: "artist",
        value: "NGHTMRE",
    });
    expect(resp.status).toBe(200);

    resp = await REQUEST.patch(ROUTE).send({
        SONG_ID: 2,
        param: "artist",
        value: "NGHTMRE",
    });
    expect(resp.status).toBe(400);

    resp = await REQUEST.patch(ROUTE).send({
        SONG_ID: 2,
        param: "title",
        value: "Still not butter",
    });
    expect(resp.status).toBe(200);

    resp = await REQUEST.patch(ROUTE).send({
        SONG_ID: 10,
        param: "title",
        value: "Still not butter",
    });
    expect(resp.status).toBe(400);
});

test("DELETE /songs", async () => {
    let resp = await REQUEST.delete(ROUTE);
    expect(resp.status).toBe(400);

    resp = await REQUEST.delete(ROUTE).send({
        song: { title: "Still not butter", artist: "Dillon Francis" },
        SONG_ID: 2,
    });
    expect(resp.status).toBe(200);

    resp = await REQUEST.delete(ROUTE).send({
        song: SONG,
        SONG_ID: 1,
    });
    expect(resp.status).toBe(400);
});

afterAll(async () => {
    await database.truncateTable("songs");
});
