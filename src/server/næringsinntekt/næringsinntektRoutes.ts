import express, { type Request, type Response } from 'express';
import { genererMetadata } from '../utils/logging';
import { genererPdfBlankett } from '../utils/apiBlankett';
import { logFerdigstilt } from '../routes';
import { logError, logSecure } from '@navikt/familie-logging';
import { hentDokumentHtmlNæringsinntekt } from './hentDokumentHtmlNæringsinntekt';
import { NæringsinntektDokumentData } from '../../typer/dokumentApiNæringsinntekt';
import fs from 'fs';

const router = express.Router();
const { NODE_ENV } = process.env;

router.post('/pdf', async (req: Request, res: Response) => {
  const næringsinntektData: NæringsinntektDokumentData = req.body as NæringsinntektDokumentData;
  const meta = genererMetadata(req);

  try {
    const html = await hentDokumentHtmlNæringsinntekt(næringsinntektData);
    const pdf = await genererPdfBlankett(html, meta);
    logFerdigstilt(req);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=næringsinntekt-kontroll.pdf`);
    res.end(pdf);
  } catch (feil) {
    const error = feil as Error;
    logError(`Generering av dokument (pdf) feilet: Sjekk secure-logs`, undefined, meta);
    loggFeilMedDataTilSecurelog<NæringsinntektDokumentData>(næringsinntektData, req, error);

    res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
  }
});

if (NODE_ENV != 'production' && NODE_ENV != 'preprod') {
  const lesMockFil = () => {
    const fileString = fs.readFileSync('./src/server/mock/dummyDataNæringsinntekt.json', {
      encoding: 'utf-8',
    });
    return JSON.parse(fileString);
  };

  router.post('/dummy-pdf', async (req: Request, res: Response) => {
    try {
      const html = await hentDokumentHtmlNæringsinntekt(lesMockFil());
      const meta = genererMetadata(req);
      const pdf = await genererPdfBlankett(html, meta);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=inntektsnotat.pdf`);
      res.end(pdf);
    } catch (feil) {
      const error = feil as Error;
      res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
    }
  });

  router.get('/dummy-html', async (_req: Request, res: Response) => {
    try {
      const html = await hentDokumentHtmlNæringsinntekt(lesMockFil());
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
    }] Genererer notat næringsinntekt-kontroll med request-data feilet med feil=${feil.message}-${
      feil.stack
    } med data: ${JSON.stringify(data)}.`,
    genererMetadata(req),
  );
};

export default router;
