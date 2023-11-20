import type { Request, Response } from 'express';
import type { IDokumentData } from '../../typer/dokumentApiBlankett';
import hentDokumentHtmlBlankett from './hentDokumentHtmlBlankett';
import { logError, logSecure } from '@navikt/familie-logging';
import { genererMetadata } from '../utils/logging';
import { genererPdfBlankett } from '../utils/apiBlankett';
import type { IKlageDokumentData } from '../../typer/klageDokumentApi';
import genererKlageDokumentHtml from './genererKlageDokumentHtml';
import router from '../routes';
import fs from 'fs';

const { NODE_ENV } = process.env;

router.post('/blankett/html', async (req: Request, res: Response) => {
  const dokument: IDokumentData = req.body as IDokumentData;

  try {
    const html = await hentDokumentHtmlBlankett(dokument);
    res.send(html);
  } catch (feil) {
    const error = feil as Error;
    logError(
      `Generering av dokument (html) feilet: Sjekk secure-logs`,
      undefined,
      genererMetadata(req),
    );
    loggFeilMedDataTilSecurelog<IDokumentData>(dokument, req, error);
    return res.status(500).send(`Generering av dokument (html) feilet: ${error.message}`);
  }
});

router.post('/blankett/pdf', async (req: Request, res: Response) => {
  const dokument: IDokumentData = req.body as IDokumentData;
  const meta = genererMetadata(req);
  try {
    const html = await hentDokumentHtmlBlankett(dokument);
    const pdf = await genererPdfBlankett(html, meta);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=saksbehandlingsblankett.pdf`);
    res.end(pdf);
  } catch (feil) {
    const error = feil as Error;
    logError(`Generering av dokument (pdf) feilet: Sjekk secure-logs`, undefined, meta);
    loggFeilMedDataTilSecurelog<IDokumentData>(dokument, req, error);

    return res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
  }
});

router.post('/blankett/klage/pdf', async (req: Request, res: Response) => {
  const dokument: IKlageDokumentData = req.body as IKlageDokumentData;
  const meta = genererMetadata(req);
  try {
    const html = await genererKlageDokumentHtml(dokument);
    const pdf = await genererPdfBlankett(html, meta);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=klagesaksbehandlingsblankett.pdf`);
    res.end(pdf);
  } catch (feil) {
    const error = feil as Error;
    logError(`Generering av klagedokument (pdf) feilet: Sjekk secure-logs`, undefined, meta);
    loggFeilMedDataTilSecurelog<IKlageDokumentData>(dokument, req, error);

    return res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
  }
});

if (NODE_ENV !== 'production') {
  const lesMockFil = () => {
    const fileString = fs.readFileSync('./src/server/mock/dummyDataBlankett.json', {
      encoding: 'utf-8',
    });
    return JSON.parse(fileString);
  };

  router.post('/blankett/dummy-pdf', async (req: Request, res: Response) => {
    try {
      const html = await hentDokumentHtmlBlankett(lesMockFil());
      const meta = genererMetadata(req);
      const pdf = await genererPdfBlankett(html, meta);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=saksbehandlingsblankett.pdf`);
      res.end(pdf);
    } catch (feil) {
      const error = feil as Error;
      return res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
    }
  });

  router.get('/blankett/dummy-html', async (_req: Request, res: Response) => {
    try {
      const html = await hentDokumentHtmlBlankett(lesMockFil());
      res.send(html);
    } catch (feil) {
      const error = feil as Error;
      return res.status(500).send(`Generering av dokument (pdf) feilet: ${error.message}`);
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
