# Soknadsveiviserproxy

Node.js Express applikasjon som mellomledd mellom [Soknadsveiviser](https://github.com/navikt/soknadsveiviser) og [Sanity](https://www.sanity.io/) som benyttes som database.

### Kom i gang

```
cd app && npm install
```

Kjør applikasjonen

```
node index.js
```

### Bygg

For å laste opp til docker og deploye til preprod:

```
docker build -t navikt/soknadsveiviserproxy:VERSION .
```

```
docker push navikt/soknadsveiviserproxy:VERSION
```

```
npm run deploy-preprod
```

Applikasjonen ligger i default namespace i preprod-sbs.
