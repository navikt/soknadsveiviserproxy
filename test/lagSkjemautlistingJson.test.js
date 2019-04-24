const {
  lagSkjemautlistingJson,
  lagJSON
} = require("../src/lagSkjemautlistingJson");
const alleSoknadsobjekter = require("./soknadsobjekter.test");

test("Sjekk at opprettet Json får riktig skjemanummer, tittel og tema", () => {
  const { hovedskjema, tema } = alleSoknadsobjekter[0];
  const resultat = lagJSON(hovedskjema, tema.temakode, "");
  expect(resultat.Skjemanummer).toEqual(hovedskjema.skjemanummer);
  expect(resultat.Tittel).toEqual(hovedskjema.navn.nb);
  expect(resultat.Tema).toEqual(tema.temakode);
});

test("Sjekk at skjemautlisting får riktig format og riktig antall innslag", () => {
  expect(lagSkjemautlistingJson(alleSoknadsobjekter).Skjemaer.length).toBe(29);
});
