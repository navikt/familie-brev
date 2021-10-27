import { client, Datasett } from './sanity/sanityClient';
import { Feil } from './utils/Feil';

export const hentAvansertDokumentNavn = async (datasett: Datasett): Promise<string> => {
  const query = `*[_type == "dokumentmal" && publisert == true]{visningsnavn, apiNavn}`;

  return client(datasett)
    .fetch(query)
    .catch(error => {
      throw new Feil(error.message, error.statusCode);
    });
};
