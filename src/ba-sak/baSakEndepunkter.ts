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

const router = express.Router();
const DATASETT = Datasett.TEST;

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

router.get(
  '/begrunnelser/:begrunnelseApiNavn/tekst/:maalform',
  async (req: Request, res: Response) => {
    const begrunnelseApiNavn = req.params.begrunnelseApiNavn;
    const målform = req.params.maalform;

    // TODO lag serlializers for begrunnelsene

    res
      .status(200)
      .send(await client(DATASETT).fetch(hentBegrunnelseTekstQuery(begrunnelseApiNavn, målform)));
  },
);

export default router;
