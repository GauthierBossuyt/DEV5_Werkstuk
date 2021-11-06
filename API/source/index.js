//PACKAGES
const express = require("express");
const bodyParser = require("body-parser");

//GLOBAL VARIABLES
const PORT = process.env.PORT;
const SERVER = express();


//FUNCTIONS
SERVER.use(bodyParser.json());
SERVER.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

SERVER.get("/", function (req, res) {
  res.send("Hello");
});

SERVER.listen(PORT, () => {
  console.log(`SERVER is listening at port ${PORT}`);
});
