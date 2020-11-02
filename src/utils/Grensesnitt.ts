export interface IDokumentVariabler {
  flettefelter: { [feltNavn: string]: string };
  submaler: {
    [submalNavn: string]: ISubmal;
  };
  valgfelter: {
    [feltNavn: string]: {
      valgNavn: string;
      valgVariabler: IDokumentVariabler;
    };
  };
  lister: { [dokumentNavn: string]: IDokumentVariabler[] };
}

export type ISubmal =
  | {
      skalMedBetingelseNavn: undefined;
      skalMed: true;
      submalVariabler: IDokumentVariabler | undefined;
    }
  | {
      skalMedBetingelseNavn: string;
      skalMed: boolean;
      submalVariabler: IDokumentVariabler | undefined;
    };
