export interface IDokumentVariabler {
  flettefelter: Flettefelter;
  delmaler: IDelmaler;
  valgfelter: IValgfelter;
}

export interface IDelmaler {
  [delmalId: string]: IDelmal;
}

export interface IDelmal {
  erGjentagende: boolean;
  dokumentVariabler: IDokumentVariabler[];
}

export interface IValgfelter {
  [valgFeltId: string]: IValgfelt;
}

export interface IValgfelt {
  valg: IValg[];
  erGjentagende: boolean;
}

export interface IValg {
  navn: string;
  dokumentVariabler: IDokumentVariabler;
}

// Enkelt dokument
export interface IDokumentData {
  delmalData: IDelmalData;
  flettefelter: Flettefelter;
}

export interface IDelmalData {
  [key: string]: Flettefelter;
}

export type Flettefelter = { [key: string]: string[] };
