const sporringer = require('./sporringer');
const express = require('express');
const createSanityClient = require('./createSanityClient');

const app = express();
const sanityClient = createSanityClient();

app.get('/soknadsveiviserproxy/isAlive', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/isReady', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/allekategorier', (req, res) => {
    sanityClient.fetch(sporringer.alleKategorier()).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/underkategori', (req, res) => {
    sanityClient.fetch(
        sporringer.underkategori(req.query.kategori, req.query.underkategori)
    ).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/soknadsobjekt', (req, res) => {
    sanityClient.fetch(
        sporringer.soknadsobjektsQuery(
            req.query.kategori, req.query.underkategori
        )
    ).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/alleskjemaer', (req, res) => {
    sanityClient.fetch(sporringer.alleskjemaerQuery())
        .then((docs) => {
            res.send(docs);
        })
        .catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/samlet', (req, res) => {
    sanityClient.fetch(sporringer.samleQuery())
        .then((docs) => {
            res.send(docs);
        })
        .catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy', (req, res) =>
    res.sendStatus(200));

app.listen(8080, () => {
    console.log(`App listening on port: 8080`);
});
