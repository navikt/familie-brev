export interface IDokumentGrensesnitt {
  flettefelter: object;
  skalMedFelter: object;
  lister: { [listenavn: string]: IDokumentGrensesnitt[] };
}
