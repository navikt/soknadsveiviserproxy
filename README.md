# soknadsveiviserproxy

Soknadsveiviserproxy er en Node.js Express applikasjon .

For lokal kjøring:
`npm install` og
`node index.js`

For å laste opp til docker og deploye til preprod:
`docker build -t docker.adeo.no:5000/sbl/soknadsveiviserproxy:VERSION .`
`docker push docker.adeo.no:5000/sbl/soknadsveiviserproxy:VERSION`
`kubectl apply -f app-config.yaml --context=preprod-sbs`

Applikasjonen ligger i default namespace.
