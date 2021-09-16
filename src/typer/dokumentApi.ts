export interface IDokumentData {
  delmalData: IDelmalData;
  flettefelter: Flettefelter;
}

export interface IDelmalData {
  [key: string]: Flettefelter;
}

export type Flettefelter = { [key: string]: Flettefelt };
export type Flettefelt = string[];

//Avansert dokument
export interface IAvansertDokumentVariabler {
  flettefelter: Flettefelter;
  delmaler: IDelmaler;
  valgfelter: IValgfelter;
  htmlfelter: IHtmlfelter;
}

export interface IBrevMedSignatur {
  brevFraSaksbehandler: IAvansertDokumentVariabler;
  besluttersignatur?: string;
  saksbehandlersignatur: string;
}

export interface IAvsnitt {
  deloverskrift?: string;
  innhold?: string;
}

export interface IManueltBrev {
  overskrift: string;
  avsnitt?: IAvsnitt[];
  saksbehandlersignatur?: string;
  brevdato?: string;
}

export interface IDelmaler {
  [delmalId: string]: IAvansertDokumentVariabler[];
}

export interface IHtmlfelter {
  [key: string]: string;
}

export interface IValgfelter {
  [valgFeltId: string]: IValg[];
}

export interface IValg {
  navn: string;
  dokumentVariabler: IAvansertDokumentVariabler;
}

// Periode
export interface IDokumentDataMedPeriode extends IDokumentData {
  perioder: Flettefelter[];
}
