import { Maalform } from '../typer/sanitygrensesnitt';
import { Flettefelt } from '../typer/dokumentApi';

export interface IBegrunnelsedata {
  apiNavn: string;
  gjelderSoker: boolean;
  barnasFodselsdatoer: string;
  antallBarn: number;
  maanedOgAarBegrunnelsenGjelderFor: string;
  maalform: Maalform;
}

export interface IPeriodedata {
  [key: string]: IBegrunnelsedata[] | Flettefelt;
}

export enum Valgfelttype {
  FOR_BARN_FØDT = 'forBarnFodt',
  DU_OG_ELLER_BARNET_BARNA = 'duOgEllerBarnetBarna',
  BARNET_BARNA = 'barnetBarna',
  BARNET_BARNA_DINE_DITT = 'barnetBarnaDineDitt',
  FRA_OG_TIL_FORMULERING = 'fraOgTilFormulering',
}

export enum ValgfeltMuligheter {
  INGEN_BARN = 'ingenBarn',
  ETT_ELLER_FLERE_BARN = 'ettEllerFlereBarn',
  ETT_BARN = 'ettBarn',
  FLERE_BARN = 'flereBarn',
  ETT_BARN_IKKE_SØKER = 'ettBarnIkkeSoker',
  FLERE_BARN_IKKE_SØKER = 'flereBarnIkkeSoker',
}

export interface SpanBlock {
  _type: 'span';
  text: string;
}

export interface ValgfeltBlock {
  _type: 'valgfelt';
  apiNavn: Valgfelttype;
  valg: ValgMulighet[];
}

export interface ValgMulighet {
  delmal: any;
  valgmulighet: string;
}

export interface FlettefeltBlock {
  _type: 'flettefelt';
  flettefelt: string;
}

export interface BegrunnelseBlock {
  _type: string;
  children: (SpanBlock | ValgfeltBlock | FlettefeltBlock)[];
}

export interface MarkDef {
  _key: string;
  _type: string;
  flettefeltReferanse: {
    _type: 'flettefelt';
    felt: string;
  };
}
