# Soknadsveiviserproxy
[![CircleCI](https://circleci.com/gh/navikt/soknadsveiviserproxy.svg?style=svg)](https://circleci.com/gh/navikt/soknadsveiviserproxy)

Node.js Express applikasjon som fungerer som et mellomledd mellom [Soknadsveiviser](https://github.com/navikt/soknadsveiviser) og [Sanity](https://www.sanity.io/) som benyttes som database.

Appen kjører på NAIS i en dockercontainer.

# Kom i gang

```
npm install
```

Kjør applikasjonen

```
npm start
```

### Bygg

Soknadsveiviserproxy har et pipelinebygg på [CircleCI](https://circleci.com/gh/navikt/soknadsveiviserproxy)

Ved merge til master kjører bygget på CircleCI automatisk, 
som laster opp et image til dockerhub og deployer til preprod. Planen er at man videre skal få en
manuell godkjenning for å dytte videre til produksjon.

For å kjøre opp docker lokalt:
```
docker build -t soknadsveiviserproxy .
docker run --name soknadsveiviserproxy -p 8080:8080 -t -d soknadsveiviserproxy
```

### Nais-cluster
Applikasjonen ligger i default namespace i dev-sbs og prod-sbs.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/team-personbruker

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker.
