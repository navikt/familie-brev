import { Maalform } from '../typer/sanitygrensesnitt';
import { client, Datasett } from './sanity/sanityClient';
import { Feil } from './utils/Feil';

export const hentAvansertDokumentFelter = async (
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<string> => {
  const query = `*[apiNavn == "${avansertDokumentNavn}"]{
        "malNavn": apiNavn,
        "dokument": *[_id in ^.${maalform}[].valgReferanse._ref]{
            visningsnavn,
            "valgFeltKategori": apiNavn,
            "valgMuligheter":
                valg[]{
                    valgmulighet,
                    "visningsnavnValgmulighet": delmal->.visningsnavn,
                    "flettefelt": delmal->.${maalform}[0].markDefs[].flettefeltReferanse->{felt, _id}
                }
        }
    }`;

  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
