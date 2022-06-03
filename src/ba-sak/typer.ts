import { Maalform } from '../typer/sanitygrensesnitt';
import { Flettefelt } from '../typer/dokumentApi';

export type Begrunnelse = IStandardbegrunnelsedata | IEØSBegrunnelsedata | IFritekst;
export type BegrunnelseMedData = IStandardbegrunnelsedata | IEØSBegrunnelsedata;

export interface IStandardbegrunnelsedata {
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
  sokersRettTilUtvidet: SøkersRettTilUtvidet;
  type: Begrunnelsetype.STANDARD_BEGRUNNELSE;
}

export interface IEØSBegrunnelsedata {
  apiNavn: string;
  sokersAktivitet: SøkersAktivitet;
  annenForeldersAktivitet: string;
  annenForeldersAktivitetsland: string;
  barnetsBostedsland: string;
  barnasFodselsdatoer: string;
  antallBarn: number;
  maalform: Maalform;
  type: Begrunnelsetype.EØS_BEGRUNNELSE;
}

export interface IFritekst {
  fritekst: string;
  type: Begrunnelsetype.FRITEKST;
}

export enum SøkersRettTilUtvidet {
  SØKER_FÅR_UTVIDET = 'sokerFaarUtvidet',
  SØKER_HAR_RETT_MEN_FÅR_IKKE = 'sokerHarRettMenFaarIkke',
  SØKER_HAR_IKKE_RETT = 'sokerHarIkkeRett',
}

export interface IPeriodedata {
  [key: string]: IStandardbegrunnelsedata[] | Flettefelt;
}

export enum Valgfelttype {
  BARNET_BARNA = 'barnetBarna',
  BARNET_BARNA_DINE_DITT = 'barnetBarnaDineDitt',
  DU_OG_ELLER_BARN_FØDT = 'duOgEllerBarnFodt',
  DU_OG_ELLER_BARNET_BARNA = 'duOgEllerBarnetBarna',
  FOR_BARN_FØDT = 'forBarnFodt',
  FRA_DATO = 'fraDato',
  DU_FÅR_ELLER_HAR_RETT_TIL_UTVIDET = 'duFaarEllerHarRettTilUtvidet',

  EOS_SOKERS_AKTIVITET_1 = 'eosSokersAktivitet1',
  EOS_SOKERS_AKTIVITET_2 = 'eosSokersAktivitet2',
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

  ARBEIDER_I_NORGE = 'arbeiderINorge',
  UTBETALING_FRA_NAV = 'utbetalingFraNav',
  UTSENDT_ARBEIDSTAKER_FRA_NORGE = 'utsendtArbeidstakerFraNorge',
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

export enum Begrunnelsetype {
  STANDARD_BEGRUNNELSE = 'STANDARD_BEGRUNNELSE',
  EØS_BEGRUNNELSE = 'EØS_BEGRUNNELSE',
  FRITEKST = 'FRITEKST',
}

export enum SøkersAktivitet {
  ARBEIDER_I_NORGE = 'ARBEIDER_I_NORGE',
  SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
  MOTTAR_UTBETALING_FRA_NAV_SOM_ERSTATTER_LØNN = 'MOTTAR_UTBETALING_FRA_NAV_SOM_ERSTATTER_LØNN',
  UTSENDT_ARBEIDSTAKER_FRA_NORGE = 'UTSENDT_ARBEIDSTAKER_FRA_NORGE',
  MOTTAR_UFØRETRYGD_FRA_NORGE = 'MOTTAR_UFØRETRYGD_FRA_NORGE',
  MOTTAR_PENSJON_FRA_NORGE = 'MOTTAR_PENSJON_FRA_NORGE',
  INAKTIV = 'INAKTIV',
}
