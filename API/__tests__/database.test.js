const { Database } = require("../source/database");
const DATABASE = new Database();
const USER = {
    username: "Gauthier",
    password: "@James07",
    email: "gauthier.bossuyt@student.ehb.be",
    spotifyID: "ABCDEFGHIJKLM",
};

test("Helper function to test the creation and deletion of a table", async () => {
    expect(await DATABASE.doesTableExist("users")).toBeFalsy();
    expect(await DATABASE.createUserTable()).toBeTruthy();
    expect(await DATABASE.doesTableExist("users")).toBeTruthy();
    expect(await DATABASE.createUserTable()).toBeFalsy();
});

test("Helper function to test the deletion of a table", async () => {
    expect(await DATABASE.deleteTable("users")).toBeTruthy();
    expect(await DATABASE.doesTableExist("users")).toBeFalsy();
});

test("Helper function to test adding an user to the users table", async () => {
    await DATABASE.createUserTable();
    expect(await DATABASE.addUser(USER)).toBeTruthy();
    expect(await DATABASE.addUser(USER)).toBeFalsy();
    expect(await DATABASE.addUser({ ...USER, username: "abc" })).toBeFalsy();
    await DATABASE.deleteTable("users");
});

test("Helper function to test deleting an user from the users table", async () => {
    await DATABASE.createUserTable();
    expect(await DATABASE.addUser(USER)).toBeTruthy();
    expect(await DATABASE.deleteUser(USER, 1)).toBeTruthy();
    expect(await DATABASE.deleteUser(USER, 1)).toBeFalsy();
    expect(await DATABASE.deleteUser(USER, 2)).toBeFalsy();
    await DATABASE.deleteTable("users");
});

test("Helper function to test receiving an user from the users table", async () => {
    await DATABASE.createUserTable();
    await DATABASE.addUser({ ...USER, username: "Tiboo" });
    await DATABASE.addUser({ ...USER, email: "Tibo@ehb.be" });
    expect(await DATABASE.getUser("username", "Tiboo")).toHaveLength(1);
    expect(await DATABASE.getUser("password", "@James07")).toHaveLength(2);
    expect(await DATABASE.getUser("email", "Tibo@ehb.be")).toHaveLength(1);
    expect(await DATABASE.getUser("USER_ID", 10)).toMatch("No user found!");
    await DATABASE.deleteTable("users");
});

test("Helper function to test updating an user from the users table", async () => {
    await DATABASE.createUserTable();
    await DATABASE.addUser(USER);
    expect(await DATABASE.updateUser(1, "username", "Gauthier")).toBeTruthy();
    expect(await DATABASE.updateUser(1, "username", "Bossuyt")).toBeTruthy();
    expect(await DATABASE.updateUser(1, "password", "password")).toBeFalsy();
    expect(await DATABASE.updateUser(1, "password", "0Userp@ss")).toBeTruthy();
    expect(
        await DATABASE.updateUser(1, "email", "highHorse@ehb.be")
    ).toBeTruthy();
    expect(await DATABASE.updateUser(1, "email", "highHorse")).toBeFalsy();
    expect(await DATABASE.updateUser(1, "spotifyID", "ZYXWVURTS")).toBeTruthy();
    expect(await DATABASE.updateUser(2, "username", "Bossuyt")).toBeFalsy();
    await DATABASE.deleteTable("users");
});
