# soknadsveiviserproxy

Soknadsveiviserproxy er en Node.js Express applikasjon .

For lokal kjøring:
`npm install` og
`node index.js`

For å laste opp til docker og deploye til preprod:
`docker build -t navikt/soknadsveiviserproxy:VERSION .`
`docker push navikt/soknadsveiviserproxy:VERSION`
`kubectl apply -f app-config.yaml`

Applikasjonen ligger i default namespace i preprod-sbs.
