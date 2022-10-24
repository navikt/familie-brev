import type { Request, Response } from 'express';
import express from 'express';
import type { Datasett } from './sanity/sanityClient';
import type { Maalform } from '../typer/sanitygrensesnitt';
import type {
  IAvansertDokumentVariabler,
  IBrevMedSignatur,
  IDokumentData,
  IFritekstbrevMedSignatur,
  ISøknad,
} from '../typer/dokumentApi';
import hentDokumentHtml from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { Feil } from './utils/Feil';
import hentAvansertDokumentHtml from './hentAvansertDokumentHtml';
import validerDokumentApiData from './utils/valideringer/validerDokumentApiData';
import { logError, logInfo, logSecure } from '@navikt/familie-logging';
import { hentAvansertDokumentFelter, hentFlettefelter } from './hentAvansertDokumentFelter';
import { hentAvansertDokumentNavn } from './hentAvansertDokumentNavn';
import { lagManueltBrevHtml } from './lagManueltBrevHtml';
import { genererSøknadHtml } from './søknadgenerator';

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
      logFerdigstilt(req);
      res.send(html);
    } catch (feil: any) {
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
    } catch (feil: any) {
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

    const brevMedSignatur = req.body as IBrevMedSignatur;

    logGenereringsrequestTilSecurelogger<IAvansertDokumentVariabler>(
      datasett,
      dokumentApiNavn,
      brevMedSignatur.brevFraSaksbehandler,
      req,
    );
    try {
      await validerDokumentApiData(datasett, maalform);
      const html = await hentAvansertDokumentHtml(
        brevMedSignatur,
        maalform,
        dokumentApiNavn,
        datasett,
      );
      logFerdigstilt(req);
      res.send(html);
    } catch (error: any) {
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
    logFerdigstilt(req);
    res.send({ data: { dokument: felter, flettefelter }, status: 'SUKSESS' });
  },
);

router.get('/:datasett/avansert-dokument/navn', async (req: Request, res: Response) => {
  const datasett = req.params.datasett as Datasett;

  const navn = await hentAvansertDokumentNavn(datasett).catch(err => {
    res.status(err.code).send(`Henting av avanserte dokumenter feilet: ${err.message}`);
  });
  logFerdigstilt(req);
  res.send({ data: navn, status: 'SUKSESS' });
});

router.get(
  '/:datasett/avansert-dokument/navn/:hentUpubliserte',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const hentUpubliserte = req.params.hentUpubliserte;

    const navn = await hentAvansertDokumentNavn(datasett, hentUpubliserte).catch(err => {
      res.status(err.code).send(`Henting av avanserte dokumenter feilet: ${err.message}`);
    });
    logFerdigstilt(req);
    res.send({ data: navn, status: 'SUKSESS' });
  },
);

router.post(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/pdf',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const dokumentApiNavn = req.params.dokumentApiNavn;

    const brevMedSignatur = req.body as IBrevMedSignatur;

    logGenereringsrequestTilSecurelogger<IAvansertDokumentVariabler>(
      datasett,
      dokumentApiNavn,
      brevMedSignatur.brevFraSaksbehandler,
      req,
    );
    try {
      await validerDokumentApiData(datasett, maalform);
      const html = await hentAvansertDokumentHtml(
        brevMedSignatur,
        maalform,
        dokumentApiNavn,
        datasett,
      );
      const pdf = await genererPdf(html);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
      res.end(pdf);
    } catch (error: any) {
      if (error instanceof Feil) {
        return res.status(error.code).send(error.message);
      }

      logError(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
      logSecure(`Generering av avansert dokument (pdf) feilet: ${error}`);
      return res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
    }
  },
);

router.post('/fritekst-brev', async (req: Request, res: Response) => {
  const brev = req.body as IFritekstbrevMedSignatur;
  try {
    const html = lagManueltBrevHtml(brev);
    const pdf = await genererPdf(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=brev.pdf`);
    res.end(pdf);
  } catch (error: any) {
    if (error instanceof Feil) {
      return res.status(error.code).send(error.message);
    }
    logError(`Generering av fritekstbrev (pdf) feilet: ${error.message}`);
    logSecure(`Generering av fritekstbrev (pdf) feilet: ${error}`);
    return res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
  }
});

router.post('/fritekst-brev/html', async (req: Request, res: Response) => {
  const brev = req.body as IFritekstbrevMedSignatur;
  try {
    const html = lagManueltBrevHtml(brev);
    logFerdigstilt(req);
    res.send(html);
  } catch (error: any) {
    if (error instanceof Feil) {
      return res.status(error.code).send(error.message);
    }
    logError(`Generering av fritekstbrev (pdf) feilet: ${error.message}`);
    logSecure(`Generering av fritekstbrev (pdf) feilet: ${error}`);
    return res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
  }
});

router.post('/generer-soknad', async (req: Request, res: Response) => {
  const søknad = req.body as ISøknad;
  try {
    const html = genererSøknadHtml(søknad);
    const pdf = await genererPdf(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=soknad.pdf`);
    res.end(pdf);
  } catch (error: any) {
    if (error instanceof Feil) {
      return res.status(error.code).send(error.message);
    }
    logError(`Generering av søknad (pdf) feilet: ${error.message}`);
    logSecure(`Generering av søknad (pdf) feilet: ${error}`);
    return res.status(500).send(`Generering av søknad (pdf) feilet: ${error.message}`);
  }
});

function genererMetadata(req: Request) {
  const callId = req.header('nav-call-id');
  return callId ? { x_callId: callId } : {};
}

export const logFerdigstilt = (req: Request) => {
  const meta = genererMetadata(req);
  logInfo(`[${req.method} - ${req.originalUrl}] Request ferdigstilt`, meta);
};

export const logGenereringsrequestTilSecurelogger = <T>(
  datasett: string,
  dokumentApiNavn: string,
  data: T,
  req: Request,
) => {
  const meta = genererMetadata(req);
  logInfo(
    `[${req.method} - ${req.originalUrl}] Genererer dokument ${dokumentApiNavn} i datasett ${datasett}.`,
    meta,
  );
  logSecure(
    `[${req.method} - ${
      req.originalUrl
    }] Genererer dokument ${dokumentApiNavn} i datasett ${datasett} med request-data: ${JSON.stringify(
      data,
    )}.`,
    meta,
  );
};

export default router;
