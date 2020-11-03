export interface IDokumentmal {
  tittel: string;
  innhold: IDokumentInnhold;
  _type: "dokumentmal";
}

export interface IDokumentliste {
  tittel: string;
  innhold: IDokumentInnhold;
  _type: "dokumentliste";
}

export type IDokumentInnhold = [IDokumentliste | ISanityBlock];

export interface ISubmalMark {
  skalMedFelt?: { felt: string };
  submal: { innhold: IDokumentInnhold; tittel: string };
  _type: "submal";
}

export interface IFlettefeltMark {
  felt: { felt: string };
  _type: "flettefelt";
}

export interface IValgfeltMark {
  valgfelt: {
    tittel: string;
    valg: [{ valgmulighet: string; dokumentmal: IDokumentmal }];
  };
  _type: "valgfelt";
}

export interface ISanityBlock {
  children: any;
  markDefs: [ISubmalMark | IFlettefeltMark | IValgfeltMark];
  _type: "block";
}
