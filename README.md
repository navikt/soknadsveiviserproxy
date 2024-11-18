# Soknadsveiviserproxy

Node.js Express applikasjon som fungerer som et mellomledd mellom [Søknadsveiviser](https://github.com/navikt/soknadsveiviser) og [Sanity](https://www.sanity.io/) som benyttes som database.

Appen kjører på NAIS i en docker container.

# Kom i gang

```
npm install
```

Opprett en .env-fil og legg inn Sanity token (finnes i secrets):
```
SANITY_TOKEN=<token>
```

Kjør applikasjonen:
```
npm start
```

### Bygg

Soknadsveiviserproxy bruker github actions.

### Nais-cluster
Applikasjonen kjører i namespace `skjemadigitalisering` i dev-gcp og prod-gcp.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes som issues.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-fyllut-sendinn.
