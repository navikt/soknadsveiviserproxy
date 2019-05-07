const createSanityClient = require("../createSanityClient");
const sanityClient = createSanityClient();
const sporringer = require("../sporringer");

async function lagSoknadsobjekterListe() {
  try {
    const soknadsobjekter = await sanityClient.fetch(
      sporringer.alleSoknadsobjekter()
    );
    const kategorier = await sanityClient.fetch(
      sporringer.alleKategorierOgUnderkategorier()
    );
    return prosesserDataOgListUt(
      kategorier,
      hentGjenvarendeSoknadsobjekter(kategorier, soknadsobjekter)
    );
  } catch (e) {
    console.error("Klarte ikke å hente fra Sanity ", e);
    return { kategorier: "Det skjedde en feil med uthenting og prosessering" };
  }
}

function prosesserDataOgListUt(kategorier, soknadsobjekter) {
  const resultJson = kategorier.reduce((arrayAvJson, kategori) => {
    return arrayAvJson.concat(lagKategoriutlisting(kategori));
  }, []);
  resultJson.push(gjenvarendeSoknadsobjekter(soknadsobjekter));
  return { kategorier: resultJson };
}

function lagKategoriutlisting(kategori) {
  return {
    kategori: kategori.tittel ? kategori.tittel.nb || "" : "",
    underkategorier: kategori.underkategorier
      ? kategori.underkategorier.reduce((arrayAvJson, underkategori) => {
          return arrayAvJson.concat(lagUnderkategoriutlisting(underkategori));
        }, [])
      : []
  };
}

function lagUnderkategoriutlisting(underkategori) {
  return {
    underkategori: underkategori.navn ? underkategori.navn.nb || "" : "",
    soknadsobjekter: underkategori.soknadsobjekter
      ? underkategori.soknadsobjekter.reduce((arrayAvJson, soknadsobjekt) => {
          return arrayAvJson.concat(lagSoknadsobjektutlisting(soknadsobjekt));
        }, [])
      : []
  };
}

function lagSoknadsobjektutlisting(soknadsobjekt) {
  return {
    navn: soknadsobjekt.navn ? soknadsobjekt.navn.nb || "" : "",
    navnEN: soknadsobjekt.navn ? soknadsobjekt.navn.en || "" : "",
    hovedskjema: soknadsobjekt.hovedskjema
      ? soknadsobjekt.hovedskjema.skjemanummer
      : "",
    tema: soknadsobjekt.tema ? soknadsobjekt.tema.temakode : "",
    dokumentinnsending: harDokumentinnsending(soknadsobjekt),
    soknadsdialog: harSoknadsdialog(soknadsobjekt)
  };
}

function hentGjenvarendeSoknadsobjekter(kategorier, soknadsobjekter) {
  kategorier.map(kategori => {
    kategori.underkategorier
      ? kategori.underkategorier.map(underkategori => {
          underkategori.soknadsobjekter
            ? underkategori.soknadsobjekter.map(soknadsobj => {
                soknadsobjekter = soknadsobjekter.filter(
                  soknadsobjekt => soknadsobj._id !== soknadsobjekt._id
                );
              })
            : null;
        })
      : null;
  });
  return soknadsobjekter;
}

function gjenvarendeSoknadsobjekter(soknadsobjekter) {
  return {
    kategori: "IKKE PUBLISERT UNDER MENYPUNKT",
    underkategorier: [
      {
        underkategori: "IKKE PUBLISERT UNDER MENYPUNKT",
        soknadsobjekter: soknadsobjekter.reduce(
          (arrayAvJson, soknadsobjekt) => {
            return arrayAvJson.concat(lagSoknadsobjektutlisting(soknadsobjekt));
          },
          []
        )
      }
    ]
  };
}

function harDokumentinnsending(soknadsobjekt) {
  if (soknadsobjekt.digitalinnsending) {
    return soknadsobjekt.digitalinnsending.dokumentinnsending ? "JA" : "NEI";
  }
  return "NEI";
}

function harSoknadsdialog(soknadsobjekt) {
  if (soknadsobjekt.digitalinnsending) {
    if (soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog) {
      if (
        soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.soknadsdialogURL
      ) {
        return soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog
          .soknadsdialogURL.nb
          ? "JA"
          : "NEI";
      }
    }
  }
  return "NEI";
}

module.exports = { lagSoknadsobjekterListe };
