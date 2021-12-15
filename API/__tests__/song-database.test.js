const { database } = require("../source/database.js");
const DATABASE = database;
const SONG = { title: "Lost My Mind", artist: "Alison Wonderland" };

beforeAll(async () => {
    let test = await database.doesTableExist("songs");
    if (test) {
        await database.truncateTable("songs");
    } else {
        await database.createUserTable("songs");
    }
});

test("Test adding a song to the songs database", async () => {
    expect(await DATABASE.addSong(SONG)).toBeTruthy();
    expect(await DATABASE.addSong(SONG)).toBeFalsy();
    expect(
        await DATABASE.addSong({ ...SONG, title: "Fuck U Love U" })
    ).toBeTruthy();
    expect(
        await DATABASE.addSong({ ...SONG, artist: "Dillon Francis" })
    ).toBeTruthy();
});

test("Test deleting a song from the songs database", async () => {
    await DATABASE.addSong({ ...SONG, title: "W.W.C.B.D." });
    expect(
        await DATABASE.deleteSong({ ...SONG, title: "W.W.C.B.D." }, 4)
    ).toBeTruthy();
    expect(
        await DATABASE.deleteSong({ ...SONG, title: "W.W.C.B.D." }, 4)
    ).toBeFalsy();
    expect(await DATABASE.deleteSong(SONG, 10)).toBeFalsy();
});

test("Test getting a song from the songs database", async () => {
    expect(await DATABASE.getSong("title", "Fuck U Love U")).toHaveLength(1);
    expect(await DATABASE.getSong("artist", "Dillon Francis")).toHaveLength(1);
    expect(await DATABASE.getSong("artist", "Jauz")).toMatch("Song not found!");
    expect(await DATABASE.getSong("title", "Stars Tonight")).toMatch(
        "Song not found!"
    );
});

test("Test updating a song from the songs database", async () => {
    expect(await DATABASE.updateSong(3, "title", "Coming Over")).toBeTruthy();
    expect(
        await DATABASE.updateSong(1, "artist", "Dillon Francis")
    ).toBeTruthy();
    expect(await DATABASE.updateSong(1, "title", "Coming Over")).toBeFalsy();
    expect(await DATABASE.updateSong(20, "title", "Baby Shark"));
});

afterAll(async () => {
    await database.truncateTable("songs");
});
