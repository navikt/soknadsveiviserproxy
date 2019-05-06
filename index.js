const sporringer = require("./src/sporringer");
const express = require("express");
const { Worker } = require("worker_threads");
const createSanityClient = require("./src/createSanityClient");
const {
  lagSoknadsobjekterListe
} = require("./src/adminrapporter/lagSoknadsobjekterListe");
const {
  lagSkjemautlistingJson,
  hentUrlTilPDFEllerTomString
} = require("./src/lagSkjemautlistingJson");
const app = express();
const sanityClient = createSanityClient();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigin = isProduction
  ? `(http|https)://(.*).nav.no`
  : `http://localhost:3000`;

// Express settings
app.use(express.json({ limit: "1mb", extended: true }));
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && origin.match(allowedOrigin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  }
  next();
});

app.get("/soknadsveiviserproxy/allekategorier", (req, res) =>
  sanityClient
    .fetch(sporringer.alleKategorier())
    .then(docs => res.send(docs))
    .catch(console.error)
);

app.get("/soknadsveiviserproxy/alleskjemaer", (req, res) => {
  sanityClient
    .fetch(sporringer.alleSkjemaer())
    .then(docs => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/soknadsobjekt/klage-og-anke", (req, res) =>
  sanityClient
    .fetch(sporringer.soknadsobjektKlageAnke())
    .then(docs => res.send(docs))
    .catch(console.error)
);

app.get("/soknadsveiviserproxy/soknadsobjekter-og-soknadslenker", (req, res) =>
  sanityClient
    .fetch(sporringer.soknader(req.query.kategori, req.query.underkategori))
    .then(docs =>
      res.send({
        soknadsobjekter: docs[0].underkategorier.soknadsobjekter || [],
        soknadslenker: docs[0].underkategorier.soknadslenker || []
      })
    )
    .catch(console.error)
);

app.get("/soknadsveiviserproxy/samlet", (req, res) => {
  sanityClient
    .fetch(sporringer.samlet())
    .then(docs => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/skjemautlisting", (req, res) => {
  sanityClient
    .fetch(sporringer.alleSoknadsobjekter())
    .then(lagSkjemautlistingJson)
    .then(docs => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/utlisting/soknadsobjekter", (req, res) => {
  lagSoknadsobjekterListe(
    sporringer.alleSoknadsobjekter(),
    sporringer.alleKategorierOgUnderkategorier()
  ).then(docs => res.send(docs));
});

app.post("/soknadsveiviserproxy/merge-pdf", async (req, res) => {
  const foersteside = req.body.foersteside;
  const pdfListe = req.body.pdfListe;
  const worker = new Worker("./src/workers/pdfMerger.js");
  worker.postMessage({ foersteside, pdfListe });
  worker.once("message", mergedPDF => res.send(mergedPDF));
});

app.get("/soknadsveiviserproxy/isAlive", (req, res) => res.sendStatus(200));
app.get("/soknadsveiviserproxy/isReady", (req, res) => res.sendStatus(200));
app.get("/soknadsveiviserproxy", (req, res) => res.sendStatus(200));
app.listen(8080, () => console.log(`App listening on port: 8080`));
