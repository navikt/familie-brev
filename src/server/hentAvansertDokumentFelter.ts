import { Maalform } from '../typer/sanitygrensesnitt';
import { client, Datasett } from './sanity/sanityClient';
import { Feil } from './utils/Feil';

export const hentFlettefelter = async (
  datasett: Datasett,
  avansertDokumentNavn: string,
): Promise<string> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
    "malNavn": apiNavn,
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
        "delmaler": *[_id in ^.${maalform}[].delmalReferanse._ref]{
            "delmalFlettefelter": 
                    ${maalform}[defined(markDefs[].flettefeltReferanse)] {
                        "flettefelt": markDefs[].flettefeltReferanse 
                    }, 
            "delmal": visningsnavn,  
            "valg":  *[_id in ^.${maalform}[].valgReferanse._ref]{
                    visningsnavn,
                    "valgFeltKategori": apiNavn,
                    "valgMuligheter":
                        valg[]{
                            valgmulighet,
                            "visningsnavnValgmulighet": delmal->.visningsnavn,
                            "flettefeltAlle": delmal-> ${maalform}[defined(markDefs)] {           
                                 "flettefelt": markDefs[]{
                                    flettefeltReferanse 
                                 }
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
