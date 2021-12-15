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
    expect(
        await DATABASE.addSong({ ...SONG, title: "Love U Hate U" })
    ).toBeTruthy();
    expect(
        await DATABASE.addSong({
            title: "Still not butter",
            artist: "Dillon Francis",
        })
    ).toBeTruthy();
    expect(await DATABASE.addUser(USER)).toBeTruthy();
    expect(await DATABASE.addUser({ ...USER, username: "Hatsheput" }));
});

test("Test connecting a song to a user in the pivot table", async () => {
    expect(await DATABASE.addSongToUser(1, 1)).toBeTruthy();
    expect(await DATABASE.addSongToUser(1, 2)).toBeTruthy();
    expect(await DATABASE.addSongToUser(1, 3)).toBeTruthy();
    expect(await DATABASE.addSongToUser(2, 1)).toBeTruthy();

    expect(await DATABASE.addSongToUser(1, 1)).toBeFalsy();
    expect(await DATABASE.addSongToUser(4, 5)).toBeFalsy();
});

test("Test getting all songs connected to a user", async () => {
    expect(await DATABASE.getAllSongsFromUser(1)).toHaveLength(3);
    expect(await DATABASE.getAllSongsFromUser(4)).toBeFalsy();
});

test("Test getting all users connected to a song", async () => {
    expect(await DATABASE.getAllUsersFromSong(1)).toHaveLength(2);
    expect(await DATABASE.getAllUsersFromSong(4)).toBeFalsy();
});

test("Test deleting song or user deletes connection in database", async () => {
    expect(await DATABASE.deleteUser(USER, 1)).toBeTruthy();
    expect(await DATABASE.getAllSongsFromUser(1)).toBeFalsy();
    expect(await DATABASE.getAllUsersFromSong(1)).toHaveLength(1);
    expect(await DATABASE.deleteSong(SONG, 1)).toBeTruthy();
    expect(await DATABASE.getAllUsersFromSong(1)).toBeFalsy();
    expect(await DATABASE.getAllSongsFromUser(2)).toBeFalsy();
});

afterAll(async () => {
    await DATABASE.truncateTable("songs");
    await DATABASE.truncateTable("users");
    await DATABASE.truncateTable("user_song");
});
