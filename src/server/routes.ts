import express from 'express';
import { client, Datasett } from './sanity/sanityClient';
import hentDokumentHtml from './dokument/hentDokumentHtml';
import { ISanityGrensesnitt, Maalform } from '../typer/sanitygrensesnitt';
import hentGrensesnitt from './sanity/hentGrenesnittFraDokument';
import { IEnkeltDokumentData } from '../typer/dokumentApi';
import hentEnkeltDokumentHtml from './enkeltDokument/hentEnkeltDokumentHtml';

const router = express.Router();

router.get('/status', (_, res) => {
  res.status(200).end();
});

const hentDokumenter = async (datasett: Datasett) => {
  const query = '*[_type == "dokumentmal"][].id';
  return await client(datasett).fetch(query);
};

router.get('/:datasett/dokumenter', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }

  res.send(await hentDokumenter(datasett));
});

const hentRelevanteGrensesnitt = async (
  maalformForesporsel: undefined | string | string[],
  dokumentForesporsel: undefined | string | string[],
  datasett: Datasett,
) => {
  let maalformer: string[];
  if (maalformForesporsel) {
    if (Array.isArray(maalformForesporsel)) {
      maalformer = maalformForesporsel;
    } else {
      maalformer = [maalformForesporsel];
    }
  } else {
    maalformer = Object.values(Maalform);
  }

  let dokumenter: string[];
  if (dokumentForesporsel) {
    if (Array.isArray(dokumentForesporsel)) {
      dokumenter = dokumentForesporsel;
    } else {
      dokumenter = [dokumentForesporsel];
    }
  } else {
    dokumenter = await hentDokumenter(datasett);
  }

  const grensesnitt: ISanityGrensesnitt[] = [];
  for (let maalformIndex = 0; maalformIndex < maalformer.length; maalformIndex++) {
    for (let dokumentIndex = 0; dokumentIndex < dokumenter.length; dokumentIndex++) {
      grensesnitt.push(
        await hentGrensesnitt(
          dokumenter[dokumentIndex],
          maalformer[maalformIndex] as Maalform,
          datasett,
        ),
      );
    }
  }

  return grensesnitt;
};

router.get('/:datasett/grensesnitt', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const dokumentForesporsel = req.query.dokumentId;
  const maalformForesporsel = req.query.maalform;

  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }
  if (typeof dokumentForesporsel === 'object' || typeof maalformForesporsel === 'object') {
    return res.status(400).send(`Ugylding forespørsel. Feil format på query-parameterene.`);
  }

  let grensesnitt: ISanityGrensesnitt[] = [];
  try {
    grensesnitt = await hentRelevanteGrensesnitt(
      maalformForesporsel,
      dokumentForesporsel,
      datasett,
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(`${error}`);
  }

  res.send(grensesnitt);
});

router.post('/:datasett/:maalform/:dokumentId/html', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentId = req.params.dokumentId;
  const dokumetVariabler = req.body;

  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    return res.status(404).send(`Målformen "${maalform}" finnes ikke.`);
  }
  try {
    const html = await hentDokumentHtml(dokumetVariabler, maalform, dokumentId, datasett);
    res.send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`${error}`);
  }
});

router.post('/:datasett/dokument/:maalform/:dokumentId/html', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentId = req.params.dokumentId;

  const dokument: IEnkeltDokumentData = req.body as IEnkeltDokumentData;
  console.log(dokument);

  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    return res.status(404).send(`Målformen "${maalform}" finnes ikke.`);
  }

  try {
    const html = await hentEnkeltDokumentHtml(dokument, maalform, dokumentId, datasett);
    res.send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`${error}`);
  }
});

export default router;
