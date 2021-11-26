//PACKAGES
const express = require("express");
const bodyParser = require("body-parser");
const { Database } = require("./database");
const DATABASE = new Database();

//GLOBAL VARIABLES
const PORT = process.env.PORT | 3000;
const SERVER = express();
const USER_ROUTER = express.Router();
DATABASE.createUserTable();
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
            let result = await DATABASE.getUser(req.body.param, req.body.value);
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
                await DATABASE.updateUser(
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
            if (await DATABASE.deleteUser(req.body.user, req.body.USER_ID)) {
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
            if (await DATABASE.addUser(req.body.user)) {
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

SERVER.use("/users", USER_ROUTER);

SERVER.get("/", async (req, res) => {
    res.send("hello");
});

SERVER.listen(PORT, async () => {});

module.exports = SERVER;
