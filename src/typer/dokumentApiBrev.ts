import type { UtbetalingerPerMndEøs } from './utbetalingerEøs';

export interface IDokumentData {
  delmalData: IDelmalData;
  flettefelter: Flettefelter;
}

export interface IDelmalData {
  [key: string]: Flettefelter;
}

export type Flettefelter = { [key: string]: Flettefelt };
export type Flettefelt = string[];

//Avansert dokument
export interface IAvansertDokumentVariabler {
  flettefelter: Flettefelter;
  delmaler: IDelmaler;
  fritekstområder: IFritekstområder;
  valgfelter: IValgfelter;
  htmlfelter: IHtmlfelter;
  overstyrtDelmalblokk?: IOverstyrtDelmalblokk;
  brevmottakere?: Brevmottakere;
  featureToggleBrukNyBrevHeader?: boolean;
}

export interface Brevmottakere {
  personer: BrevmottakerPrivatperson[];
  organisasjoner: BrevmottakerOrganisasjon[];
}

export interface BrevmottakerPrivatperson {
  navn: string;
  mottakerRolle: BrevmottakerRolle;
}

export interface BrevmottakerOrganisasjon {
  organisasjonsnummer: string;
  navnHosOrganisasjon: string;
}

export enum BrevmottakerRolle {
  BRUKER = 'BRUKER',
  VERGE = 'VERGE',
  FULLMEKTIG = 'FULLMEKTIG',
  FULLMAKT = 'FULLMAKT',
}

export interface IOverstyrtDelmalblokk {
  htmlInnhold: string;
  skalOverstyre: boolean;
}

export interface IBrevMedSignatur {
  brevFraSaksbehandler: IAvansertDokumentVariabler;
  saksbehandlersignatur: string;
  saksbehandlerEnhet?: string;
  besluttersignatur?: string;
  beslutterEnhet?: string;
  skjulBeslutterSignatur?: boolean;
  datoPlaceholder?: string;
}

export interface IFritekstbrevMedSignatur {
  brevFraSaksbehandler: IFritekstbrev;
  besluttersignatur?: string;
  saksbehandlersignatur: string;
  enhet?: string;
  datoPlaceholder?: string;
  erSamværsberegning?: boolean;
  brevmottakere?: Brevmottakere;
}

export interface IAvsnitt {
  deloverskrift?: string;
  deloverskriftHeading?: Heading;
  innhold?: string;
}

export enum Heading {
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  H4 = 'H4',
  H5 = 'H5',
  H6 = 'H6',
}

export interface IFritekstbrev {
  overskrift: string;
  avsnitt?: IAvsnitt[];
  personIdent: string;
  navn: string;
}

export interface IDelmaler {
  [delmalId: string]: IAvansertDokumentVariabler[];
}

export interface IDelmal {
  verdier: IAvansertDokumentVariabler[];
}

export interface IFritekstområder {
  [id: string]: FritekstAvsnitt[];
}

type FritekstAvsnitt = {
  deloverskrift: string;
  innhold: string;
};

export interface IHtmlfelter {
  [key: string]: string;
}

export interface IValgfelter {
  [valgFeltId: string]: IValg[];
}

export interface IValg {
  navn: string;
  dokumentVariabler: IAvansertDokumentVariabler;
}

export interface IDokumentDataMedUtbetalingerEøs extends IDokumentData {
  utbetalingerPerMndEøs: UtbetalingerPerMndEøs;
}

// Periode
export interface IDokumentDataMedPeriode extends IDokumentData {
  perioder: Flettefelter[];
}

export interface IDokumentDataSammensattKontrollsak extends IDokumentData {
  sammensattKontrollsakFritekst: string;
}

export interface IDokumentDataMedFritekst extends IDokumentData {
  fritekst: string;
}

export interface ISøknad {
  label: string;
  verdiliste: IVerdiliste[];
}

export interface IVerdiliste {
  label: string;
  verdi?: string;
  verdiliste?: IVerdiliste[];
  alternativer?: string;
}
