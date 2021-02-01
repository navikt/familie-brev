import axios, { AxiosResponse } from 'axios';
import { hentMiljøvariabler } from '../environment';
import { Feil } from './Feil';
import { logInfo } from '@navikt/familie-logging';

export const genererPdf = async (html: string): Promise<ArrayBuffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

  logInfo(`Generer pdf mot ${url}`);
  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'text/html',
        Accept: 'application/pdf',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => res.data)
    .catch(error => {
      throw new Feil(`Feil mot familie-dokument`, 500, error);
    });
};
