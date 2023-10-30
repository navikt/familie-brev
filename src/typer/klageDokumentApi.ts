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
  hjemmel?: EHjemmel;
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

export enum EHjemmel {
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
  BT_TO = 'BT_TO',
  BT_FIRE = 'BT_FIRE',
  BT_FEM = 'BT_FEM',
  BT_NI = 'BT_NI',
  BT_TRETTEN = 'BT_TRETTEN',
  FT_EØS = 'FT_EØS',
  FT_EØS_FOR = 'FT_EØS_FOR',
}

export const hjemmelTilTekst: Record<EHjemmel, string> = {
  FT_FEMTEN_TO: '§ 15-2',
  FT_FEMTEN_TRE: '§ 15-3',
  FT_FEMTEN_FIRE: '§ 15-4',
  FT_FEMTEN_FEM: '§ 15-5',
  FT_FEMTEN_SEKS: '§ 15-6',
  FT_FEMTEN_ÅTTE: '§ 15-8',
  FT_FEMTEN_NI: '§ 15-9',
  FT_FEMTEN_TI: '§ 15-10',
  FT_FEMTEN_ELLEVE: '§ 15-11',
  FT_FEMTEN_TOLV: '§ 15-12',
  FT_FEMTEN_TRETTEN: '§ 15-13',
  FT_TJUETO_TOLV: '$ 22-12',
  FT_TJUETO_TRETTEN: '$ 22-13',
  FT_TJUETO_FEMTEN: '$ 22-15',
  BT_TO: '§ 2',
  BT_FIRE: '§ 4',
  BT_FEM: '§ 5',
  BT_NI: '§ 9',
  BT_TRETTEN: '§ 13',
  FT_EØS: 'EØS-avtalen',
  FT_EØS_FOR: 'EØS art. 6',
};
