import type { Datasett } from './sanity/sanityClient.js';
import { client } from './sanity/sanityClient.js';
import { Feil } from './utils/Feil.js';

export const hentAvansertDokumentNavn = async (
  datasett: Datasett,
  hentUpubliserte?: string,
): Promise<string> => {
  let query;
  if (hentUpubliserte === 'true') {
    query = `*[_type == "dokumentmal"]{visningsnavn, prioriteringsnummer, apiNavn, overgangsstonad, barnetilsyn, skolepenger, frittstaendeBrev, regelverkVersjon }`;
  } else {
    query = `*[_type == "dokumentmal" && publisert == true]{visningsnavn, prioriteringsnummer, apiNavn, overgangsstonad, barnetilsyn, skolepenger, frittstaendeBrev, regelverkVersjon}`;
  }

  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
