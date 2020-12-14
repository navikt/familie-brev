export interface IDokumentVariabler {
  flettefelter: { [fletteFelt: string]: string };
  submaler: {
    [submalId: string]: ISubmal;
  };
  valgfelter: {
    [feltNavn: string]: IValg;
  };
  lister: { [dokumentNavn: string]: IDokumentVariabler[] };
}

export interface IValg {
  valgNavn: string;
  valgVariabler: IDokumentVariabler | undefined;
  muligeValg: IValg[] | undefined;
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
