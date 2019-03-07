const sporringer = require('./sporringer');
const express = require('express');
const createSanityClient = require('./createSanityClient');

const app = express();
const sanityClient = createSanityClient();

// Allow access from localhost in development
if (process.env.NODE_ENV !== 'production') {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
}

app.get('/soknadsveiviserproxy/isAlive', (req, res) => res.sendStatus(200));
app.get('/soknadsveiviserproxy/isReady', (req, res) => res.sendStatus(200));

app.get('/soknadsveiviserproxy/allekategorier', (req, res) =>
  sanityClient
    .fetch(sporringer.alleKategorier())
    .then((docs) => res.send(docs))
    .catch(console.error)
);

app.get('/soknadsveiviserproxy/soknadsobjekter', (req, res) =>
  sanityClient
    .fetch(
      sporringer.soknadsobjekter(req.query.kategori, req.query.underkategori)
    )
    .then((docs) => res.send(docs[0].underkategorier.soknadsobjekter))
    .catch(console.error)
);

app.get('/soknadsveiviserproxy/soknadsobjekt', (req, res) =>
  sanityClient
    .fetch(
      sporringer.soknadsobjekt(
        req.query.kategori,
        req.query.underkategori,
        decodeURIComponent(req.query.skjemanummer)
      )
    )
    .then((docs) => res.send(docs))
    .catch(console.error)
);

app.get('/soknadsveiviserproxy/alleskjemaer', (req, res) => {
  sanityClient
    .fetch(sporringer.alleSkjemaer())
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get('/soknadsveiviserproxy/samlet', (req, res) => {
  sanityClient
    .fetch(sporringer.samlet())
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get('/soknadsveiviserproxy', (req, res) => res.sendStatus(200));
app.listen(8080, () => console.log(`App listening on port: 8080`));
