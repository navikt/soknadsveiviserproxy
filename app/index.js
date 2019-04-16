const sporringer = require("./src/sporringer");
const express = require("express");
const hummus = require("hummus");
const memoryStreams = require("memory-streams");
const createSanityClient = require("./src/createSanityClient");
const { lagSkjemautlistingJson } = require("./src/lagSkjemautlistingJson");

const app = express();
const sanityClient = createSanityClient();

// Express settings
app.use(express.json({ limit: "1mb", extended: true }));

// Allow access from localhost in development
if (process.env.NODE_ENV !== "production") {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
}

app.get("/soknadsveiviserproxy/allekategorier", (req, res) =>
  sanityClient
    .fetch(sporringer.alleKategorier())
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

app.get("/soknadsveiviserproxy/soknadsobjekt/klage-og-anke", (req, res) =>
  sanityClient
    .fetch(sporringer.soknadsobjektKlageAnke())
    .then(docs => res.send(docs))
    .catch(console.error)
);

app.get("/soknadsveiviserproxy/alleskjemaer", (req, res) => {
  sanityClient
    .fetch(sporringer.alleSkjemaer())
    .then(docs => res.send(docs))
    .catch(console.error);
});

app.post("/soknadsveiviserproxy/merge-pdf", (req, res) => {
  res.setHeader("Content-type", "application/pdf");
  var outStream = new memoryStreams.WritableStream();

  const foersteside = req.body.foersteside;
  const pdfListe = req.body.pdfListe;

  try {
    //let filestream = new hummus.PDFRStreamForFile(req.body.pdfListe[0]);
    var foerstesideBuffer = Buffer.from(foersteside, "base64");

    var firstPDFStream = new hummus.PDFRStreamForBuffer(foerstesideBuffer);
    var secondPDFStream = new hummus.PDFRStreamForBuffer(foerstesideBuffer);

    var pdfWriter = hummus.createWriterToModify(
      firstPDFStream,
      new hummus.PDFStreamForResponse(outStream)
    );
    pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
    pdfWriter.end();
    var newBuffer = outStream.toBuffer();
    outStream.end();

    res.send({ pdf: newBuffer.toString("base64") });
  } catch (e) {
    outStream.end();
    throw new Error("Error during PDF combination: " + e.message);
  }
});

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

app.get("/soknadsveiviserproxy/isAlive", (req, res) => res.sendStatus(200));
app.get("/soknadsveiviserproxy/isReady", (req, res) => res.sendStatus(200));
app.get("/soknadsveiviserproxy", (req, res) => res.sendStatus(200));
app.listen(8080, () => console.log(`App listening on port: 8080`));
