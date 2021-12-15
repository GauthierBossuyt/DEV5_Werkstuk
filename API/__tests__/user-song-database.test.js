const { database } = require("../source/database.js");
const DATABASE = database;
const SONG = { title: "Lost My Mind", artist: "Alison Wonderland" };
const USER = {
    username: "Gauthier",
    password: "@James07",
    email: "gauthier.bossuyt@student.ehb.be",
    spotifyID: "ABCDEFGHIJKLM",
};

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

test("Testing initializing adding a user and a song to the DATABASEs", async () => {
    expect(await DATABASE.addSong(SONG)).toBeTruthy();
    expect(await DATABASE.addUser(USER)).toBeTruthy();
});

test("Test connecting a song to a user in the pivot table", async () => {
    expect(await DATABASE.addSongToUser(1, 1)).toBeTruthy();
    expect(await DATABASE.addSongToUser(1, 1)).toBeFalsy();
    expect(await DATABASE.addSongToUser(5, 4)).toBeFalsy();
});

afterAll(async () => {
    await DATABASE.truncateTable("user_song");
    await DATABASE.truncateTable("songs");
    await DATABASE.truncateTable("users");
});
