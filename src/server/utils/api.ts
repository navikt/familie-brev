import axios, { AxiosResponse } from 'axios';
import { hentMiljøvariabler } from '../environment';

export const genererPdf = async (html: string): Promise<ArrayBuffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

  console.log(`Genererer pdf mot ${url}`);
  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'text/html',
        'Content-Length': Buffer.byteLength(html),
        Accept: 'application/pdf',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => res.data)
    .catch(error => {
      console.log(`Feil mot familie-dokument: ${error}`);
      return error;
    });
};
