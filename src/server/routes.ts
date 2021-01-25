import express from 'express';
import { client, Datasett } from './sanity/sanityClient';
import { ISanityGrensesnitt, Maalform } from '../typer/sanitygrensesnitt';
import hentGrensesnitt from './sanity/hentGrenesnittFraDokument';
import { IAvansertDokumentVariabler, IDokumentData } from '../typer/dokumentApi';
import hentDokumentHtml from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { HttpError } from './utils/HttpError';
import hentAvansertDokumentHtml from './hentAvansertDokumentHtml';

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

const validerDokumentData = async (
  datasett: Datasett,
  maalform: Maalform,
  dokumentApiNavn: string,
  dokumenttype: string,
) => {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new HttpError(`Datasettet "${datasett}" finnes ikke.`, 404);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    throw new HttpError(`Målformen "${maalform}" finnes ikke.`, 404);
  }

  const sanityDokumenter = await client(datasett).fetch(
    `*[_type == "${dokumenttype}" && apiNavn == "${dokumentApiNavn}" ][]`,
  );
  if (sanityDokumenter.length === 0) {
    throw new HttpError(`Fant ikke dokument med apiNavn "${dokumentApiNavn}"`, 404);
  }
};

router.post('/:datasett/dokument/:maalform/:dokumentApiNavn/html', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentApiNavn = req.params.dokumentApiNavn;

  const dokument: IDokumentData = req.body as IDokumentData;

  try {
    await validerDokumentData(datasett, maalform, dokumentApiNavn, 'dokument');
    const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
    res.send(html);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send(`${error}`);
  }
});

router.post('/:datasett/dokument/:maalform/:dokumentApiNavn/pdf', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentApiNavn = req.params.dokumentApiNavn;

  const dokument: IDokumentData = req.body as IDokumentData;

  try {
    await validerDokumentData(datasett, maalform, dokumentApiNavn, 'dokument');
    const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
    const pdf = await genererPdf(html);
    res.setHeader('Content-Length', pdf.byteLength);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
    res.end(pdf);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send(`${error}`);
  }
});

router.post('/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/html', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentApiNavn = req.params.dokumentApiNavn;

  const dokumentVariabler: IAvansertDokumentVariabler = req.body as IAvansertDokumentVariabler;

  try {
    await validerDokumentData(datasett, maalform, dokumentApiNavn, 'dokumentmal');
    const html = await hentAvansertDokumentHtml(
      dokumentVariabler,
      maalform,
      dokumentApiNavn,
      datasett,
    );
    res.send(html);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send(`${error}`);
  }
});

router.post('/:datasett/avansert-dokument/:maalform/:dokumentApiNavn/pdf', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentApiNavn = req.params.dokumentApiNavn;

  const dokumentVariabler: IAvansertDokumentVariabler = req.body as IAvansertDokumentVariabler;

  try {
    await validerDokumentData(datasett, maalform, dokumentApiNavn, 'dokumentmal');
    const html = await hentAvansertDokumentHtml(
      dokumentVariabler,
      maalform,
      dokumentApiNavn,
      datasett,
    );
    const pdf = await genererPdf(html);
    res.setHeader('Content-Length', pdf.byteLength);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
    res.end(pdf);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send(`${error}`);
  }
});

export default router;
