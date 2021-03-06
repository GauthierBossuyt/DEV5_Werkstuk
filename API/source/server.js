//PACKAGES
const express = require("express");
const bodyParser = require("body-parser");
const { database } = require("./database.js");

//GLOBAL VARIABLES
const SERVER = express();
const USER_ROUTER = express.Router();
const SONG_ROUTER = express.Router();

//FUNCTIONS
SERVER.use(bodyParser.json());
SERVER.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//ROUTES
USER_ROUTER.route("/")

    /**
     * GET /users
     * @param {string} param : the parameter used to search a user.
     * @param {string} value : the value to search users on.
     * @return {json} containing the status and a message.
     */
    .get(async (req, res) => {
        if (req.body.param && req.body.value) {
            let result = await database.getUser(req.body.param, req.body.value);
            res.status(200).send({ status: 200, result: result });
        } else {
            res.status(400).send({
                status: 400,
                message: "All credentials must be given!",
            });
        }
    })

    /**
     * PATCH /users
     * @param {string} param : the parameter that should be changed.
     * @param {string} value : the value that the parameter will change to.
     * @param {integer} USER_ID
     * @return {json} containing the status and a message.
     */
    .patch(async (req, res) => {
        if (req.body.param && req.body.value && req.body.USER_ID) {
            if (
                await database.updateUser(
                    req.body.USER_ID,
                    req.body.param,
                    req.body.value
                )
            ) {
                res.status(200).send({
                    status: 200,
                    message: "Successfully updated!",
                });
            } else {
                res.status(400).send({
                    status: 400,
                    message: "The given credentials are invalid!",
                });
            }
        } else {
            res.status(400).send({
                status: 400,
                message: "All credentials must be given!",
            });
        }
    })

    /**
     * DELETE /users
     * @param {object} user : an object containing all user information
     * @param {integer} USER_ID
     * @return {json} containing the status and a message.
     */
    .delete(async (req, res) => {
        if (req.body.user && req.body.USER_ID) {
            if (await database.deleteUser(req.body.user, req.body.USER_ID)) {
                res.status(200).send({
                    status: 200,
                    message: "The user was successfully deleted!",
                });
            } else {
                res.status(400).send({
                    status: 400,
                    message: "The given credentials are invalid!",
                });
            }
        } else {
            res.status(400).send({
                status: 400,
                message: "All credentials must be given!",
            });
        }
    })

    /**
     * POST /users
     * @param {object} user : an object containing all user information
     * @return {json} containing the status and a message.
     */
    .post(async (req, res) => {
        if (req.body.user) {
            if (await database.addUser(req.body.user)) {
                res.status(200).send({
                    status: 200,
                    message: "The user was succesfully saved!",
                });
            } else {
                res.status(400).send({
                    status: 400,
                    message: "The given credentials are invalid!",
                });
            }
        } else {
            res.status(400).send({
                status: 400,
                message: "All credentials must be given!",
            });
        }
    });

SONG_ROUTER.route("/")

    /**
     * DELETE /songs
     * @param {object} song: an object containing a title and an artist
     * @param {integer} SONG_ID: the id of the targeted song
     * @return {status}
     */
    .delete(async (req, res) => {
        if ((req.body.song, req.body.SONG_ID)) {
            if (await database.deleteSong(req.body.song, req.body.SONG_ID)) {
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        } else {
            res.status(400).send({ message: "All credentials must be given!" });
        }
    })

    /**
     * PATCH /songs
     * @param {string} param / parameter for the key that will be changes
     * @param {string} value is the new value
     * @param {integer} SONG_ID is the id of the song that should be changed
     * @return {status}
     */
    .patch(async (req, res) => {
        if (req.body.param && req.body.value && req.body.SONG_ID) {
            if (
                await database.updateSong(
                    req.body.SONG_ID,
                    req.body.param,
                    req.body.value
                )
            ) {
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        } else {
            res.status(400).send({ message: "All credentials must be given!" });
        }
    })

    /**
     * GET /songs
     * @param {string} param a string that is used as the parameter for the search
     * @param {string} value a string that is used as value for the search
     * @return {json} containing an object with the results in an array.
     */
    .get(async (req, res) => {
        if (req.body.param && req.body.value) {
            let result = await database.getSong(req.body.param, req.body.value);
            if (result !== "Song not found!") {
                res.status(200).send({ response: result });
            } else {
                res.status(404).send();
            }
        } else {
            res.status(400).send({ message: "All credentials must be given!" });
        }
    })

    /**
     * POST /songs
     * @param {Object} user : an object containing a title and an artist
     * @returns {status}
     */
    .post(async (req, res) => {
        if (req.body.song) {
            if (await database.addSong(req.body.song)) {
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        } else {
            res.status(400).send({ message: "All credentials must be given!" });
        }
    });

/**
 * Connects a song to an user,
 * @param {integer} USER_ID of the targeted user.
 * @param {integer} SONG_ID of the targeted song.
 * @returns {status}
 */
SERVER.post("/addSong", async (req, res) => {
    if ((req.body.USER_ID, req.body.SONG_ID)) {
        if (await database.addSongToUser(req.body.USER_ID, req.body.SONG_ID)) {
            res.status(200).send();
        } else {
            res.status(404).send();
        }
    } else {
        res.status(400).send({ message: "All the credentials must be given!" });
    }
});

/**
 * Gets all the songs connected to a user.
 * @param {integer} USER_ID of the targeted user.
 * @returns {array} of all the songs linked with the user.
 */
SERVER.get("/userSongs", async (req, res) => {
    if (req.body.USER_ID) {
        let resp = await database.getAllSongsFromUser(req.body.USER_ID);
        if (resp !== false) {
            res.status(200).send({ songs: resp });
        } else {
            res.status(404).send({ songs: [] });
        }
    } else {
        res.status(400).send();
    }
});

/**
 * Gets all the users connected to a song.
 * @param {integer} SONG_ID of the targeted song.
 * @returns {array} of all the users linked with the song.
 */
SERVER.get("/songUsers", async (req, res) => {
    if (req.body.SONG_ID) {
        let resp = await database.getAllUsersFromSong(req.body.SONG_ID);
        if (resp !== false) {
            res.status(200).send({ users: resp });
        } else {
            res.status(404).send({ users: [] });
        }
    } else {
        res.status(400).send();
    }
});

SERVER.use("/users", USER_ROUTER);
SERVER.use("/songs", SONG_ROUTER);

SERVER.get("/", async (req, res) => {
    let users = await database.getAllDataFromTable("users");
    let songs = await database.getAllDataFromTable("songs");
    res.status(200).send({ users: users, songs: songs });
});

module.exports = SERVER;
