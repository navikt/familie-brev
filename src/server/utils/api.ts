import axios, { AxiosResponse } from 'axios';
import { hentMiljøvariabler } from '../environment';
import { Feil } from './Feil';

export const genererPdf = async (html: string): Promise<ArrayBuffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

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
      console.error('Error:');
      console.error(error.message);
      console.error(`linje ${error.lineNumber}, kolonne ${error.columnNumber}`);
      console.error(`Stack trace: ${error.stack}`);
      throw new Feil(`Feil mot familie-dokument: ${error.message}`, 500);
    });
};
