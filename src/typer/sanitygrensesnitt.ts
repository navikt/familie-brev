export enum Maalform {
  NB = 'bokmaal',
  NN = 'nynorsk',
}

export interface ISanityDelmalGrensesnitt {
  betingelse: string | undefined;
  erGjentagende: boolean;
  id: string;
  grensesnitt: ISanityGrensesnitt;
}

export interface ISanityValgmulighet {
  valgnavn: string;
  grensesnitt: ISanityGrensesnitt;
}

export interface ISanityValgfeltGrensesnitt {
  navn: string;
  erGjentagende: boolean;
  valgmuligheter: ISanityValgmulighet[];
}

export interface ISanityDokument {
  id: string;
  grensesnitt: ISanityGrensesnitt;
}

export interface ISanityGrensesnitt {
  flettefelter: string[];
  delmaler: ISanityDelmalGrensesnitt[];
  valgfelter: ISanityValgfeltGrensesnitt[];
}

export interface ISanityGrensesnittMedMaalform {
  grensesnitt: ISanityGrensesnitt;
  maalform: Maalform;
}
