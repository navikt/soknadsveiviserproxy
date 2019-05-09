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
      hentSoknadsobjekterSomIkkeErTilknyttetEnUnderkategori(
        kategorier,
        soknadsobjekter
      )
    );
  } catch (e) {
    console.error("Klarte ikke å hente fra Sanity ", e);
    return {
      soknadsobjekter: "Det skjedde en feil med uthenting og prosessering"
    };
  }
}

function prosesserDataOgListUt(kategorier, soknadsobjekter) {
  const resultJson = kategorier.reduce((arrayAvJson, kategori) => {
    return arrayAvJson.concat(lagKategoriutlisting(kategori));
  }, []);

  soknadsobjekter.map(soknadsobjekt => {
    resultJson.push(
      lagSoknadsobjektutlisting(soknadsobjekt, "UDEFINERT", "UDEFINERT")
    );
  });

  return { soknadsobjekter: resultJson };
}

function lagKategoriutlisting(kategori) {
  const kategorinavn = kategori.tittel ? kategori.tittel.nb || "" : "";
  return kategori.underkategorier
    ? kategori.underkategorier.reduce((arrayAvJson, underkategori) => {
        return arrayAvJson.concat(
          lagUnderkategoriutlisting(underkategori, kategorinavn)
        );
      }, [])
    : [{ kategori: kategorinavn }];
}

function lagUnderkategoriutlisting(underkategori, kategorinavn) {
  const underkategorinavn = underkategori.navn
    ? underkategori.navn.nb || ""
    : "";
  return underkategori.soknadsobjekter
    ? underkategori.soknadsobjekter.reduce((arrayAvJson, soknadsobjekt) => {
        return arrayAvJson.concat(
          lagSoknadsobjektutlisting(
            soknadsobjekt,
            kategorinavn,
            underkategorinavn
          )
        );
      }, [])
    : [{ kategori: kategorinavn, underkategori: underkategorinavn }];
}

function lagSoknadsobjektutlisting(
  soknadsobjekt,
  kategorinavn,
  underkategorinavn
) {
  return {
    kategori: kategorinavn,
    underkategori: underkategorinavn,
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

function hentSoknadsobjekterSomIkkeErTilknyttetEnUnderkategori(
  kategorier,
  soknadsobjekter
) {
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
