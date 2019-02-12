const sporringer = require('./sporringer');

const express = require('express');
const sanityClient = require('@sanity/client');
const fs = require('file-system');

const app = express();

if (process.env.NODE_ENV === 'production') {
    const secretsFilePath = '/var/run/secrets/nais.io/vault';
    const projectIDPath = secretsFilePath + '/sanity.projectID';
    const tokenPath = secretsFilePath + '/sanity.token';

    const projectID = fs.readFileSync(projectIDPath, 'utf8');
    const token = fs.readFileSync(tokenPath, 'utf8');
    const client = sanityClient({ // eslint-disable-line no-unused-vars
        projectId: projectID,
        dataset: 'skjemaveileder',
        token: token,
        useCdn: false,
    });
}

app.get('/soknadsveiviserproxy/isAlive', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/isReady', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/allekategorier', (req, res) => {
    client.fetch(sporringer.alleKategorier(req.query.locale)).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/underkategori', (req, res) => {
    client.fetch(
        sporringer.underkategori(
            req.query.kategori, req.query.underkategori, req.query.locale
        )
    ).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/soknadsobjekt', (req, res) => {
    client.fetch(
        sporringer.soknadsobjektsQuery(
            req.query.kategori, req.query.underkategori
        )
    ).then((docs) => {
        res.send(docs);
    }).catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/alleskjemaer', (req, res) => {
    client.fetch(sporringer.alleskjemaerQuery)
        .then((docs) => {
            res.send(docs);
        })
        .catch((error) => console.log(error));
});

app.get('/soknadsveiviserproxy/samlet', (req, res) => {
    client.fetch(sporringer.samleQuery)
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
