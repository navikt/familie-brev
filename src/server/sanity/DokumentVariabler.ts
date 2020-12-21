export interface IDokumentVariabler {
  flettefelter: { [fletteFelt: string]: string };
  submaler: {
    [submalId: string]: IDokumentVariabler | boolean | undefined;
  };
  valgfelter: {
    [feltNavn: string]: IValg;
  };
  lister: { [dokumentNavn: string]: IDokumentVariabler[] };
  submalerMetaData?: {
    [submalId: string]: ISubmalMetaData;
  };
}

export interface IValg {
  valgNavn: string;
  valgVariabler?: IDokumentVariabler;
  muligeValg?: IValg[];
}
export interface ISubmalMetaData {
  betingelse?: string;
  dokumentVariabler: IDokumentVariabler;
}
