const createSanityClient = require("../utils/createSanityClient");
const sanityClient = createSanityClient();
const sporringer = require("../sporringer");

async function lagSkjemaogVedleggsliste() {
  try {
    const skjemaobjekter = await sanityClient.fetch(
      sporringer.alleSkjemaer("skjema")
    );
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
      skjemaerogvedlegg: "Det skjedde en feil med uthenting og prosessering"
    };
  }
}

function prosesserDataOgListUt(soknadsobjekter, skjemaobjekter, vedlegg) {
  const resultJson = soknadsobjekter.reduce((arrayAvJson, soknadsobjekt) => {
    return arrayAvJson.concat(lagSoknadsobjektUtlisting(soknadsobjekt));
  }, []);

  skjemaobjekter.map(skjema => {
    resultJson.push({
      soknadsobjekt: "UDEFINERT",
      ...lagSkjemautlisting(skjema)
    });
  });

  vedlegg.map(v => {
    resultJson.push({
      ...lagVedleggsutlisting(v, "UDEFINERT")
    });
  });

  return { skjemaerogvedlegg: resultJson };
}

function lagSoknadsobjektUtlisting(soknadsobjekt) {
  const soknadsobjektnavn = soknadsobjekt.navn
    ? soknadsobjekt.navn.nb || soknadsobjekt.navn.en
    : "";
  const skjema = soknadsobjekt.hovedskjema || null;
  return soknadsobjekt.vedleggtilsoknad
    ? soknadsobjekt.vedleggtilsoknad.reduce((arrayAvJson, vedlegg) => {
        if (vedlegg.vedlegg) {
          return arrayAvJson.concat(
            lagVedleggsutlisting(vedlegg.vedlegg, soknadsobjektnavn, skjema)
          );
        }
      }, [])
    : [
        {
          soknadsobjekt: soknadsobjektnavn,
          ...lagSkjemautlisting(skjema)
        }
      ];
}

function lagSkjemautlisting(skjema) {
  return skjema
    ? {
        skjemanummer: skjema.skjemanummer,
        skjemanavn: skjema.navn.nb ? skjema.navn.nb : "",
        skjemanavnEN: skjema.navn.en ? skjema.navn.en : "",
        skjemanavnNN: skjema.navn.nn ? skjema.navn.nn : ""
      }
    : {};
}

function lagVedleggsutlisting(vedlegg, soknadsobjektnavn, skjema) {
  return {
    soknadsobjekt: soknadsobjektnavn,
    ...lagSkjemautlisting(skjema),
    vedleggsnavn: vedlegg.navn ? vedlegg.navn.nb || "" : "",
    vedleggsnavnEN: vedlegg.navn ? vedlegg.navn.en || "" : "",
    vedleggsID: vedlegg.vedleggsid,
    vedleggsskjema: vedlegg.skjematilvedlegg
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

module.exports = { lagSkjemaogVedleggsliste };
