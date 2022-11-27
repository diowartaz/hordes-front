const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/dist/website2"));

app.get("/*", function (re, res) {
  res.sendFile(path.join(__dirname + "dist/website2/index.html"));
});

app.listen(process.env.PORT);
