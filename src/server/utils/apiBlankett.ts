import { hentMiljøvariabler } from '../environment';
import type { Meta } from '@navikt/familie-logging';
import { logInfo } from '@navikt/familie-logging';

export const genererPdfBlankett = async (html: string, meta: Meta): Promise<Buffer> => {
  const url = `${hentMiljøvariabler().FAMILIE_DOKUMENT_API_URL}/api/html-til-pdf`;

  logInfo(`Generer pdf mot ${url}`, meta);

  const res = await fetch(url, {
    method: 'POST',
    body: html,
    headers: {
      'Content-Type': 'text/html',
      Accept: 'application/pdf',
      'Nav-Consumer-Id': 'familie-ef-blankett',
    },
  });

  if (!res.ok) {
    logInfo('Feil mot familie-dokument', meta);
    throw new Error(`Feil mot familie-dokument: ${res.status}`);
  }

  return Buffer.from(await res.arrayBuffer());
};
