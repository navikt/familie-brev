import axios, { AxiosResponse } from 'axios';
import { hentMiljøvariabler } from '../environment';
import { Feil } from './Feil';
import { error, info } from '@navikt/familie-logging';

export const genererPdf = async (html: string): Promise<ArrayBuffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

  info(`Generer pdf mot ${url}`);
  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'text/html',
        Accept: 'application/pdf',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => res.data)
    .catch(feil => {
      error(`Feil mot familie-dokument: ${feil.message}`);
      throw new Feil(`Feil mot familie-dokument: ${feil.message}`, 500);
    });
};
