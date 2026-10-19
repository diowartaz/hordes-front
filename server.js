const express = require('express');
const path = require('path');

const app = express();
const root = path.join(__dirname, 'dist/website2/browser');

// Les fichiers générés ont un hash dans leur nom : on peut les mettre en cache longtemps.
// index.html doit toujours être revalidé pour récupérer les nouveaux hash après un déploiement.
app.use(
  express.static(root, {
    index: false,
    setHeaders(res, filePath) {
      // ex. main-HL7OH2PL.js, styles-2DCTA7SW.css
      if (/-[0-9A-Za-z_]{8}\.(js|css)$/.test(path.basename(filePath))) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

// Fallback SPA : toutes les autres routes renvoient index.html (syntaxe Express 5)
app.get('/{*splat}', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(root, 'index.html'));
});

app.listen(process.env.PORT || 4000);
