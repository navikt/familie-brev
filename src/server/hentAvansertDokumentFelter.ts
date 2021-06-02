import { Maalform } from '../typer/sanitygrensesnitt';
import { client, Datasett } from './sanity/sanityClient';
import { Feil } from './utils/Feil';

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
            "mappe": mappe[0],
            "delmalFlettefelter": 
                    ${maalform}[defined(markDefs[].flettefeltReferanse)] {
                        "flettefelt": markDefs[].flettefeltReferanse
                    },
            "delmalValgfelt":  ^.${maalform}[].valgReferanse | [defined(@)]->{
                    "valgfeltVisningsnavn":visningsnavn,
                    "valgFeltApiNavn": apiNavn,
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

  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
