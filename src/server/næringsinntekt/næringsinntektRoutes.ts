import express, { type Request, type Response } from 'express';
import { genererMetadata } from '../utils/logging';
import { genererPdfBlankett } from '../utils/apiBlankett';
import { logFerdigstilt } from '../routes';
import { logError, logSecure } from '@navikt/familie-logging';
import { hentDokumentHtmlNæringsinntekt } from './hentDokumentHtmlNæringsinntekt';
import { NæringsinntektDokumentData } from '../../typer/dokumentApiNæringsinntekt';

const router = express.Router();

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
