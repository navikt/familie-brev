import { Maalform } from '../typer/sanitygrensesnitt';
import { Flettefelt } from '../typer/dokumentApi';

export interface IBegrunnelsedata {
  apiNavn: string;
  gjelderSoker: boolean;
  barnasFodselsdatoer: string;
  fodselsdatoerBarnOppfyllerTriggereOgHarUtbetaling: string;
  fodselsdatoerBarnOppfyllerTriggereOgHarNullutbetaling: string;
  antallBarn: number;
  antallBarnOppfyllerTriggereOgHarUtbetaling: number;
  antallBarnOppfyllerTriggereOgHarNullutbetaling: number;
  maanedOgAarBegrunnelsenGjelderFor: string;
  maalform: Maalform;
  soknadstidspunkt: string;
  avtaletidspunktDeltBosted: string;
  belop: string;
  sokerFaarUtbetaltUtvidetIPerioden: UtvidetPåSøker;
}

export enum UtvidetPåSøker {
  SØKER_FÅR_UTVIDET = 'sokerFaarUtvidet',
  SØKER_HAR_RETT_MEN_FÅR_IKKE = 'sokerHarRettMenFaarIkke',
  SØKER_HAR_IKKE_RETT = 'sokerHarIkkeRett',
}

export interface IPeriodedata {
  [key: string]: IBegrunnelsedata[] | Flettefelt;
}

export enum Valgfelttype {
  BARNET_BARNA = 'barnetBarna',
  BARNET_BARNA_DINE_DITT = 'barnetBarnaDineDitt',
  DU_OG_ELLER_BARN_FØDT = 'duOgEllerBarnFodt',
  DU_OG_ELLER_BARNET_BARNA = 'duOgEllerBarnetBarna',
  FOR_BARN_FØDT = 'forBarnFodt',
  FRA_DATO = 'fraDato',
  DU_FÅR_ELLER_HAR_RETT_TIL_UTVIDET = 'duFaarEllerHarRettTilUtvidet',
}

export enum ValgfeltMuligheter {
  INGEN_BARN = 'ingenBarn',
  ETT_ELLER_FLERE_BARN = 'ettEllerFlereBarn',
  ETT_BARN = 'ettBarn',
  FLERE_BARN = 'flereBarn',
  ETT_BARN_IKKE_SØKER = 'ettBarnIkkeSoker',
  FLERE_BARN_IKKE_SØKER = 'flereBarnIkkeSoker',
  SØKER_OG_BARN = 'sokerOgBarn',
  KUN_BARN = 'kunBarn',
  INGEN_FRA_DATO = 'ingenFraDato',
  HAR_FRA_DATO = 'harFraDato',
  DU_FÅR = 'duFaar',
  DU_HAR_RETT_TIL = 'duHarRettTil',
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

export interface ValgfeltV2Block {
  _type: 'valgFeltV2';
  skalHaStorForbokstav: ValgfeltBlock;
  storForbokstav: boolean;
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
