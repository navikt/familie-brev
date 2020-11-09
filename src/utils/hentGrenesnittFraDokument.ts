import hentDokumentQuery from "./hentDokumentQuery";
import { client } from "./sanity";
import {
  IDokumentInnhold,
  IDokumentliste,
  IFlettefeltMark,
  ISanityBlock,
  ISubmalMark,
  IValgfeltMark,
} from "./sanityElementer";

export interface ISubmalGrensesnitt {
  betingelse: string | undefined;
  submalNavn: string;
  grensesnitt: IGrensesnitt | undefined;
}

export interface IValgfeltGrensesnitt {
  navn: string;
  valgmuigheter: {
    valgnavn: string;
    grensesnitt: IGrensesnitt;
  }[];
}

export interface IDokument {
  dokumenttittel: string;
  grensesnitt: IGrensesnitt;
}

export interface IGrensesnitt {
  flettefelter: string[];
  submalFelter: ISubmalGrensesnitt[];
  valgfelter: IValgfeltGrensesnitt[];
  lister: IDokument[];
}

function undefinedDersomTomtGrensesnitt(
  grensesnitt: IGrensesnitt
): IGrensesnitt | undefined {
  return grensesnitt.lister.length === 0 &&
    grensesnitt.valgfelter.length === 0 &&
    grensesnitt.flettefelter.length === 0 &&
    grensesnitt.submalFelter.length === 0
    ? undefined
    : grensesnitt;
}

async function hentSubmalGrensesnitt(
  submal: ISubmalMark
): Promise<ISubmalGrensesnitt> {
  const skalMedFelt = submal.skalMedFelt?.felt;
  const tittel = submal.submal.tittel;
  return {
    grensesnitt: undefinedDersomTomtGrensesnitt(
      await hentGrensesnitt(tittel, false)
    ),
    betingelse: skalMedFelt,
    submalNavn: tittel,
  };
}

async function hentValgfeltGrensesnitt(
  valgfelt: IValgfeltMark
): Promise<IValgfeltGrensesnitt> {
  const tittel = valgfelt.valgfelt.tittel;
  const valgmuigheter = Promise.all(
    valgfelt.valgfelt.valg.map(async (valg) => ({
      valgnavn: valg.valgmulighet,
      grensesnitt: await hentGrensesnitt(valg.dokumentmal.tittel, false),
    }))
  );
  return {
    navn: tittel,
    valgmuigheter: await valgmuigheter,
  };
}

const hentGrensesnitt = async (
  dokumentNavn: string,
  erHoveddokument: boolean = true
): Promise<IGrensesnitt> => {
  const grensesnitt: IGrensesnitt = {
    flettefelter: [],
    submalFelter: [],
    valgfelter: [],
    lister: [],
  };
  if (erHoveddokument) {
    grensesnitt.flettefelter.push("navn");
    grensesnitt.flettefelter.push("fodselsnummer");
  }

  const query = hentDokumentQuery(dokumentNavn);
  const dokumentinnhold: IDokumentInnhold = (await client.fetch(query)).innhold;

  for await (const sanityElement of dokumentinnhold) {
    switch (sanityElement._type) {
      case "block":
        const block = sanityElement as ISanityBlock;

        for await (const mark of block.markDefs) {
          switch (mark._type) {
            case "flettefelt":
              const flettefelt = mark as IFlettefeltMark;
              grensesnitt.flettefelter.push(flettefelt.felt.felt);
              break;

            case "submal":
              const submal = mark as ISubmalMark;
              const skalMedFelt = await hentSubmalGrensesnitt(submal);
              grensesnitt.submalFelter.push(skalMedFelt);
              break;

            case "valgfelt":
              const valgfelt = mark as IValgfeltMark;
              const valgfeltGrensesnitt = await hentValgfeltGrensesnitt(
                valgfelt
              );
              grensesnitt.valgfelter.push(valgfeltGrensesnitt);
              break;

            default:
              console.warn(`Ukjent markfelt-type`, mark);
          }
        }

        break;

      case "dokumentliste":
        const dokumentliste = sanityElement as IDokumentliste;
        grensesnitt.lister.push({
          dokumenttittel: dokumentliste.tittel,
          grensesnitt: await hentGrensesnitt(dokumentliste.tittel, false),
        });
        break;

      default:
        console.warn(`Ukjent type`, sanityElement);
    }
  }

  return grensesnitt;
};

export default hentGrensesnitt;
