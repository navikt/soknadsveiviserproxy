const createSanityClient = require("./createSanityClient");
const sanityClient = createSanityClient();
const sporringer = require("../sporringer");

async function hentOgReturnerSkjemaerTilNavet() {
  try {
    const skjemaobjekter = await sanityClient.fetch(sporringer.alleSkjemaer());
    const interneskjemaobjekter = await sanityClient.fetch(
      sporringer.alleInterneSkjemaer()
    );
    const eessiskjemaobjekter = await sanityClient.fetch(
      sporringer.alleEESSISkjemaer()
    );

    return skjemaobjekter.concat(interneskjemaobjekter, eessiskjemaobjekter);
  } catch (e) {
    console.error("Klarte ikke å hente fra Sanity ", e);
    return {
      feil: "Det skjedde en feil med uthenting og prosessering"
    };
  }
}

module.exports = { hentOgReturnerSkjemaerTilNavet };
