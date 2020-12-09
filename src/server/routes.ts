import express from "express";
import { client, Datasett } from "./sanity/sanityClient";
import hentGrensesnitt, {
  IGrensesnitt,
  Maalform,
} from "./sanity/hentGrenesnittFraDokument";
import hentDokumentHtml from "./dokument/hentDokumentHtml";

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).end();
});

const hentDokumenter = async (datasett: Datasett) => {
  const query = '*[_type == "dokumentmal"][].id';
  return await client(datasett).fetch(query);
};

router.get("/:datasett/dokumenter", async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }

  res.send(await hentDokumenter);
});

const hentRelevanteGrensesnitt = async (
  maalformForesporsel: undefined | string | string[],
  dokumentForesporsel: undefined | string | string[],
  datasett: Datasett
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

  let grensesnitt: IGrensesnitt[] = [];
  for (let i = 0; i < maalformer.length; i++) {
    for (let i = 0; i < dokumenter.length; i++) {
      grensesnitt.push(
        await hentGrensesnitt(
          dokumenter[i],
          maalformer[i] as Maalform,
          datasett
        )
      );
    }
  }

  return grensesnitt;
};

router.get("/:datasett/grensesnitt", async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  const dokumentForesporsel = req.query.dokumentId;
  const maalformForesporsel = req.query.maalform;

  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }
  if (
    typeof dokumentForesporsel === "object" ||
    typeof maalformForesporsel === "object"
  ) {
    return res
      .status(400)
      .send(`Ugylding forespørsel. Feil format på query-parameterene.`);
  }

  let grensesnitt: IGrensesnitt[] = [];
  try {
    grensesnitt = await hentRelevanteGrensesnitt(
      maalformForesporsel,
      dokumentForesporsel,
      datasett
    );
  } catch (e) {
    return res.status(500).send(`Ugylding forespørsel ${e}`);
  }

  res.send(grensesnitt);
});

router.post("/:datasett/:maalform/:dokumentId/html", async (req, res) => {
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

  const html = await hentDokumentHtml(
    dokumetVariabler,
    maalform,
    dokumentId,
    datasett
  );

  res.send(html);
});

export default router;
