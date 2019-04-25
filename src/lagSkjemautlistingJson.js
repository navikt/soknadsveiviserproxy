const imageUrlBuilder = require("@sanity/image-url");
const createSanityClient = require("./createSanityClient");
const builder = imageUrlBuilder(createSanityClient());

/**
 * Genererer en JSON med alle skjemaer
 * @param {array} alleSoknadsobjekter
 * @return {{Skjemaer: array}}
 */
function lagSkjemautlistingJson(alleSoknadsobjekter) {
  const resultJson = alleSoknadsobjekter
    .filter(soknadsobjekt => soknadsobjekt.hovedskjema.pdf !== undefined)
    .reduce((arrayAvJson, soknadsobjekt) => {
      return arrayAvJson.concat(
        lagSkjemautlistingJsonForSoknadsobjekt(soknadsobjekt)
      );
    }, []);
  return { Skjemaer: resultJson };
}

/**
 * Genererer en url til valgt PDF-objekt gitt et asset-objekt fra sanity
 * @param {Object} asset
 * @return {string}
 */
function pdfUrl(asset) {
  return builder.image(asset).options.source.url;
}

/**
 * Henter url til pdf, eller tom string dersom det ikke finnes noen pdf
 * @param {Object} pdfObjekt
 * @return {string}
 */
function hentUrlTilPDFEllerTomString(pdfObjekt) {
  return pdfObjekt && pdfObjekt.asset ? pdfUrl(pdfObjekt.asset) : "";
}

/**
 * Tar inn et søknadsobjekt og returnerer JSON for de vedleggene som har tilhørende skjema
 * @param {Object} soknadsobjekt
 * @return {JSON[]}
 */
function sjekkOmVedleggHarSkjemaOgReturnerVedleggskjema(soknadsobjekt) {
  return soknadsobjekt.vedleggtilsoknad
    .map(v => v.vedlegg)
    .filter(vedlegg => vedlegg.skjematilvedlegg !== undefined)
    .filter(vedlegg => vedlegg.skjematilvedlegg.pdf !== undefined)
    .reduce((vedleggsskjemaJson, vedlegg) => {
      vedleggsskjemaJson.push(
        lagJSON(
          vedlegg.skjematilvedlegg,
          soknadsobjekt.tema.temakode,
          soknadsobjekt.gosysid,
          vedlegg.vedleggsID
        )
      );
      return vedleggsskjemaJson;
    }, []);
}

/**
 * Tar inn et søknadsobjekt og returnerer JSON for de tilhørende skjemaene
 * @param {Object} soknadsobjekt
 * @return {JSON[]}
 */
function lagSkjemautlistingJsonForSoknadsobjekt(soknadsobjekt) {
  const skjemaJson = lagJSON(
    soknadsobjekt.hovedskjema,
    soknadsobjekt.tema.temakode,
    soknadsobjekt.gosysid,
    ""
  );

  if (soknadsobjekt.vedleggtilsoknad) {
    const vedleggsJSON = sjekkOmVedleggHarSkjemaOgReturnerVedleggskjema(
      soknadsobjekt
    );
    if (vedleggsJSON.length > 0) {
      return vedleggsJSON.concat(skjemaJson);
    }
  }
  return skjemaJson;
}

/**
 * Tar inn et informasjon om et skjema og generer JSON utfra det
 * @param {Object} skjema
 * @param {string} tema
 * @param {string} gosysid
 * @param {string} vedleggsID
 * @return {JSON}
 */
function lagJSON(skjema, tema, gosysid, vedleggsID) {
  return {
    Skjemanummer: skjema.skjemanummer,
    Vedleggsid: vedleggsID,
    Tittel: skjema.navn.nb ? skjema.navn.nb : "",
    Tittel_en: skjema.navn.en ? skjema.navn.en : "",
    Tittel_nn: skjema.navn.nn ? skjema.navn.nn : "",
    Tema: tema,
    Gosysid: "000000", //Tester å sette denne til 00000
    "Beskrivelse (ID)": "000000",
    Lenke: hentUrlTilPDFEllerTomString(skjema.pdf.nb),
    "Lenke engelsk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.en),
    "Lenke nynorsk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.nn),
    "Lenke polsk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.pl),
    "Lenke fransk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.fr),
    "Lenke spansk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.es),
    "Lenke tysk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.de),
    "Lenke samisk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.se)
  };
}

module.exports = {
  hentUrlTilPDFEllerTomString,
  lagSkjemautlistingJson,
  lagJSON
};
