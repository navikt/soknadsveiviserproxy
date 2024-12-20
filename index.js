const dotenv = require("dotenv");
dotenv.config();

const sporringer = require("./src/sporringer");
const express = require("express");
const createSanityClient = require("./src/utils/createSanityClient");
const {
  lagSoknadsobjekterListe,
} = require("./src/adminrapporter/lagSoknadsobjekterListe");
const {
  lagSkjemaogVedleggsliste,
} = require("./src/adminrapporter/lagSkjemaogVedleggsliste");
const { lagSkjemautlistingJson } = require("./src/lagSkjemautlistingJson");
const {
  hentOgReturnerSkjemaerTilNavet,
} = require("./src/utils/hentOgReturnerSkjemaerTilNavet");
const app = express();
const sanityClient = createSanityClient();
const isProdGcp = process.env.NAIS_CLUSTER_NAME === "prod-gcp";
const allowedOrigin = isProdGcp ? "(http|https)://(.*).nav.no" : ".*";

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
    .then((docs) => res.send(docs))
    .catch(console.error)
);

app.get("/soknadsveiviserproxy/alleskjemaer", (req, res) => {
  hentOgReturnerSkjemaerTilNavet().then((docs) => res.send(docs));
});

app.get("/soknadsveiviserproxy/sedskjemaer", (req, res) => {
  sanityClient
    .fetch(sporringer.alleSkjemaer("sedskjema"))
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/soknadsobjekt/klage-og-anke", (req, res) =>
  sanityClient
    .fetch(sporringer.soknadsobjektKlageAnke())
    .then((docs) => res.send(docs))
    .catch(console.error)
);

app.get("/soknadsveiviserproxy/soknadsobjekter-og-soknadslenker", (req, res) =>
  sanityClient
    .fetch(sporringer.soknader(req.query.kategori, req.query.underkategori))
    .then((docs) => {
      if (docs !== []) {
        res.send({
          soknadsobjekter: docs[0].underkategorier.soknadsobjekter || [],
          soknadslenker: docs[0].underkategorier.soknadslenker || [],
          skjemalenker: docs[0].underkategorier.skjemalenker || [],
        });
      } else res.send(docs);
    })
    .catch((error) => {
      console.error(
        "Feil ved henting av søknadsobjektene med kategori: %s og underkategori: %s, melding: %s",
        req.query.kategori,
        req.query.underkategori,
        error
      );
      res.send({ soknadsobjekter: [], soknadslenker: [] });
    })
);

app.get("/soknadsveiviserproxy/samlet", (req, res) => {
  sanityClient
    .fetch(sporringer.samlet())
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/skjemautlisting", (req, res) => {
  sanityClient
    .fetch(sporringer.alleSoknadsobjekter())
    .then(lagSkjemautlistingJson)
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/utlisting/soknadsobjekter", (req, res) => {
  lagSoknadsobjekterListe().then((docs) => res.send(docs));
});

app.get("/soknadsveiviserproxy/utlisting/skjemaerogvedlegg", (req, res) => {
  lagSkjemaogVedleggsliste().then((docs) => res.send(docs));
});

app.get("/soknadsveiviserproxy/skjemafil", (req, res) => {
  sanityClient
    .fetch(sporringer.fil(req.query.skjemanummer, req.query.locale))
    .then((docs) => res.send(docs))
    .catch(console.error);
});

app.get("/soknadsveiviserproxy/internal/isAlive", (req, res) =>
  res.sendStatus(200)
);
app.get("/soknadsveiviserproxy/internal/isReady", (req, res) =>
  res.sendStatus(200)
);
app.get("/soknadsveiviserproxy", (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
