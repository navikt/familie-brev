import express, { Request, Response } from 'express';
import { Datasett } from './sanity/sanityClient';
import { Maalform } from '../typer/sanitygrensesnitt';
import { IAvansertDokumentVariabler, IDokumentData } from '../typer/dokumentApi';
import hentDokumentHtml from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { Feil } from './utils/Feil';
import hentAvansertDokumentHtml from './hentAvansertDokumentHtml';
import validerDokumentApiData from './utils/valideringer/validerDokumentApiData';
import { logError, logInfo, logSecure } from '@navikt/familie-logging';
import { hentAvansertDokumentFelter, hentFlettefelter } from './hentAvansertDokumentFelter';

const router = express.Router();

router.get('/status', (_, res) => {
  res.status(200).end();
});

router.post(
  '/:datasett/dokument/:maalform/:dokumentApiNavn/html',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const dokumentApiNavn = req.params.dokumentApiNavn;

    const dokument: IDokumentData = req.body as IDokumentData;

    logGenereringsrequestTilSecurelogger<IDokumentData>(datasett, dokumentApiNavn, dokument, req);
    try {
      await validerDokumentApiData(datasett, maalform);
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
      res.send(html);
    } catch (feil) {
      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message);
      }

      logError(`Generering av dokument (html) feilet: ${feil.message}`);
      logSecure(`Generering av dokument (html) feilet: ${feil}`);
      return res.status(500).send(`Generering av dokument (html) feilet: ${feil.message}`);
    }
  },
);

router.post(
  '/:datasett/dokument/:maalform/:dokumentApiNavn/pdf',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const dokumentApiNavn = req.params.dokumentApiNavn;

    const dokument: IDokumentData = req.body as IDokumentData;

    logGenereringsrequestTilSecurelogger<IDokumentData>(datasett, dokumentApiNavn, dokument, req);
    try {
      await validerDokumentApiData(datasett, maalform);
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
      const pdf = await genererPdf(html);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
      res.end(pdf);
    } catch (feil) {
      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message);
      }

      logError(`Generering av dokument (pdf) feilet: ${feil.message}`);
      logSecure(`Generering av dokument (pdf) feilet: ${feil}`);
      return res.status(500).send(`Generering av dokument (pdf) feilet: ${feil.message}`);
    }
  },
);

router.post(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/html',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const dokumentApiNavn = req.params.dokumentApiNavn;

    const dokumentVariabler: IAvansertDokumentVariabler = req.body as IAvansertDokumentVariabler;

    logGenereringsrequestTilSecurelogger<IAvansertDokumentVariabler>(
      datasett,
      dokumentApiNavn,
      dokumentVariabler,
      req,
    );
    try {
      await validerDokumentApiData(datasett, maalform);
      const html = await hentAvansertDokumentHtml(
        dokumentVariabler,
        maalform,
        dokumentApiNavn,
        datasett,
      );
      res.send(html);
    } catch (error) {
      if (error instanceof Feil) {
        return res.status(error.code).send(error.message);
      }

      logError(`Generering av avansert dokument (html) feilet: ${error.message}`);
      logSecure(`Generering av avansert dokument (html) feilet: ${error}`);
      return res
        .status(500)
        .send(`Generering av avansert dokument (html) feilet: ${error.message}`);
    }
  },
);

router.get(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/felter',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const avansertDokumentNavn = req.params.dokumentApiNavn;

    const felter = await hentAvansertDokumentFelter(datasett, maalform, avansertDokumentNavn).catch(
      err => {
        res.status(err.code).send(`Henting av felter feilet: ${err.message}`);
      },
    );

    const flettefelter = await hentFlettefelter(datasett, avansertDokumentNavn).catch(err => {
      res.status(err.code).send(`Henting av flettefelter feilet: ${err.message}`);
    });

    res.send({ data: { dokument: felter, flettefelter }, status: 'SUKSESS' });
  },
);

router.post(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/pdf',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const dokumentApiNavn = req.params.dokumentApiNavn;

    const dokumentVariabler: IAvansertDokumentVariabler = req.body as IAvansertDokumentVariabler;

    logGenereringsrequestTilSecurelogger<IAvansertDokumentVariabler>(
      datasett,
      dokumentApiNavn,
      dokumentVariabler,
      req,
    );
    try {
      await validerDokumentApiData(datasett, maalform);
      const html = await hentAvansertDokumentHtml(
        dokumentVariabler,
        maalform,
        dokumentApiNavn,
        datasett,
      );
      const pdf = await genererPdf(html);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
      res.end(pdf);
    } catch (error) {
      if (error instanceof Feil) {
        return res.status(error.code).send(error.message);
      }

      logError(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
      logSecure(`Generering av avansert dokument (pdf) feilet: ${error}`);
      return res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
    }
  },
);

const logGenereringsrequestTilSecurelogger = <T>(
  datasett: string,
  dokumentApiNavn: string,
  data: T,
  req: Request,
) => {
  logInfo(
    `[${req.method} - ${req.originalUrl}] Genererer dokument ${dokumentApiNavn} i datasett ${datasett}.`,
  );
  logSecure(
    `[${req.method} - ${
      req.originalUrl
    }] Genererer dokument ${dokumentApiNavn} i datasett ${datasett} med request-data: ${JSON.stringify(
      data,
    )}.`,
  );
};

export default router;
