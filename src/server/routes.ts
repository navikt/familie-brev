import express from 'express';
import { Datasett } from './sanity/sanityClient';
import { Maalform } from '../typer/sanitygrensesnitt';
import { IAvansertDokumentVariabler, IDokumentData } from '../typer/dokumentApi';
import hentDokumentHtml from './hentDokumentHtml';
import { genererPdf } from './utils/api';
import { Feil } from './utils/Feil';
import hentAvansertDokumentHtml from './hentAvansertDokumentHtml';
import { DokumentType } from '../typer/dokumentType';
import validerDokumentApiData from './utils/valideringer/validerDokumentApiData';

const router = express.Router();

router.get('/status', (_, res) => {
  res.status(200).end();
});

router.post('/:datasett/dokument/:maalform/:dokumentApiNavn/html', async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const maalform = req.params.maalform as Maalform;
  const dokumentApiNavn = req.params.dokumentApiNavn;

  const dokument: IDokumentData = req.body as IDokumentData;

  try {
    await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENT);
    const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
    res.send(html);
  } catch (error) {
    if (error instanceof Feil) {
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
    await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENT);
    const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett);
    const pdf = await genererPdf(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${dokumentApiNavn}.pdf`);
    res.end(pdf);
  } catch (error) {
    if (error instanceof Feil) {
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
    await validerDokumentApiData(datasett, maalform, dokumentApiNavn, DokumentType.DOKUMENTMAL);
    const html = await hentAvansertDokumentHtml(
      dokumentVariabler,
      maalform,
      dokumentApiNavn,
      datasett,
    );
    res.send(html);
  } catch (error) {
    if (error instanceof Feil) {
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
  } catch (error) {
    console.log(error);
    if (error instanceof Feil) {
      return res.status(error.code).send(error.message);
    }
    return res.status(500).send(`${error}`);
  }
});

export default router;
