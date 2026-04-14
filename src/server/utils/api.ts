import { hentMiljøvariabler } from '../environment';
import { Feil } from './Feil';
import { logInfo } from '@navikt/familie-logging';

export const genererPdf = async (html: string): Promise<Buffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

  logInfo(`Generer pdf mot ${url}`);

  const res = await fetch(url, {
    method: 'POST',
    body: html,
    headers: {
      'Content-Type': 'text/html',
      Accept: 'application/pdf',
    },
  });

  if (!res.ok) {
    throw new Feil(`Feil mot familie-dokument`, 500);
  }

  return Buffer.from(await res.arrayBuffer());
};
