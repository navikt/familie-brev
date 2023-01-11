# familie-brev
====================

Brev-generator for barnetrygd og enslig forsørger.
Appen generer html fra innsendte flettefelter ved bruk av sanity (
se [familie-sanity-brev](https://github.com/navikt/familie-sanity-brev)) og pdf ved bruk
av [familie-dokument](https://github.com/navikt/familie-dokument).
Konsumenter kan få returnert html eller pdf/bytearray.

# Kjør server lokalt

* `familie-dokument` må kjøres med DevLauncher for at pdf-generering skal fungere
* Pass på at du har installert alle NPM-avhengighetene `yarn`
* Kjør `yarn start:dev`

# Bygg og deploy

Appen bygges hos github actions og gir beskjed til nais deploy om å deployere appen på gcp.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes som issues her på GitHub-repoet.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.

# Hvordan oppnå forskjellige typer endringer?

* Hvis du skal legge til en ny delmal, og denne kun skal vises i gitte tilfeller, styrer du det ved å definere hvilke
  delmal-api-navn som kommer inn til endepunktet her i familie-brev.