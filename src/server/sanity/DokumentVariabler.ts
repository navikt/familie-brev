export interface IDokumentVariabler {
  flettefelter: { [fletteFelt: string]: string };
  submaler: {
    [submalId: string]: IDokumentVariabler | boolean | undefined;
  };
  valgfelter: {
    [feltNavn: string]: IValg;
  };
  lister: { [dokumentNavn: string]: IDokumentVariabler[] };
  submalerBetingelser?: { [submalId: string]: string | undefined };
}

export interface IValg {
  valgNavn: string;
  valgVariabler?: IDokumentVariabler;
  muligeValg?: IValg[];
}
