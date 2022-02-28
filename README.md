# familie-brev
====================

Brev-generator for barnetrygd og enslig forsørger. 
Appen generer html fra innsendte flettefelter ved bruk av sanity (se [familie-sanity-brev](https://github.com/navikt/familie-sanity-brev)) og pdf ved bruk av [familie-dokument](https://github.com/navikt/familie-dokument).
Konsumenter kan få returnert html eller pdf/bytearray.

# Kjør server lokalt
* `familie-dokument` må kjøres med DevLauncher for at pdf-generering skal fungere
* Pass på at du har instalert alle NPM-avhengighetene `yarn`
* Kjør `yarn start:dev`

# Bygg og deploy
Appen bygges hos github actions og gir beskjed til nais deploy om å deployere appen på gcp. 

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes til:

* Halvor Mundal, `halvor.mundal@nav.no`
* Asbjørn Ottesen Steinskog, `asbjorn.ottesen.steinskog@nav.no`

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.
