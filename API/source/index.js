//PACKAGES
const express = require("express");
const bodyParser = require("body-parser");

//GLOBAL VARIABLES
const PORT = process.env.PORT | 3000;
const SERVER = express();
const USER_ROUTER = express.Router();

//FUNCTIONS
SERVER.use(bodyParser.json());
SERVER.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

USER_ROUTER.route("/")
    .get((req, res) => {
        if (req.body.param && req.body.value) {
            res.status(200).send({ status: 200 });
        } else {
            res.status(400).send({ status: "ERROR 400: BAD REQUEST" });
        }
    })

    .patch((req, res) => {
        if (req.body.param && req.body.value && req.body.USER_ID) {
            res.status(200).send({ status: 200 });
        } else {
            res.status(400).send({ status: "ERROR 400: BAD REQUEST" });
        }
    })

    .delete((req, res) => {
        if (req.body.user && req.body.USER_ID) {
            res.status(200).send({ status: 200 });
        } else {
            res.status(400).send({ status: "ERROR 400: BAD REQUEST" });
        }
    })

    .post((req, res) => {
        if (req.body.user) {
            res.status(200).send({ status: 200 });
        } else {
            res.status(400).send({ status: "ERROR 400: BAD REQUEST" });
        }
    });

SERVER.use("/users", USER_ROUTER);

SERVER.get("/", function (req, res) {
    res.send("Hello World");
});

SERVER.listen(PORT, () => {
    //console.log(`SERVER is listening at port ${PORT}`);
});

module.exports = SERVER;
