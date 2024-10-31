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
} from '../typer/dokumentApiBrev';
import hentDokumentHtml from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { Feil } from './utils/Feil';
import hentAvansertDokumentHtml from './hentAvansertDokumentHtml';
import validerDokumentApiData from './utils/valideringer/validerDokumentApiData';
import { logError, logInfo, logSecure } from '@navikt/familie-logging';
import {
  AlleFlettefelter,
  Brevmeny,
  BrevStruktur,
  DokumentMal,
  hentAvansertDokumentFelter,
  hentAvansertDokumentFelter_V20220307,
  hentBrevmenyBlokker,
  hentFlettefelter,
  hentFlettefelterMedType,
} from './hentAvansertDokumentFelter';
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

router.get(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/felter',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const avansertDokumentNavn = req.params.dokumentApiNavn;

    const felter = await hentAvansertDokumentFelter(datasett, maalform, avansertDokumentNavn).catch(
      err => {
        res.status(err.code).send(`Henting av felter feilet: ${err.message}`);
        return;
      },
    );

    const flettefelter = await hentFlettefelter(datasett, avansertDokumentNavn).catch(err => {
      res.status(err.code).send(`Henting av flettefelter feilet: ${err.message}`);
      return;
    });

    logFerdigstilt(req);
    res.send({ data: { dokument: felter, flettefelter }, status: 'SUKSESS' });
  },
);

router.get(
  '/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/felter/v2',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett;
    const maalform = req.params.maalform as Maalform;
    const avansertDokumentNavn = req.params.dokumentApiNavn;

    const felter = await hentAvansertDokumentFelter_V20220307(
      datasett,
      maalform,
      avansertDokumentNavn,
    ).catch(err => {
      res.status(err.code).send(`Henting av felter feilet: ${err.message}`);
      return;
    });

    const flettefelter = await hentFlettefelter(datasett, avansertDokumentNavn).catch(err => {
      res.status(err.code).send(`Henting av flettefelter feilet: ${err.message}`);
      return;
    });
    logFerdigstilt(req);
    res.send({ data: { dokument: felter, flettefelter }, status: 'SUKSESS' });
  },
);

async function hentFlettefelterErrorWrapper(
  datasett: Datasett,
  avansertDokumentNavn: string,
  res: Response<any, Record<string, any>>,
): Promise<AlleFlettefelter> {
  return await hentFlettefelterMedType(datasett, avansertDokumentNavn).catch(err => {
    res.status(err.code).send(`Henting av flettefelter feilet: ${err.message}`);
    return { flettefeltReferanse: [] };
  });
}

// async function hentDelmaler(
//     datasett: Datasett,
//     maalform: Maalform,
//     avansertDokumentNavn: string,
//     res: Response<any, Record<string, any>>,
// ) {
//     return await hentDelmalerSortert(datasett, maalform, avansertDokumentNavn).catch(err => {
//         res.status(err.code).send(`Henting av delmaler feilet: ${err.message}`);
//         return {delmalerSortert: []};
//     });
// }

async function hentBrevmeny(
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
  res: Response<any, Record<string, any>>,
): Promise<Brevmeny> {
  return await hentBrevmenyBlokker(datasett, maalform, avansertDokumentNavn).catch(err => {
    res.status(err.code).send(`Henting av brevmeny feilet: ${err.message}`);
    return { brevmenyBlokker: [] };
  });
}

async function hentBrevStruktur(
  datasett: Datasett,
  maalform: Maalform,
  avansertDokumentNavn: string,
  res: Response<any, Record<string, any>>,
): Promise<BrevStruktur> {
  const brevmeny: Brevmeny = await hentBrevmeny(datasett, maalform, avansertDokumentNavn, res);
  //const delmaler: Delmaler = await hentDelmaler(datasett, maalform, avansertDokumentNavn, res);
  const flettefelter = await hentFlettefelterErrorWrapper(datasett, avansertDokumentNavn, res);

  const dokumentMal: DokumentMal = {
    //delmalerSortert: delmaler.delmalerSortert,
    brevmenyBlokker: brevmeny.brevmenyBlokker,
  };

  return { dokument: dokumentMal, flettefelter: flettefelter };
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

    const returData = await hentBrevStruktur(datasett, maalform, avansertDokumentNavn, response);

    const responseData: RessursSuksess<BrevStruktur> = { data: returData, status: 'SUKSESS' };

    response.send(responseData);
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
