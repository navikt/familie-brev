export interface IDokumentVariabler {
  flettefelter: { [fletteFelt: string]: string };
  delmaler: IDelmaler;
  valgfelter: IValgfelter;
}

export interface IDelmaler {
  [submalId: string]: IDelmal;
}

export interface IDelmal {
  erGjentagende: boolean;
  dokumentVariabler: IDokumentVariabler[];
}

export interface IValgfelter {
  [valgFeltId: string]: IValgfelt;
}

export interface IValgfelt {
  valgNavn: string;
  erGjentagende: boolean;
  dokumentVariabler: IDokumentVariabler[];
}
