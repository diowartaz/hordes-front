// app.use(cors()); // process.env.URL
// app.use(express.json());
// app.use(bodyParser.json());
// var cors = require("cors");
// const bodyParser = require("body-parser");

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/dist/website2"));

app.get("/*", function (req, res) {
  console.log("url", path.join(__dirname + "dist/website2/index.html"))
  res.sendFile(path.join(__dirname + "dist/website2/index.html"));
});

app.listen(process.env.PORT || 3000);
