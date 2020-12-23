export interface IDokumentmal {
  id: string;
  nynorsk: IDokumentInnhold;
  bokmaal: IDokumentInnhold;
  _type: 'dokumentmal';
}

export interface IDokumentliste {
  id: string;
  nynorsk: IDokumentInnhold;
  bokmaal: IDokumentInnhold;
  _type: 'dokumentliste';
}

export type IDokumentInnhold = [IDokumentliste | ISanityBlock];

export interface ISubmalMark {
  skalMedFelt?: { felt: string };
  submal: { innhold: IDokumentInnhold; id: string };
  _type: 'submal';
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
  _type: 'valgfelt';
}

export interface ISanityBlock {
  children: any;
  markDefs: [ISubmalMark | IFlettefeltMark | IValgfeltMark];
  _type: 'block';
}
