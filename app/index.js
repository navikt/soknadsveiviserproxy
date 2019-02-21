const sporringer = require('./sporringer');
const express = require('express');
const createSanityClient = require('./createSanityClient');
const lagSkjemautlistingJson = require('./lagSkjemautlistingJson');

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

app.get('/soknadsveiviserproxy/soknadsobjekt', (req, res) =>
  sanityClient
    .fetch(
      sporringer.soknadsobjektsQuery(
        req.query.kategori,
        req.query.underkategori
      )
    )
    .then((docs) => res.send(docs))
    .catch(console.error)
);

app.get('/soknadsveiviserproxy/alleskjemaer', (req, res) => {
  sanityClient
    .fetch(sporringer.alleskjemaerQuery())
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get('/soknadsveiviserproxy/samlet', (req, res) => {
  sanityClient
    .fetch(sporringer.samleQuery())
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get('/soknadsveiviserproxy', (req, res) => res.sendStatus(200));

app.get('/soknadsveiviserproxy/skjemautlisting', (req, res) => {
    sanityClient
        .fetch(sporringer.alleSoknadsobjekterQuery())
        .then(lagSkjemautlistingJson)
        .then((docs) => res.send(docs))
        .catch(console.error);
});

app.listen(8080, () => console.log(`App listening on port: 8080`));
