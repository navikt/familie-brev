# familie-brev / familie-ef-blankett
Denne applikasjonen tilbyr følgende:
- brevgenerering for barnetrygd
- brevgenerering for enslig forsørger
- generering av blankett for enslig forsørger

 ## familie-brev (brevgenerering)

Brev-generator for barnetrygd og enslig forsørger.
Appen generer html fra innsendte flettefelter ved bruk av sanity (
se [familie-sanity-brev](https://github.com/navikt/familie-sanity-brev)) og pdf ved bruk
av [familie-dokument](https://github.com/navikt/familie-dokument).
Konsumenter kan få returnert html eller pdf/bytearray.

### Kjør server lokalt

* `familie-dokument` må kjøres med ApplicationLocal for at pdf-generering skal fungere
* Pass på at du har installert alle NPM-avhengighetene `yarn`
* Kjør `yarn start:dev`

### Bygg og deploy

Appen bygges hos github actions og gir beskjed til nais deploy om å deployere appen på gcp.

### Hvordan oppnå forskjellige typer endringer?

* Hvis du skal legge til en ny delmal, og denne kun skal vises i gitte tilfeller, styrer du det ved å definere hvilke
  delmal-api-navn som kommer inn til endepunktet her i familie-brev.

 ## familie-ef-blankett (generering av blankett)

Saksbehandlingsblankett for EF-sak

Appen lager html fra data og lager pdf ved bruk av [familie-dokument](https://github.com/navikt/familie-dokument).
Konsumenter kan få returnert html eller pdf/bytearray.

### Kjør server lokalt

* Opprett `.env` og sett
```
  REACT_APP_FAMILIE_DOKUMENT=http://localhost:8082
  REACT_APP_BACKEND=http://localhost:8033
```
* `familie-dokument` må kjøres med DevLauncher for at pdf-generering skal fungere
* Kjør `yarn build`
* Kjør `yarn dev:server`

### Bygg og deploy

Appen bygges med github actions og nais deployer appen på gcp. 

### Trigge pdf-generering lokalt

Gå til localhost:8033/api/status i nettleseren og kjør følgende kommando i console:
```
fetch("http://localhost:8033/api/dummy-pdf", {
  "body": null,
  "method": "POST",
})        
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "filename.pdf";
        document.body.appendChild(a); 
        a.click();    
        a.remove();           
    });
```
For at pdf-generiring skal fungere må man være pålogget Naisdevice.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes som issues her på GitHub-repoet.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.

# Hvordan oppnå forskjellige typer endringer?

* Hvis du skal legge til en ny delmal, og denne kun skal vises i gitte tilfeller, styrer du det ved å definere hvilke
  delmal-api-navn som kommer inn til endepunktet her i familie-brev.

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.