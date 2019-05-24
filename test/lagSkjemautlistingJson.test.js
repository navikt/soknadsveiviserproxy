const {
  lagSkjemautlistingJson,
  lagJSON,
  filtrerJsonOgFjernDuplikater
} = require("../src/lagSkjemautlistingJson");
const alleSoknadsobjekter = require("./soknadsobjekter.test");
const jsonMedDuplikater = require("./skjemautlisting.test");

test("Sjekk at opprettet Json får riktig skjemanummer, tittel og tema", () => {
  const { hovedskjema, tema } = alleSoknadsobjekter[0];
  const resultat = lagJSON(hovedskjema, tema.temakode, "");
  expect(resultat.Skjemanummer).toEqual(hovedskjema.skjemanummer);
  expect(resultat.Tittel).toEqual(hovedskjema.navn.nb);
  expect(resultat.Tema).toEqual(tema.temakode);
});

test("Sjekk at skjemautlisting får riktig format og riktig antall innslag", () => {
  expect(lagSkjemautlistingJson(alleSoknadsobjekter).Skjemaer.length).toBe(13);
});

test("Sjekk at blant duplikater er det skjema med vedleggsid som blir valgt", () => {
  const json = filtrerJsonOgFjernDuplikater(jsonMedDuplikater).filter(
    skjema => skjema["Skjemanummer"] === "NAV 11-13.05"
  );
  expect(json.length === 1);
  expect(json["Vedleggsid"] === "H3");
});
