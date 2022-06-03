import { Feil } from '../server/utils/Feil';
import {
  BegrunnelseMedData,
  FlettefeltBlock,
  MarkDef,
  ValgfeltBlock,
  ValgfeltMuligheter,
  Valgfelttype,
} from './typer';
import {
  hentBarnetBarnaDineDittValg,
  hentBarnetBarnaValg,
  hentDuFårEllerHarRettTilUtvidetValg,
  hentDuOgEllerBarnetBarnaValg,
  hentDuOgEllerBarnFodtValg,
  hentForBarnFodtValg,
  hentFraDatoValg,
} from './formateringsvalg';

export const formaterValgfelt = (valgfeltBlock: ValgfeltBlock, data: BegrunnelseMedData) => {
  switch (valgfeltBlock.apiNavn) {
    case Valgfelttype.FOR_BARN_FØDT:
      return valgfeltSerializer(valgfeltBlock, hentForBarnFodtValg(data), data);
    case Valgfelttype.DU_OG_ELLER_BARNET_BARNA:
      return valgfeltSerializer(valgfeltBlock, hentDuOgEllerBarnetBarnaValg(data), data);
    case Valgfelttype.BARNET_BARNA:
      return valgfeltSerializer(valgfeltBlock, hentBarnetBarnaValg(data), data);
    case Valgfelttype.BARNET_BARNA_DINE_DITT:
      return valgfeltSerializer(valgfeltBlock, hentBarnetBarnaDineDittValg(data), data);
    case Valgfelttype.DU_OG_ELLER_BARN_FØDT:
      return valgfeltSerializer(valgfeltBlock, hentDuOgEllerBarnFodtValg(data), data);
    case Valgfelttype.FRA_DATO:
      return valgfeltSerializer(valgfeltBlock, hentFraDatoValg(data), data);
    case Valgfelttype.DU_FÅR_ELLER_HAR_RETT_TIL_UTVIDET:
      return valgfeltSerializer(valgfeltBlock, hentDuFårEllerHarRettTilUtvidetValg(data), data);
    default:
      throw new Feil(
        `Ukjent formulering fra santity. Det er ikke laget noen funksjonalitet for ${valgfeltBlock.apiNavn}`,
        400,
      );
  }
};

export const formaterFlettefelt = (flettefeltBlock: FlettefeltBlock, data: any): string => {
  const flettefeltVerdi = data[flettefeltBlock.flettefelt];

  if (flettefeltVerdi === undefined || flettefeltVerdi === '') {
    throw new Feil(
      `Flettefeltet "${flettefeltBlock.flettefelt}" mangler for begrunnelse ${data.apiNavn}`,
      400,
    );
  }

  return flettefeltVerdi;
};

const flettefeltSerializer = (delmalblokk: any[], block: any, data: BegrunnelseMedData) => {
  const markDef: MarkDef = delmalblokk[0].markDefs.find(
    (markDef: MarkDef) => markDef._key === block.marks[0],
  );
  if (markDef._type !== 'flettefelt') {
    throw new Feil('Formuleringer skal kun ha flettefelter som markeringer', 500);
  }
  return formaterFlettefelt(
    {
      _type: 'flettefelt',
      flettefelt: markDef.flettefeltReferanse.felt,
    },
    data,
  );
};

const validerFormulering = (
  delmalblokk: any[],
  ønsketValgmulighet: string,
  valgfeltBlock: ValgfeltBlock,
) => {
  if (delmalblokk.length > 1) {
    throw new Feil(
      `Formuleringsvalget ${ønsketValgmulighet} i formuleringen ${valgfeltBlock.apiNavn} går over flere linjer. 
        Formuleringer skal være på max én linje.`,
      500,
    );
  }
};

const settSammenBlokkerTilTekst = (delmalblokk: any[], data: BegrunnelseMedData) =>
  delmalblokk[0].children
    .map((block: any) => {
      if (block.marks.length > 1) {
        throw new Feil(`Mer enn ett mark`, 500);
      }
      if (block.marks.length === 1) {
        return flettefeltSerializer(delmalblokk, block, data);
      } else {
        return block.text;
      }
    })
    .join('');

const valgfeltSerializer = (
  valgfeltBlock: ValgfeltBlock,
  ønsketValgmulighet: ValgfeltMuligheter,
  data: BegrunnelseMedData,
) => {
  const delmalblokk: any[] | undefined = valgfeltBlock.valg.find(
    valg => valg.valgmulighet === ønsketValgmulighet,
  )?.delmal[data.maalform];

  if (!delmalblokk || delmalblokk.length === 0) {
    return '';
  }

  validerFormulering(delmalblokk, ønsketValgmulighet, valgfeltBlock);

  return settSammenBlokkerTilTekst(delmalblokk, data);
};
