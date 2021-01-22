export interface IAvansertDokumentVariabler {
  flettefelter: Flettefelter;
  delmaler: IDelmaler;
  valgfelter: IValgfelter;
}

export interface IDelmaler {
  [delmalId: string]: IDelmal;
}

export interface IDelmal {
  erGjentagende: boolean;
  dokumentVariabler: IAvansertDokumentVariabler[];
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
  dokumentVariabler: IAvansertDokumentVariabler;
}

// Enkelt dokument
export interface IDokumentData {
  delmalData: IDelmalData;
  flettefelter: Flettefelter;
}

export interface IDelmalData {
  [key: string]: Flettefelter;
}

export type Flettefelter = { [key: string]: Flettefelt };
export type Flettefelt = string[];
