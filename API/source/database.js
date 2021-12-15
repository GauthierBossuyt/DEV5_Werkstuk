const { default: knex } = require("knex");
const { Validation } = require("./validation");
const pg = require("knex")({
    client: "pg",
    connection: process.env.POSTGRES_CONNECTION
        ? process.env.POSTGRES_CONNECTION
        : "pg://user:user@localhost:5432/werkstuk",
    searchPath: ["knex", "public"],
});
const VALIDATION = new Validation();

class Database {
    constructor() {}

    /**
     * Initializes the tables
     */
    async initializeTables() {
        await this.createUserTable();
        await this.createSongsTable();
        await this.createUserSongTable();
    }

    /**
     * Checks if a table exists in the database.
     * @param {string} name of the table.
     * @return {boolean} that indicates if the table exists (TRUE) or doesn't (FALSE).
     */
    async doesTableExist(name) {
        let tableExists = await pg.schema.hasTable(name);
        return tableExists;
    }

    /**
     * Empties table from all content within.
     * @param {string} name of the table.
     * @returns {boolean} that indicates if the table is emptied (TRUE) or not (FALSE).
     */

    async truncateTable(name) {
        let tableExists = await this.doesTableExist(name);
        if (tableExists) {
            await pg(name).truncate();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Deletes a table with the given name if it exists.
     * @param {string} name of the table.
     * @return {boolean} that indicates if the table is deleted (TRUE) or still exists (FALSE).
     */
    async deleteTable(name) {
        await pg.schema.dropTableIfExists(name);
        if (await this.doesTableExist(name)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Creates a users table if there isnt already one
     * @return {boolean} that indicates if the creation of the table was succesful (TRUE) or failed (FALSE)
     */
    async createUserTable() {
        if (!(await this.doesTableExist("users"))) {
            await pg.schema.createTable("users", (table) => {
                table.increments("USER_ID").primary();
                table.string("username");
                table.string("password");
                table.string("email");
                table.string("spotifyID");
            });
            return true;
        } else {
            return false;
        }
    }

    /**
     * Creates the songs table if there isn't one
     * @return {boolean} that indicates if the table has been created or not.
     */
    async createSongsTable() {
        if (!(await this.doesTableExist("songs"))) {
            await pg.schema.createTable("songs", (table) => {
                table.increments("SONG_ID").primary();
                table.string("title");
                table.string("artist");
            });
            return true;
        } else {
            return false;
        }
    }

    /**
     * Creates pivot table between songs and users if there isn't one.
     * @returns {boolean} that indicates if the creation of the table was succesful(TRUE).
     */
    async createUserSongTable() {
        if (!(await this.doesTableExist("user_song"))) {
            await pg.schema.createTable("user_song", (table) => {
                table.increments("ID").primary();
                table.foreign("USER_ID").references("USER_ID").inTable("users");
                table.foreign("SONG_ID").references("SONG_ID").inTable("songs");
            });
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a user already exists
     * @param {object} user containing username, password, email and spotifyID
     * @returns {boolean} that indicates if the user exists (TRUE) or not (FALSE)
     */
    async checkIfUserExists(user) {
        let result = await pg("users")
            .where("username", user.username)
            .andWhere("email", user.email);
        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Inserts a user object into the users table.
     * @param {object} user containing username, password, email and spotifyID.
     * @returns {boolean} that indicates if the insertion was succesful (TRUE) or not (FALSE).
     */
    async addUser(user) {
        if (
            VALIDATION.checkUsername(user.username) &&
            VALIDATION.checkPassword(user.password) &&
            VALIDATION.checkEmail(user.email)
        ) {
            if (!(await this.checkIfUserExists(user))) {
                await pg("users").insert({
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    spotifyID: user.spotifyID,
                });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Deletes an user from the users table.
     * @param {*} user containing at least an username and email.
     * @param {*} userID
     * @returns a boolean to indicate if the deletion was succesful (TRUE) or not (FALSE)
     */
    async deleteUser(user, userID) {
        let result = await pg("users")
            .where("username", user.username)
            .andWhere("email", user.email)
            .andWhere("USER_ID", userID)
            .del();
        if (result > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns an user with the given parameter and value.
     * @param {string} param
     * @param {string} value
     * @returns {array} with all the found users.
     */
    async getUser(param, value) {
        let result = await pg("users").where(param, value);
        return result.length == 0 ? "No user found!" : result;
    }

    /**
     * Updates an user in the users table.
     * @param {integer} userID
     * @param {string} param
     * @param {string} value
     * @returns {boolean} that indicates if the update was succesful (TRUE) or unsuccesful (FALSE)
     */
    async updateUser(userID, param, value) {
        let validation;
        switch (param) {
            case "username":
                validation = VALIDATION.checkUsername(value);
                break;
            case "password":
                validation = VALIDATION.checkPassword(value);
                break;
            case "email":
                validation = VALIDATION.checkEmail(value);
                break;
            case "spotifyID":
                validation = true;
                break;
            default:
                break;
        }
        if (validation) {
            let result = await pg("users")
                .where("USER_ID", userID)
                .update(param, value);
            return result == 0 ? false : true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a song is already in the database
     * @param {Object} song containing a title and an artist
     * @returns {boolean} True if the song already exists and false if it doesn't.
     */
    async checkIfSongExists(song) {
        let result = await pg("songs")
            .where("title", song.title)
            .andWhere("artist", song.artist);
        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * adds a song to the song database.
     * @param {Object} song, which contains a title and an artist (no validation)
     * @returns {boolean} that indicates if adding the song was succesful
     */
    async addSong(song) {
        if (song.title && song.artist) {
            if (!(await this.checkIfSongExists(song))) {
                await pg("songs").insert({
                    title: song.title,
                    artist: song.artist,
                });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * deletes a song from the database.
     * @param {Object} song containing a title and an artist
     * @param {integer} id of the song
     * @return {boolean} that indicates if the deletion was succesful
     */
    async deleteSong(song, id) {
        let result = await pg("songs")
            .where("title", song.title)
            .andWhere("artist", song.artist)
            .andWhere("SONG_ID", id)
            .del();
        if (result > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Searches a song from the database matching the value.
     * @param {string} param key that of the object, which will be used to search with.
     * @param {string} value that the object should contain
     * @returns {array} of objects containing all the results
     */
    async getSong(param, value) {}

    /**
     * Updates a song from the database matching the value and parameter.
     * @param {string} param key of the object.
     * @param {string} value of the change.
     * @param {intiger} id is the id of the targeted object.
     * @returns {boolean} indicating whether the updating was succesful or not.
     */
    async updateSong(id, param, value) {}

    /**
     * Returns all data within a certain table.
     * @param {string} name of table.
     * @returns {array} of all data within the given table.
     */
    async getAllDataFromTable(name) {
        return await pg(name).select("*");
    }
}

const database = new Database();

module.exports = { database };
