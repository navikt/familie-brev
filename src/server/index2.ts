import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { client, Datasett } from "./sanity/sanityClient";
import hentGrensesnitt, {
  IGrensesnitt,
  Maalform,
} from "./sanity/hentGrenesnittFraDokument";

const buildDir = path.join(process.cwd() + "/build");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(buildDir));

app.get("/status", (req, res) => {
  res.status(200).end();
});

const hentDokumenter = async (datasett: Datasett) => {
  const query = '*[_type == "dokumentmal"][].id';
  return await client(datasett).fetch(query);
};

app.get("/:datasett/dokumenter", async (req, res) => {
  const datasett = req.params.datasett as Datasett;
  if (!Object.values(Datasett).includes(datasett)) {
    return res.status(404).send(`Datasettet "${datasett}" finnes ikke.`);
  }

  res.send(await hentDokumenter);
});

app.get("/:datasett/grensesnitt", async (req, res) => {
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
    return res.status(400).send(`Ugylding forespørsel`);
  }

  try {
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
    for (const maalform in maalformer) {
      for (const dokumentId in dokumenter) {
        grensesnitt.push(
          await hentGrensesnitt(dokumentId, maalform as Maalform, datasett)
        );
      }
    }
  } catch (error) {
    return res.status(400).send(`Ugylding forespørsel: ${error}`);
  }

  res.send(grensesnitt);
});

const port = 8000;
console.log("checking port", port);
app.listen(port, () => {
  console.log(`Server now listening on port: ${port}`);
});
