const createSanityClient = require("../createSanityClient");
const sanityClient = createSanityClient();

async function lagSoknadsobjekterListe(
  soknadsobjektsporring,
  kategorisporring
) {
  try {
    const soknadsobjekter = await sanityClient.fetch(soknadsobjektsporring);
    const kategorier = await sanityClient.fetch(kategorisporring);
    return prosesserDataOgListUt(soknadsobjekter, kategorier);
  } catch (e) {
    console.error("Klarte ikke å hente fra Sanity ", e);
    return { kategorier: "Det skjedde en feil med uthenting og prosessering" };
  }
}

function prosesserDataOgListUt(soknadsobjekter, kategorier) {
  const resultJson = kategorier.reduce((arrayAvJson, kategori) => {
    return arrayAvJson.concat(lagKategoriutlisting(
        kategori,
        soknadsobjekter
    ));
  }, []);
  return { kategorier: resultJson };
}

function lagKategoriutlisting(kategori) {
  return {
    kategori: kategori.tittel ? kategori.tittel.nb || "" : "",
    underkategorier: kategori.underkategorier.reduce(
      (arrayAvJson, underkategori) => {
        return arrayAvJson.concat(lagUnderkategoriutlisting(underkategori));
      },
      []
    )
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
