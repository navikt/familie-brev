export interface IDokumentGrensesnitt {
  flettefelter: { [felt: string]: string };
  skalMedFelter: { [felt: string]: boolean };
  lister: { [dokumentNavn: string]: IDokumentGrensesnitt[] };
}
