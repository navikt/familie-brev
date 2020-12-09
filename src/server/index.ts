import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { client, Datasett } from "./sanity/sanityClient";
import hentGrensesnitt, {
  IGrensesnitt,
  Maalform,
} from "./sanity/hentGrenesnittFraDokument";
import hentDokumentHtml from "./dokument/hentDokumentHtml";

const buildDir = path.join(process.cwd() + "/build");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(buildDir));

app.use(function (req, res, next) {
  const acceptedOrigins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://familie-brev.intern.nav.no",
  ];
  const defaultAcceptedOrigin = "https://familie-brev.intern.nav.no";
  const origin = req.header("origin")?.toLowerCase();

  res.setHeader(
    "Access-Control-Allow-Origin",
    origin && acceptedOrigins.includes(origin) ? origin : defaultAcceptedOrigin
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

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

  let grensesnitt: IGrensesnitt[] = [];

  grensesnitt = await hentRelevanteGrensesnitt(
    maalformForesporsel,
    dokumentForesporsel,
    datasett
  );

  res.send(grensesnitt);
});

app.post("/:datasett/:maalform/:dokumentId/html", async (req, res) => {
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

const port = 8000;
console.log("checking port", port);
app.listen(port, () => {
  console.log(`Server now listening on port: ${port}`);
});
