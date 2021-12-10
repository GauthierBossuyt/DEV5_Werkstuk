const { database } = require("../source/database");
const DATABASE = database;

const USER = {
    username: "Gauthier",
    password: "@James07",
    email: "gauthier.bossuyt@student.ehb.be",
    spotifyID: "ABCDEFGHIJKLM",
};

beforeAll(async () => {
    let test = await database.doesTableExist("users");
    if (test) {
        await database.truncateTable("users");
    } else {
        await database.createUserTable("users");
    }
});

test("Helper function to test adding an user to the users table", async () => {
    expect(await DATABASE.addUser(USER)).toBeTruthy();
    expect(await DATABASE.addUser(USER)).toBeFalsy();
    expect(await DATABASE.addUser({ ...USER, username: "abc" })).toBeFalsy();
});

test("Helper function to test deleting an user from the users table", async () => {
    expect(await DATABASE.deleteUser(USER, 1)).toBeTruthy();
    expect(await DATABASE.deleteUser(USER, 1)).toBeFalsy();
    expect(await DATABASE.deleteUser(USER, 1)).toBeFalsy();
});

test("Helper function to test receiving an user from the users table", async () => {
    await DATABASE.addUser({ ...USER, username: "Tiboo" });
    await DATABASE.addUser({ ...USER, email: "Tibo@ehb.be" });
    expect(await DATABASE.getUser("username", "Tiboo")).toHaveLength(1);
    expect(await DATABASE.getUser("password", "@James07")).toHaveLength(2);
    expect(await DATABASE.getUser("email", "Tibo@ehb.be")).toHaveLength(1);
    expect(await DATABASE.getUser("USER_ID", 10)).toMatch("No user found!");
});

test("Helper function to test updating an user from the users table", async () => {
    expect(await DATABASE.updateUser(2, "username", "Gauthier")).toBeTruthy();
    expect(await DATABASE.updateUser(2, "username", "Bossuyt")).toBeTruthy();
    expect(await DATABASE.updateUser(2, "password", "password")).toBeFalsy();
    expect(await DATABASE.updateUser(2, "password", "0Userp@ss")).toBeTruthy();
    expect(
        await DATABASE.updateUser(2, "email", "highHorse@ehb.be")
    ).toBeTruthy();
    expect(await DATABASE.updateUser(2, "email", "highHorse")).toBeFalsy();
    expect(await DATABASE.updateUser(2, "spotifyID", "ZYXWVURTS")).toBeTruthy();
});

afterAll(async () => {
    await DATABASE.truncateTable("users");
});
