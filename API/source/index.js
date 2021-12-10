//PACKAGES
const express = require("express");
const bodyParser = require("body-parser");
const SERVER = require("./server.js");

const { database } = require("./database.js");

async function initialise() {
    await database.createUserTable();
    console.log("test");
}
initialise();
//GLOBAL VARIABLES
const PORT = process.env.PORT | 3000;

SERVER.listen(PORT, () => {
    console.log("running");
});
