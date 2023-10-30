import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { hentMiljøvariabler } from '../environment';
import type { Meta } from '@navikt/familie-logging';
import { logInfo } from '@navikt/familie-logging';

export const genererPdfBlankett = async (html: string, meta: Meta): Promise<ArrayBuffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

  logInfo(`Generer pdf mot ${url}`, meta);
  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'text/html',
        Accept: 'application/pdf',
        'Nav-Consumer-Id': 'familie-ef-blankett',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => res.data)
    .catch(error => {
      logInfo('Feil mot familie-dokument', meta);
      throw error;
    });
};
