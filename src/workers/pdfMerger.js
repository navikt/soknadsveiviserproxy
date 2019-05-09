const { parentPort, threadId } = require("worker_threads");
const hummus = require("hummus");
const memoryStreams = require("memory-streams");
const request = require("request-promise");
const { appendPDFPageFromPDFWithAnnotations } = require("../utils/pdf");

parentPort.on("message", async data => {
  const foersteside = data.foersteside;
  const pdfListe = data.pdfListe;
  const outStream = new memoryStreams.WritableStream();

  try {
    const foerstesideBuffer = Buffer.from(foersteside, "base64");
    const foerstesideStream = new hummus.PDFRStreamForBuffer(foerstesideBuffer);

    // Download external pdfs from urls
    const pdfBuffers = await Promise.all(
      pdfListe.map(pdfUrl =>
        request.get({ url: pdfUrl, encoding: null }).then(res => res)
      )
    );

    // Initiate pdf writer with frontpage
    const pdfWriter = hummus.createWriterToModify(
      foerstesideStream,
      new hummus.PDFStreamForResponse(outStream)
    );

    // Merge each pdf
    pdfBuffers.forEach(pdfBuffer => {
      const pdfStream = new hummus.PDFRStreamForBuffer(pdfBuffer);
      appendPDFPageFromPDFWithAnnotations(pdfWriter, pdfStream);
    });

    pdfWriter.end();
    const newBuffer = outStream.toBuffer();
    outStream.end();

    parentPort.postMessage({ pdf: newBuffer.toString("base64") });
    parentPort.close();
  } catch (e) {
    outStream.end();
    parentPort.postMessage({ error: e });
    parentPort.close();
  }
});
