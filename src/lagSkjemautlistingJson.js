const imageUrlBuilder = require("@sanity/image-url");
const createSanityClient = require("./utils/createSanityClient");
const builder = imageUrlBuilder(createSanityClient());

/**
 * Genererer en JSON med alle skjemaer
 * @param {array} alleSoknadsobjekter
 * @return {{Skjemaer: array}}
 */
function lagSkjemautlistingJson(alleSoknadsobjekter) {
  const jsonMedDuplikater = alleSoknadsobjekter
    .filter((soknadsobjekt) => soknadsobjekt.hovedskjema.pdf !== undefined)
    .reduce((arrayAvJson, soknadsobjekt) => {
      return arrayAvJson.concat(
        lagSkjemautlistingJsonForSoknadsobjekt(soknadsobjekt)
      );
    }, []);
  return { Skjemaer: filtrerJsonOgFjernDuplikater(jsonMedDuplikater) };
}

/**
 * Genererer en url til valgt PDF-objekt gitt et asset-objekt fra sanity
 * @param {Object} asset
 * @return {string}
 */
function pdfUrl(asset) {
  return builder.image(asset).options.source.url || "";
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
    .map((v) => v.vedlegg)
    .reduce((vedleggsskjemaJson, vedlegg) => {
      vedlegg.skjematilvedlegg && vedlegg.skjematilvedlegg.pdf
        ? vedleggsskjemaJson.push(
            lagJSONForSkjema(
              vedlegg.skjematilvedlegg,
              soknadsobjekt.tema.temakode,
              vedlegg.gosysid,
              vedlegg.vedleggsid
            )
          )
        : vedleggsskjemaJson.push(
            lagJSONForVedleggUtenSkjema(vedlegg, soknadsobjekt.tema.temakode)
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
  const skjemaJson = lagJSONForSkjema(
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
function lagJSONForSkjema(skjema, tema, gosysid, vedleggsID) {
  return {
    Skjemanummer: skjema.skjemanummer,
    Vedleggsid: vedleggsID || "",
    Tittel: skjema.navn ? skjema.navn.nb || "" : "",
    Tittel_en: skjema.navn ? skjema.navn.en || "" : "",
    Tittel_nn: skjema.navn ? skjema.navn.nn || "" : "",
    Tema: tema,
    Gosysid: gosysid,
    "Beskrivelse (ID)": "000000",
    Lenke: hentUrlTilPDFEllerTomString(skjema.pdf.nb),
    "Lenke engelsk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.en),
    "Lenke nynorsk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.nn),
    "Lenke polsk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.pl),
    "Lenke fransk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.fr),
    "Lenke spansk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.es),
    "Lenke tysk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.de),
    "Lenke samisk skjema": hentUrlTilPDFEllerTomString(skjema.pdf.se),
  };
}

function lagJSONForVedleggUtenSkjema(vedlegg, tema) {
  return {
    Skjemanummer: vedlegg.vedleggsid || "",
    Tittel: vedlegg.navn ? vedlegg.navn.nb || "" : "",
    Tittel_en: vedlegg.navn ? vedlegg.navn.en || "" : "",
    Tittel_nn: vedlegg.navn ? vedlegg.navn.nn || "" : "",
    Tema: tema,
    Gosysid: vedlegg.gosysid,
    "Beskrivelse (ID)": "000000",
  };
}

function filtrerJsonOgFjernDuplikater(jsonMedDuplikater) {
  const endeligJsonUtenDuplikater = [];
  jsonMedDuplikater.forEach((json) => {
    if (
      skjemaAlleredeBehandlet(endeligJsonUtenDuplikater, json["Skjemanummer"])
    ) {
      return;
    }

    let duplicates = jsonMedDuplikater.filter(
      (resJson) => resJson["Skjemanummer"] === json["Skjemanummer"]
    );
    duplicates.length > 1
      ? endeligJsonUtenDuplikater.push(
          hentVersjonMedVedleggsidHvisDetFinnes(duplicates)
        )
      : endeligJsonUtenDuplikater.push(duplicates[0]);
  });
  return endeligJsonUtenDuplikater;
}

function hentVersjonMedVedleggsidHvisDetFinnes(skjemaer) {
  const skjemaerSomErVedlegg = skjemaer.filter(
    (skjema) => skjema["Vedleggsid"]
  );
  if (skjemaerSomErVedlegg.length > 0) {
    return skjemaerSomErVedlegg[0];
  }
  return skjemaer[0];
}

function skjemaAlleredeBehandlet(listeOverSkjemaer, skjemanummer) {
  return (
    listeOverSkjemaer.filter(
      (skjema) => skjema["Skjemanummer"] === skjemanummer
    ).length > 0
  );
}

module.exports = {
  lagSkjemautlistingJson,
  lagJSON: lagJSONForSkjema,
  filtrerJsonOgFjernDuplikater,
  sjekkOmVedleggHarSkjemaOgReturnerVedleggskjema,
};
