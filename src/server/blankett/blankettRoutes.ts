import type { Request, Response } from 'express';
import type { IDokumentData } from '../../typer/dokumentApiBlankett.js';
import { hentDokumentHtmlBlankett } from './hentDokumentHtmlBlankett.js';
import { logError } from '@navikt/familie-logging';
import { logSecure } from '../utils/teamLogs.js';
import { genererMetadata } from '../utils/logging.js';
import { genererPdfBlankett } from '../utils/apiBlankett.js';
import type { IKlageDokumentData } from '../../typer/klageDokumentApi.js';
import { hentDokumentHtml } from './genererKlageDokumentHtml.js';
import fs from 'fs';
import express from 'express';
import { logFerdigstilt } from '../routes.js';

const router = express.Router();
const { NODE_ENV } = process.env;

router.post('/pdf', async (req: Request, res: Response) => {
  const dokument: IDokumentData = req.body as IDokumentData;
  const meta = genererMetadata(req);

  try {
    const html = await hentDokumentHtmlBlankett(dokument);
    const pdf = await genererPdfBlankett(html, meta);
    logFerdigstilt(req);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=saksbehandlingsblankett.pdf`);
    res.end(pdf);
  } catch (feil) {
    const error = feil as Error;
    logError(`Generering av dokument (pdf) feilet: Sjekk secure-logs`, undefined, meta);
    loggFeilMedDataTilSecurelog<IDokumentData>(dokument, req, error);

    res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
  }
});

router.post('/klage/pdf', async (req: Request, res: Response) => {
  const dokument: IKlageDokumentData = req.body as IKlageDokumentData;
  const meta = genererMetadata(req);
  try {
    const html = await hentDokumentHtml(dokument);
    const pdf = await genererPdfBlankett(html, meta);
    logFerdigstilt(req);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=klagesaksbehandlingsblankett.pdf`);
    res.end(pdf);
  } catch (feil) {
    const error = feil as Error;
    logError(`Generering av klagedokument (pdf) feilet: Sjekk secure-logs`, undefined, meta);
    loggFeilMedDataTilSecurelog<IKlageDokumentData>(dokument, req, error);

    res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
  }
});

if (NODE_ENV != 'production' && NODE_ENV != 'preprod') {
  const lesMockFil = () => {
    const fileString = fs.readFileSync('./src/server/mock/dummyDataBlankett.json', {
      encoding: 'utf-8',
    });
    return JSON.parse(fileString);
  };

  router.post('/dummy-pdf', async (req: Request, res: Response) => {
    try {
      const html = await hentDokumentHtmlBlankett(lesMockFil());
      const meta = genererMetadata(req);
      const pdf = await genererPdfBlankett(html, meta);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=saksbehandlingsblankett.pdf`);
      res.end(pdf);
    } catch (feil) {
      const error = feil as Error;
      res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
    }
  });

  router.get('/dummy-html', async (_req: Request, res: Response) => {
    try {
      const html = await hentDokumentHtmlBlankett(lesMockFil());
      res.send(html);
    } catch (feil) {
      const error = feil as Error;
      res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
    }
  });
}

const loggFeilMedDataTilSecurelog = <T>(data: T, req: Request, feil: Error) => {
  logSecure(
    `[${req.method} - ${
      req.originalUrl
    }] Genererer saksbehandlingsblankett med request-data feilet med feil=${feil.message}-${
      feil.stack
    } med data: ${JSON.stringify(data)}.`,
    genererMetadata(req),
  );
};

export default router;
