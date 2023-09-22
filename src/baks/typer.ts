import type { Maalform } from '../typer/sanitygrensesnitt';
import type { Flettefelt } from '../typer/dokumentApi';

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
  gjelderAndreForelder: boolean;
  type: Begrunnelsetype.STANDARD_BEGRUNNELSE;
}

export interface IEØSBegrunnelsedata {
  apiNavn: string;
  sokersAktivitet: Aktivitet;
  annenForeldersAktivitet: Aktivitet;
  annenForeldersAktivitetsland?: string;
  sokersAktivitetsland?: string;
  barnetsBostedsland: string;
  barnasFodselsdatoer: string;
  antallBarn: number;
  maalform: Maalform;
  type: Begrunnelsetype.EØS_BEGRUNNELSE;
  gjelderSoker?: boolean;
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
  DEG_OG_ELLER_BARNET_BARNA = 'degOgEllerBarnetBarna',
  FOR_BARN_FØDT = 'forBarnFodt',
  FRA_DATO = 'fraDato',
  DU_FÅR_ELLER_HAR_RETT_TIL_UTVIDET = 'duFaarEllerHarRettTilUtvidet',
  DU_ELLER_DU_OG_DEN_ANDRE_FORELDEREN = 'duEllerDuOgDenAndreForelderen',
  DEG_DERE_ELLER_SEG = 'degDereEllerSeg',

  EOS_SOKERS_AKTIVITET_1 = 'eosSokersAktivitet1',
  EOS_SOKERS_AKTIVITET_2 = 'eosSokersAktivitet2',
  EOS_ANNEN_FORELDERS_AKTIVITET = 'eosAnnenForeldersAktivitet',
}

export enum ValgfeltMuligheter {
  INGEN_BARN = 'ingenBarn',
  ETT_ELLER_FLERE_BARN = 'ettEllerFlereBarn',
  ETT_BARN = 'ettBarn',
  FLERE_BARN = 'flereBarn',
  ETT_BARN_IKKE_SØKER = 'ettBarnIkkeSoker',
  FLERE_BARN_IKKE_SØKER = 'flereBarnIkkeSoker',
  SØKER_OG_BARN = 'sokerOgBarn',
  SØKER_OG_ANDRE_FORELDER = 'sokerOgAnnenForelder',
  KUN_BARN = 'kunBarn',
  KUN_SØKER = 'kunSoker',
  INGEN_FRA_DATO = 'ingenFraDato',
  HAR_FRA_DATO = 'harFraDato',
  DU_FÅR = 'duFaar',
  DU_HAR_RETT_TIL = 'duHarRettTil',

  ARBEIDER = 'arbeider',
  FÅR_PENGER_SOM_ERSTATTER_LØNN = 'faarPengerSomErstatterLonn',
  UTSENDT_ARBEIDSTAKER_FRA_NORGE = 'utsendtArbeidstakerFraNorge',
  ARBEIDER_PÅ_NORSKREGISTRERT_SKIP = 'arbeiderPaNorskregistrertSkip',
  ARBEIDER_PÅ_NORSK_SOKKEL = 'arbeiderPaNorskSokkel',
  ARBEIDER_FOR_NORSK_FLYSELSKAP = 'arbeiderForNorskFlyselskap',
  ARBEIDER_VED_UTENLANDSK_UTENRIKSSTASJON = 'arbeiderVedUtenlandskUtenriksstasjon',
  UTBETALING_FRA_NAV_I_UTLANDET = 'utbetalingFraNavUnderOppholdIUtlandet',
  IKKE_I_ARBEIDSAKTIVITET = 'ikkeIArbeidsaktivitet',
  MOTTAR_UFØRETRYGD = 'mottarUfoeretrygd',

  SØKER_MOTTAR_PENSJON = 'soekerMottarPensjon',
  MOTTAR_UFØRETRYGD_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET = 'mottarUfoeretrygdFraNAVUnderOppholdIUtlandet',
  MOTTAR_PENSJON_FRA_NORGE_UNDER_OPPHOLD_I_UTLANDET = 'mottarPensjonFraNorgeUnderOppholdIUtlandet',

  EOS_ANNEN_FORELDER_I_ARBEID = 'eosAnnenForelderIArbeid',
  EOS_ANNEN_FORELDER_MOTTAR_UTBETALING = 'eosAnnenForelderMottarUtbetalingSomErstatterLonn',
  EOS_ANNEN_FORELDER_MOTTAR_PENSJON = 'eosAnnenForelderMottarPensjon',
  EOS_ANNEN_FORELDER_FORSIKRET = 'eosAnnenForelderForsikretIBostedsland',
  EOS_ANNEN_FORELDER_INAKTIV = 'eosAnnenForelderInaktiv',
  EOS_ANNEN_FORELDER_UTSENDT_ARBEIDSTAKER = 'eosAnnenForelderUtsendtArbeidstaker',
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

export enum Aktivitet {
  ARBEIDER = 'ARBEIDER',
  SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
  MOTTAR_UTBETALING_SOM_ERSTATTER_LØNN = 'MOTTAR_UTBETALING_SOM_ERSTATTER_LØNN',
  UTSENDT_ARBEIDSTAKER_FRA_NORGE = 'UTSENDT_ARBEIDSTAKER_FRA_NORGE',
  MOTTAR_UFØRETRYGD = 'MOTTAR_UFØRETRYGD',
  MOTTAR_PENSJON = 'MOTTAR_PENSJON',
  ARBEIDER_PÅ_NORSKREGISTRERT_SKIP = 'ARBEIDER_PÅ_NORSKREGISTRERT_SKIP',
  ARBEIDER_PÅ_NORSK_SOKKEL = 'ARBEIDER_PÅ_NORSK_SOKKEL',
  ARBEIDER_FOR_ET_NORSK_FLYSELSKAP = 'ARBEIDER_FOR_ET_NORSK_FLYSELSKAP',
  ARBEIDER_VED_UTENLANDSK_UTENRIKSSTASJON = 'ARBEIDER_VED_UTENLANDSK_UTENRIKSSTASJON',
  MOTTAR_UTBETALING_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET = 'MOTTAR_UTBETALING_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET',
  MOTTAR_UFØRETRYGD_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET = 'MOTTAR_UFØRETRYGD_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET',
  MOTTAR_PENSJON_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET = 'MOTTAR_PENSJON_FRA_NAV_UNDER_OPPHOLD_I_UTLANDET',
  INAKTIV = 'INAKTIV',
  I_ARBEID = 'I_ARBEID',
  FORSIKRET_I_BOSTEDSLAND = 'FORSIKRET_I_BOSTEDSLAND',
  IKKE_AKTUELT = 'IKKE_AKTUELT',
  UTSENDT_ARBEIDSTAKER = 'UTSENDT_ARBEIDSTAKER',
}
