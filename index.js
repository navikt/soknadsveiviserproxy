const express = require('express');

const app = express();

app.get('/soknadsveiviserproxy/isAlive', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy/isReady', (req, res) =>
    res.sendStatus(200));

app.get('/soknadsveiviserproxy', (req, res) =>
    res.sendStatus(200));

app.listen(8080, () => {
    console.log(`App listening on port: 8080`);
});
