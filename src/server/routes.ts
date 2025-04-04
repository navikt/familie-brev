import type { Request, Response } from 'express';
import express from 'express';
import type { Datasett } from './sanity/sanityClient';
import type { Maalform } from '../typer/sanitygrensesnitt';
import type {
  IAvansertDokumentVariabler,
  IBrevMedSignatur,
  IDelmal,
  IDokumentData,
  IFritekstbrevMedSignatur,
  ISøknad,
} from '../typer/dokumentApiBrev';
import { hentDokumentHtml } from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { Feil } from './utils/Feil';
import { hentAvansertDokumentHtml } from './hentAvansertDokumentHtml';
import { validerDokumentApiData } from './utils/valideringer/validerDokumentApiData';
import { logError, logInfo, logSecure } from '@navikt/familie-logging';
import {
  Brevmeny,
  BrevStruktur,
  hentBrevmenyBlokker,
  hentFlettefelterMedType,
} from './hentAvansertDokumentFelter';
import { hentAvansertDokumentNavn } from './hentAvansertDokumentNavn';
import { lagManueltBrevBaksHtml, lagManueltBrevHtml } from './lagManueltBrevHtml';
import { genererSøknadHtml } from './søknadgenerator';
import { hentDelmalblokkHtml } from './hentDelmalBlockHtml';

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
        res.status(feil.code).send(feil.message);
      } else {
        logError(`Generering av dokument (html) feilet: ${feil.message}`);
        logSecure(`Generering av dokument (html) feilet: ${feil}`);
        res.status(500).send(`Generering av dokument (html) feilet: ${feil.message}`);
      }
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
        res.status(feil.code).send(feil.message);
      } else {
        logError(`Generering av dokument (pdf) feilet: ${feil.message}`);
        logSecure(`Generering av dokument (pdf) feilet: ${feil}`);
        res.status(500).send(`Generering av dokument (pdf) feilet: ${feil.message}`);
      }
    }
  },
);

router.post(
  '/:datasett/delmalblokk/:maalform/:delmalblokk/html',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const delmalblokk = req.params.delmalblokk;
    const delmal = req.body as IDelmal;
    try {
      const brevSomHtml = await hentDelmalblokkHtml(delmal, maalform, delmalblokk, datasett);
      const responseData: RessursSuksess<string> = { data: brevSomHtml, status: 'SUKSESS' };
      res.send(responseData);
    } catch (error: any) {
      if (error instanceof Feil) {
        res.status(error.code).send(error.message);
      } else {
        logError(`Generering av delmalBlock (html) feilet: ${error.message}`);
        logSecure(`Generering av delmalBlock (html) feilet: ${error}`);
        res.status(500).send(`Generering av delmalBlock (html) feilet: ${error.message}`);
      }
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
        res.status(error.code).send(error.message);
      } else {
        logError(`Generering av avansert dokument (html) feilet: ${error.message}`);
        logSecure(`Generering av avansert dokument (html) feilet: ${error}`);
        res.status(500).send(`Generering av avansert dokument (html) feilet: ${error.message}`);
      }
    }
  },
);

async function hentBrevStruktur(
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
): Promise<BrevStruktur> {
  const brevmeny: Brevmeny = await hentBrevmenyBlokker(datasett, maalform, avansertDokumentNavn);
  const flettefelter = await hentFlettefelterMedType(datasett, avansertDokumentNavn);
  return { dokument: brevmeny, flettefelter: flettefelter };
}

export type RessursSuksess<T> = {
  data: T;
  status: string;
};

router.get(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/felter/v3',
  async (req: Request, response: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const avansertDokumentNavn = req.params.dokumentApiNavn;

    hentBrevStruktur(datasett, maalform, avansertDokumentNavn)
      .then(returData => {
        const responseData: RessursSuksess<BrevStruktur> = { data: returData, status: 'SUKSESS' };
        response.send(responseData);
      })
      .catch(err => {
        response.status(err.code).send(`Henting av brevstruktur feilet: ${err.message}`);
      });
  },
);

router.get('/:datasett/avansert-dokument/navn', async (req: Request, res: Response) => {
  const datasett = req.params.datasett as Datasett;

  const navn = await hentAvansertDokumentNavn(datasett).catch(err => {
    res.status(err.code).send(`Henting av avanserte dokumenter feilet: ${err.message}`);
    return;
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
      return;
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
        res.status(error.code).send(error.message);
      } else {
        logError(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
        logSecure(`Generering av avansert dokument (pdf) feilet: ${error}`);
        res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
      }
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
      res.status(error.code).send(error.message);
    } else {
      logError(`Generering av fritekstbrev (pdf) feilet: ${error.message}`);
      logSecure(`Generering av fritekstbrev (pdf) feilet: ${error}`);
      res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
    }
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
      res.status(error.code).send(error.message);
    } else {
      logError(`Generering av fritekstbrev (pdf) feilet: ${error.message}`);
      logSecure(`Generering av fritekstbrev (pdf) feilet: ${error}`);
      res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
    }
  }
});

router.post('/fritekst-brev/baks/html', async (req: Request, res: Response) => {
  const brev = req.body as IFritekstbrevMedSignatur;
  try {
    const html = lagManueltBrevBaksHtml(brev);
    logFerdigstilt(req);
    res.send(html);
  } catch (error: any) {
    if (error instanceof Feil) {
      res.status(error.code).send(error.message);
    } else {
      logError(`Generering av fritekstbrev (pdf) feilet: ${error.message}`);
      logSecure(`Generering av fritekstbrev (pdf) feilet: ${error}`);
      res.status(500).send(`Generering av avansert dokument (pdf) feilet: ${error.message}`);
    }
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
      res.status(error.code).send(error.message);
    } else {
      logError(`Generering av søknad (pdf) feilet: ${error.message}`);
      logSecure(`Generering av søknad (pdf) feilet: ${error}`);
      res.status(500).send(`Generering av søknad (pdf) feilet: ${error.message}`);
    }
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
  if (datasett !== 'ef-brev') {
    logSecure(
      `[${req.method} - ${
        req.originalUrl
      }] Genererer dokument ${dokumentApiNavn} i datasett ${datasett} med request-data: ${JSON.stringify(
        data,
      )}.`,
      meta,
    );
  }
};

export default router;
