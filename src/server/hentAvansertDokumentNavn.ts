import type { Datasett } from './sanity/sanityClient';
import { client } from './sanity/sanityClient';
import { Feil } from './utils/Feil';

export const hentAvansertDokumentNavn = async (
  datasett: Datasett,
  hentUpubliserte?: string,
): Promise<string> => {
  let query;
  if (hentUpubliserte === 'true') {
    query = `*[_type == "dokumentmal"]{visningsnavn, prioriteringsnummer, apiNavn, overgangsstonad, barnetilsyn, skolepenger, frittstaendeBrev }`;
  } else {
    query = `*[_type == "dokumentmal" && publisert == true]{visningsnavn, prioriteringsnummer, apiNavn, overgangsstonad, barnetilsyn, skolepenger, frittstaendeBrev}`;
  }

  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
