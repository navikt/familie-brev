import type { Request, Response } from 'express';
import express from 'express';
import { client } from '../server/sanity/sanityClient.js';
import { hentBegrunnelseTekstQuery, hentKsBegrunnelserQuery } from './queries.js';
import type { BegrunnelseMedData } from './typer.js';
import { Begrunnelsetype } from './typer.js';
import {
  validerBegrunnelse,
  validerEøsbegrunnelsedata,
  validerStandardbegrunnelsedata,
} from './valideringer.js';
import { Feil } from '../server/utils/Feil.js';
import { logError } from '@navikt/familie-logging';
import { logSecure } from '../server/utils/teamLogs.js';
import { hentMiljøvariabler } from '../server/environment.js';
import { escape } from '../server/utils/escapeString.js';
import { begrunnelseSerializer } from './begrunnelseSerializer.js';

const router = express.Router();

const { KS_DATASETT } = hentMiljøvariabler();

router.get('/begrunnelser', async (_: Request, res: Response) => {
  res.status(200).send(await client(KS_DATASETT).fetch(hentKsBegrunnelserQuery()));
});

router.post('/begrunnelser/:begrunnelseApiNavn/tekst/', async (req: Request, res: Response) => {
  const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
  const data = req.body as BegrunnelseMedData;
  try {
    if (data.type === Begrunnelsetype.STANDARD_BEGRUNNELSE) {
      validerStandardbegrunnelsedata(data);
    } else if (data.type === Begrunnelsetype.EØS_BEGRUNNELSE) {
      validerEøsbegrunnelsedata(data);
    }

    const begrunnelseFraSanity = await client(KS_DATASETT).fetch(
      hentBegrunnelseTekstQuery(begrunnelseApiNavn, data.maalform, KS_DATASETT),
    );

    validerBegrunnelse(begrunnelseFraSanity, begrunnelseApiNavn);

    const begrunnelse = begrunnelseSerializer(begrunnelseFraSanity, data);

    res.status(200).send(begrunnelse);
  } catch (error: any) {
    if (error instanceof Feil) {
      res.status(error.code).send(escape(error.message));
    } else {
      logError(`Generering av begrunnelse feilet: ${error.message}`);
      logSecure(`Generering av begrunnelse feilet: ${error}`);
      res.status(500).send(`Generering av begrunnelse feilet: ${escape(error.message)}`);
    }
  }
});

export default router;
