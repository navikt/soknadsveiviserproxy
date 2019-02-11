const express = require('express');
const sanityClient = require('@sanity/client');
const fs = require('file-system');

const app = express();
app.get('/soknadsveiviserproxy/isAlive', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/isReady', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy', (req, res) => {
    const secretsFilePath = '/var/run/secrets/nais.io/vault';
    const projectIDPath = secretsFilePath + '/sanity.projectID';
    const tokenPath = secretsFilePath + '/sanity.token';

    const projectID = fs.readFileSync(projectIDPath, 'utf8');
    const token = fs.readFileSync(tokenPath, 'utf8');
    const client = sanityClient({
        projectId: projectID,
        dataset: 'skjemaveileder',
        token: token,
        useCdn: false,
    });

    const skjemaQuery = `*[_type == "skjema"]`;

    client.fetch(skjemaQuery).then((docs) => {
        console.log(docs);
    }).catch((error) => console.log(error));
});

app.listen(8080, () => {
    console.log(`App listening on port: 8080`);
});
