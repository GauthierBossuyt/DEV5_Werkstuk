const { default: knex } = require("knex");
const { Validation } = require("./validation");
const pg = require("knex")({
    client: "pg",
    connection: process.env.POSTGRES_CONNECTION,
    searchPath: ["knex", "public"],
});
const VALIDATION = new Validation();

class Database {
    constructor() {}

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
                table.increments("USER_ID");
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
        let result = await pg("users")
            .where("USER_ID", userID)
            .update(param, value);
        return result == 0 ? false : true;
    }
}

module.exports = { Database };