const express = require('express');
const path = require('path');

const app = express();
const root = path.join(__dirname, 'dist/website2/browser');

app.use(express.static(root));

app.get('/*', function (req, res) {
  res.sendFile(path.join(root + '/index.html'));
});

app.listen(process.env.PORT || 4000);
