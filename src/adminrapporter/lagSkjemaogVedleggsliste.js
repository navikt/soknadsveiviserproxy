const createSanityClient = require("../createSanityClient");
const sanityClient = createSanityClient();
const sporringer = require("../sporringer");

async function lagSkjemaogVedleggsliste() {
  try {
    const skjemaobjekter = await sanityClient.fetch(sporringer.alleSkjemaer());
    const soknadsobjekter = await sanityClient.fetch(
      sporringer.alleSoknadsobjekter()
    );
    const vedlegg = await sanityClient.fetch(sporringer.alleVedlegg());
    return prosesserDataOgListUt(
      soknadsobjekter,
      hentSkjemaerSomIkkeErTilknyttetEtSoknadsobjekt(
        soknadsobjekter,
        skjemaobjekter
      ),
      hentVedleggSomIkkeErTilknyttetEtSoknadsobjekt(soknadsobjekter, vedlegg)
    );
  } catch (e) {
    console.error("Klarte ikke å hente fra Sanity ", e);
    return {
      soknadsobjekter: "Det skjedde en feil med uthenting og prosessering"
    };
  }
}

function prosesserDataOgListUt(soknadsobjekter, skjemaobjekter, vedlegg) {
  const resultJson = soknadsobjekter.reduce((arrayAvJson, soknadsobjekt) => {
    return arrayAvJson.concat(lagSoknadsobjektlisting(soknadsobjekt));
  }, []);
  resultJson.push(gjenvarendeSkjema(skjemaobjekter));
  resultJson.push(gjenvarendeVedlegg(vedlegg));
  return { soknadsobjekter: resultJson };
}

function lagSoknadsobjektlisting(soknadsobjekt) {
  return {
    soknadsobjekt: soknadsobjekt.navn
      ? soknadsobjekt.navn.nb || soknadsobjekt.navn.en
      : "",
    hovedskjema: lagSkjemautlisting(soknadsobjekt.hovedskjema || null),
    vedleggsliste: soknadsobjekt.vedleggtilsoknad
      ? soknadsobjekt.vedleggtilsoknad.reduce((arrayAvJson, vedlegg) => {
          if (vedlegg.vedlegg) {
            return arrayAvJson.concat(lagVedleggsutlisting(vedlegg.vedlegg));
          }
        }, [])
      : []
  };
}

function lagSkjemautlisting(skjema) {
  return {
    skjemanummer: skjema.skjemanummer,
    navn: skjema.navn.nb ? skjema.navn.nb : "",
    navnEN: skjema.navn.en ? skjema.navn.en : "",
    navnNN: skjema.navn.nn ? skjema.navn.nn : ""
  };
}

function lagVedleggsutlisting(vedlegg) {
  return {
    navn: vedlegg.navn ? vedlegg.navn.nb || "" : "",
    navnEN: vedlegg.navn ? vedlegg.navn.en || "" : "",
    ID: vedlegg.vedleggsid,
    skjema: vedlegg.skjematilvedlegg
      ? vedlegg.skjematilvedlegg.skjemanummer
      : ""
  };
}

function hentSkjemaerSomIkkeErTilknyttetEtSoknadsobjekt(
  soknadsobjekter,
  skjemaer
) {
  soknadsobjekter.map(soknadsobjekt => {
    if (soknadsobjekt.hovedskjema) {
      skjemaer = skjemaer.filter(
        skjema => soknadsobjekt.hovedskjema._id !== skjema._id
      );
    }
  });
  return skjemaer;
}

function gjenvarendeSkjema(skjemaobjekter) {
  return {
    soknadsobjekt: "IKKE PUBLISERT UNDER SOKNADSOBJEKT",
    hovedskjema: skjemaobjekter.reduce((arrayAvJson, skjema) => {
      return arrayAvJson.concat({
        navn: skjema.navn,
        skjemanummer: skjema.skjemanummer
      });
    }, [])
  };
}

function hentVedleggSomIkkeErTilknyttetEtSoknadsobjekt(
  soknadsobjekter,
  vedleggsliste
) {
  soknadsobjekter.map(soknadsobjekt => {
    soknadsobjekt.vedleggtilsoknad
      ? soknadsobjekt.vedleggtilsoknad.map(vedleggsobjekt => {
          if (vedleggsobjekt.vedlegg) {
            vedleggsliste = vedleggsliste.filter(
              vedlegg => vedlegg._id !== vedleggsobjekt.vedlegg._id
            );
          }
        })
      : null;
  });
  return vedleggsliste;
}

function gjenvarendeVedlegg(vedlegg) {
  return {
    soknadsobjekt: "IKKE PUBLISERT UNDER SOKNADSOBJEKT",
    vedleggsliste: vedlegg.reduce((arrayAvJson, vedleggsobjekt) => {
      return arrayAvJson.concat(lagVedleggsutlisting(vedleggsobjekt));
    }, [])
  };
}

module.exports = { lagSkjemaogVedleggsliste };
