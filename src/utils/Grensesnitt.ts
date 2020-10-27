export interface IDokumentGrensesnitt {
  flettefelter: { [felt: string]: string };
  skalMedFelter: { [felt: string]: boolean };
  valgfelter: { [felt: string]: string };
  lister: { [dokumentNavn: string]: IDokumentGrensesnitt[] };
}
