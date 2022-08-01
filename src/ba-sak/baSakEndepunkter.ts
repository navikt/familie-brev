import type { Request, Response } from 'express';
import { client } from '../server/sanity/sanityClient';
import {
  hentBegrunnelseQuery,
  hentBegrunnelserAvTypeQuery,
  hentBegrunnelserForVilkårQuery,
  hentBegrunnelserQuery,
  hentBegrunnelseTekstQuery,
  hentHjemlerForBegrunnelseQuery,
} from './queries';
import begrunnelseSerializer from './begrunnelseSerializer';
import type { BegrunnelseMedData } from './typer';
import { Begrunnelsetype } from './typer';
import {
  validerBegrunnelse,
  validerEøsbegrunnelsedata,
  validerStandardbegrunnelsedata,
} from './valideringer';
import { Feil } from '../server/utils/Feil';
import { logError, logSecure } from '@navikt/familie-logging';
import { hentMiljøvariabler } from '../server/environment';
import router from '../server/routes';

const { BA_DATASETT } = hentMiljøvariabler();

router.get('/status', (_, res) => {
  res.status(200).end();
});

router.get('/begrunnelser', async (_: Request, res: Response) => {
  res.status(200).send(await client(BA_DATASETT).fetch(hentBegrunnelserQuery()));
});

router.get('/begrunnelser/av-type/:type', async (req: Request, res: Response) => {
  const type = req.params.type;
  res.status(200).send(await client(BA_DATASETT).fetch(hentBegrunnelserAvTypeQuery(type)));
});

router.get('/begrunnelser/for-vilkaar/:vilkaar', async (req: Request, res: Response) => {
  const vilkår = req.params.vilkaar;
  res.status(200).send(await client(BA_DATASETT).fetch(hentBegrunnelserForVilkårQuery(vilkår)));
});

router.get('/begrunnelser/:begrunnelseApiNavn/hjemler', async (req: Request, res: Response) => {
  const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
  res
    .status(200)
    .send(await client(BA_DATASETT).fetch(hentHjemlerForBegrunnelseQuery(begrunnelseApiNavn)));
});

router.get('/begrunnelser/:begrunnelseApiNavn', async (req: Request, res: Response) => {
  const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
  res.status(200).send(await client(BA_DATASETT).fetch(hentBegrunnelseQuery(begrunnelseApiNavn)));
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

    const begrunnelseFraSanity = await client(BA_DATASETT).fetch(
      hentBegrunnelseTekstQuery(begrunnelseApiNavn, data.maalform),
    );

    validerBegrunnelse(begrunnelseFraSanity, begrunnelseApiNavn);

    const begrunnelse = begrunnelseSerializer(begrunnelseFraSanity, data);

    res.status(200).send(begrunnelse);
  } catch (error: any) {
    if (error instanceof Feil) {
      return res.status(error.code).send(error.message);
    }

    logError(`Generering av begrunnelse feilet: ${error.message}`);
    logSecure(`Generering av begrunnelse feilet: ${error}`);
    return res.status(500).send(`Generering av begrunnelse feilet: ${error.message}`);
  }
});

export default router;
