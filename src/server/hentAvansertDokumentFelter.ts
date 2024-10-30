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

export interface Delmaler {
  delmalerSortert: DelmalerSortert[];
}
export interface DelmalerSortert {
  delmalApiNavn: string;
  delmalNavn: string;
  delmalValgfelt: ValgFelt[];
  delmalFlettefelter: Flettefelter[]; // referanse til flettefelt
  gruppeVisningsnavn: string;
}

export interface DokumentMal {
  delmalerSortert: DelmalerSortert[];
  brevmenyBlokker: BrevmenyBlokk[];
}

export type FritekstBlokk = {
  _type: 'fritekstområde';
  innhold: { id: string };
};
type DelmalBlokk = {
  _type: 'delmalBlock';
  innhold: DelmalerSortert;
};
export type BrevmenyBlokker = {
  brevmenyBlokker: BrevmenyBlokk[];
};
export type BrevmenyBlokk = FritekstBlokk | DelmalBlokk;

export const hentFlettefelter = async (
  datasett: Datasett,
  avansertDokumentNavn: string,
): Promise<string> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
     "flettefeltReferanse" :  *[ _type=='flettefelt' ]
    }[0]`;
  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};

// export const hentBrevstruktur = async (
//   datasett: Datasett,
//   maalform: Maalform,
//   avansertDokumentNavn: string,
// ): Promise<DokumentMal> => {
//   const brevmenyBlokker: BrevmenyBlokk[] = await hentBrevmenyBlokker(
//     datasett,
//     maalform,
//     avansertDokumentNavn,
//   );
//   const delmalerSortert: Delmaler = await hentDelmalerSortert(
//     datasett,
//     maalform,
//     avansertDokumentNavn,
//   );
//   const dokumentMal: DokumentMal = { delmalerSortert, brevmenyBlokker };
//   return dokumentMal;
// };

export const hentDelmalerSortert = async (
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<Delmaler> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
        "delmalerSortert": ${maalform}[defined(delmalReferanse)].delmalReferanse->{ 
            "delmalApiNavn": apiNavn,
            "delmalNavn": visningsnavn,
            gruppeVisningsnavn,
            "delmalFlettefelter": 
                    ${maalform}[length(markDefs[].flettefeltReferanse) > 0 ]{
                        "flettefelt": markDefs[].flettefeltReferanse
                      },
            "delmalValgfelt": ${maalform}[defined(valgReferanse)].valgReferanse ->{
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
  }[0]`;
  return clientV2(datasett, '2022-03-07')
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};

export const hentBrevmenyBlokker = async (
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<BrevmenyBlokker> => {
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

export const hentAvansertDokumentFelter_V20220307 = async (
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<string> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
        "malNavn": apiNavn,
        "delmalerSortert": ${maalform}[defined(delmalReferanse)].delmalReferanse->{ 
            "delmalApiNavn": apiNavn,
            "delmalNavn": visningsnavn,
            gruppeVisningsnavn,
            "delmalFlettefelter": 
                    ${maalform}[length(markDefs[].flettefeltReferanse) > 0 ]{
                        "flettefelt": markDefs[].flettefeltReferanse
                      },
            "delmalValgfelt": ${maalform}[defined(valgReferanse)].valgReferanse ->{
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
        },
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

export const hentAvansertDokumentFelter = async (
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<string> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
        "malNavn": apiNavn,
        "delmalerSortert": ${maalform}[].delmalReferanse | [defined(@)]->{ 
            "delmalApiNavn": apiNavn,
            "delmalNavn": visningsnavn,
            gruppeVisningsnavn,
            "delmalFlettefelter": 
                    ${maalform}[defined(markDefs[].flettefeltReferanse)] {
                        "flettefelt": markDefs[].flettefeltReferanse
                    },
            "delmalValgfelt":  ^.${maalform}[].valgReferanse | [defined(@)]->{
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
        },
        "brevmenyBlokker": ${maalform}[defined(delmalReferanse) ||  _type == "fritekstområde" ] | { 
            _type,
            "innhold": select(
                _type == "fritekstområde" => { "id": _key },
                defined(delmalReferanse) => delmalReferanse->{
                  "delmalApiNavn": apiNavn,
                  "delmalNavn": visningsnavn,
                  gruppeVisningsnavn,
                  "delmalFlettefelter": 
                          ${maalform}[defined(markDefs[].flettefeltReferanse)] {
                              "flettefelt": markDefs[].flettefeltReferanse
                          },
                  "delmalValgfelt":  ^.${maalform}[].valgReferanse | [defined(@)]->{
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

  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
