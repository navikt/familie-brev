export interface IDokumentmal {
  id: string;
  nynorsk: IDokumentInnhold;
  bokmaal: IDokumentInnhold;
  _type: 'dokumentmal';
}

export type IDokumentInnhold = [ISanityBlock | IDelmalBlock | IValfeltBlock];

export interface IDelmalMark {
  skalMedFelt?: { felt: string };
  submal: { innhold: IDokumentInnhold; id: string };
  erGjentagende: undefined;
  _type: 'submal';
}

export interface IDelmalBlock {
  skalMedFelt?: { felt: string };
  submal: { innhold: IDokumentInnhold; id: string };
  erGjentagende: boolean;
  _type: 'delmalBlock';
}

export interface IValfeltBlock {
  valgfelt: {
    id: string;
    valg: [{ valgmulighet: string; delmal: IDokumentmal }];
  };
  erGjentagende: boolean;
  _type: 'valgfeltBlock';
}

export interface IFlettefeltMark {
  felt: { felt: string };
  _type: 'flettefelt';
}

export interface IValgfeltMark {
  valgfelt: {
    id: string;
    valg: [{ valgmulighet: string; delmal: IDokumentmal }];
  };
  erGjentagende: undefined;
  _type: 'valgfelt';
}

export interface ISanityBlock {
  children: any;
  markDefs: [IDelmalMark | IFlettefeltMark | IValgfeltMark];
  _type: 'block';
}
