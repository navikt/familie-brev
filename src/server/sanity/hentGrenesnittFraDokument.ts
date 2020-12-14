import hentDokumentQuery from "./hentDokumentQuery";
import {
  IDokumentInnhold,
  IDokumentliste,
  IFlettefeltMark,
  ISanityBlock,
  ISubmalMark,
  IValgfeltMark,
} from "./sanityElementer";
import { client, Datasett } from "./sanityClient";
import formaterTilCamelCase from "./formaterTilCamelCase";

export enum Maalform {
  BM = "bokmaal",
  NN = "nynorsk",
}

export interface ISubmalGrensesnitt {
  betingelse: string | undefined;
  submalId: string;
  grensesnitt: IGrensesnitt | undefined;
}

export interface IValgfeltGrensesnitt {
  navn: string;
  valgmuigheter: {
    valgnavn: string;
    grensesnitt: IGrensesnitt | undefined;
  }[];
}

export interface IDokument {
  id: string;
  grensesnitt: IGrensesnitt;
}

export interface IGrensesnitt {
  flettefelter: string[];
  submalFelter: ISubmalGrensesnitt[];
  valgfelter: IValgfeltGrensesnitt[];
  lister: IDokument[];
}

export interface IGrensesnittMedMaalform {
  grensesnitt: IGrensesnitt;
  maalform: Maalform;
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
  submal: ISubmalMark,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett
): Promise<ISubmalGrensesnitt> {
  if (!submal.submal) {
    throw new Error(`Submal i ${dokumentId} er tomt for ${maalform} versjon`);
  }
  const skalMedFelt = submal.skalMedFelt?.felt;
  const id = submal.submal.id;
  return {
    grensesnitt: undefinedDersomTomtGrensesnitt(
      await hentGrensesnitt(id, maalform, datasett, false)
    ),
    betingelse: skalMedFelt && formaterTilCamelCase(skalMedFelt),
    submalId: formaterTilCamelCase(id),
  };
}

async function hentValgfeltGrensesnitt(
  valgfelt: IValgfeltMark,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett
): Promise<IValgfeltGrensesnitt> {
  if (!valgfelt.valgfelt) {
    throw new Error(`Valgfelt i ${dokumentId} er tomt for ${maalform} versjon`);
  }
  const tittel = valgfelt.valgfelt.tittel;
  const valgmuigheter = Promise.all(
    valgfelt.valgfelt.valg.map(async (valg) => ({
      valgnavn: formaterTilCamelCase(valg.valgmulighet),
      grensesnitt: undefinedDersomTomtGrensesnitt(
        await hentGrensesnitt(valg.delmal.id, maalform, datasett, false)
      ),
    }))
  );
  return {
    navn: formaterTilCamelCase(tittel),
    valgmuigheter: await valgmuigheter,
  };
}

const hentGrensesnitt = async (
  dokumentId: string,
  maalform: Maalform,
  datasett: Datasett,
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

  const dokumentType = erHoveddokument ? "dokumentmal" : "delmal";

  const query = hentDokumentQuery(dokumentType, dokumentId, maalform);
  const dokumentinnhold: IDokumentInnhold = (
    await client(datasett).fetch(query)
  )[maalform];
  if (dokumentinnhold) {
    for await (const sanityElement of dokumentinnhold) {
      switch (sanityElement._type) {
        case "block":
          const block = sanityElement as ISanityBlock;

          for await (const mark of block.markDefs) {
            switch (mark._type) {
              case "flettefelt":
                const flettefelt = mark as IFlettefeltMark;
                if (!flettefelt.felt) {
                  throw new Error(
                    `Flettefelt i ${dokumentId} er tomt for ${maalform} versjon`
                  );
                }
                grensesnitt.flettefelter.push(
                  formaterTilCamelCase(flettefelt.felt.felt)
                );
                break;

              case "submal":
                const submalMark = mark as ISubmalMark;
                const submalGrensesnitt = await hentSubmalGrensesnitt(
                  submalMark,
                  maalform,
                  dokumentId,
                  datasett
                );
                grensesnitt.submalFelter.push(submalGrensesnitt);
                break;

              case "valgfelt":
                const valgfelt = mark as IValgfeltMark;
                const valgfeltGrensesnitt = await hentValgfeltGrensesnitt(
                  valgfelt,
                  maalform,
                  dokumentId,
                  datasett
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
            id: formaterTilCamelCase(dokumentliste.id),
            grensesnitt: await hentGrensesnitt(
              dokumentliste.id,
              maalform,
              datasett,
              false
            ),
          });
          break;

        default:
          console.warn(`Ukjent type`, sanityElement);
          throw new Error(
            `Ojda, noe gikk galt. kotakt systemansvarlig hvis problemet vedvarer`
          );
      }
    }
  }

  return grensesnitt;
};

export default hentGrensesnitt;
