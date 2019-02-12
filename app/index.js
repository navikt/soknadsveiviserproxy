const sporringer = require('./sporringer');

const express = require('express');
const sanityClient = require('@sanity/client');
const fs = require('file-system');

const app = express();

const secretsFilePath = '/var/run/secrets/nais.io/vault';
const projectIDPath = secretsFilePath + '/sanity.projectID';
const tokenPath = secretsFilePath + '/sanity.token';
const datasetPath = secretsFilePath + '/sanity.dataset';

const projectID = fs.readFileSync(projectIDPath, 'utf8');
const token = fs.readFileSync(tokenPath, 'utf8');
const dataset = fs.readFileSync(datasetPath, 'utf8');
const client = sanityClient({
    projectId: projectID,
    dataset: dataset,
    token: token,
    useCdn: false,
});

app.get('/soknadsveiviserproxy/isAlive', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/isReady', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/allekategorier', (req, res) => {
    client.fetch(sporringer.alleKategorier()).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/underkategori', (req, res) => {
    kategori = JSON.stringify(req.query.kategori);
    underkategori = JSON.stringify(req.query.underkategori);
    client.fetch(
        sporringer.underkategori(kategori, underkategori)
    ).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/soknadsobjekt', (req, res) => {
    kategori = JSON.stringify(req.query.kategori);
    underkategori = JSON.stringify(req.query.underkategori);
    client.fetch(
        sporringer.soknadsobjektsQuery(
            req.query.kategori, req.query.underkategori
        )
    ).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/alleskjemaer', (req, res) => {
    client.fetch(sporringer.alleskjemaerQuery())
        .then((docs) => {
            res.send(docs);
        })
        .catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/samlet', (req, res) => {
    client.fetch(sporringer.samleQuery())
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
