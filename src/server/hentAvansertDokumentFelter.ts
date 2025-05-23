import type { Maalform } from '../typer/sanitygrensesnitt';
import { client, clientV2, Datasett } from './sanity/sanityClient';
import { Feil } from './utils/Feil';

export interface Flettefeltreferanse {
  _ref: string;
}

export interface Flettefelter {
  flettefelt: Flettefeltreferanse[];
}

export interface Valgmulighet {
  flettefelter: Flettefelter[];
  valgmulighet: string;
  visningsnavnValgmulighet: string;
}

export interface ValgFelt {
  valgMuligheter: Valgmulighet[];
  valgfeltVisningsnavn: string;
  valgFeltApiNavn: string;
  valgfeltBeskrivelse?: string;
}

export interface DelmalerSortert {
  delmalApiNavn: string;
  delmalNavn: string;
  delmalValgfelt: ValgFelt[];
  delmalFlettefelter: Flettefelter[]; // referanse til flettefelt
  gruppeVisningsnavn: string;
}

export interface BrevStruktur {
  dokument: DokumentMal;
  flettefelter: AlleFlettefelter;
}

export interface DokumentMal {
  brevmenyBlokker: BrevmenyBlokk[];
}

export interface AlleFlettefelter {
  flettefeltReferanse: Flettefelt[];
}

interface Flettefelt {
  felt: string;
  erFritektsfelt?: boolean;
  feltVisningsnavn?: string;
  _id: string;
  beskrivelse?: string;
}

export type FritekstBlokk = {
  _type: 'fritekstområde';
  innhold: { id: string };
};
type DelmalBlokk = {
  _type: 'delmalBlock';
  innhold: DelmalerSortert;
};
export type Brevmeny = {
  brevmenyBlokker: BrevmenyBlokk[];
};
export type BrevmenyBlokk = FritekstBlokk | DelmalBlokk;

export const hentFlettefelterMedType = async (
  datasett: Datasett,
  avansertDokumentNavn: string,
): Promise<AlleFlettefelter> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
     "flettefeltReferanse" :  *[ _type=='flettefelt' ]
    }[0]`;
  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};

export const hentBrevmenyBlokker = async (
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<Brevmeny> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
        "brevmenyBlokker": ${maalform}[defined(delmalReferanse) ||  _type == "fritekstområde" ] | { 
            _type,
            "innhold": select(
                _type == "fritekstområde" => { "id": _key },
                defined(delmalReferanse) => delmalReferanse->{
                  "delmalApiNavn": apiNavn,
                  "delmalNavn": visningsnavn,
                  gruppeVisningsnavn,
                  "delmalFlettefelter": 
                          ${maalform}[length(markDefs[].flettefeltReferanse) > 0 ] {
                              "flettefelt": markDefs[].flettefeltReferanse
                          },
                  "delmalValgfelt":  ${maalform}[defined(valgReferanse)].valgReferanse ->{
                          "valgfeltVisningsnavn":visningsnavn,
                          "valgFeltApiNavn": apiNavn,
                          "valgfeltBeskrivelse": beskrivelse,
                          "valgMuligheter":
                              valg[]{
                                  valgmulighet,
                                  "visningsnavnValgmulighet": delmal->.visningsnavn,
                                  "flettefelter": delmal-> ${maalform}[defined(markDefs)] {           
                                       "flettefelt": markDefs[].flettefeltReferanse 
                                  }  
                              }
                  }
                }
            )
        }
  }[0]`;

  return clientV2(datasett, '2022-03-07')
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
