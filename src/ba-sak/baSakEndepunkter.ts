import express, { Request, Response } from 'express';
import { client, Datasett } from '../server/sanity/sanityClient';
import {
  hentBegrunnelseQuery,
  hentBegrunnelserAvTypeQuery,
  hentBegrunnelserForVilkårQuery,
  hentBegrunnelserQuery,
  hentBegrunnelseTekstQuery,
  hentHjemlerForBegrunnelseQuery,
} from './queries';
import begrunnelseSerializer from './begrunnelseSerializer';
import { IBegrunnelsedata } from './typer';
import { validerBegrunnelse, validerBegrunnelsedata } from './valideringer';
import { Feil } from '../server/utils/Feil';
import { logError, logSecure } from '@navikt/familie-logging';

const router = express.Router();
const DATASETT = Datasett.BA;

router.get('/status', (_, res) => {
  res.status(200).end();
});

router.get('/begrunnelser', async (_: Request, res: Response) => {
  res.status(200).send(await client(DATASETT).fetch(hentBegrunnelserQuery()));
});

router.get('/begrunnelser/av-type/:type', async (req: Request, res: Response) => {
  const type = req.params.type;
  res.status(200).send(await client(DATASETT).fetch(hentBegrunnelserAvTypeQuery(type)));
});

router.get('/begrunnelser/for-vilkaar/:vilkaar', async (req: Request, res: Response) => {
  const vilkår = req.params.vilkaar;
  res.status(200).send(await client(DATASETT).fetch(hentBegrunnelserForVilkårQuery(vilkår)));
});

router.get('/begrunnelser/:begrunnelseApiNavn/hjemler', async (req: Request, res: Response) => {
  const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
  res
    .status(200)
    .send(await client(DATASETT).fetch(hentHjemlerForBegrunnelseQuery(begrunnelseApiNavn)));
});

router.get('/begrunnelser/:begrunnelseApiNavn', async (req: Request, res: Response) => {
  const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
  res.status(200).send(await client(DATASETT).fetch(hentBegrunnelseQuery(begrunnelseApiNavn)));
});

router.post('/begrunnelser/:begrunnelseApiNavn/tekst/', async (req: Request, res: Response) => {
  const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
  const data = req.body as IBegrunnelsedata;
  try {
    validerBegrunnelsedata(data);

    const begrunnelseFraSanity = await client(DATASETT).fetch(
      hentBegrunnelseTekstQuery(begrunnelseApiNavn, data.maalform),
    );

    validerBegrunnelse(begrunnelseFraSanity, begrunnelseApiNavn);

    const begrunnelse = begrunnelseSerializer(begrunnelseFraSanity, data);

    res.status(200).send(begrunnelse);
  } catch (error) {
    if (error instanceof Feil) {
      return res.status(error.code).send(error.message);
    }

    logError(`Generering av begrunnelse feilet: ${error.message}`);
    logSecure(`Generering av begrunnelse feilet: ${error}`);
    return res.status(500).send(`Generering av begrunnelse feilet: ${error.message}`);
  }
});

export default router;
