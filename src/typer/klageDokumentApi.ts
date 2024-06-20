export interface IKlageDokumentData {
  behandling: IKlageBehandling;
  personopplysninger: IPersonopplysninger;
  formkrav: IFormkravVilkår;
  vurdering: IVurdering;
}

export interface IPersonopplysninger {
  navn: string;
  personIdent: string;
}

export interface IKlageBehandling {
  eksternFagsakId: string;
  stønadstype: EStønadstype;
  klageMottatt: string;
  resultat: EKlageBehandlingResultat;
  påklagetVedtak?: IPåklagetVedtak;
}

export interface IPåklagetVedtak {
  behandlingstype: string;
  resultat: string;
  vedtakstidspunkt: string;
}

export enum EStønadstype {
  OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
  SKOLEPENGER = 'SKOLEPENGER',
  BARNETILSYN = 'BARNETILSYN',
  BARNETRYGD = 'BARNETRYGD',
  KONTANTSTØTTE = 'KONTANTSTØTTE',
}

export const stønadstypeTilTekst: Record<EStønadstype, string> = {
  OVERGANGSSTØNAD: 'Overgangsstønad',
  SKOLEPENGER: 'Skolepenger',
  BARNETILSYN: 'Barnetilsyn',
  BARNETRYGD: 'Barnetrygd',
  KONTANTSTØTTE: 'Kontantstøtte',
};

export enum EKlageBehandlingResultat {
  MEDHOLD = 'MEDHOLD',
  IKKE_MEDHOLD = 'IKKE_MEDHOLD',
  IKKE_MEDHOLD_FORMKRAV_AVVIST = 'IKKE_MEDHOLD_FORMKRAV_AVVIST',
  HENLAGT = 'HENLAGT',
}

export const behandlingResultatTilTekst: Record<EKlageBehandlingResultat, string> = {
  MEDHOLD: 'Medhold',
  IKKE_MEDHOLD: 'Oversendt til KA',
  IKKE_MEDHOLD_FORMKRAV_AVVIST: 'Ikke medhold formkrav avvist',
  HENLAGT: 'Henlagt',
};

export interface IFormkravVilkår {
  klagePart: EFormVilkår;
  klagefristOverholdt: EFormVilkår;
  klagefristOverholdtUnntak?: FormkravFristUnntak;
  klageKonkret: EFormVilkår;
  klageSignert: EFormVilkår;
  saksbehandlerBegrunnelse?: string;
  brevtekst?: string;
}

export enum FormkravFristUnntak {
  UNNTAK_KAN_IKKE_LASTES = 'UNNTAK_KAN_IKKE_LASTES',
  UNNTAK_SÆRLIG_GRUNN = 'UNNTAK_SÆRLIG_GRUNN',
  IKKE_UNNTAK = 'IKKE_UNNTAK',
  IKKE_SATT = 'IKKE_SATT',
}

export const formkravFristUnntakTilTekst: Record<FormkravFristUnntak, string> = {
  UNNTAK_KAN_IKKE_LASTES: 'Ja, klager kan ikke lastes for å ha sendt inn klage etter fristen',
  UNNTAK_SÆRLIG_GRUNN: 'Ja, av særlige grunner er det rimelig at klagen blir behandlet',
  IKKE_UNNTAK: 'Nei',
  IKKE_SATT: 'Ikke satt',
};

export enum EFormVilkår {
  OPPFYLT = 'OPPFYLT',
  IKKE_OPPFYLT = 'IKKE_OPPFYLT',
  SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
  IKKE_SATT = 'IKKE_SATT',
}

export const formVilkårTilTekst: Record<EFormVilkår, string> = {
  OPPFYLT: 'Oppfylt',
  IKKE_OPPFYLT: 'Ikke oppfylt',
  SKAL_IKKE_VURDERES: 'Skal ikke vurderes',
  IKKE_SATT: 'Ikke satt',
};

export interface IVurdering {
  vedtak: EVedtak;
  årsak?: EÅrsakOmgjøring;
  begrunnelseOmgjøring?: string;
  hjemmel?: Hjemmel;
  innstillingKlageinstans?: string;
  interntNotat?: string;
}

// VEDTAK
export enum EVedtak {
  OMGJØR_VEDTAK = 'OMGJØR_VEDTAK',
  OPPRETTHOLD_VEDTAK = 'OPPRETTHOLD_VEDTAK',
}

export const vedtakTilTekst: Record<EVedtak, string> = {
  OMGJØR_VEDTAK: 'Omgjør vedtak',
  OPPRETTHOLD_VEDTAK: 'Oppretthold vedtak',
};

// ÅRSAK
export enum EÅrsakOmgjøring {
  FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
  FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
  FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
  FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
  KØET_BEHANDLING = 'KØET_BEHANDLING',
  ANNET = 'ANNET',
}

export const årsakTilTekst: Record<EÅrsakOmgjøring, string> = {
  FEIL_I_LOVANDVENDELSE: 'Feil lovanvendelse',
  FEIL_REGELVERKSFORSTÅELSE: 'Feil regelverksforståelse',
  FEIL_ELLER_ENDRET_FAKTA: 'Feil eller endret fakta',
  FEIL_PROSESSUELL: 'Prosessuell feil',
  KØET_BEHANDLING: 'Søker eller den andre forelderen har en åpen behandling',
  ANNET: 'Annet',
};

enum FolketrygdlovenHjemmelEF {
  FT_FEMTEN_TO = 'FT_FEMTEN_TO',
  FT_FEMTEN_TRE = 'FT_FEMTEN_TRE',
  FT_FEMTEN_FIRE = 'FT_FEMTEN_FIRE',
  FT_FEMTEN_FEM = 'FT_FEMTEN_FEM',
  FT_FEMTEN_SEKS = 'FT_FEMTEN_SEKS',
  FT_FEMTEN_ÅTTE = 'FT_FEMTEN_ÅTTE',
  FT_FEMTEN_NI = 'FT_FEMTEN_NI',
  FT_FEMTEN_TI = 'FT_FEMTEN_TI',
  FT_FEMTEN_ELLEVE = 'FT_FEMTEN_ELLEVE',
  FT_FEMTEN_TOLV = 'FT_FEMTEN_TOLV',
  FT_FEMTEN_TRETTEN = 'FT_FEMTEN_TRETTEN',
  FT_TJUETO_TOLV = 'FT_TJUETO_TOLV',
  FT_TJUETO_TRETTEN = 'FT_TJUETO_TRETTEN',
  FT_TJUETO_FEMTEN = 'FT_TJUETO_FEMTEN',
}

enum BarnetrygdlovenHjemmel {
  BT_TO = 'BT_TO',
  BT_FIRE = 'BT_FIRE',
  BT_FEM = 'BT_FEM',
  BT_NI = 'BT_NI',
  BT_TI = 'BT_TI',
  BT_ELLEVE = 'BT_ELLEVE',
  BT_TOLV = 'BT_TOLV',
  BT_TRETTEN = 'BT_TRETTEN',
  BT_SYTTEN = 'BT_SYTTEN',
  BT_ATTEN = 'BT_ATTEN',
}

enum KontantstøttelovenHjemmel {
  KS_TO = 'KS_TO',
  KS_TRE = 'KS_TRE',
  KS_SEKS = 'KS_SEKS',
  KS_SYV = 'KS_SYV',
  KS_ÅTTE = 'KS_ÅTTE',
  KS_NI = 'KS_NI',
  KS_TI = 'KS_TI',
  KS_ELLEVE = 'KS_ELLEVE',
  KS_TOLV = 'KS_TOLV',
  KS_TRETTEN = 'KS_TRETTEN',
  KS_SEKSTEN = 'KS_SEKSTEN',
}

enum UtlandsavtalerHjemmel {
  UTLAND_EØS = 'UTLAND_EØS',
  UTLAND_EØS_FORORDNINGEN_FEM = 'UTLAND_EØS_FORORDNINGEN_FEM',
  UTLAND_EØS_FORORDNINGEN_SEKS = 'UTLAND_EØS_FORORDNINGEN_SEKS',
  UTLAND_NORDISK = 'UTLAND_NORDISK',
  UTLAND_TRYGDEAVTALER = 'UTLAND_TRYGDEAVTALER',
}

enum ArbeidsmarkedslovenHjemmel {
  ARBML_13 = 'ARBML_13',
  ARBML_17 = 'ARBML_17',
  ARBML_22 = 'ARBML_22',
}

enum FolketrygdlovenHjemmelTS {
  FTRL_11_A_3 = 'FTRL_11_A_3',
  FTRL_11_A_4 = 'FTRL_11_A_4',
  FTRL_11_A_4_3 = 'FTRL_11_A_4_3',
  FTRL_15_11 = 'FTRL_15_11',
  FTRL_17_10_17_15 = 'FTRL_17_10_17_15',
  FTRL_21_12 = 'FTRL_21_12',
  FTRL_22_13 = 'FTRL_22_13',
  FTRL_22_15 = 'FTRL_22_15',
  FTRL_22_17A = 'FTRL_22_17A',
}

enum TilleggsstønadforskriftenHjemmel {
  FS_TILL_ST_1_3_MOBILITET = 'FS_TILL_ST_1_3_MOBILITET',
  FS_TILL_ST_3_REISE = 'FS_TILL_ST_3_REISE',
  FS_TILL_ST_6_FLYTTING = 'FS_TILL_ST_6_FLYTTING',
  FS_TILL_ST_8_BOLIG = 'FS_TILL_ST_8_BOLIG',
  FS_TILL_ST_10_TILSYN = 'FS_TILL_ST_10_TILSYN',
  FS_TILL_ST_12_LAEREMIDLER = 'FS_TILL_ST_12_LAEREMIDLER',
  FS_TILL_ST_15_2 = 'FS_TILL_ST_15_2',
  FS_TILL_ST_15_3 = 'FS_TILL_ST_15_3',
}

enum ForeldeseslovenHjemmel {
  FL_2_3 = 'FL_2_3',
  FL_10 = 'FL_10',
}

enum ForvaltningslovenHjemmel {
  FVL_11 = 'FVL_11',
  FVL_17 = 'FVL_17',
  FVL_18_19 = 'FVL_18_19',
  FVL_35 = 'FVL_35',
  FVL_41 = 'FVL_41',
  FVL_42 = 'FVL_42',
}

export type Hjemmel =
  | FolketrygdlovenHjemmelEF
  | BarnetrygdlovenHjemmel
  | KontantstøttelovenHjemmel
  | UtlandsavtalerHjemmel
  | ArbeidsmarkedslovenHjemmel
  | FolketrygdlovenHjemmelTS
  | TilleggsstønadforskriftenHjemmel
  | ForeldeseslovenHjemmel
  | ForvaltningslovenHjemmel;

const folketrygdLovenEFVisningstekster: Record<FolketrygdlovenHjemmelEF, string> = {
  FT_FEMTEN_TO: '§ 15-2 Forutgående medlemskap',
  FT_FEMTEN_TRE: '§ 15-3 Opphold i Norge',
  FT_FEMTEN_FIRE: '§ 15-4 Enslig mor eller far',
  FT_FEMTEN_FEM: '§ 15-5 Overgangsstønad',
  FT_FEMTEN_SEKS: '§ 15-6 Plikt til yrkesrettet aktivitet',
  FT_FEMTEN_ÅTTE: '§ 15-8 Stønadsperiode',
  FT_FEMTEN_NI: '§ 15-9 Avkorting mot inntekt',
  FT_FEMTEN_TI: '§ 15-10 Stønad til barnetilsyn',
  FT_FEMTEN_ELLEVE: '§ 15-11 Stønad til skolepenger',
  FT_FEMTEN_TOLV: '§ 15-12 Sanksjon',
  FT_FEMTEN_TRETTEN: '§ 15-13 Forholdet til andre folketrygdytelser',
  FT_TJUETO_TOLV: '§ 22-12 Tidspunkt for utbetaling når rett til en ytelse oppstår eller opphører',
  FT_TJUETO_TRETTEN: '§ 22-13 Frister for framsetting av krav, virkningstidspunkt og etterbetaling',
  FT_TJUETO_FEMTEN: '§ 22-15 Tilbakekreving',
};

const barnetrygdlovenVisningstekster: Record<BarnetrygdlovenHjemmel, string> = {
  BT_TO: '§ 2 Hvem som har rett til barnetrygd',
  BT_FIRE: '§ 4 Bosatt i riket, lovlig opphold mm.',
  BT_FEM: '§ 5 Medlemskap i folketrygden under utenlandsopphold',
  BT_NI: '§ 9 Utvidet barnetrygd',
  BT_TI: '§ 10 Barnetrygdens størrelse',
  BT_ELLEVE: '§ 11 Stønadsperiode',
  BT_TOLV: '§ 12 Utbetaling',
  BT_TRETTEN: '§ 13 Tilbakekreving',
  BT_SYTTEN: '§ 17 Stønadsmottakers opplysningsplikt',
  BT_ATTEN: '§ 18 Uriktige opplysninger',
};

const kontantstøttelovenVisningstekster: Record<KontantstøttelovenHjemmel, string> = {
  KS_TO: '§ 2 Vilkår knyttet til barnet',
  KS_TRE: '§ 3 Vilkår knyttet til støttemottaker',
  KS_SEKS: '§ 6 Barn i fosterhjem eller institusjon',
  KS_SYV: '§ 7 Kontantstøttens størrelse',
  KS_ÅTTE: '§ 8 Stønadsperiode',
  KS_NI: '§ 9 Utbetaling av kontantstøtte - delt bosted',
  KS_TI: '§ 10 Utbetaling til adopterte barn',
  KS_ELLEVE: '§ 11 Tilbakekreving',
  KS_TOLV: '§ 12 Støttemottakerens opplysningsplikt',
  KS_TRETTEN: '§ 13 Avslag på søknad, stans i utbetalingen',
  KS_SEKSTEN: '§ 16 Opplysningsplikt',
};

const utlandsavtalerVisningstekster: Record<UtlandsavtalerHjemmel, string> = {
  UTLAND_EØS: 'EØS-avtalen',
  UTLAND_EØS_FORORDNINGEN_FEM: 'EØS-forordningen art. 5',
  UTLAND_EØS_FORORDNINGEN_SEKS: 'EØS-forordningen art. 6',
  UTLAND_NORDISK: 'Nordisk konvensjon',
  UTLAND_TRYGDEAVTALER: 'Trygdeavtaler',
};

const arbeidsmarkedslovenVisningstekster: Record<ArbeidsmarkedslovenHjemmel, string> = {
  ARBML_13: 'ARBML_13',
  ARBML_17: 'ARBML_17',
  ARBML_22: 'ARBML_22',
};

const folketrygdlovenTSVisningstekster: Record<FolketrygdlovenHjemmelTS, string> = {
  FTRL_11_A_3: 'FTRL_11_A_3',
  FTRL_11_A_4: 'FTRL_11_A_4',
  FTRL_11_A_4_3: 'FTRL_11_A_4_3',
  FTRL_15_11: 'FTRL_15_11',
  FTRL_17_10_17_15: 'FTRL_17_10_17_15',
  FTRL_21_12: 'FTRL_21_12',
  FTRL_22_13: 'FTRL_22_13',
  FTRL_22_15: 'FTRL_22_15',
  FTRL_22_17A: 'FTRL_22_17A',
};

const tilleggsstønadforskriftenVisningstekster: Record<TilleggsstønadforskriftenHjemmel, string> = {
  FS_TILL_ST_1_3_MOBILITET: 'FS_TILL_ST_1_3_MOBILITET',
  FS_TILL_ST_3_REISE: 'FS_TILL_ST_3_REISE',
  FS_TILL_ST_6_FLYTTING: 'FS_TILL_ST_6_FLYTTING',
  FS_TILL_ST_8_BOLIG: 'FS_TILL_ST_8_BOLIG',
  FS_TILL_ST_10_TILSYN: 'FS_TILL_ST_10_TILSYN',
  FS_TILL_ST_12_LAEREMIDLER: 'FS_TILL_ST_12_LAEREMIDLER',
  FS_TILL_ST_15_2: 'FS_TILL_ST_15_2',
  FS_TILL_ST_15_3: 'FS_TILL_ST_15_3',
};

const foreldeseslovenVisningstekster: Record<ForeldeseslovenHjemmel, string> = {
  FL_2_3: 'FL_2_3',
  FL_10: 'FL_10',
};

const forvaltningslovenVisningstekster: Record<ForvaltningslovenHjemmel, string> = {
  FVL_11: 'FVL_11',
  FVL_17: 'FVL_17',
  FVL_18_19: 'FVL_18_19',
  FVL_35: 'FVL_35',
  FVL_41: 'FVL_41',
  FVL_42: 'FVL_42',
};

export const hjemmelTilVisningstekst: Record<Hjemmel, string> = {
  ...folketrygdLovenEFVisningstekster,
  ...barnetrygdlovenVisningstekster,
  ...kontantstøttelovenVisningstekster,
  ...utlandsavtalerVisningstekster,
  ...arbeidsmarkedslovenVisningstekster,
  ...folketrygdlovenTSVisningstekster,
  ...tilleggsstønadforskriftenVisningstekster,
  ...foreldeseslovenVisningstekster,
  ...forvaltningslovenVisningstekster,
};
