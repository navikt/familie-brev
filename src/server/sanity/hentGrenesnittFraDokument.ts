import { hentAvansertDokumentQuery } from './hentAvansertDokumentQuery';
import formaterTilCamelCase from './formaterTilCamelCase';
import {
  ISanityDelmalGrensesnitt,
  ISanityGrensesnitt,
  ISanityValgfeltGrensesnitt,
  Maalform,
} from '../../typer/sanitygrensesnitt';
import {
  IDelmalBlock,
  IDelmalMark,
  IDokumentInnhold,
  IFlettefeltMark,
  ISanityBlock,
  IValfeltBlock,
  IValgfeltMark,
} from '../../typer/sanity';
import { client, Datasett } from './sanityClient';

async function hentSubmalGrensesnitt(
  delmal: IDelmalMark | IDelmalBlock,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett,
): Promise<ISanityDelmalGrensesnitt> {
  if (!delmal.submal) {
    throw new Error(`Submal i ${dokumentId} er tomt for ${maalform} versjon`);
  }
  const skalMedFelt = delmal.skalMedFelt?.felt;
  const id = delmal.submal.id;
  return {
    grensesnitt: await hentGrensesnitt(id, maalform, datasett, false),
    betingelse: skalMedFelt && formaterTilCamelCase(skalMedFelt),
    id: formaterTilCamelCase(id),
    erGjentagende: !!delmal.erGjentagende,
  };
}

async function hentValgfeltGrensesnitt(
  valgfelt: IValgfeltMark | IValfeltBlock,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett,
): Promise<ISanityValgfeltGrensesnitt> {
  if (!valgfelt.valgfelt) {
    throw new Error(`Valgfelt i ${dokumentId} er tomt for ${maalform} versjon`);
  }
  const id = valgfelt.valgfelt.id;
  const valgmuigheter = Promise.all(
    valgfelt.valgfelt.valg.map(async valg => ({
      valgnavn: formaterTilCamelCase(valg.valgmulighet),
      grensesnitt: await hentGrensesnitt(valg.delmal.id, maalform, datasett, false),
    })),
  );
  return {
    navn: formaterTilCamelCase(id),
    valgmuligheter: await valgmuigheter,
    erGjentagende: !!valgfelt.erGjentagende,
  };
}

const hentGrensesnitt = async (
  dokumentId: string,
  maalform: Maalform,
  datasett: Datasett,
  erHoveddokument = true,
): Promise<ISanityGrensesnitt> => {
  const grensesnitt: ISanityGrensesnitt = {
    flettefelter: [],
    delmaler: [],
    valgfelter: [],
  };
  if (erHoveddokument) {
    grensesnitt.flettefelter.push('navn');
    grensesnitt.flettefelter.push('fodselsnummer');
  }

  const dokumentType = erHoveddokument ? 'dokumentmal' : 'delmal';

  const query = hentAvansertDokumentQuery(dokumentType, dokumentId, maalform);
  const dokumentinnhold: IDokumentInnhold = (await client(datasett).fetch(query))[maalform];
  if (dokumentinnhold) {
    for await (const sanityElement of dokumentinnhold) {
      switch (sanityElement._type) {
        case 'block':
          const block = sanityElement as ISanityBlock;

          for await (const mark of block.markDefs) {
            switch (mark._type) {
              case 'flettefelt':
                const flettefelt = mark as IFlettefeltMark;
                if (!flettefelt.felt) {
                  throw new Error(`Flettefelt i ${dokumentId} er tomt for ${maalform} versjon`);
                }
                grensesnitt.flettefelter.push(formaterTilCamelCase(flettefelt.felt.felt));
                break;

              case 'submal':
                const submalMark = mark as IDelmalMark;
                const submalGrensesnitt = await hentSubmalGrensesnitt(
                  submalMark,
                  maalform,
                  dokumentId,
                  datasett,
                );
                grensesnitt.delmaler.push(submalGrensesnitt);
                break;

              case 'valgfelt':
                const valgfelt = mark as IValgfeltMark;
                const valgfeltGrensesnitt = await hentValgfeltGrensesnitt(
                  valgfelt,
                  maalform,
                  dokumentId,
                  datasett,
                );
                grensesnitt.valgfelter.push(valgfeltGrensesnitt);
                break;

              default:
                console.warn(`Ukjent markfelt-type`, mark);
            }
          }
          break;

        case 'delmalBlock':
          const delmalBlock = sanityElement as IDelmalBlock;
          const submalGrensesnitt = await hentSubmalGrensesnitt(
            delmalBlock,
            maalform,
            dokumentId,
            datasett,
          );
          grensesnitt.delmaler.push(submalGrensesnitt);
          break;

        case 'valgfeltBlock':
          const valgfelt = sanityElement as IValfeltBlock;
          const valgfeltGrensesnitt = await hentValgfeltGrensesnitt(
            valgfelt,
            maalform,
            dokumentId,
            datasett,
          );
          grensesnitt.valgfelter.push(valgfeltGrensesnitt);
          break;

        case undefined:
          break;

        default:
          console.warn(`Ukjent type`, sanityElement);
          throw new Error(`Ojda, noe gikk galt. kotakt systemansvarlig hvis problemet vedvarer`);
      }
    }
  }

  return grensesnitt;
};

export default hentGrensesnitt;
