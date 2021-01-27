export interface IAvansertDokumentVariabler {
  flettefelter: Flettefelter;
  delmaler: IDelmaler;
  valgfelter: IValgfelter;
}

export interface IDelmaler {
  [delmalId: string]: IAvansertDokumentVariabler[];
}

export interface IValgfelter {
  [valgFeltId: string]: IValg[];
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
