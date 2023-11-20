export interface IDokumentData {
  behandling: IBehandling;
  vilkår: IVilkår;
  personopplysninger: IPersonopplysninger;
  vedtak: IVedtak;
  søknadsdatoer?: ISøknadsdatoer;
}

export interface IBehandling {
  årsak: EBehandlingÅrsak;
  stønadstype: EStønadType;
  årsakRevurdering?: IÅrsakRevurdering;
  tidligereVedtaksperioder?: ITidligereVedtaksperioder;
}

export interface ITidligereVedtaksperioder {
  infotrygd: ITidligereInnvilgetVedtak;
  sak?: ITidligereInnvilgetVedtak;
  historiskPensjon: boolean;
}

interface ITidligereInnvilgetVedtak {
  harTidligereOvergangsstønad: boolean;
  harTidligereBarnetilsyn: boolean;
  harTidligereSkolepenger: boolean;
  periodeHistorikkOvergangsstønad?: IGrunnlagsdataPeriodeHistorikk[];
}

export interface IGrunnlagsdataPeriodeHistorikk {
  vedtaksperiodeType: EPeriodetype;
  fom: string;
  tom: string;
  antallMåneder: number;
  antallMånederUtenBeløp: number;
}

export interface ISøknadsdatoer {
  søknadsdato: string;
  søkerStønadFra?: string;
}

export type IAvslåVedtak = {
  resultatType: EBehandlingResultat.AVSLÅ;
  avslåBegrunnelse: string;
  avslåÅrsak: EAvslagÅrsak;
};

export type IInnvilgeVedtakOvergangsstønad = {
  resultatType: EBehandlingResultat.INNVILGE;
  periodeBegrunnelse: string;
  inntektBegrunnelse: string;
  perioder: IPeriode[];
  inntekter: IInntekt[];
};

export type IInnvilgeVedtakBarnetilsyn = {
  resultatType: EBehandlingResultat.INNVILGE;
  begrunnelse?: string;
  perioder: Barnetilsynperiode[];
  perioderKontantstøtte: PeriodeMedBeløp[];
  tilleggsstønad: Tilleggsstønad;
};

export type IInnvilgeVedtakSkolepenger = {
  resultatType: EBehandlingResultat.INNVILGE;
  begrunnelse?: string;
  skoleårsperioder: ISkoleårsperiode[];
};

export type ISkoleårsperiode = {
  perioder: IDelårsperiodeSkoleårDto[];
  utgiftsperioder: ISkolepengerUtgift[];
};

export type IDelårsperiodeSkoleårDto = {
  studietype: ESkolepengerStudietype;
  årMånedFra: string;
  årMånedTil: string;
  studiebelastning: number;
};

export const studietypeTilTekst: Record<ESkolepengerStudietype, string> = {
  HØGSKOLE_UNIVERSITET: 'Høgskole / Universitet',
  VIDEREGÅENDE: 'Videregående',
};

export enum ESkolepengerStudietype {
  HØGSKOLE_UNIVERSITET = 'HØGSKOLE_UNIVERSITET',
  VIDEREGÅENDE = 'VIDEREGÅENDE',
}

export type ISkolepengerUtgift = {
  årMånedFra: string;
  stønad: number;
};

export type Tilleggsstønad = {
  harTilleggsstønad: boolean;
  perioder: PeriodeMedBeløp[];
  begrunnelse?: string;
};

export type PeriodeMedBeløp = {
  årMånedFra: string;
  årMånedTil: string;
  beløp: number;
};

export type Barnetilsynperiode = {
  årMånedFra: string;
  årMånedTil: string;
  utgifter: number;
  barn: string[];
};

export type IVedtak =
  | IAvslåVedtak
  | IInnvilgeVedtakOvergangsstønad
  | IInnvilgeVedtakBarnetilsyn
  | IInnvilgeVedtakSkolepenger;
export interface IInntekt {
  årMånedFra: string;
  forventetInntekt?: number;
  samordningsfradrag?: number;
  dagsats?: number;
  månedsinntekt?: number;
}
export enum EBehandlingResultat {
  INNVILGE = 'INNVILGE',
  AVSLÅ = 'AVSLÅ',
  HENLEGGE = 'HENLEGGE',
  BEHANDLE_I_GOSYS = 'BEHANDLE_I_GOSYS',
}

export const behandlingResultatTilTekst: Record<EBehandlingResultat, string> = {
  INNVILGE: 'Innvilge',
  AVSLÅ: 'Avslå',
  HENLEGGE: 'Henlegge',
  BEHANDLE_I_GOSYS: 'Behandle i Gosys',
};

export enum EStønadType {
  OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
  BARNETILSYN = 'BARNETILSYN',
  SKOLEPENGER = 'SKOLEPENGER',
}

export const stønadstypeTilTekst: Record<EStønadType, string> = {
  OVERGANGSSTØNAD: 'Overgangsstønad',
  BARNETILSYN: 'Barnetilsyn',
  SKOLEPENGER: 'Skolepenger',
};

export enum EBehandlingÅrsak {
  KLAGE = 'KLAGE',
  NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
  SANKSJON_1_MND = 'SANKSJON_1_MND',
  SØKNAD = 'SØKNAD',
  MIGRERING = 'MIGRERING',
  G_OMREGNING = 'G_OMREGNING',
  IVERKSETTE_KA_VEDTAK = 'IVERKSETTE_KA_VEDTAK',
  KORRIGERING_UTEN_BREV = 'KORRIGERING_UTEN_BREV',
  PAPIRSØKNAD = 'PAPIRSØKNAD',
  MANUELT_OPPRETTET = 'MANUELT_OPPRETTET',
  SATSENDRING = 'SATSENDRING',
}

export const behandlingÅrsakTilTekst: Record<EBehandlingÅrsak, string> = {
  KLAGE: 'Klage',
  NYE_OPPLYSNINGER: 'Nye opplysninger',
  SANKSJON_1_MND: 'Sanksjon 1 måned',
  SØKNAD: 'Søknad',
  MIGRERING: 'Migrering',
  G_OMREGNING: 'G-omregning',
  IVERKSETTE_KA_VEDTAK: 'Iverksette KA-vedtak (uten brev)',
  KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
  PAPIRSØKNAD: 'Papirsøknad',
  MANUELT_OPPRETTET: 'Manuelt opprettet',
  SATSENDRING: 'Satsendring',
};

export interface IPeriode {
  periodeType: EPeriodetype;
  aktivitet: EAktivitet;
  årMånedFra: string;
  årMånedTil: string;
}

export interface IPeriodeBarnetilsyn {
  årMånedFra: string;
  årMånedTil: string;
  utgifter: number;
  antallBarn: number;
}
export enum EPeriodetype {
  PERIODE_FØR_FØDSEL = 'PERIODE_FØR_FØDSEL',
  HOVEDPERIODE = 'HOVEDPERIODE',
  FORLENGELSE = 'FORLENGELSE',
  MIDLERTIDIG_OPPHØR = 'MIDLERTIDIG_OPPHØR',
  MIGRERING = 'MIGRERING',
  SANKSJON = 'SANKSJON',
  UTVIDELSE = 'UTVIDELSE',
  NY_PERIODE_FOR_NYTT_BARN = 'NY_PERIODE_FOR_NYTT_BARN',
}

export const periodetypeTilTekst: Record<EPeriodetype, string> = {
  PERIODE_FØR_FØDSEL: 'Periode før fødsel',
  HOVEDPERIODE: 'Hovedperiode',
  FORLENGELSE: 'Forlengelse',
  MIDLERTIDIG_OPPHØR: 'Midlertidig opphør',
  MIGRERING: 'Migrering',
  SANKSJON: 'Sanksjon',
  UTVIDELSE: 'Utvidelse',
  NY_PERIODE_FOR_NYTT_BARN: 'Ny periode for nytt barn',
};

export enum EAktivitet {
  IKKE_AKTIVITETSPLIKT = 'IKKE_AKTIVITETSPLIKT',
  BARN_UNDER_ETT_ÅR = 'BARN_UNDER_ETT_ÅR',
  FORSØRGER_I_ARBEID = 'FORSØRGER_I_ARBEID',
  FORSØRGER_I_UTDANNING = 'FORSØRGER_I_UTDANNING',
  FORSØRGER_REELL_ARBEIDSSØKER = 'FORSØRGER_REELL_ARBEIDSSØKER',
  FORSØRGER_ETABLERER_VIRKSOMHET = 'FORSØRGER_ETABLERER_VIRKSOMHET',
  BARNET_SÆRLIG_TILSYNSKREVENDE = 'BARNET_SÆRLIG_TILSYNSKREVENDE',
  FORSØRGER_MANGLER_TILSYNSORDNING = 'FORSØRGER_MANGLER_TILSYNSORDNING',
  FORSØRGER_ER_SYK = 'FORSØRGER_ER_SYK',
  BARNET_ER_SYKT = 'BARNET_ER_SYKT',
}

export const aktivitetsTypeTilTekst: Record<EAktivitet, string> = {
  IKKE_AKTIVITETSPLIKT: 'Ikke aktivitetsplikt',
  BARN_UNDER_ETT_ÅR: 'Barn er under 1 år',
  FORSØRGER_I_ARBEID: 'Forsørger er i arbeid (§15-6 første ledd)',
  FORSØRGER_I_UTDANNING: 'Forsørger er i utdanning (§15-6 første ledd)',
  FORSØRGER_REELL_ARBEIDSSØKER: ' Forsørger er reell arbeidssøker (§15-6 første ledd)',
  FORSØRGER_ETABLERER_VIRKSOMHET: 'Forsørger etablerer egen virksomhet (§15-6 første ledd)',
  BARNET_SÆRLIG_TILSYNSKREVENDE: 'Barnet er særlig tilsynskrevende (§15-6 fjerde ledd)',
  FORSØRGER_MANGLER_TILSYNSORDNING: 'Forsørger mangler tilsynsordning (§15-6 femte ledd)',
  FORSØRGER_ER_SYK: 'Forsørger er syk (§15-6 femte ledd)',
  BARNET_ER_SYKT: 'Barnet er sykt (§15-6 femte ledd)',
};

export interface IPersonopplysninger {
  navn: string;
  personIdent: string;
}

export interface IVilkår {
  vurderinger: IVurdering[];
  grunnlag: IVilkårGrunnlag;
}

export interface IVilkårGrunnlag {
  medlemskap: IMedlemskap;
  sivilstand: ISivilstandVilkår;
  //bosituasjon: IBosituasjon;
  sivilstandsplaner: ISivilstandsplaner;
  barnMedSamvær: IBarnMedSamvær[];
  harAvsluttetArbeidsforhold: boolean;
}

export interface ISivilstandVilkår {
  registergrunnlag: ISivilstandRegistergrunnlag;
}

export interface ISivilstandRegistergrunnlag {
  type: SivilstandType;
  navn?: string;
  gyldigFraOgMed: string;
}

export interface IBarnMedSamvær {
  barnId: string;
  registergrunnlag: IBarnMedSamværRegistergrunnlag;
  søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

export interface IBarnMedSamværRegistergrunnlag {
  navn?: string;
  fødselsnummer?: string;
  harSammeAdresse?: boolean;
  forelder?: IAnnenForelder;
}

export interface IBarnMedSamværSøknadsgrunnlag {
  navn?: string;
  fødselsnummer?: string;
  fødselTermindato?: string;
  erBarnetFødt: boolean;
  harSammeAdresse?: boolean;
  forelder?: IAnnenForelder;
}

export interface IAnnenForelder {
  navn?: string;
  fødselsnummer?: string;
  fødselsdato?: string;
  bosattINorge?: boolean;
  land?: string;
  visningsadresse?: string;
}

export interface IMedlemskap {
  registergrunnlag: IMedlemskapRegistergrunnlag;
}

export interface IMedlemskapRegistergrunnlag {
  nåværendeStatsborgerskap: string[];
  oppholdstatus: IOppholdstatus[];
  statsborgerskap: IStatsborgerskap[];
  folkeregisterpersonstatus: Folkeregisterpersonstatus; //TODO: Definere typen et annet sted enn personopplysninger?
  innflytting: IInnflyttingTilNorge[];
  utflytting: IUtflyttingFraNorge[];
  medlUnntak: IGyldigeVedtakPerioderIMedl;
}

export type IGyldigeVedtakPerioderIMedl = { gyldigeVedtaksPerioder: IGyldigVedtakPeriode[] };
export interface IGyldigVedtakPeriode {
  fraogmedDato: string;
  tilogmedDato: string;
  erMedlemIFolketrygden: boolean;
}

export interface IOppholdstatus {
  fraDato?: string;
  tilDato?: string;
  oppholdstillatelse: Oppholdstatus;
}

export type Oppholdstatus = 'MIDLERTIDIG' | 'PERMANENT' | 'UKJENT';

export interface ISivilstandsplaner {
  harPlaner?: boolean;
  fraDato?: string;
  vordendeSamboerEktefelle?: IPersonDetaljer;
}

export interface IVurdering {
  id: string;
  resultat: Vilkårsresultat;
  behandlingId: string;
  barnId?: string;
  vilkårType: VilkårType;
  delvilkårsvurderinger: IDelvilkår[];
  endretAv: string;
  endretTid: string;
}

export interface Vurderingsfeilmelding {
  [Key: string]: string;
}

export enum IRegelId {
  SLUTT_NODE = 'SLUTT_NODE',

  //Tidligere perioder
  HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING = 'HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING',
  HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD = 'HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD',

  // Medlemskap
  SØKER_MEDLEM_I_FOLKETRYGDEN = 'SØKER_MEDLEM_I_FOLKETRYGDEN',
  MEDLEMSKAP_UNNTAK = 'MEDLEMSKAP_UNNTAK',

  // Opphold
  BOR_OG_OPPHOLDER_SEG_I_NORGE = 'BOR_OG_OPPHOLDER_SEG_I_NORGE',
  OPPHOLD_UNNTAK = 'OPPHOLD_UNNTAK',

  // Samliv
  LEVER_IKKE_MED_ANNEN_FORELDER = 'LEVER_IKKE_MED_ANNEN_FORELDER',
  LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD = 'LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD',

  // Aleneomsorg
  SKRIFTLIG_AVTALE_OM_DELT_BOSTED = 'SKRIFTLIG_AVTALE_OM_DELT_BOSTED',
  NÆRE_BOFORHOLD = 'NÆRE_BOFORHOLD',
  MER_AV_DAGLIG_OMSORG = 'MER_AV_DAGLIG_OMSORG',

  // Mor eller far
  OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN = 'OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN',

  // Sivilstand
  SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON = 'SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON',
  SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING = 'SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING',
  KRAV_SIVILSTAND_PÅKREVD_BEGRUNNELSE = 'KRAV_SIVILSTAND_PÅKREVD_BEGRUNNELSE',
  KRAV_SIVILSTAND_UTEN_PÅKREVD_BEGRUNNELSE = 'KRAV_SIVILSTAND_UTEN_PÅKREVD_BEGRUNNELSE',
  SIVILSTAND_UNNTAK = 'SIVILSTAND_UNNTAK',

  // Nytt barn samme partner
  HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER = 'HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER',

  // Aktivitet
  FYLLER_BRUKER_AKTIVITETSPLIKT = 'FYLLER_BRUKER_AKTIVITETSPLIKT',

  // Sagt opp arbeidsforhold
  SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
  RIMELIG_GRUNN_SAGT_OPP = 'RIMELIG_GRUNN_SAGT_OPP',

  ER_I_ARBEID_ELLER_FORBIGÅENDE_SYKDOM = 'ER_I_ARBEID_ELLER_FORBIGÅENDE_SYKDOM',

  // Inntekt
  INNTEKT_LAVERE_ENN_INNTEKTSGRENSE = 'INNTEKT_LAVERE_ENN_INNTEKTSGRENSE',
  INNTEKT_SAMSVARER_MED_OS = 'INNTEKT_SAMSVARER_MED_OS',

  HAR_ALDER_LAVERE_ENN_GRENSEVERDI = 'HAR_ALDER_LAVERE_ENN_GRENSEVERDI',
  UNNTAK_ALDER = 'UNNTAK_ALDER',
  HAR_DOKUMENTERTE_TILSYNSUTGIFTER = 'HAR_DOKUMENTERTE_TILSYNSUTGIFTER',

  // Skolepenger
  RETT_TIL_OVERGANGSSTØNAD = 'RETT_TIL_OVERGANGSSTØNAD',
  DOKUMENTASJON_AV_UTDANNING = 'DOKUMENTASJON_AV_UTDANNING',
  DOKUMENTASJON_AV_UTGIFTER_UTDANNING = 'DOKUMENTASJON_AV_UTGIFTER_UTDANNING',
  NAVKONTOR_VURDERING = 'NAVKONTOR_VURDERING',
  SAKSBEHANDLER_VURDERING = 'SAKSBEHANDLER_VURDERING',
}
export enum ISvarId {
  // Felles
  JA = 'JA',
  NEI = 'NEI',

  // Aleneomsorg
  SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER = 'SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER',
  SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT = 'SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT',
  SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN = 'SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN',
  SELVSTENDIGE_BOLIGER_SAMME_TOMT = 'SELVSTENDIGE_BOLIGER_SAMME_TOMT',
  NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE = 'NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE',
  TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE = 'TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE',

  // Forutgående medlemskap
  MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR = 'MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
  MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR = 'MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR',
  I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG = 'I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG',
  ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR = 'ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR',
  ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR = 'ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR',
  ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR = 'ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR',
  TOTALVURDERING_OPPFYLLER_FORSKRIFT = 'TOTALVURDERING_OPPFYLLER_FORSKRIFT',
  MEDLEM_MER_ENN_5_ÅR_EØS = 'MEDLEM_MER_ENN_5_ÅR_EØS',
  MEDLEM_MER_ENN_5_ÅR_EØS_ANNEN_FORELDER_TRYGDEDEKKET_I_NORGE = 'MEDLEM_MER_ENN_5_ÅR_EØS_ANNEN_FORELDER_TRYGDEDEKKET_I_NORGE',

  // Opphold
  ARBEID_NORSK_ARBEIDSGIVER = 'ARBEID_NORSK_ARBEIDSGIVER',
  UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER = 'UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER',
  OPPHOLDER_SEG_I_ANNET_EØS_LAND = 'OPPHOLDER_SEG_I_ANNET_EØS_LAND',

  // Sivilstand
  GJENLEVENDE_IKKE_RETT_TIL_YTELSER = 'GJENLEVENDE_IKKE_RETT_TIL_YTELSER',
  GJENLEVENDE_OVERTAR_OMSORG = 'GJENLEVENDE_OVERTAR_OMSORG',

  // Aktivtet barnetilsyn
  ER_I_ARBEID = 'ER_I_ARBEID',
  ETABLERER_EGEN_VIRKSOMHET = 'ETABLERER_EGEN_VIRKSOMHET',
  HAR_FORBIGÅENDE_SYKDOM = 'HAR_FORBIGÅENDE_SYKDOM',
  // Alder på barn
  TRENGER_MER_TILSYN_ENN_JEVNALDRENDE = 'TRENGER_MER_TILSYN_ENN_JEVNALDRENDE',
  FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID = 'FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID',

  // Inntekt
  NOEN_MÅNEDER_OVERSTIGER_6G = 'NOEN_MÅNEDER_OVERSTIGER_6G',
  BRUKER_MOTTAR_IKKE_OVERGANGSSTØNAD = 'BRUKER_MOTTAR_IKKE_OVERGANGSSTØNAD',
}
export interface IVurderingDelvilkår {
  regelId: IRegelId;
  svar?: ISvarId;
  begrunnelse?: string;
}

export interface IDelvilkår {
  resultat: Vilkårsresultat;
  vurderinger: IVurderingDelvilkår[];
}

export enum SivilstandType {
  UOPPGITT = 'UOPPGITT',
  UGIFT = 'UGIFT',
  GIFT = 'GIFT',
  ENKE_ELLER_ENKEMANN = 'ENKE_ELLER_ENKEMANN',
  SKILT = 'SKILT',
  SEPARERT = 'SEPARERT',
  REGISTRERT_PARTNER = 'REGISTRERT_PARTNER',
  SEPARERT_PARTNER = 'SEPARERT_PARTNER',
  SKILT_PARTNER = 'SKILT_PARTNER',
  GJENLEVENDE_PARTNER = 'GJENLEVENDE_PARTNER',
}

export enum Vilkårsresultat {
  OPPFYLT = 'OPPFYLT',
  IKKE_OPPFYLT = 'IKKE_OPPFYLT',
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  IKKE_TATT_STILLING_TIL = 'IKKE_TATT_STILLING_TIL',
  SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
}

export enum Vilkår {
  TIDLIGERE_VEDTAKSPERIODER = 'TIDLIGERE_VEDTAKSPERIODER',
  FORUTGÅENDE_MEDLEMSKAP = 'FORUTGÅENDE_MEDLEMSKAP',
  LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
  SIVILSTAND = 'SIVILSTAND',
  SAMLIV = 'SAMLIV',
  ALENEOMSORG = 'ALENEOMSORG',
  MOR_ELLER_FAR = 'MOR_ELLER_FAR',
  NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
  SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
  AKTIVITET = 'AKTIVITET',
  ALDER_PÅ_BARN = 'ALDER_PÅ_BARN',
  INNTEKT = 'INNTEKT',
  AKTIVITET_ARBEID = 'AKTIVITET_ARBEID',
  DOKUMENTASJON_TILSYNSUTGIFTER = 'DOKUMENTASJON_TILSYNSUTGIFTER',
  RETT_TIL_OVERGANGSSTØNAD = 'RETT_TIL_OVERGANGSSTØNAD',
  DOKUMENTASJON_AV_UTDANNING = 'DOKUMENTASJON_AV_UTDANNING',
  ER_UTDANNING_HENSIKTSMESSIG = 'ER_UTDANNING_HENSIKTSMESSIG',
}

export interface IStatsborgerskap {
  land: string;
  gyldigFraOgMedDato?: string;
  gyldigTilOgMedDato?: string;
}

export enum Folkeregisterpersonstatus {
  BOSATT = 'BOSATT',
  UTFLYTTET = 'UTFLYTTET',
  FORSVUNNET = 'FORSVUNNET',
  DOED = 'DOED',
  OPPHOERT = 'OPPHOERT',
  FOEDSELSREGISTRERT = 'FOEDSELSREGISTRERT',
  MIDLERTIDIG = 'MIDLERTIDIG',
  INAKTIV = 'INAKTIV',
  UKJENT = 'UKJENT',
}

export interface IInnflyttingTilNorge {
  fraflyttingsland?: string;
  fraflyttingssted?: string;
  dato?: string;
}

export interface IUtflyttingFraNorge {
  tilflyttingsland?: string;
  tilflyttingssted?: string;
  dato?: string;
}

export interface IPersonDetaljer {
  navn: string;
  fødselsdato?: string;
  ident?: string;
}

export type VilkårType =
  | Vilkår.FORUTGÅENDE_MEDLEMSKAP
  | Vilkår.LOVLIG_OPPHOLD
  | Vilkår.SIVILSTAND
  | Vilkår.SAMLIV
  | Vilkår.ALENEOMSORG
  | Vilkår.NYTT_BARN_SAMME_PARTNER
  | Vilkår.MOR_ELLER_FAR
  | Vilkår.SAGT_OPP_ELLER_REDUSERT
  | Vilkår.TIDLIGERE_VEDTAKSPERIODER
  | Vilkår.AKTIVITET
  | Vilkår.AKTIVITET_ARBEID
  | Vilkår.INNTEKT
  | Vilkår.ALDER_PÅ_BARN
  | Vilkår.DOKUMENTASJON_TILSYNSUTGIFTER
  | Vilkår.RETT_TIL_OVERGANGSSTØNAD
  | Vilkår.DOKUMENTASJON_AV_UTDANNING
  | Vilkår.ER_UTDANNING_HENSIKTSMESSIG;

export const vilkårTypeTilTekst: Record<VilkårType, string> = {
  FORUTGÅENDE_MEDLEMSKAP: 'Vilkår om forutgående medlemskap',
  LOVLIG_OPPHOLD: 'Vilkår om opphold i Norge',
  SIVILSTAND: 'Vilkår om sivilstand',
  SAMLIV: 'Vilkår om samliv',
  ALENEOMSORG: 'Vilkår om aleneomsorg',
  MOR_ELLER_FAR: 'Vilkår om mor eller far',
  NYTT_BARN_SAMME_PARTNER: 'Vilkår om nytt barn med samme partner',
  SAGT_OPP_ELLER_REDUSERT: 'Vilkår om sagt opp eller redusert stilling',
  AKTIVITET: 'Aktivitet',
  TIDLIGERE_VEDTAKSPERIODER: 'Tidligere vedtaksperioder',
  ALDER_PÅ_BARN: 'Alder på barn',
  INNTEKT: 'Inntekt',
  AKTIVITET_ARBEID: 'Aktivitet arbeid',
  DOKUMENTASJON_TILSYNSUTGIFTER: 'Vilkår om dokumentasjon av tilsynsutgifter',
  DOKUMENTASJON_AV_UTDANNING: 'Vilkår om dokumentasjon av utdanning',
  ER_UTDANNING_HENSIKTSMESSIG: 'Vilkår om utdanningens nødvendighet og hensiktsmessighet',
  RETT_TIL_OVERGANGSSTØNAD: 'Vilkåret om rett til overgangsstønad',
};
// ------ VILKÅRGRUPPE
/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export enum VilkårGruppe {
  TIDLIGERE_VEDTAKSPERIODER = 'TIDLIGERE_VEDTAKSPERIODER',
  MEDLEMSKAP = 'MEDLEMSKAP',
  LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
  SIVILSTAND = 'SIVILSTAND',
  SAMLIV = 'SAMLIV',
  ALENEOMSORG = 'ALENEOMSORG',
  MOR_ELLER_FAR = 'MOR_ELLER_FAR',
  NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
  SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
  AKTIVITET = 'AKTIVITET',
  AKTIVITET_ARBEID = 'AKTIVITET_ARBEID',
  INNTEKT = 'INNTEKT',
  ALDER_PÅ_BARN = 'ALDER_PÅ_BARN',
  DOKUMENTASJON_TILSYNSUTGIFTER = 'DOKUMENTASJON_TILSYNSUTGIFTER',
  RETT_TIL_OVERGANGSSTØNAD = 'RETT_TIL_OVERGANGSSTØNAD',
  DOKUMENTASJON_AV_UTDANNING = 'DOKUMENTASJON_AV_UTDANNING',
  ER_UTDANNING_HENSIKTSMESSIG = 'ER_UTDANNING_HENSIKTSMESSIG',
}

export const resultatTilTekst: Record<Vilkårsresultat, string> = {
  OPPFYLT: 'Oppfylt',
  IKKE_AKTUELL: 'Ikke aktuell',
  IKKE_OPPFYLT: 'Ikke oppfylt',
  IKKE_TATT_STILLING_TIL: 'Ikke tatt stilling til',
  SKAL_IKKE_VURDERES: 'Ikke vurdert',
};

export const svarIdTilTekst: Record<ISvarId, string> = {
  JA: 'Ja',
  NEI: 'Nei',
  ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
  UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
  GJENLEVENDE_OVERTAR_OMSORG:
    'Ja, gjenlevende som etter dødsfallet overtar omsorgen for egne særkullsbarn',
  GJENLEVENDE_IKKE_RETT_TIL_YTELSER:
    'Ja, gjenlevende som etter dødsfallet får barn som avdøde ikke er mor/far til, og som ikke har rett til ytelser etter kap.17',
  ANDRE_FORELDER_MEDLEM_MINST_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
    'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst 5 år etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
  ANDRE_FORELDER_MEDLEM_MINST_7_ÅR_AVBRUDD_MER_ENN_10_ÅR:
    'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen har vært medlem i minst 7 år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
  ANDRE_FORELDER_MEDLEM_SISTE_5_ÅR:
    'Ja, medlem og bosatt når stønadstilfellet oppstod, den andre forelderen er bosatt og har vært medlem siste 5 år',
  I_LANDET_FOR_GJENFORENING_ELLER_GIFTE_SEG:
    'Ja, medlem og bosatt når stønadstilfellet oppstod, kom til landet for gjenforening med ektefelle/samboer med felles barn, eller for å gifte seg med en som er bosatt, og hadde gyldig oppholdstillatelse ved ankomst',
  MEDLEM_MER_ENN_5_ÅR_AVBRUDD_MINDRE_ENN_10_ÅR:
    'Ja, medlem i minst 5 år etter fylte 16 år når krav fremsettes, og avbruddet er mindre enn 10 år',
  MEDLEM_MER_ENN_7_ÅR_AVBRUDD_MER_ENN_10ÅR:
    'Ja, medlem i minst 7 år etter fylte 16 år når krav fremsettes, og avbruddet er mer enn 10 år',
  TOTALVURDERING_OPPFYLLER_FORSKRIFT:
    'Ja, totalvurdering viser at forholdene går inn under forskriften om kravet om 5 års forutgående medlemskap',
  SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER:
    'Ja, søker bor i samme hus som den andre forelderen og huset har 4 eller færre boenheter',
  SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT:
    'Ja, søker bor i samme hus som den andre forelderen og huset har flere enn 4 boenheter, men boforholdet er vurdert nært',
  SELVSTENDIGE_BOLIGER_SAMME_TOMT:
    'Ja, foreldrene bor i selvstendige boliger på samme tomt eller gårdsbruk',
  SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN:
    'Ja, foreldrene bor i selvstendige boliger på samme gårdstun',
  NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE:
    'Ja, foreldrene bor i nærmeste bolig eller rekkehus i samme gate',
  TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE:
    'Ja, foreldrene bor i tilstøtende boliger eller rekkehus i samme gate',
  ER_I_ARBEID: 'Ja, det er dokumentert at brukeren er i arbeid',
  ETABLERER_EGEN_VIRKSOMHET: 'Ja, det er dokumentert at brukeren etablerer egen virksomhet',
  HAR_FORBIGÅENDE_SYKDOM: 'Ja, det er dokumentert at brukeren har forbigående sykdom',
  TRENGER_MER_TILSYN_ENN_JEVNALDRENDE:
    'Ja, barnet har fullført fjerde skoleår og det er dokumentert at barnet trenger vesentlig mer tilsyn enn jevnaldrene',
  FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
    'Ja, barnet har fullført fjerde skoleår og det er dokumentert at forsørgeren har langvarig og/eller uregelmessig arbeidstid',
  NOEN_MÅNEDER_OVERSTIGER_6G: 'Ja, men noen måneder overstiger 6G',
  BRUKER_MOTTAR_IKKE_OVERGANGSSTØNAD: 'Bruker mottar ikke overgangsstønad',
  OPPHOLDER_SEG_I_ANNET_EØS_LAND: 'Oppholder seg i annet EØS-land',
  MEDLEM_MER_ENN_5_ÅR_EØS:
    'Ja, EØS-borger fyller vilkåret om 5 års forutgående medlemskap etter sammenlegging med medlemskapsperioder i annet EU/EØS-land',
  MEDLEM_MER_ENN_5_ÅR_EØS_ANNEN_FORELDER_TRYGDEDEKKET_I_NORGE:
    'Ja, EØS-borger fyller vilkåret om 5 års forutgående medlemskap etter bestemmelsene i annet EU/EØS-land, og den andre forelderen er EØS-borger og trygdedekket i Norge som yrkesaktiv',
};
export const delvilkårTypeTilTekst: Record<IRegelId, string> = {
  SØKER_MEDLEM_I_FOLKETRYGDEN: 'Har bruker vært medlem i folketrygden i de siste 5 årene?',
  BOR_OG_OPPHOLDER_SEG_I_NORGE: 'Bor og oppholder bruker og barna seg i Norge?',
  KRAV_SIVILSTAND_PÅKREVD_BEGRUNNELSE: 'Er krav til sivilstand oppfylt?',
  KRAV_SIVILSTAND_UTEN_PÅKREVD_BEGRUNNELSE: 'Er krav til sivilstand oppfylt?',
  SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON: 'Kan samlivsbrudd likestilles med formell separasjon?',
  SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING:
    'Er det samsvar mellom datoene for separasjon og fraflytting?',
  LEVER_IKKE_MED_ANNEN_FORELDER:
    'Er vilkåret om å ikke leve sammen med den andre av barnets/barnas foreldre oppfylt?',
  LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD:
    'Er vilkåret om å ikke leve i et ekteskapslignende forhold i felles husholdning uten felles barn oppfylt?',
  SKRIFTLIG_AVTALE_OM_DELT_BOSTED: 'Har foreldrene inngått skriftlig avtale om delt bosted?',
  NÆRE_BOFORHOLD: 'Har bruker og den andre forelderen nære boforhold?',
  MER_AV_DAGLIG_OMSORG: 'Har bruker klart mer av den daglige omsorgen?',
  OMSORG_FOR_EGNE_ELLER_ADOPTERTE_BARN: 'Har bruker omsorgen for egne/adopterte barn? ',
  HAR_FÅTT_ELLER_VENTER_NYTT_BARN_MED_SAMME_PARTNER:
    'Har søker fått nytt barn med samme partner (født etter 01.01.2016) eller venter nytt barn med samme partner, etter at en av foreldrene tidligere har mottatt eller fortsatt mottar stønad for et annet felles barn?',
  SAGT_OPP_ELLER_REDUSERT:
    'Har søker sagt opp jobben, tatt frivillig permisjon eller redusert arbeidstiden de siste 6 månedene før søknadstidspunktet?',
  MEDLEMSKAP_UNNTAK: 'Er unntak fra hovedregelen oppfylt?',
  OPPHOLD_UNNTAK: 'Er unntak fra hovedregelen oppfylt?',
  FYLLER_BRUKER_AKTIVITETSPLIKT:
    'Fyller bruker aktivitetsplikt, unntak for aktivitetsplikt eller har barn under 1 år?',
  SIVILSTAND_UNNTAK: 'Er unntak fra krav om sivilstand oppfylt?',
  RIMELIG_GRUNN_SAGT_OPP:
    'Hadde søker rimelig grunn til å si opp jobben eller redusere arbeidstiden?',
  SLUTT_NODE: 'UGYLDIG DELVILKÅR',
  HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING:
    'Har søker tidligere mottatt andre stønader som har betydning for stønadstiden i §15-8 første og andre ledd?',
  HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD: 'Har søker tidligere mottatt overgangsstønad?',
  ER_I_ARBEID_ELLER_FORBIGÅENDE_SYKDOM: 'Er brukeren i arbeid eller har forbigående sykdom?',
  INNTEKT_LAVERE_ENN_INNTEKTSGRENSE:
    'Har brukeren inntekt under 6 ganger et? (Per 1. mars 2023: 711.720 kr / 59.310 kr. Per 1. mars 2022: 668.862 kr / 55.738 kr)',
  INNTEKT_SAMSVARER_MED_OS:
    'Er inntekten i samsvar med den inntekten som er lagt til grunn ved beregning av overgangsstønad?',
  HAR_ALDER_LAVERE_ENN_GRENSEVERDI: 'Har barnet fullført 4.skoleår?',
  UNNTAK_ALDER: 'Oppfylles unntak etter å ha fullført 4. skoleår?',
  HAR_DOKUMENTERTE_TILSYNSUTGIFTER: 'Har brukeren dokumenterte tilsynsutgifter?',
  RETT_TIL_OVERGANGSSTØNAD: 'Er vilkårene for rett til overgangsstønad oppfylt?',
  DOKUMENTASJON_AV_UTDANNING: 'Er det dokumentert at bruker er under utdanning?',
  DOKUMENTASJON_AV_UTGIFTER_UTDANNING:
    'Er det dokumentert at brukeren har utgifter til utdanningen?',
  NAVKONTOR_VURDERING: 'Har NAV-kontoret vurdert utdanningen?',
  SAKSBEHANDLER_VURDERING: 'Er utdanningen nødvendig og hensiktsmessig?',
};

export const sivilstandTilTekst: Record<SivilstandType, string> = {
  UOPPGITT: 'Ikke oppgitt',
  UGIFT: 'Ugift',
  GIFT: 'Gift',
  ENKE_ELLER_ENKEMANN: 'Enke/Enkemann',
  SKILT: 'Skilt',
  SKILT_PARTNER: 'Skilt partner',
  SEPARERT: 'Separert',
  SEPARERT_PARTNER: 'Separert partner',
  REGISTRERT_PARTNER: 'Registrert partner',
  GJENLEVENDE_PARTNER: 'Gjenlevende partner',
};

export interface IÅrsakRevurdering {
  årsak: Årsak;
  opplysningskilde: Opplysningskilde;
  beskrivelse?: string;
}

export enum Årsak {
  ENDRING_INNTEKT = 'ENDRING_INNTEKT',
  ENDRING_AKTIVITET = 'ENDRING_AKTIVITET',
  ENDRING_INNTEKT_OG_AKTIVITET = 'ENDRING_INNTEKT_OG_AKTIVITET',

  SØKNAD_UTVIDELSE_UTDANNING = 'SØKNAD_UTVIDELSE_UTDANNING',
  SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN = 'SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN',
  SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM = 'SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM',
  SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET = 'SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET',
  SØKNAD_NY_PERIODE_NYTT_BARN = 'SØKNAD_NY_PERIODE_NYTT_BARN',
  SØKNAD_NYTT_BGH_SKOLEÅR = 'SØKNAD_NYTT_BGH_SKOLEÅR',
  SØKNAD_NYTT_SKOLEÅR = 'SØKNAD_NYTT_SKOLEÅR',

  OPPHØR_VILKÅR_IKKE_OPPFYLT = 'OPPHØR_VILKÅR_IKKE_OPPFYLT',
  OPPHØR_EGET_ØNSKE = 'OPPHØR_EGET_ØNSKE',

  ENDRING_STØNADSPERIODE = 'ENDRING_STØNADSPERIODE',
  SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE = 'SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE',
  SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE = 'SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE',
  SØKNAD_ETTER_AVSLAG = 'SØKNAD_ETTER_AVSLAG',
  SØKNAD_ETTER_OPPHØR = 'SØKNAD_ETTER_OPPHØR',

  ENDRING_TILSYNSUTGIFTER = 'ENDRING_TILSYNSUTGIFTER',
  ENDRING_ANTALL_BARN = 'ENDRING_ANTALL_BARN',
  ENDRING_UTGIFTER_SKOLEPENGER = 'ENDRING_UTGIFTER_SKOLEPENGER',

  UTESTENGELSE = 'UTESTENGELSE',
  ANNET = 'ANNET',
  KLAGE_OMGJØRING = 'KLAGE_OMGJØRING',
  ANKE_OMGJØRING = 'ANKE_OMGJØRING',
}

export const årsakRevuderingTilTekst: Record<Årsak, string> = {
  ENDRING_INNTEKT: 'Endring i inntekt',
  ENDRING_AKTIVITET: 'Endring i aktivitet',
  ENDRING_INNTEKT_OG_AKTIVITET: 'Endring i inntekt og aktivitet',
  SØKNAD_UTVIDELSE_UTDANNING: 'Søknad om utvidelse - utdanning',
  SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN: 'Søknad om utvidelse - særlig tilsynskrevende barn',
  SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM: 'Søknad om forlengelse - forbigående sykdom',
  SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET:
    'Søknad om forlengelse i påvente av jobb, utdanning, barnepass eller som arbeidssøker',
  SØKNAD_NY_PERIODE_NYTT_BARN: 'Søknad om ny periode for nytt barn',
  SØKNAD_NYTT_BGH_SKOLEÅR: 'Søknad for nytt bhg-/skoleår',
  SØKNAD_NYTT_SKOLEÅR: 'Søknad for nytt skoleår',
  OPPHØR_VILKÅR_IKKE_OPPFYLT: 'Opphør - vilkår ikke oppfylt',
  OPPHØR_EGET_ØNSKE: 'Opphør - eget ønske',
  ENDRING_STØNADSPERIODE: 'Endring av stønadsperiode',
  SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE:
    'Søknad ny periode - hovedperiode ikke brukt opp tidligere',
  SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE: 'Søknad - brukt opp hovedperioden tidligere',
  SØKNAD_ETTER_AVSLAG: 'Søknad etter avslag',
  SØKNAD_ETTER_OPPHØR: 'Søknad etter opphør',
  ENDRING_TILSYNSUTGIFTER: 'Endring i tilsynsutgifter',
  ENDRING_ANTALL_BARN: 'Endring i antall barn brukeren skal ha stønad for',
  ENDRING_UTGIFTER_SKOLEPENGER: 'Endring i utgifter til skolepenger',
  UTESTENGELSE: 'Utestengelse',
  ANNET: 'Annet',
  KLAGE_OMGJØRING: 'Klage - Omgjøring',
  ANKE_OMGJØRING: 'Anke - Omgjøring',
};

export enum Opplysningskilde {
  INNSENDT_SØKNAD = 'INNSENDT_SØKNAD',
  MELDING_MODIA = 'MELDING_MODIA',
  INNSENDT_DOKUMENTASJON = 'INNSENDT_DOKUMENTASJON',
  BESKJED_ANNEN_ENHET = 'BESKJED_ANNEN_ENHET',
  OPPLYSNINGER_INTERNE_KONTROLLER = 'OPPLYSNINGER_INTERNE_KONTROLLER',
}

export const opplysningskildeTilTekst: Record<Opplysningskilde, string> = {
  INNSENDT_SØKNAD: 'Innsendt søknad',
  MELDING_MODIA: 'Melding i Modia',
  INNSENDT_DOKUMENTASJON: 'Innsendt dokumentasjon',
  BESKJED_ANNEN_ENHET: 'Beskjed fra annen enhet',
  OPPLYSNINGER_INTERNE_KONTROLLER: 'Opplysninger fra intern kontroll',
};

export enum EAvslagÅrsak {
  BARN_OVER_ÅTTE_ÅR = 'BARN_OVER_ÅTTE_ÅR',
  MANGLENDE_OPPLYSNINGER = 'MANGLENDE_OPPLYSNINGER',
  STØNADSTID_OPPBRUKT = 'STØNADSTID_OPPBRUKT',
  MINDRE_INNTEKTSENDRINGER = 'MINDRE_INNTEKTSENDRINGER',
  KORTVARIG_AVBRUDD_JOBB = 'KORTVARIG_AVBRUDD_JOBB',
}

export const årsakerTilAvslag: EAvslagÅrsak[] = [
  EAvslagÅrsak.BARN_OVER_ÅTTE_ÅR,
  EAvslagÅrsak.MANGLENDE_OPPLYSNINGER,
  EAvslagÅrsak.STØNADSTID_OPPBRUKT,
  EAvslagÅrsak.MINDRE_INNTEKTSENDRINGER,
  EAvslagÅrsak.KORTVARIG_AVBRUDD_JOBB,
];

export const avslagÅrsakTilTekst: Record<EAvslagÅrsak, string> = {
  BARN_OVER_ÅTTE_ÅR: 'Barnet er over 8 år',
  MANGLENDE_OPPLYSNINGER: 'Manglende opplysninger',
  STØNADSTID_OPPBRUKT: 'Stønadstiden er brukt opp',
  MINDRE_INNTEKTSENDRINGER: 'Ikke 10 % endring inntekt',
  KORTVARIG_AVBRUDD_JOBB: 'Kortvarig avbrudd jobb',
};
