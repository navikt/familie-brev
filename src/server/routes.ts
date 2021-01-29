import express, { Request, Response } from 'express';
import { Datasett } from './sanity/sanityClient';
import { Maalform } from '../typer/sanitygrensesnitt';
import { IAvansertDokumentVariabler, IDokumentData } from '../typer/dokumentApi';
import hentDokumentHtml from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { Feil } from './utils/Feil';
import hentAvansertDokumentHtml from './hentAvansertDokumentHtml';
import { DokumentType } from '../typer/dokumentType';
import validerDokumentApiData from './utils/valideringer/validerDokumentApiData';
import { error, secure, info } from '@navikt/familie-logging';

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
      await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENT);
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
      res.send(html);
    } catch (feil) {
      error(`Generering av dokument (html) feilet: ${feil.message}`);
      secure(`Generering av dokument (html) feilet: ${feil}`);

      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message);
      }
      return res.status(500).send(`${feil}`);
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
      await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENT);
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
      const pdf = await genererPdf(html);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
      res.end(pdf);
    } catch (feil) {
      error(`Generering av dokument (pdf) feilet: ${feil.message}`);
      secure(`Generering av dokument (pdf) feilet: ${feil}`);

      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message);
      }
      return res.status(500).send(`${feil}`);
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
      await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENTMAL);
      const html = await hentAvansertDokumentHtml(
        dokumentVariabler,
        maalform,
        dokumentApiNavn,
        datasett,
      );
      res.send(html);
    } catch (feil) {
      error(`Generering av avansert dokument (html) feilet: ${feil.message}`);
      secure(`Generering av avansert dokument (html) feilet: ${feil}`);

      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message);
      }
      return res.status(500).send(`${feil}`);
    }
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
      await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENTMAL);
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
    } catch (feil) {
      error(`Generering av avansert dokument (pdf) feilet: ${feil.message}`);
      secure(`Generering av avansert dokument (pdf) feilet: ${feil}`);
      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message);
      }
      return res.status(500).send(`${feil}`);
    }
  },
);

const logGenereringsrequestTilSecurelogger = <T>(
  datasett: string,
  dokumentApiNavn: string,
  data: T,
  req: Request,
) => {
  info(
    `[${req.method} - ${req.originalUrl}] Genererer dokument ${dokumentApiNavn} i datasett ${datasett}.`,
  );
  secure(
    `[${req.method} - ${req.originalUrl}] Genererer dokument ${dokumentApiNavn} i datasett ${datasett} med request-data: ${data}.`,
  );
};

export default router;
