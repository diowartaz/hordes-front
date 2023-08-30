const express = require("express");
const path = require("path");
const fallback = require("express-history-api-fallback");

const app = express();
const root = `${__dirname}/dist/website2`;

app.use(express.static(root));
app.use(fallback("index.html", { root }));

app.get("/*", function (req, res) {
  res.sendFile(path.join(root + "/index.html"));
});

app.listen(process.env.PORT || 4000);
