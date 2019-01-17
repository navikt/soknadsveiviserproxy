const express = require('express');
const sanityClient = require('@sanity/client');
const fs = require('file-system');

const app = express();
app.get('/isAlive', (req, res) =>
    res.sendStatus(200));

app.get('/isReady', (req, res) =>
    res.sendStatus(200));

app.get('/', (req, res) => {
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

    const skjemaQuery = `*[_type == "skjema" && ` +
        `!(_id in path("drafts.**"))]{emneord, malgruppe, skjemanummer,` +
        `tema, "navn": navn.nb, "pdf": pdf.nb}`;

    client.fetch(skjemaQuery).then((docs) => {
        res.sendStatus(200);
    }).catch((error) => console.log(error));
});

app.listen(8080, () => {
    console.log(`App listening on port: 8080`);
});
