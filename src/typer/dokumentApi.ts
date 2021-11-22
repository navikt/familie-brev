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

export interface IFritekstbrevMedSignatur {
  brevFraSaksbehandler: IFritekstbrev;
  besluttersignatur?: string;
  saksbehandlersignatur: string;
}

export interface IAvsnitt {
  deloverskrift?: string;
  innhold?: string;
}

export interface IFritekstbrev {
  overskrift: string;
  avsnitt?: IAvsnitt[];
  brevdato?: string;
  personIdent: string;
  navn: string;
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

export interface ISøknad {
  label: string;
  verdiliste: IVerdiliste[];
}

export interface IVerdiliste {
  label: string;
  verdi?: string;
  verdiliste?: IVerdiliste[];
  alternativer?: string;
}
